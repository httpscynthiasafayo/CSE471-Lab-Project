import mongoose from 'mongoose';

const visaSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    enum: ['Australia', 'UK', 'Canada']
  },
  visaType: {
    type: String,
    required: true,
    enum: ['Student', 'Tourist', 'Work', 'Permanent Resident']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  instructions: [{
    step: Number,
    description: String
  }],
  processingTime: {
    type: String,
    required: true
  },
  fees: {
    amount: Number,
    currency: String,
    description: String
  },
  eligibility: [{
    type: String
  }],
  documents: [{
    name: String,
    required: Boolean,
    description: String
  }],
  applicationUrl: {
    type: String
  },
  additionalInfo: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Visa', visaSchema);