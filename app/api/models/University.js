import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  name: String,
  department: String,
  term: String,
  degree: String,
  applicationFee: String,
  tuitionFee: String,
  status: String,
  duration: String
});

const universitySchema = new mongoose.Schema({
  name: String,
  country: String,
  programTypes: [String],
  costEstimate: Number,
  url: String,
  location: String,
  programs: [programSchema]
});

export default mongoose.model('University', universitySchema);

