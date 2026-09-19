import dbConnect from "@/lib/db";
import ContactMessage from "@/lib/models/ContactMessage";
import { serialize } from "./serialize";
import type { ContactMessageLean } from "@/lib/types";

export async function getMessages() {
  await dbConnect();
  const docs = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
  return serialize<ContactMessageLean[]>(docs);
}

export async function countUnreadMessages() {
  await dbConnect();
  return ContactMessage.countDocuments({ read: false });
}
