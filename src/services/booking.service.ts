import { getSupabase, useMock, mockDelay } from "./base.service";
import { Booking, MOCK_BOOKINGS, MOCK_COMPANIONS } from "@/lib/mockData";

type DbBooking = Record<string, any>;

function mapDbToBooking(db: DbBooking): Booking {
  return {
    id: db.id,
    customerId: db.customer_id,
    companionId: db.companion_id,
    status: db.status,
    scheduledAt: db.scheduled_at,
    durationHours: db.duration_hours,
    totalPrice: db.total_price,
    currency: db.currency || "USD",
    specialRequests: db.special_requests,
    checkedInAt: db.checked_in_at,
    checkedOutAt: db.checked_out_at,
    createdAt: db.created_at,
  };
}

export async function getBookings(userId: string): Promise<Booking[]> {
  if (useMock()) {
    await mockDelay(200);
    return MOCK_BOOKINGS.filter(b => b.customerId === userId || b.companionId === userId);
  }
  const { data, error } = await getSupabase()
    .from("bookings")
    .select("*")
    .or(`customer_id.eq.${userId},companion_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapDbToBooking);
}

export async function createBooking(booking: {
  customerId: string; companionId: string; scheduledAt: string;
  durationHours: number; totalPrice: number; currency: string; specialRequests?: string;
}): Promise<Booking> {
  if (useMock()) {
    await mockDelay(300);
    const companion = MOCK_COMPANIONS.find(c => c.id === booking.companionId);
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      customerId: booking.customerId,
      companionId: booking.companionId,
      status: "pending",
      scheduledAt: booking.scheduledAt,
      durationHours: booking.durationHours,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      specialRequests: booking.specialRequests,
      createdAt: new Date().toISOString(),
    };
    return newBooking;
  }
  const { data, error } = await getSupabase()
    .from("bookings")
    .insert({
      customer_id: booking.customerId,
      companion_id: booking.companionId,
      scheduled_at: booking.scheduledAt,
      duration_hours: booking.durationHours,
      total_price: booking.totalPrice,
      currency: booking.currency,
      special_requests: booking.specialRequests,
    })
    .select()
    .single();
  if (error) throw error;
  return mapDbToBooking(data);
}

export async function updateBookingStatus(bookingId: string, status: Booking["status"], extra?: Record<string, any>): Promise<void> {
  if (useMock()) return;
  const updates: Record<string, any> = { status };
  if (extra?.checkedInAt) updates.checked_in_at = extra.checkedInAt;
  if (extra?.checkedOutAt) updates.checked_out_at = extra.checkedOutAt;
  const { error } = await getSupabase().from("bookings").update(updates).eq("id", bookingId);
  if (error) throw error;
}
