import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  original_id: { type: String, required: true, unique: true },
  email: { type: String },
  full_name: { type: String },
  phone_number: { type: String },
  avatar_url: { type: String },
  avatar_gridfs_id: { type: mongoose.Schema.Types.ObjectId },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Profile', profileSchema);
