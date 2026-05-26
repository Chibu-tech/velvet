import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_STATE !== "false";

function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
    console.warn("[Supabase] Missing or placeholder credentials. Falling back to mock mode.");
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

export const supabase = createSupabaseClient();
export const isMockMode = () => USE_MOCK || !supabase;
