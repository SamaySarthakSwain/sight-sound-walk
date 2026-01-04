-- Create monuments table to store all monument data
CREATE TABLE public.monuments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  facts TEXT[] DEFAULT '{}',
  distance_from_berhampur TEXT,
  is_featured BOOLEAN DEFAULT false,
  region TEXT DEFAULT 'odisha',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.monuments ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (monuments are public data)
CREATE POLICY "Anyone can view monuments" 
ON public.monuments 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_monuments_updated_at
BEFORE UPDATE ON public.monuments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_monuments_state ON public.monuments(state);
CREATE INDEX idx_monuments_category ON public.monuments(category);
CREATE INDEX idx_monuments_region ON public.monuments(region);
CREATE INDEX idx_monuments_is_featured ON public.monuments(is_featured);