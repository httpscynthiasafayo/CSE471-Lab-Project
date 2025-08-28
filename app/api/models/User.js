import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['user', 'admin', 'landowner'], default: 'user' },
  propertyOwnershipDocumentUrl: String,
  isLandownerVerified: { type: Boolean, default: false },
  resumeUrl: String,
  cvUrl: String,
  preferences: {
    locations: [String],
    maxRent: Number  
  },

   subscription: {
  plan: { type: String, default: 'none' },
  status: { type: String, default: 'inactive' },
  startDate: { type: Date },
  subscriptionId: { type: String, default: null }
  },
  planSet: { type: Boolean, default: false },
  
  phone: { type: String },
  whatsappUrl: { type: String },
  socialUrl: { type: String },

}, 


{ timestamps: true });

export default mongoose.model('User', userSchema);
