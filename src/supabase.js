import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback to avoid crash if env vars are missing
const DEFAULT_URL = 'https://placeholder.supabase.co';
const DEFAULT_KEY = 'placeholder';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials missing! App running in Mock Mode.');
}

export const supabase = createClient(
    supabaseUrl || DEFAULT_URL,
    supabaseAnonKey || DEFAULT_KEY
);
