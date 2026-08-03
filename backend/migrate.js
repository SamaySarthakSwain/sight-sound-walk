import mongoose from 'mongoose';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

// Import our models
import Monument from './models/Monument.js';
import FoodPlace from './models/FoodPlace.js';
import Hotel from './models/Hotel.js';
import Profile from './models/Profile.js';

// Setup env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sight_sound_walk';

// Helper to download image and store in GridFS
async function storeImageInGridFS(bucket, imageUrl, filename) {
  if (!imageUrl) return null;
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        return resolve(null); // Return null if image cannot be downloaded
      }
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: res.headers['content-type']
      });
      res.pipe(uploadStream);
      uploadStream.on('error', reject);
      uploadStream.on('finish', () => resolve(uploadStream.id));
    }).on('error', reject);
  });
}

async function migrateData() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' });

    // 1. Migrate Monuments
    console.log('Fetching Monuments from Supabase...');
    const { data: monuments, error: mError } = await supabase.from('monuments').select('*');
    if (mError) throw mError;

    for (const m of monuments) {
      const existing = await Monument.findOne({ original_id: m.id });
      if (!existing) {
        let gridfs_id = null;
        if (m.image_url) {
          console.log(`Downloading image for Monument: ${m.title}`);
          gridfs_id = await storeImageInGridFS(bucket, m.image_url, `monument_${m.id}`);
        }
        await Monument.create({
          original_id: m.id,
          title: m.title,
          description: m.description,
          location: m.location,
          state: m.state,
          region: m.region,
          category: m.category,
          latitude: m.latitude,
          longitude: m.longitude,
          image_url: m.image_url,
          image_gridfs_id: gridfs_id,
          is_featured: m.is_featured,
          facts: m.facts,
          distance_from_berhampur: m.distance_from_berhampur,
          created_at: m.created_at,
          updated_at: m.updated_at
        });
      }
    }
    console.log('Monuments migrated.');

    // 2. Migrate Food Places
    console.log('Fetching Food Places from Supabase...');
    const { data: food, error: fError } = await supabase.from('food_places').select('*');
    if (fError) throw fError;

    for (const f of food) {
      const existing = await FoodPlace.findOne({ original_id: f.id });
      if (!existing) {
        let gridfs_id = null;
        if (f.image_url) {
          console.log(`Downloading image for Food: ${f.name}`);
          gridfs_id = await storeImageInGridFS(bucket, f.image_url, `food_${f.id}`);
        }
        await FoodPlace.create({
          original_id: f.id,
          name: f.name,
          description: f.description,
          location: f.location,
          category: f.category,
          latitude: f.latitude,
          longitude: f.longitude,
          image_url: f.image_url,
          image_gridfs_id: gridfs_id,
          is_food_street: f.is_food_street,
          famous_dishes: f.famous_dishes,
          avg_price_min: f.avg_price_min,
          avg_price_max: f.avg_price_max,
          google_place_id: f.google_place_id,
          google_rating: f.google_rating,
          google_total_ratings: f.google_total_ratings,
          created_at: f.created_at,
          updated_at: f.updated_at
        });
      }
    }
    console.log('Food Places migrated.');

    // 3. Migrate Hotels
    console.log('Fetching Hotels from Supabase...');
    const { data: hotels, error: hError } = await supabase.from('hotels').select('*');
    if (hError) throw hError;

    for (const h of hotels) {
      const existing = await Hotel.findOne({ original_id: h.id });
      if (!existing) {
        let gridfs_id = null;
        if (h.image_url) {
          console.log(`Downloading image for Hotel: ${h.name}`);
          gridfs_id = await storeImageInGridFS(bucket, h.image_url, `hotel_${h.id}`);
        }
        await Hotel.create({
          original_id: h.id,
          name: h.name,
          description: h.description,
          location: h.location,
          latitude: h.latitude,
          longitude: h.longitude,
          image_url: h.image_url,
          image_gridfs_id: gridfs_id,
          address: h.address,
          contact_phone: h.contact_phone,
          contact_email: h.contact_email,
          website: h.website,
          star_rating: h.star_rating,
          price_per_night_min: h.price_per_night_min,
          price_per_night_max: h.price_per_night_max,
          amenities: h.amenities,
          total_rooms: h.total_rooms,
          available_rooms: h.available_rooms,
          google_place_id: h.google_place_id,
          google_rating: h.google_rating,
          google_total_ratings: h.google_total_ratings,
          created_at: h.created_at,
          updated_at: h.updated_at
        });
      }
    }
    console.log('Hotels migrated.');

    // 4. Migrate Profiles
    console.log('Fetching Profiles from Supabase...');
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
    if (pError) throw pError;

    for (const p of profiles) {
      const existing = await Profile.findOne({ original_id: p.id });
      if (!existing) {
        let gridfs_id = null;
        if (p.avatar_url) {
          console.log(`Downloading image for Profile: ${p.id}`);
          gridfs_id = await storeImageInGridFS(bucket, p.avatar_url, `avatar_${p.id}`);
        }
        await Profile.create({
          original_id: p.id,
          email: p.email,
          full_name: p.full_name,
          phone_number: p.phone_number,
          avatar_url: p.avatar_url,
          avatar_gridfs_id: gridfs_id,
          created_at: p.created_at,
          updated_at: p.updated_at
        });
      }
    }
    console.log('Profiles migrated.');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
