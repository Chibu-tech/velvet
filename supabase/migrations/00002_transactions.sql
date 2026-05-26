-- ============================================================
-- TRANSACTIONS & PAYMENTS
-- Run this in the Supabase SQL Editor after 00001_initial_schema.sql
-- ============================================================

-- ============================================================
-- PAYMENT METHODS
-- ============================================================
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_account_id TEXT, -- For Stripe Connect (companions)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TRANSACTIONS (General Ledger)
-- ============================================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable if coming from external/platform
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,   -- Nullable if going to platform (fees)
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  amount INT NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'USD',
  type TEXT NOT NULL CHECK (type IN ('payment_received', 'payout_sent', 'refund', 'platform_fee', 'subscription', 'credit_purchase')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'disputed')),
  stripe_payment_id TEXT, -- Reference to the external payment gateway ID
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_transactions_from_user ON public.transactions(from_user_id);
CREATE INDEX idx_transactions_to_user ON public.transactions(to_user_id);
CREATE INDEX idx_transactions_booking ON public.transactions(booking_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_stripe_id ON public.transactions(stripe_payment_id);
CREATE INDEX idx_payment_methods_user ON public.payment_methods(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Payment Methods: users can read and update their own
CREATE POLICY "Users can view own payment methods"
  ON public.payment_methods FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON public.payment_methods FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods"
  ON public.payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions: highly restricted
-- Users can only READ transactions they are a party to
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- ONLY Admin/Service Role can insert or update transactions. 
-- Regular users CANNOT insert/update transactions directly from the client.
-- (No INSERT/UPDATE policies for regular users)

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE TRIGGER set_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
