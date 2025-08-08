import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  address: {
    text: String,
    lat: Number,
    lng: Number,
  },
  rentPerMonth: { type: Number, required: true },
  amenities: [String],
  propertyType: { type: String, enum: ["apartment", "house", "studio", "other"], required: true },
  availabilityStart: Date,
  availabilityEnd: Date,
  images: [String], // URLs or image paths
}, { timestamps: true });

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);