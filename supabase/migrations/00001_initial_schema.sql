-- Velvet Platform - Initial Database Schema
-- Run this in the Supabase SQL Editor

-- Extensions
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
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
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  companion_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  unread_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  reference_id TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  relationship TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.safety_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('checkin', 'checkout', 'safe_word', 'panic', 'distress')),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, from_user_id)
);

CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  selfie_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.distress_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  location TEXT,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  reward_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADD MISSING COLUMNS TO EXISTING TABLES (idempotent)
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='images') THEN ALTER TABLE public.profiles ADD COLUMN images TEXT[] DEFAULT '{}'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='trust_score') THEN ALTER TABLE public.profiles ADD COLUMN trust_score INT DEFAULT 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='response_rate') THEN ALTER TABLE public.profiles ADD COLUMN response_rate INT DEFAULT 100; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='distance_km') THEN ALTER TABLE public.profiles ADD COLUMN distance_km FLOAT DEFAULT 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='pricing_hourly') THEN ALTER TABLE public.profiles ADD COLUMN pricing_hourly INT DEFAULT 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='pricing_daily') THEN ALTER TABLE public.profiles ADD COLUMN pricing_daily INT DEFAULT 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='pricing_currency') THEN ALTER TABLE public.profiles ADD COLUMN pricing_currency TEXT DEFAULT 'USD'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='availability_status') THEN ALTER TABLE public.profiles ADD COLUMN availability_status TEXT DEFAULT 'available'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='categories') THEN ALTER TABLE public.profiles ADD COLUMN categories TEXT[] DEFAULT '{}'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='require_verified_clients') THEN ALTER TABLE public.profiles ADD COLUMN require_verified_clients BOOLEAN DEFAULT false; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='safe_word') THEN ALTER TABLE public.profiles ADD COLUMN safe_word TEXT DEFAULT ''; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='credits') THEN ALTER TABLE public.profiles ADD COLUMN credits INT DEFAULT 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='tier') THEN ALTER TABLE public.profiles ADD COLUMN tier TEXT DEFAULT 'free'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='location') THEN ALTER TABLE public.profiles ADD COLUMN location GEOGRAPHY(Point, 4326); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='onboarded') THEN ALTER TABLE public.profiles ADD COLUMN onboarded BOOLEAN DEFAULT false; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='reviews_count') THEN ALTER TABLE public.profiles ADD COLUMN reviews_count INT DEFAULT 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='last_active') THEN ALTER TABLE public.profiles ADD COLUMN last_active TIMESTAMPTZ DEFAULT NOW(); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='updated_at') THEN ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='rating') THEN ALTER TABLE public.profiles ADD COLUMN rating FLOAT DEFAULT 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='username') THEN ALTER TABLE public.profiles ADD COLUMN username TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='display_name') THEN ALTER TABLE public.profiles ADD COLUMN display_name TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='avatar_url') THEN ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_verified') THEN ALTER TABLE public.profiles ADD COLUMN is_verified BOOLEAN DEFAULT false; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='verification_status') THEN ALTER TABLE public.profiles ADD COLUMN verification_status TEXT DEFAULT 'unverified'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='online_status') THEN ALTER TABLE public.profiles ADD COLUMN online_status BOOLEAN DEFAULT false; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='created_at') THEN ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW(); END IF;
  -- conversations table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conversations' AND column_name='companion_id') THEN ALTER TABLE public.conversations ADD COLUMN companion_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conversations' AND column_name='customer_id') THEN ALTER TABLE public.conversations ADD COLUMN customer_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conversations' AND column_name='last_message') THEN ALTER TABLE public.conversations ADD COLUMN last_message TEXT DEFAULT ''; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conversations' AND column_name='unread_count') THEN ALTER TABLE public.conversations ADD COLUMN unread_count INT DEFAULT 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conversations' AND column_name='updated_at') THEN ALTER TABLE public.conversations ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(); END IF;
  -- messages table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='conversation_id') THEN ALTER TABLE public.messages ADD COLUMN conversation_id UUID REFERENCES public.conversations(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='sender_id') THEN ALTER TABLE public.messages ADD COLUMN sender_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='image_url') THEN ALTER TABLE public.messages ADD COLUMN image_url TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='is_read') THEN ALTER TABLE public.messages ADD COLUMN is_read BOOLEAN DEFAULT false; END IF;
  -- bookings table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='customer_id') THEN ALTER TABLE public.bookings ADD COLUMN customer_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='companion_id') THEN ALTER TABLE public.bookings ADD COLUMN companion_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='duration_hours') THEN ALTER TABLE public.bookings ADD COLUMN duration_hours INT DEFAULT 1; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='total_price') THEN ALTER TABLE public.bookings ADD COLUMN total_price INT DEFAULT 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='special_requests') THEN ALTER TABLE public.bookings ADD COLUMN special_requests TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='checked_in_at') THEN ALTER TABLE public.bookings ADD COLUMN checked_in_at TIMESTAMPTZ; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='checked_out_at') THEN ALTER TABLE public.bookings ADD COLUMN checked_out_at TIMESTAMPTZ; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='updated_at') THEN ALTER TABLE public.bookings ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(); END IF;
  -- notifications table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='user_id') THEN ALTER TABLE public.notifications ADD COLUMN user_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='reference_id') THEN ALTER TABLE public.notifications ADD COLUMN reference_id TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='is_read') THEN ALTER TABLE public.notifications ADD COLUMN is_read BOOLEAN DEFAULT false; END IF;
  -- emergency_contacts table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='emergency_contacts' AND column_name='user_id') THEN ALTER TABLE public.emergency_contacts ADD COLUMN user_id UUID REFERENCES public.profiles(id); END IF;
  -- safety_events table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='safety_events' AND column_name='user_id') THEN ALTER TABLE public.safety_events ADD COLUMN user_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='safety_events' AND column_name='booking_id') THEN ALTER TABLE public.safety_events ADD COLUMN booking_id UUID REFERENCES public.bookings(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='safety_events' AND column_name='timestamp') THEN ALTER TABLE public.safety_events ADD COLUMN "timestamp" TIMESTAMPTZ DEFAULT NOW(); END IF;
  -- ratings table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ratings' AND column_name='booking_id') THEN ALTER TABLE public.ratings ADD COLUMN booking_id UUID REFERENCES public.bookings(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ratings' AND column_name='from_user_id') THEN ALTER TABLE public.ratings ADD COLUMN from_user_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ratings' AND column_name='to_user_id') THEN ALTER TABLE public.ratings ADD COLUMN to_user_id UUID REFERENCES public.profiles(id); END IF;
  -- verification_requests table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='user_id') THEN ALTER TABLE public.verification_requests ADD COLUMN user_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='verification_requests' AND column_name='reviewed_by') THEN ALTER TABLE public.verification_requests ADD COLUMN reviewed_by UUID REFERENCES public.profiles(id); END IF;
  -- reports table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='reporter_id') THEN ALTER TABLE public.reports ADD COLUMN reporter_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='reported_user_id') THEN ALTER TABLE public.reports ADD COLUMN reported_user_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='resolved_by') THEN ALTER TABLE public.reports ADD COLUMN resolved_by UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='resolved_at') THEN ALTER TABLE public.reports ADD COLUMN resolved_at TIMESTAMPTZ; END IF;
  -- distress_alerts table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='distress_alerts' AND column_name='user_id') THEN ALTER TABLE public.distress_alerts ADD COLUMN user_id UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='distress_alerts' AND column_name='booking_id') THEN ALTER TABLE public.distress_alerts ADD COLUMN booking_id UUID REFERENCES public.bookings(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='distress_alerts' AND column_name='resolved') THEN ALTER TABLE public.distress_alerts ADD COLUMN resolved BOOLEAN DEFAULT false; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='distress_alerts' AND column_name='resolved_by') THEN ALTER TABLE public.distress_alerts ADD COLUMN resolved_by UUID REFERENCES public.profiles(id); END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='distress_alerts' AND column_name='resolved_at') THEN ALTER TABLE public.distress_alerts ADD COLUMN resolved_at TIMESTAMPTZ; END IF;
  -- referral_codes table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='referral_codes' AND column_name='user_id') THEN ALTER TABLE public.referral_codes ADD COLUMN user_id UUID REFERENCES public.profiles(id); END IF;
END $$;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_online ON public.profiles(online_status) WHERE online_status = true;
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(is_verified) WHERE is_verified = true;
CREATE INDEX IF NOT EXISTS idx_profiles_rating ON public.profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_participant ON public.conversations(companion_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_companion ON public.bookings(companion_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_safety_events_user ON public.safety_events(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_target ON public.ratings(to_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_distress_alerts_active ON public.distress_alerts(resolved) WHERE resolved = false;
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles USING GIST (location) WHERE location IS NOT NULL;

-- ============================================================
-- ROW LEVEL SECURITY (idempotent)
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

DO $$ BEGIN
  DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Participants can read conversations" ON public.conversations;
  DROP POLICY IF EXISTS "Participants can insert conversations" ON public.conversations;
  DROP POLICY IF EXISTS "Participants can read messages" ON public.messages;
  DROP POLICY IF EXISTS "Participants can insert messages" ON public.messages;
  DROP POLICY IF EXISTS "Participants can read bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Customers can insert bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Participants can update bookings" ON public.bookings;
  DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
  DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
  DROP POLICY IF EXISTS "Users can manage own emergency contacts" ON public.emergency_contacts;
  DROP POLICY IF EXISTS "Users can read own safety events" ON public.safety_events;
  DROP POLICY IF EXISTS "Users can insert own safety events" ON public.safety_events;
  DROP POLICY IF EXISTS "Ratings are readable by participants" ON public.ratings;
  DROP POLICY IF EXISTS "Users can insert own ratings" ON public.ratings;
  DROP POLICY IF EXISTS "Users can read own verification requests" ON public.verification_requests;
  DROP POLICY IF EXISTS "Users can insert own verification requests" ON public.verification_requests;
  DROP POLICY IF EXISTS "Users can read own reports" ON public.reports;
  DROP POLICY IF EXISTS "Users can insert reports" ON public.reports;
  DROP POLICY IF EXISTS "Users can read own distress alerts" ON public.distress_alerts;
  DROP POLICY IF EXISTS "Users can insert own distress alerts" ON public.distress_alerts;
  DROP POLICY IF EXISTS "Referral codes are publicly readable" ON public.referral_codes;
  DROP POLICY IF EXISTS "Users can insert own referral codes" ON public.referral_codes;
END $$;

CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Participants can read conversations"
  ON public.conversations FOR SELECT USING (auth.uid() = companion_id OR auth.uid() = customer_id);

CREATE POLICY "Participants can insert conversations"
  ON public.conversations FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Participants can read messages"
  ON public.messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.companion_id = auth.uid() OR c.customer_id = auth.uid()))
  );

CREATE POLICY "Participants can insert messages"
  ON public.messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.companion_id = auth.uid() OR c.customer_id = auth.uid()))
  );

CREATE POLICY "Participants can read bookings"
  ON public.bookings FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = companion_id);

CREATE POLICY "Customers can insert bookings"
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Participants can update bookings"
  ON public.bookings FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = companion_id);

CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own emergency contacts"
  ON public.emergency_contacts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read own safety events"
  ON public.safety_events FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Users can insert own safety events"
  ON public.safety_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Ratings are readable by participants"
  ON public.ratings FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can insert own ratings"
  ON public.ratings FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can read own verification requests"
  ON public.verification_requests FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Users can insert own verification requests"
  ON public.verification_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own reports"
  ON public.reports FOR SELECT USING (auth.uid() = reporter_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Users can insert reports"
  ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can read own distress alerts"
  ON public.distress_alerts FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Users can insert own distress alerts"
  ON public.distress_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Referral codes are publicly readable"
  ON public.referral_codes FOR SELECT USING (true);

CREATE POLICY "Users can insert own referral codes"
  ON public.referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS (idempotent)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_conversations_updated_at ON public.conversations;
CREATE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
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
