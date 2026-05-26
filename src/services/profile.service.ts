import { getSupabase, useMock, mockDelay } from "./base.service";
import { Profile, MOCK_COMPANIONS } from "@/lib/mockData";

type DbProfile = Record<string, any>;

function mapDbToProfile(db: DbProfile): Profile {
  return {
    id: db.id,
    username: db.username || "",
    displayName: db.display_name || "",
    role: db.role || "customer",
    avatarUrl: db.avatar_url || "",
    images: db.images || [],
    bio: db.bio || "",
    interests: db.interests || [],
    languages: db.languages || [],
    isVerified: db.is_verified || false,
    verificationStatus: db.verification_status || "unverified",
    trustScore: db.trust_score || 0,
    responseRate: db.response_rate || 100,
    onlineStatus: db.online_status || false,
    lastActive: db.last_active || "",
    distanceKm: db.distance_km || 0,
    pricingHourly: db.pricing_hourly || 0,
    pricingDaily: db.pricing_daily || 0,
    pricingCurrency: db.pricing_currency || "USD",
    availabilityStatus: db.availability_status || "available",
    categories: db.categories || [],
    rating: db.rating || 0,
    reviewsCount: db.reviews_count || 0,
    requireVerifiedClients: db.require_verified_clients || false,
  };
}

function mapProfileToDb(p: Partial<Profile>): Record<string, any> {
  const db: Record<string, any> = {};
  if (p.displayName !== undefined) db.display_name = p.displayName;
  if (p.username !== undefined) db.username = p.username;
  if (p.role !== undefined) db.role = p.role;
  if (p.avatarUrl !== undefined) db.avatar_url = p.avatarUrl;
  if (p.images !== undefined) db.images = p.images;
  if (p.bio !== undefined) db.bio = p.bio;
  if (p.interests !== undefined) db.interests = p.interests;
  if (p.languages !== undefined) db.languages = p.languages;
  if (p.isVerified !== undefined) db.is_verified = p.isVerified;
  if (p.verificationStatus !== undefined) db.verification_status = p.verificationStatus;
  if (p.trustScore !== undefined) db.trust_score = p.trustScore;
  if (p.responseRate !== undefined) db.response_rate = p.responseRate;
  if (p.onlineStatus !== undefined) db.online_status = p.onlineStatus;
  if (p.availabilityStatus !== undefined) db.availability_status = p.availabilityStatus;
  if (p.categories !== undefined) db.categories = p.categories;
  if (p.pricingHourly !== undefined) db.pricing_hourly = p.pricingHourly;
  if (p.pricingDaily !== undefined) db.pricing_daily = p.pricingDaily;
  if (p.pricingCurrency !== undefined) db.pricing_currency = p.pricingCurrency;
  if (p.requireVerifiedClients !== undefined) db.require_verified_clients = p.requireVerifiedClients;
  return db;
}

export async function getProfiles(filters?: { role?: string; verified?: boolean; online?: boolean; category?: string; limit?: number }): Promise<Profile[]> {
  if (useMock()) {
    await mockDelay(200);
    let results = [...MOCK_COMPANIONS];
    if (filters?.role) results = results.filter(p => p.role === filters.role);
    if (filters?.verified) results = results.filter(p => p.isVerified);
    if (filters?.online) results = results.filter(p => p.onlineStatus);
    if (filters?.category && filters.category !== "All") results = results.filter(p => p.categories.includes(filters.category!));
    if (filters?.limit) results = results.slice(0, filters.limit);
    return results;
  }
  let query = getSupabase().from("profiles").select("*");
  if (filters?.role) query = query.eq("role", filters.role);
  if (filters?.verified) query = query.eq("is_verified", true);
  if (filters?.online) query = query.eq("online_status", true);
  if (filters?.category && filters.category !== "All") query = query.contains("categories", [filters.category]);
  if (filters?.limit) query = query.limit(filters.limit);
  query = query.order("rating", { ascending: false });
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapDbToProfile);
}

export async function getProfileById(id: string): Promise<Profile | null> {
  if (useMock()) {
    await mockDelay(100);
    return MOCK_COMPANIONS.find(p => p.id === id) || null;
  }
  const { data, error } = await getSupabase().from("profiles").select("*").eq("id", id).single();
  if (error) return null;
  return data ? mapDbToProfile(data) : null;
}

export async function getCurrentUserProfile(userId: string): Promise<{ id: string; username: string; displayName: string; role: string; avatarUrl: string; onboarded: boolean; tier: string; credits: number; verificationStatus: string; safeWord: string; requireVerifiedClients: boolean } | null> {
  if (useMock()) {
    return {
      id: "user-1", username: "vip_guest", displayName: "Julian Sterling", role: "customer",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
      onboarded: true, tier: "free", credits: 50, verificationStatus: "unverified", safeWord: "", requireVerifiedClients: false,
    };
  }
  const { data, error } = await getSupabase().from("profiles").select("*").eq("id", userId).single();
  if (error || !data) return null;
  return {
    id: data.id, username: data.username || "", displayName: data.display_name || "", role: data.role || "customer",
    avatarUrl: data.avatar_url || "", onboarded: data.onboarded || false, tier: data.tier || "free",
    credits: data.credits || 0, verificationStatus: data.verification_status || "unverified",
    safeWord: data.safe_word || "", requireVerifiedClients: data.require_verified_clients || false,
  };
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
  if (useMock()) return;
  const db = mapProfileToDb(updates);
  const { error } = await getSupabase().from("profiles").update(db).eq("id", userId);
  if (error) throw error;
}
