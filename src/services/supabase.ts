import { createClient } from '@supabase/supabase-js';

// User provided credentials for Project: freelanceportfolio (wtvxshcjtelfdwcpvweq)
const supabaseUrl = 'https://wtvxshcjtelfdwcpvweq.supabase.co';
const supabaseAnonKey = 'sb_publishable_MTGXolNbWBBg8IkYTMyyAg_7GI-XcFX';

// Export a flag to let the app know if sync features are actually available
export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-portfolio-auth-token',
  }
});
