#!/usr/bin/env node
/**
 * Seeds fake reviews into Supabase for completed bookings.
 * Run: node supabase/seed-reviews.js
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const lines = readFileSync(resolve(__dirname, "../.env.local"), "utf8").split("\n");
    const env = {};
    for (const line of lines) {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) env[key.trim()] = rest.join("=").trim();
    }
    return env;
  } catch { return {}; }
}

const env = { ...process.env, ...loadEnv() };
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const FAKE_REVIEWS = [
  {
    rating: 5,
    body: "Absolutely incredible experience. Biscuit came home happy, clean, and completely exhausted from all the fun. We got daily photo updates which made us feel so much at ease. Will 100% be back!",
    approved: true,
    daysAgo: 45,
  },
  {
    rating: 5,
    body: "Mochi is usually anxious around strangers but settled in beautifully. The personal attention and home environment made all the difference. So grateful to have found Paws and Petals.",
    approved: true,
    daysAgo: 30,
  },
  {
    rating: 4,
    body: "Great care overall — Cooper was well-loved and came back healthy. Pickup and drop-off were smooth. Only reason for 4 stars is I wish there were a few more check-in photos, but honestly a minor thing.",
    approved: true,
    daysAgo: 18,
  },
  {
    rating: 5,
    body: "This is the only place I trust with Luna. She's notoriously picky and shy, but she actually explored the whole house by day two according to the updates I got. Phenomenal care.",
    approved: true,
    daysAgo: 60,
  },
  {
    rating: 5,
    body: "Daisy can be a handful (she's enormous!) but she was treated like royalty. The updates and photos were precious. Booking again for our summer vacation without a second thought.",
    approved: false, // pending approval — good for admin to see
    daysAgo: 3,
  },
  {
    rating: 5,
    body: "The walking service was perfectly timed and Biscuit came home tired in the best way. Very professional, punctual, and clearly a dog lover. Highly recommend to everyone I know.",
    approved: true,
    daysAgo: 90,
  },
];

async function run() {
  console.log("🌱 Fetching completed bookings...\n");

  const { data: bookings, error: bErr } = await admin
    .from("bookings")
    .select("id, client_id, service, start_date")
    .eq("status", "completed")
    .order("start_date", { ascending: false })
    .limit(10);

  if (bErr) { console.error("Error fetching bookings:", bErr.message); process.exit(1); }
  if (!bookings?.length) { console.log("No completed bookings found. Run scripts/seed.mjs first."); process.exit(0); }

  console.log(`Found ${bookings.length} completed bookings.\n`);

  // Check which ones already have reviews
  const { data: existing } = await admin
    .from("reviews")
    .select("booking_id");
  const existingIds = new Set((existing ?? []).map((r) => r.booking_id));

  let inserted = 0;
  for (let i = 0; i < Math.min(bookings.length, FAKE_REVIEWS.length); i++) {
    const booking = bookings[i];
    if (existingIds.has(booking.id)) {
      console.log(`  ↩  Booking ${booking.service} (${booking.start_date}) already has a review`);
      continue;
    }

    const template = FAKE_REVIEWS[i];
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - template.daysAgo);

    const { error } = await admin.from("reviews").insert({
      booking_id: booking.id,
      client_id:  booking.client_id,
      rating:     template.rating,
      body:       template.body,
      approved:   template.approved,
      created_at: createdAt.toISOString(),
    });

    if (error) {
      console.error(`  ✗  Review for ${booking.service}:`, error.message);
    } else {
      console.log(`  ✓  ${template.rating}★ review for ${booking.service} (${booking.start_date}) — ${template.approved ? "approved" : "pending"}`);
      inserted++;
    }
  }

  console.log(`\n✅ Inserted ${inserted} reviews.\n`);
}

run().catch(console.error);
