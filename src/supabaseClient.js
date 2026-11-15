import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for Vite (or process.env.REACT_APP_... for Create React App)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);