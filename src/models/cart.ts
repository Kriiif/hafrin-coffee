import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        idProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "carts" }
);

export const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);