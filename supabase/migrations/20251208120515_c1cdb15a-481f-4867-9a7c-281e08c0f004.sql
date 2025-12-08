-- Update profiles table to include name and avatar_url for user info display
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create visit_history table to track places users have visited
CREATE TABLE public.visit_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_name TEXT NOT NULL,
  place_category TEXT,
  place_image TEXT,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on visit_history
ALTER TABLE public.visit_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for visit_history
CREATE POLICY "Users can view their own visit history" 
ON public.visit_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visit history" 
ON public.visit_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visit history" 
ON public.visit_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add DELETE policy to profiles table (from security review)
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Update the handle_new_user function to capture more user info
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, phone_number, full_name, email, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'phone_number',
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;