import { getSupabase, useMock, mockDelay } from "./base.service";
import { Profile, MOCK_COMPANIONS } from "@/lib/mockData";
import { getProfiles } from "./profile.service";

export interface SearchFilters {
  query?: string;
  radiusKm?: number;
  verifiedOnly?: boolean;
  onlineOnly?: boolean;
  category?: string;
}

export async function searchCompanions(filters: SearchFilters): Promise<Profile[]> {
  if (useMock()) {
    await mockDelay(250);
    let results = MOCK_COMPANIONS.filter(c => c.role === "companion");
    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(c =>
        c.displayName.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q) ||
        c.interests.some(i => i.toLowerCase().includes(q)) ||
        c.categories.some(cat => cat.toLowerCase().includes(q))
      );
    }
    if (filters.verifiedOnly) results = results.filter(c => c.isVerified);
    if (filters.onlineOnly) results = results.filter(c => c.onlineStatus);
    if (filters.category && filters.category !== "All") results = results.filter(c => c.categories.includes(filters.category!));
    return results;
  }
  let query = getSupabase().from("profiles").select("*").eq("role", "companion");
  if (filters.verifiedOnly) query = query.eq("is_verified", true);
  if (filters.onlineOnly) query = query.eq("online_status", true);
  if (filters.category && filters.category !== "All") query = query.contains("categories", [filters.category]);
  if (filters.query) {
    query = query.or(`display_name.ilike.%${filters.query}%,bio.ilike.%${filters.query}%`);
  }
  query = query.order("rating", { ascending: false }).limit(50);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((p: any) => ({
    id: p.id, username: p.username || "", displayName: p.display_name || "", role: p.role,
    avatarUrl: p.avatar_url || "", images: p.images || [], bio: p.bio || "",
    interests: p.interests || [], languages: p.languages || [],
    isVerified: p.is_verified || false, verificationStatus: p.verification_status || "unverified",
    trustScore: p.trust_score || 0, responseRate: p.response_rate || 100,
    onlineStatus: p.online_status || false, lastActive: p.last_active || "",
    distanceKm: p.distance_km || 0, pricingHourly: p.pricing_hourly || 0,
    pricingDaily: p.pricing_daily || 0, pricingCurrency: p.pricing_currency || "USD",
    availabilityStatus: p.availability_status || "available",
    categories: p.categories || [], rating: p.rating || 0, reviewsCount: p.reviews_count || 0,
    requireVerifiedClients: p.require_verified_clients || false,
  }));
}
