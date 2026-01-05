-- Create food_places table
CREATE TABLE public.food_places (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  category TEXT NOT NULL, -- street_food, restaurant, food_hub
  famous_dishes TEXT[] DEFAULT '{}',
  avg_price_min INTEGER,
  avg_price_max INTEGER,
  image_url TEXT,
  is_food_street BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food_ratings table with one rating per user per place constraint
CREATE TABLE public.food_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  food_place_id UUID NOT NULL REFERENCES public.food_places(id) ON DELETE CASCADE,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  taste_rating INTEGER NOT NULL CHECK (taste_rating >= 1 AND taste_rating <= 5),
  hygiene_rating INTEGER NOT NULL CHECK (hygiene_rating >= 1 AND hygiene_rating <= 5),
  value_rating INTEGER NOT NULL CHECK (value_rating >= 1 AND value_rating <= 5),
  comment TEXT,
  ate_here BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, food_place_id)
);

-- Enable RLS
ALTER TABLE public.food_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_ratings ENABLE ROW LEVEL SECURITY;

-- Food places are publicly viewable
CREATE POLICY "Anyone can view food places" 
ON public.food_places 
FOR SELECT 
USING (true);

-- Food ratings policies
CREATE POLICY "Anyone can view food ratings" 
ON public.food_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own ratings" 
ON public.food_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.food_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_food_ratings_place ON public.food_ratings(food_place_id);
CREATE INDEX idx_food_places_category ON public.food_places(category);

-- Enable realtime for ratings
ALTER PUBLICATION supabase_realtime ADD TABLE public.food_ratings;

-- Add trigger for updated_at
CREATE TRIGGER update_food_places_updated_at
BEFORE UPDATE ON public.food_places
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample food places for Bhubaneswar
INSERT INTO public.food_places (name, description, location, latitude, longitude, category, famous_dishes, avg_price_min, avg_price_max, is_food_street) VALUES
('Dalma', 'Traditional Odia restaurant known for authentic cuisine', 'Saheed Nagar, Bhubaneswar', 20.2961, 85.8245, 'restaurant', ARRAY['Dalma', 'Pakhala Bhata', 'Chhena Poda'], 150, 400, false),
('Hare Krishna Dhaba', 'Popular vegetarian dhaba with Odia specialties', 'Janpath, Bhubaneswar', 20.2750, 85.8189, 'restaurant', ARRAY['Thali', 'Khechudi', 'Ghugni'], 80, 200, false),
('Lingaraj Temple Road Food Street', 'Famous street food hub near Lingaraj Temple', 'Lingaraj Temple Road', 20.2382, 85.8318, 'food_hub', ARRAY['Dahi Bara Aloo Dum', 'Gupchup', 'Chhena Gaja'], 20, 100, true),
('Manek Chowk', 'Evening food street with diverse street food', 'Unit 1, Bhubaneswar', 20.2689, 85.8400, 'food_hub', ARRAY['Chaat', 'Bara Ghugni', 'Mudhi Mansa'], 30, 150, true),
('Wildgrass Restaurant', 'Premium Odia cuisine restaurant', 'Jaydev Vihar, Bhubaneswar', 20.3000, 85.8190, 'restaurant', ARRAY['Macha Besara', 'Santula', 'Rasabali'], 300, 800, false),
('Nimapara Chhena Poda', 'Famous for authentic Chhena Poda', 'Master Canteen, Bhubaneswar', 20.2725, 85.8330, 'street_food', ARRAY['Chhena Poda', 'Rasagola', 'Khira Mohana'], 50, 150, false),
('Truptii Restaurant', 'Popular for Odia thali and sweets', 'Sachivalaya Marg, Bhubaneswar', 20.2870, 85.8456, 'restaurant', ARRAY['Odia Thali', 'Chhena Jhili', 'Enduri Pitha'], 120, 350, false),
('Unit 4 Market Food Zone', 'Bustling market area with street food vendors', 'Unit 4, Bhubaneswar', 20.2780, 85.8520, 'food_hub', ARRAY['Pakoda', 'Samosa', 'Jalebi'], 20, 80, true);