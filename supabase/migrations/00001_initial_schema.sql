-- Velvet Platform - Initial Database Schema
-- Run this in the Supabase SQL Editor

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'companion', 'admin')),
  avatar_url TEXT,
  images TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  trust_score INT DEFAULT 0,
  response_rate INT DEFAULT 100,
  online_status BOOLEAN DEFAULT false,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  distance_km FLOAT DEFAULT 0,
  pricing_hourly INT DEFAULT 0,
  pricing_daily INT DEFAULT 0,
  pricing_currency TEXT DEFAULT 'USD',
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'away')),
  categories TEXT[] DEFAULT '{}',
  rating FLOAT DEFAULT 0,
  reviews_count INT DEFAULT 0,
  require_verified_clients BOOLEAN DEFAULT false,
  safe_word TEXT DEFAULT '',
  credits INT DEFAULT 0,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'gold', 'platinum')),
  onboarded BOOLEAN DEFAULT false,
  location GEOGRAPHY(Point, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  companion_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  unread_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  companion_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'cancelled', 'active', 'completed', 'distress')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_hours INT NOT NULL,
  total_price INT NOT NULL,
  currency TEXT DEFAULT 'USD',
  special_requests TEXT,
  checked_in_at TIMESTAMPTZ,
  checked_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  reference_id TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  relationship TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SAFETY EVENTS
-- ============================================================
CREATE TABLE public.safety_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('checkin', 'checkout', 'safe_word', 'panic', 'distress')),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RATINGS
-- ============================================================
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, from_user_id)
);

-- ============================================================
-- VERIFICATION REQUESTS
-- ============================================================
CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  selfie_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ============================================================
-- REPORTS (Moderation)
-- ============================================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ============================================================
-- DISTRESS ALERTS
-- ============================================================
CREATE TABLE public.distress_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  location TEXT,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ============================================================
-- REFERRAL CODES
-- ============================================================
CREATE TABLE public.referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  reward_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_online ON public.profiles(online_status) WHERE online_status = true;
CREATE INDEX idx_profiles_verified ON public.profiles(is_verified) WHERE is_verified = true;
CREATE INDEX idx_profiles_rating ON public.profiles(rating DESC);
CREATE INDEX idx_conversations_participant ON public.conversations(companion_id, customer_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_companion ON public.bookings(companion_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_safety_events_user ON public.safety_events(user_id, timestamp DESC);
CREATE INDEX idx_ratings_target ON public.ratings(to_user_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_distress_alerts_active ON public.distress_alerts(resolved) WHERE resolved = false;
CREATE INDEX idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX idx_profiles_location ON public.profiles USING GIST (location) WHERE location IS NOT NULL;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distress_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only owner can update
CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Conversations: participants can read/write
CREATE POLICY "Participants can read conversations"
  ON public.conversations FOR SELECT USING (auth.uid() = companion_id OR auth.uid() = customer_id);

CREATE POLICY "Participants can insert conversations"
  ON public.conversations FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Messages: participants in the conversation
CREATE POLICY "Participants can read messages"
  ON public.messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.companion_id = auth.uid() OR c.customer_id = auth.uid()))
  );

CREATE POLICY "Participants can insert messages"
  ON public.messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.companion_id = auth.uid() OR c.customer_id = auth.uid()))
  );

-- Bookings: customer and companion can read, customer can insert
CREATE POLICY "Participants can read bookings"
  ON public.bookings FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = companion_id);

CREATE POLICY "Customers can insert bookings"
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Participants can update bookings"
  ON public.bookings FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = companion_id);

-- Notifications: owner only
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Emergency contacts: owner only
CREATE POLICY "Users can manage own emergency contacts"
  ON public.emergency_contacts FOR ALL USING (auth.uid() = user_id);

-- Safety events: participant or admin
CREATE POLICY "Users can read own safety events"
  ON public.safety_events FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Users can insert own safety events"
  ON public.safety_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ratings: readable by everyone involved
CREATE POLICY "Ratings are readable by participants"
  ON public.ratings FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can insert own ratings"
  ON public.ratings FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- Verification requests: user and admin
CREATE POLICY "Users can read own verification requests"
  ON public.verification_requests FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Users can insert own verification requests"
  ON public.verification_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reports: reporter and admin
CREATE POLICY "Users can read own reports"
  ON public.reports FOR SELECT USING (auth.uid() = reporter_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Users can insert reports"
  ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Distress alerts: user and admin
CREATE POLICY "Users can read own distress alerts"
  ON public.distress_alerts FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Users can insert own distress alerts"
  ON public.distress_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referral codes: owner and readable by anyone (for code lookup)
CREATE POLICY "Referral codes are publicly readable"
  ON public.referral_codes FOR SELECT USING (true);

CREATE POLICY "Users can insert own referral codes"
  ON public.referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'displayName', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'avatarUrl', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- RPC FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION public.add_credits(user_id UUID, amount INT)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles SET credits = COALESCE(credits, 0) + amount WHERE id = user_id;
END;
$$;
