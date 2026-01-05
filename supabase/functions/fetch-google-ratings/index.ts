import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_API_KEY = "AIzaSyBVVkTWwfx3NW6bFi1t7CEomwv1owCO1SI";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get food places that need Google ratings
    const { data: places, error: fetchError } = await supabase
      .from("food_places")
      .select("id, name, location, latitude, longitude, google_place_id, google_last_updated")
      .order("google_last_updated", { ascending: true, nullsFirst: true })
      .limit(10);

    if (fetchError) throw fetchError;

    const results = [];

    for (const place of places || []) {
      // Skip if updated within last 24 hours
      if (place.google_last_updated) {
        const lastUpdated = new Date(place.google_last_updated);
        const hoursSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);
        if (hoursSinceUpdate < 24) continue;
      }

      let placeId = place.google_place_id;

      // If no place ID, search for it
      if (!placeId && place.latitude && place.longitude) {
        const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${place.latitude},${place.longitude}&radius=500&keyword=${encodeURIComponent(place.name)}&key=${GOOGLE_API_KEY}`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
          placeId = searchData.results[0].place_id;
        }
      }

      if (placeId) {
        // Get place details
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total&key=${GOOGLE_API_KEY}`;
        
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        if (detailsData.result) {
          const { error: updateError } = await supabase
            .from("food_places")
            .update({
              google_place_id: placeId,
              google_rating: detailsData.result.rating || null,
              google_total_ratings: detailsData.result.user_ratings_total || 0,
              google_last_updated: new Date().toISOString(),
            })
            .eq("id", place.id);

          if (!updateError) {
            results.push({
              id: place.id,
              name: place.name,
              google_rating: detailsData.result.rating,
              google_total_ratings: detailsData.result.user_ratings_total,
            });
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, updated: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
