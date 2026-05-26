import { getSupabase, useMock, mockDelay } from "./base.service";

export interface ReportItem {
  id: string;
  reporter: string;
  reportedUser: string;
  reportedUserId: string;
  reason: string;
  details: string;
  status: string;
  createdAt: string;
}

export interface DistressAlert {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  bookingId: string;
  timestamp: string;
  location: string;
}

export async function getReports(): Promise<ReportItem[]> {
  if (useMock()) {
    await mockDelay(200);
    return [{
      id: "rep-1", reporter: "seraphina_v", reportedUser: "guest_user_99", reportedUserId: "unknown",
      reason: "Inappropriate language", details: "Spammed messages requesting explicit contact details outside platform guidelines.",
      status: "open", createdAt: "2026-05-21T08:30:00Z",
    }];
  }
  const { data, error } = await getSupabase()
    .from("reports")
    .select("*, reporter:profiles!reporter_id(username), reported:profiles!reported_user_id(username)")
    .eq("status", "open")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: r.id,
    reporter: r.reporter?.username || "",
    reportedUser: r.reported?.username || "",
    reportedUserId: r.reported_user_id || "",
    reason: r.reason,
    details: r.details || "",
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function resolveReport(reportId: string, resolvedBy: string): Promise<void> {
  if (useMock()) return;
  await getSupabase().from("reports").update({ status: "resolved", resolved_at: new Date().toISOString(), resolved_by: resolvedBy }).eq("id", reportId);
}

export async function banUser(userId: string): Promise<void> {
  if (useMock()) return;
  await getSupabase().from("profiles").update({ role: "banned" as any }).eq("id", userId);
}

export async function reportUser(reporterId: string, reportedUserId: string, reason: string, details?: string): Promise<void> {
  if (useMock()) return;
  await getSupabase().from("reports").insert({ reporter_id: reporterId, reported_user_id: reportedUserId, reason, details });
}

export async function getDistressAlerts(): Promise<DistressAlert[]> {
  if (useMock()) {
    await mockDelay(200);
    return [];
  }
  const { data, error } = await getSupabase()
    .from("distress_alerts")
    .select("*, profiles!inner(username, avatar_url)")
    .eq("resolved", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((d: any) => ({
    id: d.id,
    userId: d.user_id,
    username: d.profiles?.username || "",
    avatarUrl: d.profiles?.avatar_url || "",
    bookingId: d.booking_id || "",
    timestamp: d.created_at,
    location: d.location || "",
  }));
}

export async function resolveDistress(alertId: string, resolvedBy: string): Promise<void> {
  if (useMock()) return;
  await getSupabase().from("distress_alerts").update({ resolved: true, resolved_at: new Date().toISOString(), resolved_by: resolvedBy }).eq("id", alertId);
}

export async function createDistressAlert(userId: string, bookingId: string, location?: string): Promise<void> {
  if (useMock()) return;
  await getSupabase().from("distress_alerts").insert({ user_id: userId, booking_id: bookingId, location });
}

export async function createSafetyEvent(userId: string, type: string, bookingId?: string): Promise<void> {
  if (useMock()) return;
  await getSupabase().from("safety_events").insert({ user_id: userId, type, booking_id: bookingId });
}
