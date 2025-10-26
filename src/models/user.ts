import mongoose from "mongoose";
import type { UserDocument } from "@/types/user";

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    phone: { type: String },
    address: { type: String },
  },
  { 
    collection: "users",
    timestamps: true 
  });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
