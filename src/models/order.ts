import mongoose, { Schema, models } from "mongoose";

const OrderSchema = new Schema({
  item: String,
  quantity: Number,
  sugar: String,
  ice: String,
  additions: [String],
  createdAt: { type: Date, default: Date.now },
});

export const Order = models.Order || mongoose.model("Order", OrderSchema);