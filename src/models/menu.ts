import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    pic: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "menus" }
);

export const Menu = mongoose.models.Menu || mongoose.model("Menu", MenuSchema);