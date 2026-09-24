import express from 'express';
import mongoose from 'mongoose';
import Monument from '../models/Monument.js';
import FoodPlace from '../models/FoodPlace.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import Visit from '../models/Visit.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key';

const router = express.Router();

// Get all monuments
router.get('/monuments', async (req, res) => {
  try {
    const monuments = await Monument.find();
    res.json(monuments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single monument
router.get('/monuments/:id', async (req, res) => {
  try {
    const monument = await Monument.findOne({ original_id: req.params.id });
    if (!monument) return res.status(404).json({ error: "Not found" });
    res.json(monument);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all food places
router.get('/food-places', async (req, res) => {
  try {
    const food = await FoodPlace.find();
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all hotels
router.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to serve images from GridFS
router.get('/image/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' });
    const objectId = new mongoose.Types.ObjectId(req.params.id);
    
    const downloadStream = bucket.openDownloadStream(objectId);
    downloadStream.on('error', () => {
      res.status(404).send('Image not found');
    });
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth Route
router.post('/auth/google', async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Find or create user
    let user = await User.findOne({ googleId });
    if (!user) {
      user = new User({ email, name, picture, googleId });
      await user.save();
    }

    // Create session token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user });
  } catch (err) {
    console.error('Auth Error:', err);
    res.status(401).json({ error: 'Invalid Google Token' });
  }
});

// Visits Routes
router.post('/visits', async (req, res) => {
  try {
    const visit = new Visit(req.body);
    await visit.save();
    res.json(visit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/visits/:userId', async (req, res) => {
  try {
    const visits = await Visit.find({ user_id: req.params.userId }).sort({ visited_at: -1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
