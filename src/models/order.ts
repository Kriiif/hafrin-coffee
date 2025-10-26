import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // nama minuman
    quantity: { type: Number, required: true },
    sugar: { type: String, enum: ["less", "normal"], default: "normal" },
    ice: { type: String, enum: ["no", "normal"], default: "normal" },
    additions: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "orders" }
);

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);