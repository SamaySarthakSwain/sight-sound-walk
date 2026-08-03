import mongoose from 'mongoose';

const foodPlaceSchema = new mongoose.Schema({
  original_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  category: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  image_url: { type: String },
  image_gridfs_id: { type: mongoose.Schema.Types.ObjectId },
  is_food_street: { type: Boolean, default: false },
  famous_dishes: [{ type: String }],
  avg_price_min: { type: Number },
  avg_price_max: { type: Number },
  google_place_id: { type: String },
  google_rating: { type: Number },
  google_total_ratings: { type: Number },
  google_last_updated: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('FoodPlace', foodPlaceSchema);
