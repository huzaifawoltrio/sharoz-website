import mongoose, { Schema } from "mongoose";

export type OrderStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "fulfilled"
  | "cancelled";

const OrderItemSchema = new Schema(
  {
    artworkId: { type: Schema.Types.ObjectId, ref: "Artwork", required: true },
    artworkTitle: { type: String, required: true },
    artworkSlug: { type: String, required: true },
    image: { type: String, default: "" },
    variant: {
      type: { type: String, enum: ["original", "print"], required: true },
      size: { type: String, default: null },
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderNoteSchema = new Schema(
  {
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    buyer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      message: { type: String, default: "" },
    },
    items: { type: [OrderItemSchema], default: [] },
    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "fulfilled", "cancelled"],
      default: "new",
    },
    notes: { type: [OrderNoteSchema], default: [] },
  },
  { timestamps: true }
);

OrderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
