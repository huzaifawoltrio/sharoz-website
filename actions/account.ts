"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { requireAdmin } from "@/lib/dal";
import { changePasswordSchema } from "@/lib/validation/auth";
import { firstZodMessage, type ActionState } from "@/lib/action-state";

export async function changePassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { adminId } = await requireAdmin();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  const admin = await Admin.findById(adminId);
  if (!admin) return { error: "Account not found" };

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    admin.passwordHash
  );
  if (!valid) return { error: "Current password is incorrect" };

  admin.passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await admin.save();

  return { success: true };
}
