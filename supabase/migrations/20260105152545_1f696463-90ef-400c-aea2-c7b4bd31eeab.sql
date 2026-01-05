-- Add Google-related columns to food_places
ALTER TABLE public.food_places 
ADD COLUMN google_place_id TEXT,
ADD COLUMN google_rating NUMERIC,
ADD COLUMN google_total_ratings INTEGER,
ADD COLUMN google_last_updated TIMESTAMP WITH TIME ZONE;