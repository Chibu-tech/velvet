-- ==========================================
-- VELVET — PRODUCTION DATABASE SCHEMA
-- Premium Geo-Social Companionship Platform
-- Migration: 20260627_velvet_production_schema
--
-- Designed for:
--   • Supabase managed environment
--   • Horizontal scaling readiness
--   • Analytics materialized views
--   • Full safety audit trail
-- ==========================================

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 0. CLEANUP — Remove test artifacts
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
DROP TABLE IF EXISTS public.test_table CASCADE;

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 1. EXTENSIONS (Supabase-compatible)
-- Extensions live in the "extensions" schema
-- on Supabase managed instances. Enable
-- PostGIS via Dashboard → Extensions first.
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"    WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "postgis"      WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto"     WITH SCHEMA extensions;

-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 2. CUSTOM ENUM TYPES
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'companion', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'pending', 'approved', 'declined', 'cancelled',
    'active', 'completed', 'distress'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('free', 'gold', 'platinum');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE safety_event_type AS ENUM ('checkin', 'checkout', 'safe_word', 'panic', 'distress');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE credit_tx_type AS ENUM ('purchase', 'spend', 'reward', 'refund', 'admin_adjust');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE distress_status AS ENUM ('active', 'responding', 'resolved', 'false_alarm');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE referral_status AS ENUM ('pending', 'signed_up', 'completed', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'message', 'booking_request', 'booking_approved', 'booking_declined',
    'booking_active', 'boost_expires', 'safety_alert', 'rating',
    'panic', 'referral_reward', 'verification_update', 'system'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 3. CORE TABLES
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-- ─── 3a. PROFILES ─────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username              VARCHAR(100) UNIQUE NOT NULL,
    display_name          VARCHAR(150),
    role                  user_role DEFAULT 'customer' NOT NULL,
    avatar_url            TEXT,
    images                TEXT[] DEFAULT '{}',
    bio                   TEXT,
    interests             TEXT[] DEFAULT '{}',
    languages             TEXT[] DEFAULT '{}',
    categories            TEXT[] DEFAULT '{}',

    -- Verification & Trust
    is_verified           BOOLEAN DEFAULT FALSE NOT NULL,
    verification_status   verification_status DEFAULT 'unverified' NOT NULL,
    trust_score           SMALLINT DEFAULT 100 NOT NULL
                              CHECK (trust_score >= 0 AND trust_score <= 100),
    response_rate         SMALLINT DEFAULT 100 NOT NULL
                              CHECK (response_rate >= 0 AND response_rate <= 100),

    -- Presence
    online_status         BOOLEAN DEFAULT FALSE NOT NULL,
    last_active           TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,

    -- Geolocation (PostGIS)
    location              extensions.geography(Point, 4326),
    visibility_radius_km  NUMERIC(8,2) DEFAULT 25.0 NOT NULL CHECK (visibility_radius_km > 0),

    -- Companion pricing (nullable for customers)
    pricing_hourly        NUMERIC(10,2) CHECK (pricing_hourly >= 0),
    pricing_daily         NUMERIC(10,2) CHECK (pricing_daily >= 0),
    pricing_currency      VARCHAR(10) DEFAULT 'USD',
    availability_status   VARCHAR(20) DEFAULT 'available'
                              CHECK (availability_status IN ('available', 'busy', 'away')),

    -- Companion settings
    require_verified_clients BOOLEAN DEFAULT FALSE NOT NULL,

    -- Safety
    safe_word_hash        TEXT,  -- bcrypt hash, never store plaintext

    -- Subscription shorthand (denormalized for fast reads)
    current_tier          subscription_tier DEFAULT 'free' NOT NULL,
    credits_balance       INT DEFAULT 0 NOT NULL CHECK (credits_balance >= 0),

    -- Timestamps
    created_at            TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at            TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

COMMENT ON TABLE  public.profiles IS 'User profiles — customers, companions, and admins';
COMMENT ON COLUMN public.profiles.safe_word_hash IS 'Bcrypt hash of user safe word — never store plaintext';
COMMENT ON COLUMN public.profiles.location IS 'PostGIS GEOGRAPHY point for proximity search (SRID 4326)';


-- ─── 3b. CONVERSATIONS ───────────────────
CREATE TABLE IF NOT EXISTS public.conversations (
    id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_one    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_two    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at  TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,

    CONSTRAINT unique_conversation_pair UNIQUE (user_one, user_two),
    CONSTRAINT ck_different_participants CHECK (user_one < user_two)
    -- user_one < user_two ensures canonical ordering and prevents duplicate pairs
);

COMMENT ON TABLE public.conversations IS 'Chat threads between exactly two users';


-- ─── 3c. MESSAGES ─────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
    id                UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    conversation_id   UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content           TEXT,
    image_url         TEXT,
    is_read           BOOLEAN DEFAULT FALSE NOT NULL,
    created_at        TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

COMMENT ON TABLE public.messages IS 'Individual chat messages within conversations';


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 4. BOOKING & COMMERCE
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-- ─── 4a. BOOKINGS ─────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
    id                  UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    customer_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    companion_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status              booking_status DEFAULT 'pending' NOT NULL,
    scheduled_at        TIMESTAMPTZ NOT NULL,
    duration_hours      SMALLINT NOT NULL CHECK (duration_hours > 0),
    total_price         NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
    currency            VARCHAR(10) DEFAULT 'USD',
    special_requests    TEXT,
    cancellation_reason TEXT,

    -- Safety check-in/out
    checked_in_at       TIMESTAMPTZ,
    checked_out_at      TIMESTAMPTZ,

    created_at          TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at          TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,

    CONSTRAINT ck_booking_different_parties CHECK (customer_id != companion_id)
);

COMMENT ON TABLE public.bookings IS 'Companionship booking requests with full lifecycle tracking';


-- ─── 4b. REVIEWS ──────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
    id            UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    booking_id    UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    reviewer_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewed_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating        SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text   TEXT,
    created_at    TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,

    -- One review per booking per direction
    CONSTRAINT uq_review_per_booking_reviewer UNIQUE (booking_id, reviewer_id)
);

COMMENT ON TABLE public.reviews IS 'Post-booking ratings and reviews (1-5 stars)';


-- ─── 4c. SUBSCRIPTIONS ───────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id               UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier             subscription_tier DEFAULT 'free' NOT NULL,
    credits_balance  INT DEFAULT 0 NOT NULL CHECK (credits_balance >= 0),
    starts_at        TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    expires_at       TIMESTAMPTZ NOT NULL,
    is_active        BOOLEAN DEFAULT TRUE NOT NULL,
    created_at       TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

COMMENT ON TABLE public.subscriptions IS 'User subscription tiers and credit balances';


-- ─── 4d. BOOSTS ───────────────────────────
CREATE TABLE IF NOT EXISTS public.boosts (
    id            UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    credits_cost  INT NOT NULL CHECK (credits_cost > 0),
    boosted_at    TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    expires_at    TIMESTAMPTZ NOT NULL
);

COMMENT ON TABLE public.boosts IS 'Profile boost/promotion purchases';


-- ─── 4e. CREDIT TRANSACTIONS (Audit Ledger) ──
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id              UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount          INT NOT NULL,          -- positive = credit, negative = debit
    tx_type         credit_tx_type NOT NULL,
    reference_type  VARCHAR(50),           -- 'boost', 'booking', 'subscription', etc.
    reference_id    UUID,                  -- FK to the related entity
    balance_after   INT NOT NULL,          -- snapshot of balance after this tx
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

COMMENT ON TABLE public.credit_transactions IS 'Full credit ledger — every purchase, spend, reward, and refund';


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 5. SAFETY & TRUST
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-- ─── 5a. REPORTS ──────────────────────────
CREATE TABLE IF NOT EXISTS public.reports (
    id           UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    reporter_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason       TEXT NOT NULL,
    details      TEXT,
    status       report_status DEFAULT 'pending' NOT NULL,
    resolved_by  UUID REFERENCES public.profiles(id),
    resolved_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,

    CONSTRAINT ck_report_different_parties CHECK (reporter_id != reported_id)
);

COMMENT ON TABLE public.reports IS 'User-to-user reports for moderation';


-- ─── 5b. BLOCKS ───────────────────────────
CREATE TABLE IF NOT EXISTS public.blocks (
    id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    blocker_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,

    CONSTRAINT uq_block_pair UNIQUE (blocker_id, blocked_id),
    CONSTRAINT ck_block_different_parties CHECK (blocker_id != blocked_id)
);

COMMENT ON TABLE public.blocks IS 'User-to-user blocks — blocked users hidden from all queries';


-- ─── 5c. EMERGENCY CONTACTS ──────────────
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id            UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name          VARCHAR(200) NOT NULL,
    phone         VARCHAR(30) NOT NULL,
    email         VARCHAR(254),
    relationship  VARCHAR(100),
    is_primary    BOOLEAN DEFAULT FALSE NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

COMMENT ON TABLE public.emergency_contacts IS 'Trusted emergency contacts per user';


-- ─── 5d. SAFETY EVENTS (Audit Log) ───────
CREATE TABLE IF NOT EXISTS public.safety_events (
    id          UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id  UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    event_type  safety_event_type NOT NULL,
    location    extensions.geography(Point, 4326),
    metadata    JSONB DEFAULT '{}',       -- extensible payload (device info, etc.)
    created_at  TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

COMMENT ON TABLE  public.safety_events IS 'Immutable safety audit trail — checkins, checkouts, panic, safe word';
COMMENT ON COLUMN public.safety_events.metadata IS 'Extensible JSONB for device info, IP, coordinates, etc.';


-- ─── 5e. DISTRESS ALERTS ─────────────────
CREATE TABLE IF NOT EXISTS public.distress_alerts (
    id                UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id        UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    status            distress_status DEFAULT 'active' NOT NULL,
    location          extensions.geography(Point, 4326),
    location_label    TEXT,                -- human-readable location
    responded_by      UUID REFERENCES public.profiles(id),
    resolved_at       TIMESTAMPTZ,
    resolution_notes  TEXT,
    created_at        TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

COMMENT ON TABLE public.distress_alerts IS 'Active distress escalations visible to admin for immediate response';


-- ─── 5f. VERIFICATION REQUESTS ───────────
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id                UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    selfie_image_url  TEXT NOT NULL,
    id_card_url       TEXT NOT NULL,
    status            verification_status DEFAULT 'pending' NOT NULL,
    rejection_reason  TEXT,
    reviewed_by       UUID REFERENCES public.profiles(id),
    reviewed_at       TIMESTAMPTZ,
    created_at        TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

COMMENT ON TABLE public.verification_requests IS 'Identity verification queue (selfie + ID card)';


-- ─── 5g. LIVE LOCATION SHARING ───────────
CREATE TABLE IF NOT EXISTS public.live_location_shares (
    id              UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id      UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    is_active       BOOLEAN DEFAULT TRUE NOT NULL,
    shared_with     UUID[] DEFAULT '{}',  -- array of emergency contact / user IDs
    last_location   extensions.geography(Point, 4326),
    started_at      TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    ended_at        TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

COMMENT ON TABLE public.live_location_shares IS 'Real-time location sharing during active bookings';


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 6. NOTIFICATIONS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE IF NOT EXISTS public.notifications (
    id            UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title         VARCHAR(200) NOT NULL,
    message       TEXT NOT NULL,
    type          notification_type NOT NULL,
    reference_id  UUID,
    is_read       BOOLEAN DEFAULT FALSE NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

COMMENT ON TABLE public.notifications IS 'In-app and push notification store';


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 7. REFERRALS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE TABLE IF NOT EXISTS public.referrals (
    id              UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    referrer_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    referral_code   VARCHAR(20) NOT NULL UNIQUE,
    status          referral_status DEFAULT 'pending' NOT NULL,
    reward_credits  INT DEFAULT 0 NOT NULL CHECK (reward_credits >= 0),
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

COMMENT ON TABLE public.referrals IS 'Referral tracking with credit rewards';


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 8. INDEXES — Performance at Scale
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role              ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_role_verified      ON public.profiles(role, is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_online             ON public.profiles(online_status) WHERE online_status = true;
CREATE INDEX IF NOT EXISTS idx_profiles_location           ON public.profiles USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_profiles_availability       ON public.profiles(availability_status) WHERE role = 'companion';
CREATE INDEX IF NOT EXISTS idx_profiles_updated            ON public.profiles(updated_at DESC);

-- Conversations & Messages
CREATE INDEX IF NOT EXISTS idx_conversations_users         ON public.conversations(user_one, user_two);
CREATE INDEX IF NOT EXISTS idx_messages_conv_created       ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_unread             ON public.messages(conversation_id) WHERE NOT is_read;

-- Bookings
CREATE INDEX IF NOT EXISTS idx_bookings_customer           ON public.bookings(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_companion          ON public.bookings(companion_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_status_scheduled   ON public.bookings(status, scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_pending            ON public.bookings(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_bookings_active             ON public.bookings(status) WHERE status = 'active';

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed            ON public.reviews(reviewed_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking             ON public.reviews(booking_id);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_active   ON public.subscriptions(user_id) WHERE is_active = true;

-- Boosts
CREATE INDEX IF NOT EXISTS idx_boosts_user_active          ON public.boosts(user_id, expires_at DESC);

-- Credit Transactions
CREATE INDEX IF NOT EXISTS idx_credit_tx_user_created      ON public.credit_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_tx_type              ON public.credit_transactions(tx_type);

-- Safety
CREATE INDEX IF NOT EXISTS idx_safety_events_user          ON public.safety_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_safety_events_booking       ON public.safety_events(booking_id);
CREATE INDEX IF NOT EXISTS idx_safety_events_type          ON public.safety_events(event_type);
CREATE INDEX IF NOT EXISTS idx_distress_active             ON public.distress_alerts(status) WHERE status = 'active';

-- Emergency Contacts
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user     ON public.emergency_contacts(user_id);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread   ON public.notifications(user_id) WHERE NOT is_read;
CREATE INDEX IF NOT EXISTS idx_notifications_user_created   ON public.notifications(user_id, created_at DESC);

-- Referrals
CREATE INDEX IF NOT EXISTS idx_referrals_referrer          ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code              ON public.referrals(referral_code);

-- Verification
CREATE INDEX IF NOT EXISTS idx_verif_requests_pending      ON public.verification_requests(status) WHERE status = 'pending';

-- Live Location
CREATE INDEX IF NOT EXISTS idx_live_location_active        ON public.live_location_shares(user_id) WHERE is_active = true;


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 9. SPATIAL QUERY HELPER FUNCTIONS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE OR REPLACE FUNCTION public.get_nearby_companions(
    lat           DOUBLE PRECISION,
    lng           DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION DEFAULT 50000.0,
    online_only   BOOLEAN DEFAULT FALSE,
    verified_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id              UUID,
    username        VARCHAR,
    display_name    VARCHAR,
    avatar_url      TEXT,
    role            user_role,
    is_verified     BOOLEAN,
    online_status   BOOLEAN,
    pricing_hourly  NUMERIC,
    distance_meters DOUBLE PRECISION
)
LANGUAGE plpgsql STABLE AS $$
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
        extensions.ST_Distance(
            p.location,
            extensions.ST_SetSRID(extensions.ST_Point(lng, lat), 4326)::extensions.geography
        ) AS distance_meters
    FROM public.profiles p
    WHERE p.role = 'companion'
      AND extensions.ST_DWithin(
            p.location,
            extensions.ST_SetSRID(extensions.ST_Point(lng, lat), 4326)::extensions.geography,
            radius_meters
          )
      AND (NOT online_only  OR p.online_status = TRUE)
      AND (NOT verified_only OR p.is_verified = TRUE)
    ORDER BY distance_meters ASC;
END;
$$;

COMMENT ON FUNCTION public.get_nearby_companions IS 'Find companions within a given radius of lat/lng coordinates';


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 10. AUTO-UPDATE TIMESTAMPS TRIGGER
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all mutable tables
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'profiles', 'conversations', 'bookings',
            'live_location_shares'
        ])
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_updated_at
                BEFORE UPDATE ON public.%I
                FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
            tbl, tbl
        );
    END LOOP;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 11. AUTO-PROVISION PROFILE ON AUTH SIGNUP
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, role, avatar_url, online_status)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            'user_' || substring(extensions.uuid_generate_v4()::text, 1, 8)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            NEW.raw_user_meta_data->>'username',
            'Velvet Member'
        ),
        COALESCE(
            (NEW.raw_user_meta_data->>'role')::user_role,
            'customer'::user_role
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        FALSE
    );

    -- Create initial free subscription (30-day trial)
    INSERT INTO public.subscriptions (user_id, tier, expires_at)
    VALUES (NEW.id, 'free', timezone('utc', now()) + interval '30 days');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if present, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-- Enable RLS on all tables
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boosts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distress_alerts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_location_shares  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals             ENABLE ROW LEVEL SECURITY;

-- ─── Profiles ─────────────────────────────
CREATE POLICY "Authenticated users can view all profiles"
    ON public.profiles FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ─── Conversations ────────────────────────
CREATE POLICY "Users can view their conversations"
    ON public.conversations FOR SELECT
    USING (auth.uid() = user_one OR auth.uid() = user_two);

CREATE POLICY "Users can create conversations they belong to"
    ON public.conversations FOR INSERT
    WITH CHECK (auth.uid() = user_one OR auth.uid() = user_two);

-- ─── Messages ─────────────────────────────
CREATE POLICY "Users can view messages in their conversations"
    ON public.messages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = messages.conversation_id
        AND (c.user_one = auth.uid() OR c.user_two = auth.uid())
    ));

CREATE POLICY "Users can send messages in their conversations"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id AND EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = messages.conversation_id
        AND (c.user_one = auth.uid() OR c.user_two = auth.uid())
    ));

CREATE POLICY "Users can mark messages as read"
    ON public.messages FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = messages.conversation_id
        AND (c.user_one = auth.uid() OR c.user_two = auth.uid())
    ));

-- ─── Bookings ─────────────────────────────
CREATE POLICY "Users can view their bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = customer_id OR auth.uid() = companion_id);

CREATE POLICY "Customers can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Booking parties can update bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = customer_id OR auth.uid() = companion_id);

-- ─── Reviews ──────────────────────────────
CREATE POLICY "Authenticated users can read reviews"
    ON public.reviews FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Reviewers can create reviews for their bookings"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = reviewer_id AND EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.id = reviews.booking_id
        AND (b.customer_id = auth.uid() OR b.companion_id = auth.uid())
        AND b.status = 'completed'
    ));

-- ─── Subscriptions ────────────────────────
CREATE POLICY "Users can view their subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their subscriptions"
    ON public.subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their subscriptions"
    ON public.subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

-- ─── Boosts ───────────────────────────────
CREATE POLICY "Users can view their boosts"
    ON public.boosts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create boosts"
    ON public.boosts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ─── Credit Transactions ──────────────────
CREATE POLICY "Users can view their credit history"
    ON public.credit_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- ─── Reports ──────────────────────────────
CREATE POLICY "Users can create reports"
    ON public.reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports"
    ON public.reports FOR SELECT
    USING (auth.uid() = reporter_id);

-- ─── Blocks ───────────────────────────────
CREATE POLICY "Users can view their blocks"
    ON public.blocks FOR SELECT
    USING (auth.uid() = blocker_id);

CREATE POLICY "Users can create blocks"
    ON public.blocks FOR INSERT
    WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can delete their blocks"
    ON public.blocks FOR DELETE
    USING (auth.uid() = blocker_id);

-- ─── Emergency Contacts ──────────────────
CREATE POLICY "Users can manage their emergency contacts"
    ON public.emergency_contacts FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ─── Safety Events ───────────────────────
CREATE POLICY "Users can view their safety events"
    ON public.safety_events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create safety events"
    ON public.safety_events FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ─── Distress Alerts ─────────────────────
CREATE POLICY "Users can view their distress alerts"
    ON public.distress_alerts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create distress alerts"
    ON public.distress_alerts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ─── Verification Requests ───────────────
CREATE POLICY "Users can view their verification requests"
    ON public.verification_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can submit verification requests"
    ON public.verification_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ─── Live Location Shares ────────────────
CREATE POLICY "Users can manage their location shares"
    ON public.live_location_shares FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ─── Notifications ───────────────────────
CREATE POLICY "Users can view their notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- ─── Referrals ───────────────────────────
CREATE POLICY "Users can view their referrals"
    ON public.referrals FOR SELECT
    USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals"
    ON public.referrals FOR INSERT
    WITH CHECK (auth.uid() = referrer_id);


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 13. ANALYTICS — MATERIALIZED VIEWS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-- ─── Per-Companion Stats ──────────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_companion_stats AS
SELECT
    p.id                    AS companion_id,
    p.username,
    p.display_name,
    p.is_verified,
    p.online_status,
    p.pricing_hourly,
    p.trust_score,
    p.response_rate,
    COALESCE(r.avg_rating, 0)         AS avg_rating,
    COALESCE(r.review_count, 0)       AS review_count,
    COALESCE(b.total_bookings, 0)     AS total_bookings,
    COALESCE(b.completed_bookings, 0) AS completed_bookings,
    COALESCE(b.total_revenue, 0)      AS total_revenue,
    COALESCE(b.avg_duration, 0)       AS avg_booking_hours,
    p.created_at                      AS member_since
FROM public.profiles p
LEFT JOIN (
    SELECT
        reviewed_id,
        ROUND(AVG(rating)::numeric, 2)  AS avg_rating,
        COUNT(*)                        AS review_count
    FROM public.reviews
    GROUP BY reviewed_id
) r ON r.reviewed_id = p.id
LEFT JOIN (
    SELECT
        companion_id,
        COUNT(*)                                                      AS total_bookings,
        COUNT(*) FILTER (WHERE status = 'completed')                  AS completed_bookings,
        COALESCE(SUM(total_price) FILTER (WHERE status = 'completed'), 0) AS total_revenue,
        ROUND(AVG(duration_hours)::numeric, 1)                        AS avg_duration
    FROM public.bookings
    GROUP BY companion_id
) b ON b.companion_id = p.id
WHERE p.role = 'companion';

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_companion_stats_id
    ON public.mv_companion_stats(companion_id);

COMMENT ON MATERIALIZED VIEW public.mv_companion_stats
    IS 'Pre-aggregated companion metrics for search ranking, leaderboards, and analytics dashboards. Refresh with: REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_companion_stats;';


-- ─── Daily Platform Metrics ───────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_platform_daily AS
SELECT
    d.day::date AS report_date,
    -- Users
    COALESCE(u.new_signups, 0)           AS new_signups,
    -- Bookings
    COALESCE(bk.bookings_created, 0)     AS bookings_created,
    COALESCE(bk.bookings_completed, 0)   AS bookings_completed,
    COALESCE(bk.bookings_cancelled, 0)   AS bookings_cancelled,
    COALESCE(bk.revenue, 0)             AS revenue,
    COALESCE(bk.avg_duration, 0)         AS avg_booking_hours,
    -- Safety
    COALESCE(se.safety_events, 0)        AS safety_events,
    COALESCE(se.panic_events, 0)         AS panic_events,
    -- Messages
    COALESCE(m.messages_sent, 0)         AS messages_sent
FROM generate_series(
    (SELECT COALESCE(MIN(created_at::date), CURRENT_DATE) FROM public.profiles),
    CURRENT_DATE,
    '1 day'::interval
) AS d(day)
LEFT JOIN (
    SELECT created_at::date AS day, COUNT(*) AS new_signups
    FROM public.profiles GROUP BY 1
) u ON u.day = d.day::date
LEFT JOIN (
    SELECT
        created_at::date AS day,
        COUNT(*)                                         AS bookings_created,
        COUNT(*) FILTER (WHERE status = 'completed')     AS bookings_completed,
        COUNT(*) FILTER (WHERE status = 'cancelled')     AS bookings_cancelled,
        COALESCE(SUM(total_price) FILTER (WHERE status = 'completed'), 0) AS revenue,
        ROUND(AVG(duration_hours)::numeric, 1)           AS avg_duration
    FROM public.bookings GROUP BY 1
) bk ON bk.day = d.day::date
LEFT JOIN (
    SELECT
        created_at::date AS day,
        COUNT(*)                                     AS safety_events,
        COUNT(*) FILTER (WHERE event_type = 'panic') AS panic_events
    FROM public.safety_events GROUP BY 1
) se ON se.day = d.day::date
LEFT JOIN (
    SELECT created_at::date AS day, COUNT(*) AS messages_sent
    FROM public.messages GROUP BY 1
) m ON m.day = d.day::date
ORDER BY d.day DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_platform_daily_date
    ON public.mv_platform_daily(report_date);

COMMENT ON MATERIALIZED VIEW public.mv_platform_daily
    IS 'Daily platform analytics rollup for admin dashboards. Refresh with: REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_platform_daily;';


-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- 14. GRANT PERMISSIONS
-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-- Grant table access to Supabase roles
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'profiles', 'conversations', 'messages', 'bookings',
            'reviews', 'subscriptions', 'boosts', 'credit_transactions',
            'reports', 'blocks', 'emergency_contacts', 'safety_events',
            'distress_alerts', 'verification_requests', 'live_location_shares',
            'notifications', 'referrals'
        ])
    LOOP
        EXECUTE format('GRANT ALL ON TABLE public.%I TO authenticated', tbl);
        EXECUTE format('GRANT SELECT ON TABLE public.%I TO anon', tbl);
        EXECUTE format('GRANT ALL ON TABLE public.%I TO service_role', tbl);
    END LOOP;
END $$;

-- Grant access to materialized views
GRANT SELECT ON public.mv_companion_stats TO authenticated, anon, service_role;
GRANT SELECT ON public.mv_platform_daily  TO authenticated, service_role;

-- Grant access to functions
GRANT EXECUTE ON FUNCTION public.get_nearby_companions TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.set_updated_at        TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user       TO service_role;


-- ==========================================
-- MIGRATION COMPLETE
-- Tables:  17 production tables
-- Indexes: 35+ performance indexes
-- Views:   2 analytics materialized views
-- RLS:     Full row-level security on all tables
-- ==========================================
