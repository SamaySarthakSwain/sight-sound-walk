-- Create hotels table
CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
  google_rating NUMERIC,
  google_total_ratings INTEGER,
  google_place_id TEXT,
  image_url TEXT,
  amenities TEXT[] DEFAULT '{}',
  price_per_night_min INTEGER,
  price_per_night_max INTEGER,
  available_rooms INTEGER DEFAULT 0,
  total_rooms INTEGER DEFAULT 0,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view hotels" 
ON public.hotels 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_hotels_updated_at
BEFORE UPDATE ON public.hotels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample Bhubaneswar hotels
INSERT INTO public.hotels (name, description, location, address, star_rating, google_rating, google_total_ratings, amenities, price_per_night_min, price_per_night_max, available_rooms, total_rooms, contact_phone, image_url) VALUES
('Mayfair Lagoon', 'Luxury 5-star hotel with lagoon views, multiple restaurants, and world-class spa facilities', 'Bhubaneswar', 'Jaydev Vihar, Bhubaneswar, Odisha 751013', 5, 4.5, 3250, ARRAY['Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym', 'Bar', 'Room Service'], 8500, 25000, 15, 65, '+91 674 666 0101', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
('Trident Bhubaneswar', 'Elegant 5-star property near the airport with beautiful gardens and excellent dining', 'Bhubaneswar', 'CB-1, Nayapalli, Bhubaneswar, Odisha 751013', 5, 4.4, 2890, ARRAY['Pool', 'Spa', 'Restaurant', 'WiFi', 'Gym', 'Business Center', 'Airport Shuttle'], 7500, 22000, 22, 80, '+91 674 230 1010', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'),
('Swosti Premium', 'Modern 4-star hotel in the heart of the city with rooftop dining', 'Bhubaneswar', 'Janpath, Bhubaneswar, Odisha 751001', 4, 4.3, 1850, ARRAY['Restaurant', 'WiFi', 'Gym', 'Room Service', 'Conference Room', 'Parking'], 4500, 12000, 18, 55, '+91 674 253 5678', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'),
('Hotel Hindustan International', 'Well-established 4-star hotel with excellent location and service', 'Bhubaneswar', 'Sachivalaya Marg, Bhubaneswar, Odisha 751001', 4, 4.2, 2100, ARRAY['Restaurant', 'WiFi', 'Gym', 'Bar', 'Room Service', 'Banquet Hall'], 4000, 10000, 12, 48, '+91 674 253 0201', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'),
('Ginger Bhubaneswar', 'Smart budget hotel with modern amenities and great value', 'Bhubaneswar', 'Jaydev Vihar Square, Bhubaneswar, Odisha 751013', 3, 4.1, 1650, ARRAY['Restaurant', 'WiFi', 'Gym', 'Parking', 'Laundry'], 2500, 5000, 25, 100, '+91 674 663 3333', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'),
('Hotel Presidency', 'Comfortable 3-star hotel near railway station with good connectivity', 'Bhubaneswar', 'Master Canteen Square, Bhubaneswar, Odisha 751001', 3, 4.0, 1420, ARRAY['Restaurant', 'WiFi', 'Room Service', 'Parking', 'Travel Desk'], 2200, 4500, 20, 60, '+91 674 253 2888', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'),
('Lemon Tree Premier', 'Upscale 4-star hotel with contemporary design and excellent hospitality', 'Bhubaneswar', 'Patia, Bhubaneswar, Odisha 751024', 4, 4.3, 1980, ARRAY['Pool', 'Restaurant', 'WiFi', 'Gym', 'Spa', 'Bar', 'Conference Room'], 5000, 14000, 30, 120, '+91 674 668 8888', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
('Fortune Park Sishmo', 'Premium 4-star hotel with panoramic city views and fine dining', 'Bhubaneswar', 'Nayapalli, Bhubaneswar, Odisha 751012', 4, 4.2, 1560, ARRAY['Restaurant', 'WiFi', 'Gym', 'Bar', 'Room Service', 'Business Center'], 4200, 11000, 16, 75, '+91 674 301 1111', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'),
('Hotel Arya Palace', 'Budget-friendly 2-star hotel with essential amenities', 'Bhubaneswar', 'Kalpana Square, Bhubaneswar, Odisha 751001', 2, 3.8, 890, ARRAY['WiFi', 'Room Service', 'Parking', 'TV'], 1200, 2500, 10, 35, '+91 674 253 4455', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'),
('Sandy Tower', 'Mid-range hotel with homely atmosphere and local cuisine', 'Bhubaneswar', 'Unit-4, Bhubaneswar, Odisha 751001', 3, 3.9, 1120, ARRAY['Restaurant', 'WiFi', 'Room Service', 'Parking', 'Laundry'], 1800, 3800, 14, 45, '+91 674 253 6789', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800');