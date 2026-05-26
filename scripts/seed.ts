// Velvet Seed Script
// Usage: npx ts-node --compiler-options '{"module":"commonjs","moduleResolution":"node"}' scripts/seed.ts
// Or copy-paste into Supabase SQL Editor after running the migration

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SEED_USERS = [
  { email: "seraphina@velvet.app", password: "Test1234!", username: "seraphina_v", displayName: "Seraphina Vance", role: "companion" },
  { email: "alexander@velvet.app", password: "Test1234!", username: "alexander_r", displayName: "Alexander Thorne", role: "companion" },
  { email: "valeria@velvet.app", password: "Test1234!", username: "valeria_lux", displayName: "Valeria Sterling", role: "companion" },
  { email: "marcus@velvet.app", password: "Test1234!", username: "marcus_k", displayName: "Marcus Kincaid", role: "companion" },
  { email: "vip@velvet.app", password: "Test1234!", username: "vip_guest", displayName: "Julian Sterling", role: "customer" },
  { email: "admin@velvet.app", password: "Admin1234!", username: "velvet_admin", displayName: "Velvet Admin", role: "admin" },
];

async function seed() {
  console.log("Seeding Velvet platform...\n");

  for (const user of SEED_USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        avatarUrl: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? "1500648767791-00dcc994a43e" : "1534528741775-53994a69daeb"}?auto=format&fit=crop&q=80&w=300`,
      },
    });

    if (error) {
      console.error(`Failed to create ${user.email}:`, error.message);
      continue;
    }

    console.log(`Created user: ${user.email} (${data.user.id})`);

    // Update profile with more details
    const profileData: Record<string, any> = {
      display_name: user.displayName,
      username: user.username,
      role: user.role,
      onboarded: true,
      credits: user.role === "companion" ? 0 : 50,
      tier: "free",
    };

    if (user.role === "companion") {
      Object.assign(profileData, {
        bio: "Curator of luxury nightlife experiences, fine dining guide, and premium social companion for exclusive corporate functions, gallery openings, and high-end VIP networking soirées.",
        interests: ["Fine Dining", "Modern Art", "Jazz Clubs", "VIP Events"],
        languages: ["English", "French"],
        is_verified: true,
        verification_status: "verified",
        trust_score: 95 + Math.floor(Math.random() * 5),
        response_rate: 95 + Math.floor(Math.random() * 5),
        online_status: true,
        pricing_hourly: 150 + Math.floor(Math.random() * 100),
        pricing_daily: 1000 + Math.floor(Math.random() * 1000),
        availability_status: "available",
        categories: ["Nightlife Hosting", "Social Meetups", "Creator Bookings"],
        rating: 4.5 + Math.random() * 0.5,
        reviews_count: 10 + Math.floor(Math.random() * 30),
      });
    }

    const { error: updateError } = await supabase.from("profiles").update(profileData).eq("id", data.user.id);
    if (updateError) console.error(`Profile update error for ${user.email}:`, updateError.message);
  }

  console.log("\nSeed complete!");
}

seed().catch(console.error);
