import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import aiRouter from './routes/ai.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sight_sound_walk';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', apiRouter);
app.use('/api/ai', aiRouter);

// Basic route
app.get('/', (req, res) => {
  res.send('Sight Sound Walk API is running on MongoDB!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
