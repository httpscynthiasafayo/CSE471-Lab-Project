import mongoose from 'mongoose';
const propertySchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  type: { type: String, enum: ['Apartment', 'Room', 'Studio'] },
  photos: [String],
  description: String,
  amenities: [String],
  terms: String,
  isRented: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Property', propertySchema);
