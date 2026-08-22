import { areas, businesses, artisans, jobs } from "@/data";
import { ArtisanProfile, Business } from "@/types";

export function searchBusinesses(query: string, areaId?: string, categoryId?: string, businessList?: Business[]) {
  const source = businessList || businesses;
  const normalized = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "");

  return source.filter((b) => {
    const nameMatch =
      b.nameFr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalized) ||
      b.nameAr.includes(query) ||
      b.descriptionFr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalized) ||
      b.descriptionAr.includes(query);
    const areaMatch = !areaId || b.areaId === areaId;
    const catMatch = !categoryId || b.category === categoryId;
    return nameMatch && areaMatch && catMatch;
  });
}

export function searchArtisans(query: string, areaId?: string, specialtyId?: string, artisanList?: ArtisanProfile[]) {
  const source = artisanList || artisans;
  const normalized = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "");

  return source.filter((a) => {
    const nameMatch =
      a.nameFr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalized) ||
      a.nameAr.includes(query) ||
      a.descriptionFr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalized) ||
      a.descriptionAr.includes(query);
    const areaMatch = !areaId || a.areaId === areaId;
    const specMatch = !specialtyId || a.specialty === specialtyId;
    return nameMatch && areaMatch && specMatch;
  });
}

export function searchJobs(query: string, areaId?: string, sectorId?: string, jobTypeId?: string) {
  const normalized = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "");

  return jobs.filter((j) => {
    const titleMatch =
      j.titleFr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalized) ||
      j.titleAr.includes(query) ||
      j.company.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalized);
    const areaMatch = !areaId || j.areaId === areaId;
    const sectorMatch = !sectorId || j.sector === sectorId;
    const typeMatch = !jobTypeId || j.jobType === jobTypeId;
    return titleMatch && areaMatch && sectorMatch && typeMatch;
  });
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function sortByDistance<T extends { lat: number; lng: number }>(
  items: T[],
  userLat: number,
  userLng: number
): (T & { distance: number })[] {
  return items
    .map((item) => ({
      ...item,
      distance: calculateDistance(userLat, userLng, item.lat, item.lng),
    }))
    .sort((a, b) => a.distance - b.distance);
}

export function getAreaName(areaId: string): { fr: string; ar: string } {
  const area = areas.find((a) => a.id === areaId);
  return area ? { fr: area.nameFr, ar: area.nameAr } : { fr: "N/A", ar: "غير معروف" };
}
