import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { serialize } from "./serialize";
import type { OrderLean } from "@/lib/types";

export async function getOrders(status?: string) {
  await dbConnect();
  const query = status && status !== "all" ? { status } : {};
  const docs = await Order.find(query).sort({ createdAt: -1 }).lean();
  return serialize<OrderLean[]>(docs);
}

export async function getOrderById(id: string) {
  await dbConnect();
  const doc = await Order.findById(id).lean();
  return doc ? serialize<OrderLean>(doc) : null;
}

export async function countOrdersByStatus(status: string) {
  await dbConnect();
  return Order.countDocuments({ status });
}
