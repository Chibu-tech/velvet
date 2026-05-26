import { getSupabase, useMock, mockDelay } from "./base.service";
import { Notification, MOCK_NOTIFICATIONS } from "@/lib/mockData";

type DbNotif = Record<string, any>;

function mapDbToNotification(db: DbNotif): Notification {
  return {
    id: db.id,
    title: db.title,
    message: db.message,
    type: db.type,
    referenceId: db.reference_id || "",
    isRead: db.is_read || false,
    createdAt: db.created_at,
  };
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  if (useMock()) {
    await mockDelay(150);
    return MOCK_NOTIFICATIONS;
  }
  const { data, error } = await getSupabase()
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapDbToNotification);
}

export async function markNotificationsAsRead(userId: string): Promise<void> {
  if (useMock()) return;
  await getSupabase()
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
}

export async function createNotification(notification: {
  userId: string; title: string; message: string; type: string; referenceId?: string;
}): Promise<Notification> {
  if (useMock()) {
    return {
      id: `not-${Date.now()}`,
      title: notification.title,
      message: notification.message,
      type: notification.type as any,
      referenceId: notification.referenceId || "",
      isRead: false,
      createdAt: new Date().toISOString(),
    };
  }
  const { data, error } = await getSupabase()
    .from("notifications")
    .insert({
      user_id: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      reference_id: notification.referenceId,
    })
    .select()
    .single();
  if (error) throw error;
  return mapDbToNotification(data);
}
