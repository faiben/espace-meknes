import { createClient } from "@supabase/supabase-js";
import { businesses, artisans, jobs, ads } from "./src/data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(url, key);

function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const snake = k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
    result[snake] = v;
  }
  return result;
}

async function seed() {
  console.log(`Seeding ${businesses.length} businesses...`);
  const bizData = businesses.map((b) => toSnake(b as unknown as Record<string, unknown>));
  const { error: e1 } = await supabase.from("businesses").upsert(bizData);
  if (e1) console.error("Businesses:", e1.message); else console.log("  OK");

  console.log(`Seeding ${artisans.length} artisans...`);
  const artData = artisans.map((a) => toSnake(a as unknown as Record<string, unknown>));
  const { error: e2 } = await supabase.from("artisans").upsert(artData);
  if (e2) console.error("Artisans:", e2.message); else console.log("  OK");

  console.log(`Seeding ${jobs.length} jobs...`);
  const jobData = jobs.map((j) => toSnake(j as unknown as Record<string, unknown>));
  const { error: e3 } = await supabase.from("jobs").upsert(jobData);
  if (e3) console.error("Jobs:", e3.message); else console.log("  OK");

  if (ads.length > 0) {
    console.log(`Seeding ${ads.length} ads...`);
    const adData = ads.map((a) => toSnake(a as unknown as Record<string, unknown>));
    const { error: e4 } = await supabase.from("ads").upsert(adData);
    if (e4) console.error("Ads:", e4.message); else console.log("  OK");
  }

  console.log("Done!");
}

seed();
