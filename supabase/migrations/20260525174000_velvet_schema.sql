-- ==========================================
-- VELVET - PREMIUM GEO-SOCIAL COMPANIONSHIP
-- PRODUCTION DATABASE SCHEMA & SECURITY POLICIES
-- REQUIRES EXTENSION: PostGIS
-- ==========================================

-- 1. EXTENSION REGISTRATION
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMERATION TYPES
CREATE TYPE user_role AS ENUM ('customer', 'companion', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'declined', 'cancelled', 'active', 'completed', 'distress');
CREATE TYPE subscription_tier AS ENUM ('free', 'gold', 'platinum');

-- 3. PROFILES AND USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150),
    role user_role DEFAULT 'customer'::user_role NOT NULL,
    avatar_url TEXT,
    images TEXT[] DEFAULT '{}',
    bio TEXT,
    interests TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    
    -- Verification & Trust Metrics
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    trust_score INT DEFAULT 100 CHECK (trust_score >= 0 AND trust_score <= 100) NOT NULL,
    response_rate INT DEFAULT 100 CHECK (response_rate >= 0 AND response_rate <= 100) NOT NULL,
    online_status BOOLEAN DEFAULT FALSE NOT NULL,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Geo Location System
    location GEOGRAPHY(Point, 4326),
    visibility_radius DECIMAL DEFAULT 25.0 CHECK (visibility_radius > 0) NOT NULL, -- in Kilometers
    
    -- Companion Pricing Tiers (Nullable for customers)
    pricing_hourly DECIMAL CHECK (pricing_hourly >= 0),
    pricing_daily DECIMAL CHECK (pricing_daily >= 0),
    pricing_currency VARCHAR(10) DEFAULT 'USD',
    availability_status VARCHAR(100) DEFAULT 'available', -- e.g. "available", "busy", "away"
    require_verified_clients BOOLEAN DEFAULT FALSE NOT NULL,
    safe_word VARCHAR(100),
    verification_status VARCHAR(50) DEFAULT 'unverified' NOT NULL, -- unverified, pending, verified
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CONVERSATIONS & REALTIME MESSAGES
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_one UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    user_two UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_conversation_participants UNIQUE (user_one, user_two),
    CONSTRAINT check_different_participants CHECK (user_one != user_two)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT,
    image_url TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BOOKING REQUESTS (COMPANIONSHIP & NIGHTLIFE HOSTING)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    companion_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status booking_status DEFAULT 'pending'::booking_status NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours INT CHECK (duration_hours > 0) NOT NULL,
    total_price DECIMAL NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    special_requests TEXT,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    checked_out_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_booking_distinct_parties CHECK (customer_id != companion_id)
);

-- 6. RATINGS AND REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE NOT NULL,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reviewed_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SUBSCRIPTIONS & MONETIZATION
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    tier subscription_tier DEFAULT 'free'::subscription_tier NOT NULL,
    credits_balance INT DEFAULT 0 CHECK (credits_balance >= 0) NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- 8. PROFILE BOOSTS & PROMOTIONS
CREATE TABLE IF NOT EXISTS public.boosts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    boosted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    credits_cost INT NOT NULL
);

-- 8b. EMERGENCY CONTACTS
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    relationship VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8c. SAFETY CHECK-INS
CREATE TABLE IF NOT EXISTS public.safety_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    checked_in_at TIMESTAMP WITH TIME ZONE NOT NULL,
    checked_out_at TIMESTAMP WITH TIME ZONE,
    safe_word_triggered BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_booking_checkin UNIQUE (booking_id, user_id)
);

-- 8d. SAFETY EVENTS (Check-in, check-out, safe word, panic)
CREATE TABLE IF NOT EXISTS public.safety_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL, -- checkin, checkout, safe_word, panic, distress
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8e. DISTRESS ALERTS
CREATE TABLE IF NOT EXISTS public.distress_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    alert_type VARCHAR(50) NOT NULL, -- panic, safe_word, missed_checkout
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'active' NOT NULL, -- active, resolved
    resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8f. LIVE LOCATION SHARING SESSIONS
CREATE TABLE IF NOT EXISTS public.location_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    shared_with UUID[] DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- 9. TRUST, SAFETY AND REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reported_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- pending, investigated, resolved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_report_distinct_parties CHECK (reporter_id != reported_id)
);

CREATE TABLE IF NOT EXISTS public.blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_block_pair UNIQUE (blocker_id, blocked_id),
    CONSTRAINT check_block_distinct_parties CHECK (blocker_id != blocked_id)
);

-- 10. REALTIME NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- message, booking_request, booking_approved, boost_expires, safety_alert, rating, booking_active, panic
    reference_id UUID,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. VERIFICATION REQUESTS
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    selfie_image_url TEXT NOT NULL,
    id_card_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- pending, approved, rejected
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on new safety tables
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distress_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_shares ENABLE ROW LEVEL SECURITY;

-- Emergency Contacts Policies
CREATE POLICY "Users can view their own emergency contacts"
    ON public.emergency_contacts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own emergency contacts"
    ON public.emergency_contacts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emergency contacts"
    ON public.emergency_contacts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emergency contacts"
    ON public.emergency_contacts FOR DELETE
    USING (auth.uid() = user_id);

-- Safety Check-ins Policies
CREATE POLICY "Users can view check-ins for their bookings"
    ON public.safety_checkins FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.bookings
        WHERE bookings.id = safety_checkins.booking_id
        AND (bookings.customer_id = auth.uid() OR bookings.companion_id = auth.uid())
    ));

CREATE POLICY "Users can create check-ins for their bookings"
    ON public.safety_checkins FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Safety Events Policies
CREATE POLICY "Users can view their own safety events"
    ON public.safety_events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all safety events"
    ON public.safety_events FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

CREATE POLICY "Users can create safety events"
    ON public.safety_events FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Distress Alerts Policies
CREATE POLICY "Users can view their own distress alerts"
    ON public.distress_alerts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all distress alerts"
    ON public.distress_alerts FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

CREATE POLICY "Admins can resolve distress alerts"
    ON public.distress_alerts FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

-- Location Shares Policies
CREATE POLICY "Users can view their own location shares"
    ON public.location_shares FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own location shares"
    ON public.location_shares FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own location shares"
    ON public.location_shares FOR UPDATE
    USING (auth.uid() = user_id);

-- ==========================================
-- INDEXES & PERFORMANCE OPTIMIZATIONS
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_online_status ON public.profiles(online_status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON public.profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_companion_id ON public.bookings(companion_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ==========================================
-- SPATIAL QUERY HELPER FUNCTIONS
-- ==========================================
CREATE OR REPLACE FUNCTION get_nearby_companions(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION DEFAULT 50000.0,
    online_only BOOLEAN DEFAULT FALSE,
    verified_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id UUID,
    username VARCHAR,
    display_name VARCHAR,
    avatar_url TEXT,
    role user_role,
    is_verified BOOLEAN,
    online_status BOOLEAN,
    pricing_hourly DECIMAL,
    distance_meters DOUBLE PRECISION
) 
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.username,
        p.display_name,
        p.avatar_url,
        p.role,
        p.is_verified,
        p.online_status,
        p.pricing_hourly,
        ST_Distance(p.location, ST_SetSRID(ST_Point(lng, lat), 4326)::geography) as distance_meters
    FROM 
        public.profiles p
    WHERE 
        p.role = 'companion'::user_role
        AND ST_DWithin(p.location, ST_SetSRID(ST_Point(lng, lat), 4326)::geography, radius_meters)
        AND (NOT online_only OR p.online_status = TRUE)
        AND (NOT verified_only OR p.is_verified = TRUE)
    ORDER BY 
        distance_meters ASC;
END;
$$;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users" 
    ON public.profiles FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Conversations Policies
CREATE POLICY "Users can view conversations they are part of"
    ON public.conversations FOR SELECT
    USING (auth.uid() = user_one OR auth.uid() = user_two);

CREATE POLICY "Users can create conversations they are part of"
    ON public.conversations FOR INSERT
    WITH CHECK (auth.uid() = user_one OR auth.uid() = user_two);

-- Messages Policies
CREATE POLICY "Users can view messages in their conversations"
    ON public.messages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.conversations 
        WHERE conversations.id = messages.conversation_id 
        AND (conversations.user_one = auth.uid() OR conversations.user_two = auth.uid())
    ));

CREATE POLICY "Users can insert messages into their conversations"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id AND EXISTS (
        SELECT 1 FROM public.conversations 
        WHERE conversations.id = messages.conversation_id 
        AND (conversations.user_one = auth.uid() OR conversations.user_two = auth.uid())
    ));

-- Bookings Policies
CREATE POLICY "Users can view bookings they are part of"
    ON public.bookings FOR SELECT
    USING (auth.uid() = customer_id OR auth.uid() = companion_id);

CREATE POLICY "Customers can request bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update bookings they are part of"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = customer_id OR auth.uid() = companion_id);

-- Notifications Policies
CREATE POLICY "Users can read their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can edit their own notifications status"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- ==========================================
-- TRIGGERS & PROFILES AUTO-PROVISIONING
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, role, avatar_url, online_status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substring(uuid_generate_v4()::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', 'Velvet Member'),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'customer'::user_role),
    new.raw_user_meta_data->>'avatar_url',
    FALSE
  );
  
  -- Create initial standard subscription
  INSERT INTO public.subscriptions (user_id, tier, expires_at)
  VALUES (new.id, 'free'::subscription_tier, timezone('utc'::text, now() + interval '30 days'));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
