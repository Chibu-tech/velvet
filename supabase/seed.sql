-- Velvet Platform - Reference Seed Data
-- Run this AFTER creating auth users (e.g. via scripts/seed.ts or Supabase Auth UI)
-- These UUIDs are examples; replace with actual auth.users IDs

-- Example companion profiles (update UUIDs to match auth.users)
-- INSERT INTO public.profiles (id, username, display_name, role, avatar_url, bio, interests, languages, is_verified, verification_status, trust_score, response_rate, online_status, pricing_hourly, pricing_daily, availability_status, categories, rating, reviews_count, onboarded, tier, credits)
-- VALUES
--   ('REPLACE_WITH_AUTH_USER_ID', 'seraphina_v', 'Seraphina Vance', 'companion', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', 'Curator of luxury nightlife experiences, fine dining guide, and premium social companion for exclusive corporate functions.', ARRAY['Fine Dining', 'Modern Art', 'Jazz Clubs', 'VIP Events'], ARRAY['English', 'French', 'Italian'], true, 'verified', 98, 100, true, 150, 1200, 'available', ARRAY['Nightlife Hosting', 'Social Meetups', 'Creator Bookings'], 4.9, 34, true, 'gold', 200);
