const SUPABASE_URL = 'https://uqgfmyynnmqaguonaora.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TGqK4RWtZLcIiC-SJMbGuQ_Fw3_jLkx';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const isSupabaseConfigured =
  SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
  /^https?:\/\//i.test(SUPABASE_URL);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
