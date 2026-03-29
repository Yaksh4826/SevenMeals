import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check for config errors
export const supabaseClientConfigError =
  !supabaseUrl || !supabaseAnonKey || !supabaseServiceKey
    ? "Missing Supabase environment variables in .env"
    : null;

// 🛡️ Standard Client (Sticks to RLS - for Frontend)
export const supabase = supabaseClientConfigError
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);

// 🔑 Admin Client (Bypasses RLS - for Backend APIs)
export const supabaseAdmin = supabaseClientConfigError
  ? null
  : createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });