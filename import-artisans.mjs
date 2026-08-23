import { readFileSync } from "fs";

const SUPABASE_URL = "https://fmxchegxgxsyngycvgyk.supabase.co";
const SUPABASE_KEY = "sb_publishable_JgiY4LKuCmm_vZp_Mb9Fzw_j1JS6x2w";

const raw = JSON.parse(readFileSync("C:\\Users\\faica\\Downloads\\artisans.json", "utf-8"));
console.log(`Read ${raw.length} artisans from file`);

const mapped = raw.map((a) => ({
  id: a.id || `a-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
  name_fr: a.nameFr || "",
  name_ar: a.nameAr || "",
  specialty: a.specialty || "autre",
  description_fr: a.descriptionFr || "",
  description_ar: a.descriptionAr || "",
  phone: a.phone || "",
  email: a.email || "",
  address_fr: a.addressFr || "",
  address_ar: a.addressAr || "",
  area_id: a.areaId || "medina",
  lat: a.lat ?? 34.0331,
  lng: a.lng ?? -5.5473,
  rating: a.rating ?? 0,
  jobs_completed: a.jobsCompleted ?? 0,
  is_visible: a.isVisible ?? true,
  created_at: a.createdAt || new Date().toISOString(),
  user_id: a.userId || "",
  avatar: a.avatar || "",
}));

const BATCH = 100;
let ok = 0;
let fail = 0;

for (let i = 0; i < mapped.length; i += BATCH) {
  const batch = mapped.slice(i, i + BATCH);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/artisans`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(batch),
  });
  if (res.ok) {
    ok += batch.length;
    console.log(`Batch ${Math.floor(i/BATCH)+1}: OK (${ok}/${mapped.length})`);
  } else {
    const err = await res.text();
    fail += batch.length;
    console.error(`Batch ${Math.floor(i/BATCH)+1} FAILED (${res.status}): ${err.slice(0,200)}`);
  }
}

console.log(`\nDone! ${ok} inserted/updated, ${fail} failed`);
