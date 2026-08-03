import express from 'express';
import mongoose from 'mongoose';
import Monument from '../models/Monument.js';
import FoodPlace from '../models/FoodPlace.js';
import Hotel from '../models/Hotel.js';

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

export default router;
