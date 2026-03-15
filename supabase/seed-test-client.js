#!/usr/bin/env node
/**
 * Creates a test client account + pets in Supabase.
 * Run once: node supabase/seed-test-client.js
 *
 * Test credentials after running:
 *   Email:    testclient@example.com
 *   Password: TestPassword123!
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env
function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env.local");
    const lines = readFileSync(envPath, "utf8").split("\n");
    const env = {};
    for (const line of lines) {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) env[key.trim()] = rest.join("=").trim();
    }
    return env;
  } catch {
    return {};
  }
}

const env = { ...process.env, ...loadEnv() };

const SUPABASE_URL         = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_EMAIL    = "testclient@example.com";
const TEST_PASSWORD = "TestPassword123!";

async function run() {
  // ── 1. Create auth user ──────────────────────────────────
  console.log("Creating auth user…");
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { name: "Sarah Mitchell" },
  });

  if (authError && !authError.message.includes("already been registered")) {
    console.error("Auth user creation failed:", authError.message);
    process.exit(1);
  }

  // If user already exists, look them up
  let userId = authData?.user?.id;
  if (!userId) {
    const { data: users } = await admin.auth.admin.listUsers();
    const existing = users?.users?.find((u) => u.email === TEST_EMAIL);
    if (!existing) { console.error("Could not find or create user."); process.exit(1); }
    userId = existing.id;
    console.log("User already exists, reusing:", userId);
  } else {
    console.log("Created auth user:", userId);
  }

  // ── 2. Upsert clients row ────────────────────────────────
  console.log("Upserting clients row…");
  const { error: clientError } = await admin.from("clients").upsert({
    id:                userId,
    email:             TEST_EMAIL,
    name:              "Sarah Mitchell",
    phone:             "(555) 867-5309",
    referral_code:     "SARAH1",
    referral_credits:  1000, // $10 credit to demo the UI
  }, { onConflict: "id" });

  if (clientError) console.warn("clients upsert:", clientError.message);
  else console.log("clients row ready");

  // ── 3. Insert pets ───────────────────────────────────────
  const pets = [
    {
      client_id:        userId,
      name:             "Biscuit",
      species:          "dog",
      breed:            "Labrador Mix",
      dob:              "2021-06-15",
      weight_lbs:       54,
      spayed_neutered:  true,
      microchip_id:     "900032000487621",
      vet_name:         "Green Valley Animal Clinic",
      vet_phone:        "(555) 321-4567",
      medical_notes:    null,
      behavioral_notes: "Friendly and food-motivated. Pulls on leash but settles fast. Gets along with all dogs.",
      rabies_exp:       "2027-06-01",
      bordetella_exp:   "2026-04-15",
      photo_url:        null,
    },
    {
      client_id:        userId,
      name:             "Pepper",
      species:          "dog",
      breed:            "Border Collie",
      dob:              "2023-02-28",
      weight_lbs:       38,
      spayed_neutered:  false,
      microchip_id:     null,
      vet_name:         "Green Valley Animal Clinic",
      vet_phone:        "(555) 321-4567",
      medical_notes:    "Puppy — still completing vaccine series. Bordetella due for renewal.",
      behavioral_notes: "Very energetic, needs lots of mental stimulation. Does better with one other dog at a time.",
      rabies_exp:       "2026-08-10",
      bordetella_exp:   "2026-03-20", // expires soon relative to today (March 2026)
      photo_url:        null,
    },
  ];

  for (const pet of pets) {
    const { error } = await admin.from("pets").insert(pet);
    if (error) {
      if (error.message.includes("duplicate")) console.log(`  ${pet.name} already exists, skipping`);
      else console.warn(`  ${pet.name}:`, error.message);
    } else {
      console.log(`  Inserted pet: ${pet.name}`);
    }
  }

  console.log("\n✓ Done!");
  console.log("─────────────────────────────────");
  console.log("  Email:    ", TEST_EMAIL);
  console.log("  Password: ", TEST_PASSWORD);
  console.log("  Login at: http://localhost:3000/account/login");
  console.log("─────────────────────────────────");
}

run().catch((err) => { console.error(err); process.exit(1); });
