import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cogzpsjmpvygchazyfac.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_I3B2YeZPHQcnKYrTFu8wnw_MVK6mp4x';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
