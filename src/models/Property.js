import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  address: String,
  rentPerMonth: Number,
  amenities: [String],
  propertyType: String,
  availabilityStart: Date,
  availabilityEnd: Date,
  images: [String],
}, { timestamps: true });

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);
