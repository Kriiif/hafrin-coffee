import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    idCart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "canceled"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "orders" }
);

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);