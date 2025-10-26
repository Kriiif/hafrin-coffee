import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    phone: { type: String },
    address: { type: String },
  },
  { collection: "users" }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
