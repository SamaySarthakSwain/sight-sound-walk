import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fsptuiiymuxtwepbumda.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzcHR1aWl5bXV4dHdlcGJ1bWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjUxMTksImV4cCI6MjA4NzEwMTExOX0.BwaB8j4QoxGPgxDDf99QJyJgtXqgVrPuXrLLImMHLgM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data, error } = await supabase.from('monuments').select('*');
  if (error) {
    console.log("ERROR_JSON:", JSON.stringify(error));
  } else {
    console.log("Monuments count:", data.length);
    if (data && data.length > 0) {
      console.log(JSON.stringify(data[0]));
    }
  }
}
check();
