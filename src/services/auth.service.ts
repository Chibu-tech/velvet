import { getSupabase, useMock, ServiceError } from "./base.service";

export interface AuthResult {
  user: {
    id: string;
    email: string;
    user_metadata: Record<string, any>;
  } | null;
  error: Error | null;
}

export interface SessionResult {
  session: {
    user: {
      id: string;
      email: string;
      user_metadata: Record<string, any>;
    };
  } | null;
  error: Error | null;
}

export async function getSession(): Promise<SessionResult> {
  if (useMock()) {
    return { session: { user: { id: "user-1", email: "vip@velvet.app", user_metadata: {} } }, error: null };
  }
  const { data, error } = await getSupabase().auth.getSession();
  if (error) return { session: null, error };
  if (!data.session) return { session: null, error: null };
  return { session: { user: { id: data.session.user.id, email: data.session.user.email || "", user_metadata: data.session.user.user_metadata } }, error: null };
}

export async function signUp(email: string, password: string, metadata?: Record<string, any>): Promise<AuthResult> {
  if (useMock()) {
    return { user: { id: "user-" + Date.now(), email, user_metadata: metadata || {} }, error: null };
  }
  const { data, error } = await getSupabase().auth.signUp({ email, password, options: { data: metadata } });
  if (error) return { user: null, error };
  return { user: data.user ? { id: data.user.id, email: data.user.email || "", user_metadata: data.user.user_metadata } : null, error: null };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (useMock()) {
    return { user: { id: "user-1", email, user_metadata: { role: "customer", username: "vip_guest", displayName: "Julian Sterling" } }, error: null };
  }
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) return { user: null, error };
  return { user: data.user ? { id: data.user.id, email: data.user.email || "", user_metadata: data.user.user_metadata } : null, error: null };
}

export async function signOut(): Promise<Error | null> {
  if (useMock()) return null;
  const { error } = await getSupabase().auth.signOut();
  return error;
}
