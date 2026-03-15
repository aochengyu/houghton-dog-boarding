-- ============================================================
-- Paws and Petals — Supabase Schema (idempotent)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── TABLES ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.clients (
  id                      UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                   TEXT        NOT NULL UNIQUE,
  name                    TEXT        NOT NULL DEFAULT '',
  phone                   TEXT,
  referral_code           TEXT        NOT NULL UNIQUE,
  referred_by             UUID        REFERENCES public.clients(id) ON DELETE SET NULL,
  referral_credits        INTEGER     NOT NULL DEFAULT 0,
  waiver_signed_at        TIMESTAMPTZ,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add new columns idempotently
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS waiver_signed_at        TIMESTAMPTZ;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS emergency_contact_name  TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;

CREATE TABLE IF NOT EXISTS public.pets (
  id                 UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id          UUID        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name               TEXT        NOT NULL,
  species            TEXT        NOT NULL CHECK (species IN ('dog', 'cat')),
  breed              TEXT,
  dob                DATE,
  weight_lbs         NUMERIC(5,1),
  spayed_neutered    BOOLEAN     NOT NULL DEFAULT false,
  microchip_id       TEXT,
  vet_name           TEXT,
  vet_phone          TEXT,
  medical_notes      TEXT,
  behavioral_notes   TEXT,
  photo_url          TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id                    UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id             UUID        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  pet_id                UUID        NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  service               TEXT        NOT NULL CHECK (service IN ('boarding', 'day-care', 'walking', 'drop-in')),
  start_date            DATE        NOT NULL,
  end_date              DATE,
  status                TEXT        NOT NULL DEFAULT 'inquiry'
                                    CHECK (status IN ('inquiry','confirmed','active','completed','cancelled')),
  price_cents           INTEGER     NOT NULL DEFAULT 0,
  credit_applied_cents  INTEGER     NOT NULL DEFAULT 0,
  notes                 TEXT,
  paid_at               TIMESTAMPTZ,
  payment_method        TEXT,
  checked_in_at         TIMESTAMPTZ,
  checked_out_at        TIMESTAMPTZ,
  dropoff_time          TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add new columns idempotently
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS checked_in_at     TIMESTAMPTZ;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS checked_out_at    TIMESTAMPTZ;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS dropoff_time      TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- ── STAY PHOTOS ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.stay_photos (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id  UUID        NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  photo_url   TEXT        NOT NULL,
  caption     TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── REVIEWS ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id  UUID        NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  client_id   UUID        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  rating      INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        TEXT,
  approved    BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (booking_id)
);

-- ── WAITLIST ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.waitlist (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  service     TEXT        NOT NULL CHECK (service IN ('boarding', 'day-care', 'walking', 'drop-in')),
  start_date  DATE        NOT NULL,
  end_date    DATE,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.referrals (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id  UUID        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  referred_id  UUID        NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  status       TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'credited')),
  credited_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (referrer_id, referred_id)
);

-- ── TRIGGER: auto-create client profile on signup ────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.clients (id, email, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    upper(substring(md5(NEW.id::text || now()::text), 1, 6))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── ROW LEVEL SECURITY ───────────────────────────────────────

ALTER TABLE public.clients     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stay_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist    ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'clients_own' AND tablename = 'clients') THEN
    CREATE POLICY "clients_own" ON public.clients FOR ALL USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'pets_own' AND tablename = 'pets') THEN
    CREATE POLICY "pets_own" ON public.pets FOR ALL USING (auth.uid() = client_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'bookings_read_own' AND tablename = 'bookings') THEN
    CREATE POLICY "bookings_read_own" ON public.bookings FOR SELECT USING (auth.uid() = client_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'bookings_insert_own' AND tablename = 'bookings') THEN
    CREATE POLICY "bookings_insert_own" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'referrals_participant' AND tablename = 'referrals') THEN
    CREATE POLICY "referrals_participant" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
  END IF;
  -- Stay photos: clients can read photos for their own bookings
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'stay_photos_read_own' AND tablename = 'stay_photos') THEN
    CREATE POLICY "stay_photos_read_own" ON public.stay_photos FOR SELECT
      USING (EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.client_id = auth.uid()));
  END IF;
  -- Reviews: clients can read + insert their own
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'reviews_own' AND tablename = 'reviews') THEN
    CREATE POLICY "reviews_own" ON public.reviews FOR ALL USING (auth.uid() = client_id);
  END IF;
  -- Approved reviews are public-readable (for marketing site)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'reviews_approved_public' AND tablename = 'reviews') THEN
    CREATE POLICY "reviews_approved_public" ON public.reviews FOR SELECT USING (approved = true);
  END IF;
  -- Waitlist: clients manage their own entries
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'waitlist_own' AND tablename = 'waitlist') THEN
    CREATE POLICY "waitlist_own" ON public.waitlist FOR ALL USING (auth.uid() = client_id);
  END IF;
END $$;

-- ── STORAGE: pet photos ──────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-photos', 'pet-photos', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'pet_photos_owner_upload' AND tablename = 'objects') THEN
    CREATE POLICY "pet_photos_owner_upload" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'pet_photos_public_read' AND tablename = 'objects') THEN
    CREATE POLICY "pet_photos_public_read" ON storage.objects
      FOR SELECT USING (bucket_id = 'pet-photos');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'pet_photos_owner_delete' AND tablename = 'objects') THEN
    CREATE POLICY "pet_photos_owner_delete" ON storage.objects
      FOR DELETE USING (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- ── HELPER: increment referral credits ───────────────────────

CREATE OR REPLACE FUNCTION public.increment_credits(row_id UUID, amount INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only allows positive increments to prevent credit drain attacks
  IF amount <= 0 THEN RETURN; END IF;
  UPDATE public.clients SET referral_credits = referral_credits + amount WHERE id = row_id;
END;
$$;

-- Restrict to service role only — anon/authenticated clients cannot call this directly
REVOKE EXECUTE ON FUNCTION public.increment_credits(UUID, INTEGER) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_credits(UUID, INTEGER) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_credits(UUID, INTEGER) FROM authenticated;
