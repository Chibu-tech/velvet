import { supabase, isMockMode } from "@/lib/supabase";

export function useMock(): boolean {
  return isMockMode();
}

export function getSupabase() {
  return supabase!;
}

export function mockDelay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export class ServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "ServiceError";
  }
}

export function handleError(err: unknown): never {
  if (err instanceof ServiceError) throw err;
  const message = err instanceof Error ? err.message : "Unknown error";
  throw new ServiceError(message);
}

export async function withErrorHandling<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    return handleError(err);
  }
}
