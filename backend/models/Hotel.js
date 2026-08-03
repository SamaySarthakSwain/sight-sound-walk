import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  original_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  image_url: { type: String },
  image_gridfs_id: { type: mongoose.Schema.Types.ObjectId },
  address: { type: String },
  contact_phone: { type: String },
  contact_email: { type: String },
  website: { type: String },
  star_rating: { type: Number },
  price_per_night_min: { type: Number },
  price_per_night_max: { type: Number },
  amenities: [{ type: String }],
  total_rooms: { type: Number },
  available_rooms: { type: Number },
  google_place_id: { type: String },
  google_rating: { type: Number },
  google_total_ratings: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Hotel', hotelSchema);
