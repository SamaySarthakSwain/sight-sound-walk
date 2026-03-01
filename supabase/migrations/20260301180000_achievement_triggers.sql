-- Function to check and grant achievements
CREATE OR REPLACE FUNCTION public.check_achievements()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_category TEXT;
  v_visit_count INTEGER;
  v_achievement RECORD;
BEGIN
  v_user_id := NEW.user_id;
  v_category := NEW.place_category;

  -- 1. Check for category-based achievements
  IF v_category IS NOT NULL THEN
    FOR v_achievement IN 
      SELECT * FROM public.achievements 
      WHERE category_requirement = v_category
    LOOP
      -- Count visits in this category
      SELECT COUNT(*) INTO v_visit_count 
      FROM public.visit_history 
      WHERE user_id = v_user_id AND place_category = v_category;

      -- If requirement met, grant achievement if not already earned
      IF v_visit_count >= v_achievement.count_requirement THEN
        INSERT INTO public.user_achievements (user_id, achievement_id)
        VALUES (v_user_id, v_achievement.id)
        ON CONFLICT (user_id, achievement_id) DO NOTHING;
      END IF;
    LOOP END;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger for visit_history
DROP TRIGGER IF EXISTS on_visit_recorded ON public.visit_history;
CREATE TRIGGER on_visit_recorded
  AFTER INSERT ON public.visit_history
  FOR EACH ROW
  EXECUTE FUNCTION public.check_achievements();

-- Function for Vlog achievement
CREATE OR REPLACE FUNCTION public.check_vlog_achievement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_achievement_id UUID;
BEGIN
  -- Get the "Odisha Insider" achievement ID
  SELECT id INTO v_achievement_id 
  FROM public.achievements 
  WHERE title = 'Odisha Insider' 
  LIMIT 1;

  IF v_achievement_id IS NOT NULL THEN
    INSERT INTO public.user_achievements (user_id, achievement_id)
    VALUES (NEW.user_id, v_achievement_id)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger for voice_vlogs
DROP TRIGGER IF EXISTS on_vlog_posted ON public.voice_vlogs;
CREATE TRIGGER on_vlog_posted
  AFTER INSERT ON public.voice_vlogs
  FOR EACH ROW
  EXECUTE FUNCTION public.check_vlog_achievement();
