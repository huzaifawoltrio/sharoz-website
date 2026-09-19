"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Admin from "@/lib/models/Admin";
import { createSession, deleteSession } from "@/lib/session";
import { loginSchema } from "@/lib/validation/auth";
import type { ActionState } from "@/lib/action-state";
import { firstZodMessage } from "@/lib/action-state";

export async function login(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  await dbConnect();
  const admin = await Admin.findOne({ email: parsed.data.email.toLowerCase() });

  if (!admin) {
    return { error: "Invalid email or password" };
  }

  const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  await createSession(admin._id.toString());
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
