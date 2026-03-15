-- ─────────────────────────────────────────────────────────
-- Fake pet seed data
-- Run this in the Supabase SQL editor.
-- It inserts 3 demo pets for the admin account.
-- ─────────────────────────────────────────────────────────

-- Step 1: grab the admin user's ID from auth
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'aochengyu06@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Admin user not found — make sure you have signed up first.';
  END IF;

  -- ── Pet 1: Mochi — Golden Retriever ────────────────────
  INSERT INTO public.pets (
    id, client_id, name, species, breed, dob, weight_lbs,
    spayed_neutered, microchip_id, vet_name, vet_phone,
    medical_notes, behavioral_notes,
    rabies_exp, bordetella_exp, photo_url, created_at
  ) VALUES (
    gen_random_uuid(), v_user_id,
    'Mochi', 'dog', 'Golden Retriever',
    '2020-04-12', 68,
    true, '981020012345678',
    'Westside Animal Hospital', '(555) 234-7890',
    'Mild seasonal allergies — takes Apoquel daily. No issues with boarding.',
    'Very friendly and social. Loves fetch and belly rubs. Can be excitable when meeting new dogs but settles quickly.',
    '2026-11-15', '2026-06-01',
    NULL, NOW() - INTERVAL '8 months'
  )
  ON CONFLICT DO NOTHING;

  -- ── Pet 2: Nori — Shiba Inu (vaccine expired) ──────────
  INSERT INTO public.pets (
    id, client_id, name, species, breed, dob, weight_lbs,
    spayed_neutered, microchip_id, vet_name, vet_phone,
    medical_notes, behavioral_notes,
    rabies_exp, bordetella_exp, photo_url, created_at
  ) VALUES (
    gen_random_uuid(), v_user_id,
    'Nori', 'dog', 'Shiba Inu',
    '2022-09-03', 22,
    false, NULL,
    'Westside Animal Hospital', '(555) 234-7890',
    NULL,
    'Independent and a bit shy at first. Warms up after 20–30 minutes. Prefers smaller dogs. Not a fan of loud noises.',
    '2025-01-20', '2026-08-10',
    NULL, NOW() - INTERVAL '3 months'
  )
  ON CONFLICT DO NOTHING;

  -- ── Pet 3: Butter — Domestic Shorthair cat ─────────────
  INSERT INTO public.pets (
    id, client_id, name, species, breed, dob, weight_lbs,
    spayed_neutered, microchip_id, vet_name, vet_phone,
    medical_notes, behavioral_notes,
    rabies_exp, bordetella_exp, photo_url, created_at
  ) VALUES (
    gen_random_uuid(), v_user_id,
    'Butter', 'cat', 'Domestic Shorthair',
    '2019-07-22', 10,
    true, '900182000123456',
    'Lakeside Feline Clinic', '(555) 876-5432',
    'Hyperthyroidism — on methimazole twice daily. Must be kept separate from dogs.',
    'Calm and affectionate with trusted people. Needs a quiet room. Does not tolerate handling from strangers immediately.',
    '2026-03-30', NULL,
    NULL, NOW() - INTERVAL '14 months'
  )
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Seeded 3 pets for user %', v_user_id;
END $$;
