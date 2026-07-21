"use server";

import { HAZARD_STATUS } from "@campus-hazard/shared";
import { uploadResolutionImage } from "@campus-hazard/supabase/storage/upload-resolution";
import { createAdminClient } from "@/lib/supabase/admin";

export type SubmitResolutionState = {
  error?: string;
  success?: boolean;
  hazardId?: string;
};

function getRequiredField(formData: FormData, name: string): string {
  return formData.get(name)?.toString().trim() ?? "";
}

export async function submitResolutionUpdate(
  _prevState: SubmitResolutionState,
  formData: FormData
): Promise<SubmitResolutionState> {
  const hazardId = getRequiredField(formData, "hazardId");
  const notes = getRequiredField(formData, "notes");
  const image = formData.get("image");

  if (!hazardId) {
    return { error: "Hazard not found." };
  }

  if (!(image instanceof File) || image.size === 0) {
    return { error: "Please upload a resolution image." };
  }

  if (!notes) {
    return { error: "Please enter resolution notes." };
  }

  const supabase = createAdminClient();

  const { data: hazard, error: fetchError } = await supabase
    .from("hazards")
    .select("id, hazard_id, status")
    .eq("hazard_id", hazardId)
    .single();

  if (fetchError || !hazard) {
    return { error: "Hazard not found." };
  }

  if (
    hazard.status !== HAZARD_STATUS.UNRESOLVED &&
    hazard.status !== HAZARD_STATUS.IN_PROGRESS
  ) {
    return { error: "This hazard has already been resolved." };
  }

  const uploadResult = await uploadResolutionImage(
    supabase,
    hazard.hazard_id,
    image
  );

  if (!uploadResult.ok) {
    return { error: uploadResult.error };
  }

  const resolvedAt = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("hazards")
    .update({
      status: HAZARD_STATUS.RESOLVED,
      resolution_image_path: uploadResult.path,
      resolution_notes: notes,
      resolved_at: resolvedAt,
    })
    .eq("id", hazard.id);

  if (updateError) {
    return {
      error: "Unable to save resolution details. Please try again.",
    };
  }

  const { error: eventError } = await supabase.from("hazard_events").insert({
    hazard_uuid: hazard.id,
    hazard_id: hazard.hazard_id,
    event_type: "resolved",
  });

  if (eventError) {
    return {
      error: "Unable to save resolution details. Please try again.",
    };
  }

  return {
    success: true,
    hazardId: hazard.hazard_id,
  };
}
