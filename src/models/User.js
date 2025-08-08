// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "owner", "renter"], default: "renter" },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);