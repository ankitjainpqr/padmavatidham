import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
           typeof supabaseUrl === 'string' &&
           typeof supabaseAnonKey === 'string' &&
           supabaseUrl.trim() !== '' && 
           supabaseAnonKey.trim() !== '' &&
           supabaseUrl !== 'your_supabase_project_url' &&
           supabaseAnonKey !== 'your_supabase_anon_key' &&
           supabaseUrl.startsWith('http'));
};

// Only create the client if we have valid credentials
let supabase: SupabaseClient;

if (isSupabaseConfigured()) {
  supabase = createClient(supabaseUrl!, supabaseAnonKey!);
} else {
  console.warn(
    '⚠️ Supabase environment variables are not set. Please create a .env file with:\n' +
    'VITE_SUPABASE_URL=your_supabase_project_url\n' +
    'VITE_SUPABASE_ANON_KEY=your_supabase_anon_key\n\n' +
    'See SUPABASE_SETUP.md for instructions.\n' +
    'The app will continue to run, but Supabase operations will not work until configured.'
  );
  // Create a client with a valid URL format but it won't work
  // This is a workaround - the client will be created but operations will fail
  // We use a valid URL format to pass validation
  supabase = createClient('https://invalid-placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImludmFsaWQtcGxhY2Vob2xkZXIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTI2OTIwMCwiZXhwIjoxOTU2ODQ1MjAwfQ.invalid');
}

export { supabase };






