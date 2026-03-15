// Seed script — creates fake clients, pets, and bookings for testing.
// Run with: node scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kigoalaecaigqrudkzlp.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZ29hbGFlY2FpZ3FydWRremxwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQxNzM0NSwiZXhwIjoyMDg4OTkzMzQ1fQ.prmnHKZBlqfYCQO_fjrLAVw1p1HByrI0wXw076vfsWs";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const FAKE_CLIENTS = [
  { email: "sarah.johnson@example.com",  name: "Sarah Johnson",  phone: "4255550101" },
  { email: "mike.chen@example.com",       name: "Mike Chen",      phone: "4255550102" },
  { email: "emily.rodriguez@example.com", name: "Emily Rodriguez", phone: "4255550103" },
  { email: "david.kim@example.com",       name: "David Kim",      phone: "4255550104" },
];

const FAKE_PETS = [
  { name: "Biscuit",  species: "dog", breed: "Golden Retriever", weight_lbs: 65, dob: "2019-04-12", spayed_neutered: true,  vet_name: "Kirkland Animal Clinic",  vet_phone: "4255559001", medical_notes: null,                        behavioral_notes: "Loves fetch, great with other dogs." },
  { name: "Mochi",    species: "dog", breed: "Shiba Inu",        weight_lbs: 23, dob: "2021-08-03", spayed_neutered: true,  vet_name: "Eastside Vet",            vet_phone: "4255559002", medical_notes: "On monthly flea prevention.", behavioral_notes: "Selective with dogs, loves humans." },
  { name: "Luna",     species: "cat", breed: "Maine Coon",       weight_lbs: 12, dob: "2020-02-20", spayed_neutered: true,  vet_name: "Redmond Pet Care",        vet_phone: "4255559003", medical_notes: null,                        behavioral_notes: "Very calm, enjoys window spots." },
  { name: "Cooper",   species: "dog", breed: "Labrador Mix",     weight_lbs: 72, dob: "2018-11-30", spayed_neutered: false, vet_name: "Kirkland Animal Clinic",  vet_phone: "4255559001", medical_notes: "Joint supplement daily.",     behavioral_notes: "High energy, needs a long morning walk." },
  { name: "Daisy",    species: "dog", breed: "Bernese Mountain", weight_lbs: 88, dob: "2022-01-15", spayed_neutered: true,  vet_name: "Eastside Vet",            vet_phone: "4255559002", medical_notes: null,                        behavioral_notes: "Gentle giant, loves naps." },
];

// Bookings: [clientIndex, petIndex, service, start, end, status, price_cents]
const FAKE_BOOKINGS = [
  [0, 0, "boarding",  "2026-03-10", "2026-03-17", "active",    49000],
  [1, 1, "boarding",  "2026-03-15", "2026-03-18", "confirmed", 21000],
  [2, 2, "boarding",  "2026-03-20", "2026-03-25", "confirmed", 30000],
  [3, 3, "day-care",  "2026-03-13", null,          "confirmed",  6000],
  [0, 0, "walking",   "2026-03-05", null,          "completed",  3000],
  [1, 1, "drop-in",   "2026-03-08", null,          "completed",  3000],
  [3, 3, "boarding",  "2026-02-20", "2026-02-25", "completed", 35000],
  [2, 4, "boarding",  "2026-04-01", "2026-04-07", "inquiry",       0],
  [0, 0, "day-care",  "2026-03-19", null,          "inquiry",       0],
];

async function seed() {
  console.log("🌱 Seeding fake data...\n");

  const userIds = [];

  // 1. Create auth users
  for (const client of FAKE_CLIENTS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: client.email,
      password: "TestPassword123!",
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes("already been registered")) {
        // Fetch existing user
        const { data: list } = await supabase.auth.admin.listUsers();
        const existing = list?.users?.find((u) => u.email === client.email);
        if (existing) {
          userIds.push(existing.id);
          console.log(`  ↩  ${client.email} already exists`);
          continue;
        }
      }
      console.error(`  ✗  ${client.email}:`, error.message);
      userIds.push(null);
      continue;
    }

    userIds.push(data.user.id);
    console.log(`  ✓  Created user: ${client.email}`);

    // Small delay to let the trigger create the client record
    await new Promise((r) => setTimeout(r, 600));

    // Update name + phone
    await supabase
      .from("clients")
      .update({ name: client.name, phone: client.phone })
      .eq("id", data.user.id);
  }

  console.log();

  // 2. Create pets
  const petIds = [];
  for (let i = 0; i < FAKE_PETS.length; i++) {
    const clientIdx = i < 2 ? 0 : i < 3 ? 1 : i < 4 ? 2 : 3; // distribute pets across clients
    const ownerId = userIds[clientIdx < userIds.length ? clientIdx : 0];
    if (!ownerId) { petIds.push(null); continue; }

    const pet = FAKE_PETS[i];
    const { data, error } = await supabase
      .from("pets")
      .insert({ ...pet, client_id: ownerId })
      .select("id")
      .single();

    if (error) {
      console.error(`  ✗  Pet ${pet.name}:`, error.message);
      petIds.push(null);
    } else {
      petIds.push(data.id);
      console.log(`  ✓  Created pet: ${pet.name} (${pet.species})`);
    }
  }

  console.log();

  // 3. Create bookings
  for (const [ci, pi, service, start, end, status, price] of FAKE_BOOKINGS) {
    const clientId = userIds[ci];
    const petId = petIds[pi];
    if (!clientId || !petId) continue;

    const { error } = await supabase.from("bookings").insert({
      client_id:   clientId,
      pet_id:      petId,
      service,
      start_date:  start,
      end_date:    end ?? null,
      status,
      price_cents: price,
      credit_applied_cents: 0,
    });

    if (error) {
      console.error(`  ✗  Booking ${service} for client ${ci}:`, error.message);
    } else {
      console.log(`  ✓  Booking: ${service} [${status}] ${start}${end ? " → " + end : ""}`);
    }
  }

  // 4. Referral: Sarah referred Mike
  if (userIds[0] && userIds[1]) {
    await supabase.from("referrals").insert({
      referrer_id: userIds[0],
      referred_id: userIds[1],
      status: "credited",
      credited_at: new Date().toISOString(),
    });
    // Give both $20 credits
    await supabase.from("clients").update({ referral_credits: 2000 }).eq("id", userIds[0]);
    await supabase.from("clients").update({ referral_credits: 2000 }).eq("id", userIds[1]);
    console.log("\n  ✓  Referral: Sarah → Mike (credited)");
  }

  console.log("\n✅ Seed complete!\n");
}

seed().catch(console.error);
