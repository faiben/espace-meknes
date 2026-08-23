import { readFileSync } from "fs";

const SUPABASE_URL = "https://fmxchegxgxsyngycvgyk.supabase.co";
const SUPABASE_KEY = "sb_publishable_JgiY4LKuCmm_vZp_Mb9Fzw_j1JS6x2w";

const raw = JSON.parse(readFileSync("C:\\Users\\faica\\Downloads\\businesses.json", "utf-8"));
console.log(`Read ${raw.length} businesses from file`);

const mapped = raw.map((b) => ({
  id: b.id || `b-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
  name_fr: b.nameFr || "",
  name_ar: b.nameAr || "",
  description_fr: b.descriptionFr || "",
  description_ar: b.descriptionAr || "",
  category: b.category || "autre",
  area_id: b.areaId || "medina",
  address: b.address || "",
  phone: b.phone || "",
  email: b.email || "",
  website: b.website || "",
  logo: b.logo || "",
  cover_image: b.coverImage || "",
  images: b.images || [],
  video: b.video || "",
  whatsapp: b.whatsapp || "",
  lat: b.lat ?? 34.0331,
  lng: b.lng ?? -5.5473,
  rating: b.rating ?? 0,
  review_count: b.reviewCount ?? 0,
  is_sponsored: b.isSponsored ?? false,
  package_type: b.packageType || "free",
  created_at: b.createdAt || new Date().toISOString(),
  user_id: b.userId || b.ownerId || "",
}));

const BATCH = 100;
let ok = 0;
let fail = 0;

for (let i = 0; i < mapped.length; i += BATCH) {
  const batch = mapped.slice(i, i + BATCH);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/businesses`, {
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
