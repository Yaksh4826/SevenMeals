import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseClientConfigError =
  !supabaseUrl || !supabaseAnonKey
    ? "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env"
    : null;

export const supabase = supabaseClientConfigError
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);
