import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // Using string to match the Google ID
  place_name: { type: String, required: true },
  place_category: { type: String },
  place_image: { type: String },
  visited_at: { type: Date, default: Date.now }
});

export default mongoose.model('Visit', visitSchema);
