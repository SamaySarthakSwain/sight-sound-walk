
-- 1. Restrict user_achievements INSERT (if table exists) to service role only
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_achievements') THEN
    EXECUTE 'DROP POLICY IF EXISTS "System can grant achievements" ON public.user_achievements';
    EXECUTE 'DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements';
  END IF;
END $$;

-- 2. Hide monuments.hidden_lore from client roles (column-level revoke)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='monuments' AND column_name='hidden_lore'
  ) THEN
    EXECUTE 'REVOKE SELECT (hidden_lore) ON public.monuments FROM anon, authenticated, PUBLIC';
    EXECUTE 'GRANT SELECT (id, title, description, location, state, category, image_url, latitude, longitude, region, is_featured, distance_from_berhampur, facts, created_at, updated_at) ON public.monuments TO anon, authenticated';
  END IF;
END $$;

-- 3. visit_history: restrict to authenticated role (was public → included anon)
DROP POLICY IF EXISTS "Users can view their own visit history" ON public.visit_history;
DROP POLICY IF EXISTS "Users can insert their own visit history" ON public.visit_history;
DROP POLICY IF EXISTS "Users can delete their own visit history" ON public.visit_history;

CREATE POLICY "Users can view their own visit history"
  ON public.visit_history FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visit history"
  ON public.visit_history FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visit history"
  ON public.visit_history FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 4. food_ratings: restrict direct SELECT to owner only
DROP POLICY IF EXISTS "Authenticated users can view food ratings" ON public.food_ratings;

CREATE POLICY "Users can view their own food ratings"
  ON public.food_ratings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 5. hotels: hide sensitive contact columns from broad SELECT
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='hotels' AND column_name='contact_phone') THEN
    EXECUTE 'REVOKE SELECT (contact_phone, contact_email, website) ON public.hotels FROM anon, authenticated, PUBLIC';
  END IF;
END $$;
