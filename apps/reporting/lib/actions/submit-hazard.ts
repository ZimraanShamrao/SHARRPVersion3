"use server";

import { HAZARD_STATUS } from "@campus-hazard/shared";
import { uploadSubmissionImage } from "@campus-hazard/supabase/storage/upload-submission";
import { createAdminClient } from "@/lib/supabase/admin";

export type SubmitHazardState = {
  error?: string;
  success?: boolean;
  hazardId?: string;
};

function getRequiredField(formData: FormData, name: string): string {
  return formData.get(name)?.toString().trim() ?? "";
}

function getOptionalField(formData: FormData, name: string): string | null {
  const value = formData.get(name)?.toString().trim() ?? "";
  return value.length > 0 ? value : null;
}

export async function submitHazard(
  _prevState: SubmitHazardState,
  formData: FormData
): Promise<SubmitHazardState> {
  const image = formData.get("image");
  const shortDescription = getRequiredField(formData, "shortDescription");
  const detailedDescription = getOptionalField(formData, "detailedDescription");
  const location = getRequiredField(formData, "location");

  if (!(image instanceof File) || image.size === 0) {
    return { error: "Please upload a hazard image." };
  }

  if (!shortDescription) {
    return { error: "Please describe the hazard in one short sentence." };
  }

  if (!location) {
    return { error: "Please provide the location of the hazard." };
  }

  const supabase = createAdminClient();

  const { data: hazardId, error: hazardIdError } = await supabase.rpc(
    "generate_hazard_id"
  );

  if (hazardIdError || !hazardId) {
    return {
      error: "Unable to submit your report. Please try again.",
    };
  }

  const uploadResult = await uploadSubmissionImage(supabase, hazardId, image);

  if (!uploadResult.ok) {
    return { error: uploadResult.error };
  }

  const { data: hazard, error: insertError } = await supabase
    .from("hazards")
    .insert({
      hazard_id: hazardId,
      short_description: shortDescription,
      detailed_description: detailedDescription,
      location,
      status: HAZARD_STATUS.UNRESOLVED,
      submission_image_path: uploadResult.path,
    })
    .select("id, hazard_id")
    .single();

  if (insertError || !hazard) {
    return {
      error: "Unable to save your hazard report. Please try again.",
    };
  }

  const { error: eventError } = await supabase.from("hazard_events").insert({
    hazard_uuid: hazard.id,
    hazard_id: hazard.hazard_id,
    event_type: "submitted",
  });

  if (eventError) {
    return {
      error: "Unable to save your hazard report. Please try again.",
    };
  }

  return {
    success: true,
    hazardId: hazard.hazard_id,
  };
}
