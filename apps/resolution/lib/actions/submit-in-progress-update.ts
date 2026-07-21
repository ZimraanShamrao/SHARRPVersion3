"use server";

import { HAZARD_STATUS } from "@campus-hazard/shared";
import { uploadProgressImage } from "@campus-hazard/supabase/storage/upload-progress";
import { createAdminClient } from "@/lib/supabase/admin";

export type SubmitInProgressState = {
  error?: string;
  success?: boolean;
  hazardId?: string;
};

function getRequiredField(formData: FormData, name: string): string {
  return formData.get(name)?.toString().trim() ?? "";
}

export async function submitInProgressUpdate(
  _prevState: SubmitInProgressState,
  formData: FormData
): Promise<SubmitInProgressState> {
  const hazardId = getRequiredField(formData, "hazardId");
  const notes = getRequiredField(formData, "notes");
  const image = formData.get("image");

  if (!hazardId) {
    return { error: "Hazard not found." };
  }

  if (!notes) {
    return { error: "Please enter maintenance notes." };
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
    return {
      error: "This hazard cannot receive progress updates.",
    };
  }

  const wasUnresolved = hazard.status === HAZARD_STATUS.UNRESOLVED;

  const { data: progressNumber, error: progressError } = await supabase.rpc(
    "next_progress_number",
    { p_hazard_uuid: hazard.id }
  );

  if (progressError || progressNumber == null) {
    return {
      error: "Unable to submit progress update. Please try again.",
    };
  }

  let progressImagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    const uploadResult = await uploadProgressImage(
      supabase,
      hazard.hazard_id,
      progressNumber,
      image
    );

    if (!uploadResult.ok) {
      return { error: uploadResult.error };
    }

    progressImagePath = uploadResult.path;
  }

  const { error: maintenanceError } = await supabase
    .from("maintenance_updates")
    .insert({
      hazard_uuid: hazard.id,
      hazard_id: hazard.hazard_id,
      progress_number: progressNumber,
      notes,
      progress_image_path: progressImagePath,
    });

  if (maintenanceError) {
    return {
      error: "Unable to save maintenance update. Please try again.",
    };
  }

  if (wasUnresolved) {
    const { error: updateError } = await supabase
      .from("hazards")
      .update({ status: HAZARD_STATUS.IN_PROGRESS })
      .eq("id", hazard.id);

    if (updateError) {
      return {
        error: "Unable to update hazard status. Please try again.",
      };
    }
  }

  const { error: eventError } = await supabase.from("hazard_events").insert({
    hazard_uuid: hazard.id,
    hazard_id: hazard.hazard_id,
    event_type: wasUnresolved ? "marked_in_progress" : "progress_updated",
  });

  if (eventError) {
    return {
      error: "Unable to save progress update. Please try again.",
    };
  }

  return {
    success: true,
    hazardId: hazard.hazard_id,
  };
}
