import mongoose from 'mongoose';
const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemType: { type: String, enum: ['POST', 'PROPERTY', 'UNIVERSITY'] },
  itemId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });
export default mongoose.model('Bookmark', bookmarkSchema);
