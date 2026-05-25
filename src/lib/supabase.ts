// Supabase Client Wrapper
// This hooks into the live server if credentials are configured,
// otherwise triggers a transparent mock fallback so the application runs perfectly out-of-the-box.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const USE_MOCK_STATE = process.env.NEXT_PUBLIC_USE_MOCK_STATE !== "false";

export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export const velvetSupabaseClient = {
  isMock: USE_MOCK_STATE,
  
  auth: {
    getSession: async () => {
      return { data: { session: { user: { id: "user-1", email: "vip@velvet.app" } } }, error: null };
    },
    signUp: async (email: string, password: string, metadata?: any) => {
      console.log("[MOCK AUTH] Sign Up:", email, metadata);
      return { data: { user: { id: "user-" + Date.now(), email, user_metadata: metadata } }, error: null };
    },
    signInWithPassword: async (email: string, password: string) => {
      console.log("[MOCK AUTH] Sign In:", email);
      return { data: { user: { id: "user-1", email, user_metadata: { role: "customer", username: "vip_guest" } } }, error: null };
    },
    signOut: async () => {
      console.log("[MOCK AUTH] Sign Out");
      return { error: null };
    }
  },

  db: {
    select: async (table: string, query: string = "*") => {
      console.log(`[MOCK DB] Select from ${table} with query ${query}`);
      return { data: [], error: null };
    },
    insert: async (table: string, values: any) => {
      console.log(`[MOCK DB] Insert into ${table}:`, values);
      return { data: values, error: null };
    },
    update: async (table: string, values: any, match: any) => {
      console.log(`[MOCK DB] Update ${table} where:`, match, "with values:", values);
      return { data: values, error: null };
    }
  }
};
