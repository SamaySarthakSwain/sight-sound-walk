-- Run this in your Supabase SQL Editor to enable historical AI tracking for cameras

-- Table to store historical Crowd and Vehicle counts from Live Cameras
CREATE TABLE IF NOT EXISTS crowd_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  username TEXT NOT NULL,
  location TEXT,
  person_count INTEGER DEFAULT 0,
  vehicle_count INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optional: Create an index for faster querying by session
CREATE INDEX IF NOT EXISTS idx_crowd_records_session ON crowd_records(session_id);

-- Optional: Enable Realtime for the crowd_records table if you want dashboards to update
alter publication supabase_realtime add table crowd_records;
