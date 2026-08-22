import { createClient } from "@supabase/supabase-js";
import { businesses, artisans, jobs, ads } from "./src/data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  console.log(`Seeding ${businesses.length} businesses...`);
  const { error: e1 } = await supabase.from("businesses").upsert(businesses);
  if (e1) console.error("Businesses:", e1.message); else console.log("  OK");

  console.log(`Seeding ${artisans.length} artisans...`);
  const { error: e2 } = await supabase.from("artisans").upsert(artisans);
  if (e2) console.error("Artisans:", e2.message); else console.log("  OK");

  console.log(`Seeding ${jobs.length} jobs...`);
  const { error: e3 } = await supabase.from("jobs").upsert(jobs);
  if (e3) console.error("Jobs:", e3.message); else console.log("  OK");

  if (ads.length > 0) {
    console.log(`Seeding ${ads.length} ads...`);
    const { error: e4 } = await supabase.from("ads").upsert(ads);
    if (e4) console.error("Ads:", e4.message); else console.log("  OK");
  }

  console.log("Done!");
}

seed();
