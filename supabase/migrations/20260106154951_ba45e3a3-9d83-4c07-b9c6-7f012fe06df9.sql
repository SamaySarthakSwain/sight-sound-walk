-- Create cab services table (Ola, Uber, Rapido, local services)
CREATE TABLE public.cab_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  is_local BOOLEAN DEFAULT false,
  has_2_wheeler BOOLEAN DEFAULT false,
  has_3_wheeler BOOLEAN DEFAULT false,
  has_4_wheeler BOOLEAN DEFAULT false,
  base_fare_2w NUMERIC DEFAULT 0,
  per_km_2w NUMERIC DEFAULT 0,
  base_fare_3w NUMERIC DEFAULT 0,
  per_km_3w NUMERIC DEFAULT 0,
  base_fare_4w NUMERIC DEFAULT 0,
  per_km_4w NUMERIC DEFAULT 0,
  avg_wait_time_mins INTEGER DEFAULT 5,
  eco_rating INTEGER DEFAULT 3, -- 1-5 scale
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicle types table
CREATE TABLE public.vehicle_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cab_service_id UUID REFERENCES public.cab_services(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL, -- '2_wheeler', '3_wheeler', '4_wheeler'
  vehicle_name TEXT NOT NULL, -- 'Bike', 'Auto', 'Mini', 'Sedan', etc.
  capacity INTEGER NOT NULL,
  base_fare NUMERIC DEFAULT 0,
  per_km_rate NUMERIC DEFAULT 0,
  per_min_rate NUMERIC DEFAULT 0,
  is_eco_friendly BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trip history table for fare tracking
CREATE TABLE public.trip_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cab_service_id UUID REFERENCES public.cab_services(id),
  vehicle_type_id UUID REFERENCES public.vehicle_types(id),
  start_location TEXT NOT NULL,
  start_lat NUMERIC,
  start_lng NUMERIC,
  end_location TEXT NOT NULL,
  end_lat NUMERIC,
  end_lng NUMERIC,
  stops JSONB DEFAULT '[]',
  distance_km NUMERIC,
  duration_mins INTEGER,
  estimated_fare NUMERIC,
  actual_fare NUMERIC,
  passengers INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trip feedback table
CREATE TABLE public.trip_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trip_history(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  driver_rating INTEGER CHECK (driver_rating >= 1 AND driver_rating <= 5),
  vehicle_condition INTEGER CHECK (vehicle_condition >= 1 AND vehicle_condition <= 5),
  punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
  comment TEXT,
  would_recommend BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cab_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_feedback ENABLE ROW LEVEL SECURITY;

-- Cab services are publicly viewable
CREATE POLICY "Anyone can view cab services" ON public.cab_services FOR SELECT USING (true);

-- Vehicle types are publicly viewable
CREATE POLICY "Anyone can view vehicle types" ON public.vehicle_types FOR SELECT USING (true);

-- Trip history policies
CREATE POLICY "Users can view their own trip history" ON public.trip_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own trips" ON public.trip_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trips" ON public.trip_history FOR UPDATE USING (auth.uid() = user_id);

-- Trip feedback policies
CREATE POLICY "Users can view their own feedback" ON public.trip_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own feedback" ON public.trip_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample cab services
INSERT INTO public.cab_services (name, logo_url, is_local, has_2_wheeler, has_3_wheeler, has_4_wheeler, base_fare_2w, per_km_2w, base_fare_3w, per_km_3w, base_fare_4w, per_km_4w, avg_wait_time_mins, eco_rating) VALUES
('Ola', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Ola_Cabs_logo.svg/200px-Ola_Cabs_logo.svg.png', false, true, true, true, 25, 5, 30, 8, 50, 12, 5, 3),
('Uber', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Uber_logo_2018.png/200px-Uber_logo_2018.png', false, true, true, true, 30, 6, 35, 9, 55, 13, 4, 3),
('Rapido', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Rapido_logo.png/200px-Rapido_logo.png', false, true, true, false, 20, 4, 25, 7, 0, 0, 3, 4),
('Berhampur Cabs', null, true, false, true, true, 0, 0, 20, 6, 40, 10, 8, 3),
('City Auto', null, true, false, true, false, 0, 0, 15, 5, 0, 0, 10, 4);

-- Insert vehicle types
INSERT INTO public.vehicle_types (cab_service_id, vehicle_type, vehicle_name, capacity, base_fare, per_km_rate, per_min_rate, is_eco_friendly) 
SELECT id, '2_wheeler', 'Bike', 1, base_fare_2w, per_km_2w, 1, true FROM public.cab_services WHERE has_2_wheeler = true
UNION ALL
SELECT id, '3_wheeler', 'Auto', 3, base_fare_3w, per_km_3w, 1.5, true FROM public.cab_services WHERE has_3_wheeler = true
UNION ALL
SELECT id, '4_wheeler', 'Mini', 4, base_fare_4w, per_km_4w, 2, false FROM public.cab_services WHERE has_4_wheeler = true;

-- Add trigger for updated_at
CREATE TRIGGER update_cab_services_updated_at
BEFORE UPDATE ON public.cab_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();