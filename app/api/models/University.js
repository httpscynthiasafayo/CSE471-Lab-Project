import mongoose from 'mongoose';
const universitySchema = new mongoose.Schema({
  name: String,
  country: String,
  programTypes: [String],
  costEstimate: Number,
  url: String
});
export default mongoose.model('University', universitySchema);
