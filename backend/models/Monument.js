import mongoose from 'mongoose';

const monumentSchema = new mongoose.Schema({
  original_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  region: { type: String },
  category: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  image_url: { type: String },
  image_gridfs_id: { type: mongoose.Schema.Types.ObjectId }, // Reference to GridFS file
  is_featured: { type: Boolean, default: false },
  facts: [{ type: String }],
  distance_from_berhampur: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Monument', monumentSchema);
