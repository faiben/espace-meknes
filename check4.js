const { createClient } = require("@supabase/supabase-js");
const s = createClient("https://fmxchegxgxsyngycvgyk.supabase.co", "sb_publishable_JgiY4LKuCmm_vZp_Mb9Fzw_j1JS6x2w");
function distance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
(async () => {
  let all = [];
  let from = 0;
  while (true) {
    const { data } = await s.from("businesses").select("id,name_fr,lat,lng").range(from, from + 999);
    if (!data || data.length === 0) break;
    all = all.concat(data); from += 1000;
  }
  console.log("total", all.length);
  // Distribution of coords
  const lats = all.map(b => Number(b.lat));
  const lngs = all.map(b => Number(b.lng));
  console.log("lat min/max:", Math.min(...lats), Math.max(...lats));
  console.log("lng min/max:", Math.min(...lngs), Math.max(...lngs));
  // distance from a user at Meknes center
  const ulat = 34.0331, ulng = -5.5473;
  const dists = all.map(b => distance(ulat, ulng, Number(b.lat), Number(b.lng)));
  console.log("from Meknes center: min", Math.min(...dists).toFixed(2), "max", Math.max(...dists).toFixed(2), "km");
  // businesses > 10km
  const far = all.filter(b => distance(ulat, ulng, Number(b.lat), Number(b.lng)) > 10);
  console.log("businesses >10km from center:", far.length);
  far.slice(0,5).forEach(b => console.log("  ", b.name_fr, b.lat, b.lng, distance(ulat,ulng,Number(b.lat),Number(b.lng)).toFixed(1)+"km"));
})();
