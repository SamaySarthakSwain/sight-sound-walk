
-- Restrict food_ratings public reads to hide user_id from anonymous users
DROP POLICY IF EXISTS "Anyone can view food ratings" ON public.food_ratings;

-- Authenticated users can see all ratings (with user_id intact, for their own profile lookups via separate joins)
CREATE POLICY "Authenticated users can view food ratings"
ON public.food_ratings
FOR SELECT
TO authenticated
USING (true);

-- Create a public, anonymized view of ratings (no user_id)
CREATE OR REPLACE VIEW public.food_ratings_public
WITH (security_invoker = true)
AS
SELECT
  id,
  food_place_id,
  ate_here,
  comment,
  value_rating,
  hygiene_rating,
  taste_rating,
  overall_rating,
  created_at
FROM public.food_ratings;

GRANT SELECT ON public.food_ratings_public TO anon, authenticated;

-- Restrict hotels contact info: anonymous users get no contact_phone/contact_email
DROP POLICY IF EXISTS "Anyone can view hotels" ON public.hotels;

CREATE POLICY "Authenticated users can view hotels"
ON public.hotels
FOR SELECT
TO authenticated
USING (true);

-- Create a public view of hotels excluding contact fields
CREATE OR REPLACE VIEW public.hotels_public
WITH (security_invoker = true)
AS
SELECT
  id,
  name,
  description,
  location,
  address,
  latitude,
  longitude,
  star_rating,
  google_rating,
  google_total_ratings,
  google_place_id,
  image_url,
  amenities,
  price_per_night_min,
  price_per_night_max,
  available_rooms,
  total_rooms,
  website,
  created_at,
  updated_at
FROM public.hotels;

GRANT SELECT ON public.hotels_public TO anon, authenticated;
