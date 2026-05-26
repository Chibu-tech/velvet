import { getSupabase, useMock, mockDelay } from "./base.service";

export interface VerificationRequest {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  selfieUrl: string;
  status: string;
  submittedAt: string;
}

export async function getVerificationRequests(): Promise<VerificationRequest[]> {
  if (useMock()) {
    await mockDelay(200);
    return [
      { id: "v-req-1", userId: "comp-1", username: "elena_model", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", selfieUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400", status: "pending", submittedAt: "2026-05-21T09:00:00Z" },
      { id: "v-req-2", userId: "comp-2", username: "marcus_k", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200", selfieUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400", status: "pending", submittedAt: "2026-05-21T11:15:00Z" },
    ];
  }
  const { data, error } = await getSupabase()
    .from("verification_requests")
    .select("*, profiles!inner(username, avatar_url)")
    .eq("status", "pending")
    .order("submitted_at", { ascending: true });
  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    username: r.profiles?.username || "",
    avatarUrl: r.profiles?.avatar_url || "",
    selfieUrl: r.selfie_url,
    status: r.status,
    submittedAt: r.submitted_at,
  }));
}

export async function approveVerification(requestId: string, reviewerId: string): Promise<void> {
  if (useMock()) return;
  const { data: req } = await getSupabase().from("verification_requests").select("user_id").eq("id", requestId).single();
  if (!req) return;
  await getSupabase().from("verification_requests").update({ status: "approved", reviewed_at: new Date().toISOString(), reviewed_by: reviewerId }).eq("id", requestId);
  await getSupabase().from("profiles").update({ is_verified: true, verification_status: "verified" }).eq("id", req.user_id);
}

export async function rejectVerification(requestId: string, reviewerId: string): Promise<void> {
  if (useMock()) return;
  await getSupabase().from("verification_requests").update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: reviewerId }).eq("id", requestId);
}

export async function submitVerification(userId: string, selfieUrl: string): Promise<void> {
  if (useMock()) return;
  await getSupabase().from("verification_requests").insert({ user_id: userId, selfie_url: selfieUrl, status: "pending" });
  await getSupabase().from("profiles").update({ verification_status: "pending" }).eq("id", userId);
}
