"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export type ValidateStudentIdState = {
  error?: string;
};

export async function validateStudentId(
  _prevState: ValidateStudentIdState,
  formData: FormData
): Promise<ValidateStudentIdState> {
  const studentId = formData.get("studentId")?.toString().trim() ?? "";

  if (!studentId) {
    return { error: "Please enter your Student ID." };
  }

  const supabase = createAdminClient();

  const { data: isValid, error } = await supabase.rpc("validate_student_id", {
    p_student_id: studentId,
  });

  if (error) {
    return {
      error: "Unable to validate your Student ID. Please try again.",
    };
  }

  if (!isValid) {
    return {
      error: "Student ID not found. Please check your ID and try again.",
    };
  }

  redirect("/report/form");
}
