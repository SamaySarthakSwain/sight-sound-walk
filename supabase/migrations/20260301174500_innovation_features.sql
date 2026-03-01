-- 1. Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  badge_icon TEXT NOT NULL, -- Name of the icon (e.g., 'Landmark', 'Waves', 'Tent')
  category_requirement TEXT, -- 'temple', 'beach', 'museum'
  count_requirement INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- 3. Create voice_vlogs table
CREATE TABLE public.voice_vlogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monument_id UUID REFERENCES public.monuments(id) ON DELETE SET NULL,
  audio_url TEXT NOT NULL,
  user_name TEXT,
  likes_count INTEGER DEFAULT 0,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_vlogs ENABLE ROW LEVEL SECURITY;

-- Policies for Achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- Policies for User Achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can grant achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for Voice Vlogs
CREATE POLICY "Anyone can listen to voice vlogs" ON public.voice_vlogs FOR SELECT USING (true);
CREATE POLICY "Users can record their own vlogs" ON public.voice_vlogs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vlogs" ON public.voice_vlogs FOR DELETE USING (auth.uid() = user_id);

-- Insert initial achievements
INSERT INTO public.achievements (title, description, badge_icon, category_requirement, count_requirement) VALUES
('The Pilgrim', 'Visit your first 3 temples in Odisha', 'Landmark', 'temple', 3),
('Beach Bum', 'Explore 2 different beaches along the coast', 'Waves', 'beach', 2),
('Heritage Scout', 'Visit at least 5 heritage sites across the state', 'History', 'monument', 5),
('Odisha Insider', 'Contribute your first Community Audio Vlog', 'Mic', NULL, 1),
('Odisha Expert', 'Master explorer with 10 legendary site visits', 'Star', 'monument', 10);
