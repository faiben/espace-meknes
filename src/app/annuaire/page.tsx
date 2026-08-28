"use client";

import { useState, useMemo, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { searchBusinesses, sortByDistance } from "@/utils/search";
import { BusinessCard } from "@/components/BusinessCard";
import { SearchBar } from "@/components/SearchBar";
import { BusinessMap } from "@/components/BusinessMap";
import { Filter, MapPin, Navigation, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";

function AnnuaireContent() {
  const { t, isArabic } = useLang();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(searchParams.get("map") === "true");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(5);
  const [nearMe, setNearMe] = useState(false);
  const [locating, setLocating] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [locStatus, setLocStatus] = useState<"idle" | "locating" | "ok" | "blocked" | "error">("idle");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [clampedToCenter, setClampedToCenter] = useState(false);
  const CITY_CENTER = { lat: 34.0331, lng: -5.5473 };

  const positionRef = useRef<number | null>(null);

  const stopWatching = () => {
    if (positionRef.current !== null) {
      navigator.geolocation.clearWatch(positionRef.current);
      positionRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopWatching();
  }, []);

  const checkPermission = useCallback(async (): Promise<"granted" | "denied" | "prompt" | "unknown"> => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const res = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        return res.state as "granted" | "denied" | "prompt";
      }
    } catch {
      /* fallthrough */
    }
    return "unknown";
  }, []);

  const handleNearMe = async () => {
    if (nearMe) {
      setNearMe(false);
      setPosition(null);
      setUserLocation(null);
      setUsingFallback(false);
      setAccuracy(null);
      setLocStatus("idle");
      stopWatching();
      return;
    }
    stopWatching();
    setUsingFallback(false);
    setAccuracy(null);

    if (!("geolocation" in navigator)) {
      setPosition(CITY_CENTER);
      setUserLocation(CITY_CENTER);
      setNearMe(true);
      setUsingFallback(true);
      setLocStatus("error");
      return;
    }

    const permission = await checkPermission();
    if (permission === "denied") {
      setNearMe(true);
      setUserLocation(null);
      setPosition(null);
      setLocStatus("blocked");
      return;
    }

    setLocating(true);
    setLocStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(p);
        setUserLocation(p);
        setAccuracy(pos.coords.accuracy);
        setNearMe(true);
        setLocating(false);
        setLocStatus("ok");
      },
      (err) => {
        setLocating(false);
        if (err && err.code === 1) {
          setNearMe(true);
          setUserLocation(null);
          setPosition(null);
          setLocStatus("blocked");
          return;
        }
        setPosition(CITY_CENTER);
        setUserLocation(CITY_CENTER);
        setNearMe(true);
        setUsingFallback(true);
        setLocStatus("error");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
    positionRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(p);
        setUserLocation(p);
        setUsingFallback(false);
        setAccuracy(pos.coords.accuracy);
        setLocStatus("ok");
      },
      () => {
        /* keep last known position */
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
    );
  };

  const { allBusinesses } = useBusinessStore();

  const filtered = useMemo(() => {
    let results = searchBusinesses(query, undefined, selectedCategory || undefined, allBusinesses);
    if (nearMe) {
      const ref = position && userLocation ? userLocation : CITY_CENTER;
      const sorted = sortByDistance(results, ref.lat, ref.lng);
      const nearest = sorted[0]?.distance ?? Infinity;
      const useCenter = usingFallback || nearest > 5;
      const source = useCenter ? CITY_CENTER : ref;
      const finalSorted = useCenter ? sortByDistance(results, source.lat, source.lng) : sorted;
      results = finalSorted.filter((b) => b.distance <= radius);
    }
    return results;
  }, [query, selectedCategory, nearMe, position, userLocation, radius, usingFallback, allBusinesses]);

  useEffect(() => {
    if (!nearMe || !position || !userLocation) {
      setClampedToCenter(false);
      return;
    }
    const probe = sortByDistance(allBusinesses, userLocation.lat, userLocation.lng);
    const nearest = probe[0]?.distance ?? Infinity;
    setClampedToCenter(usingFallback || nearest > 5);
  }, [nearMe, position, userLocation, usingFallback, allBusinesses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-800 mb-2">{t.annuaireTitle}</h1>
        <p className="text-navy-600">
          {filtered.length} {t.results}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-emerald-200 font-medium text-sm text-navy-700 card-shadow"
        >
          <SlidersHorizontal size={16} /> {t.filter} {showFilters ? "▲" : "▼"}
        </button>

        {/* Sidebar Filters */}
        <div className={`lg:w-72 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white rounded-2xl border border-emerald-100 p-4 card-shadow lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-navy-800">{t.filter}</h3>
              <SlidersHorizontal size={18} className="text-navy-400" />
            </div>

            {/* Category filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-navy-700 mb-1">{t.allCategories}</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-navy-50"
              >
                <option value="">{t.allCategories}</option>
                {Object.entries(t.categories).map(([key, val]) => (
                  <option key={key} value={key}>{val}</option>
                ))}
              </select>
            </div>

            {/* Near me */}
            <div className="mb-4">
              <button
                onClick={handleNearMe}
                disabled={locating}
                className={clsx(
                  "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors",
                  nearMe
                    ? "bg-primary-600 text-white"
                    : "bg-primary-50 text-primary-700 hover:bg-primary-100",
                  locating && "opacity-60 cursor-wait"
                )}
              >
                <Navigation size={16} className={locating ? "animate-spin" : ""} />
                {locating ? (isArabic ? "جاري التحديد..." : "Localisation...") : t.nearMe}
              </button>
              {nearMe && (
                <div className="mt-3">
                  {locStatus === "blocked" && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-2 mb-2 text-[11px] text-red-700 leading-snug">
                      {isArabic
                        ? "تم رفض الوصول إلى موقعك. فعّل الموقع في إعدادات المتصفح ثم أعد المحاولة."
                        : "Accès à votre position refusé. Autorisez la localisation dans les paramètres du navigateur, puis réessayez."}
                    </div>
                  )}
                  {locStatus === "error" && usingFallback && (
                    <p className="text-[11px] text-amber-600 mt-1">
                      {isArabic ? "تعذر تحديد موقعك بدقة. تم استخدام وسط المدينة." : "Impossible de vous localiser précisément. Résultats autour du centre-ville."}
                    </p>
                  )}
                  {locStatus === "ok" && !usingFallback && clampedToCenter && (
                    <p className="text-[11px] text-amber-600 mt-1">
                      {isArabic
                        ? "موقعك (من الشبكة) بعيد عن المركز. تم ضبط النتائج حول وسط المدينة."
                        : "Votre position (réseau) est éloignée du centre. Résultats centrés sur la ville."}
                    </p>
                  )}
                  {locStatus === "ok" && !usingFallback && !clampedToCenter && (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                      <Navigation size={11} />
                      {isArabic
                        ? (accuracy != null && accuracy > 800 ? `تم تحديد موقعك تقريبياً (${userLocation?.lat?.toFixed(4)}, ${userLocation?.lng?.toFixed(4)}).` : "تم تحديد موقعك بدقة.")
                        : (accuracy != null && accuracy > 800 ? `Position approximative (${userLocation?.lat?.toFixed(4)}, ${userLocation?.lng?.toFixed(4)}).` : "Position précise (GPS).")}
                    </p>
                  )}
                  <label className="text-xs text-navy-500 block mt-2">
                    {t.distance}: {radius} {t.km}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="25"
                    step="0.5"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
              )}
            </div>

            {/* Map toggle */}
            <button
              onClick={() => setShowMap(!showMap)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-navy-50 text-navy-700 font-medium text-sm hover:bg-emerald-200 transition-colors"
            >
              <MapPin size={16} />
              {showMap ? (isArabic ? "إخفاء الخريطة" : "Masquer la carte") : t.viewOnMap}
            </button>

            {/* Reset */}
            {(selectedCategory || nearMe) && (
              <button
                onClick={() => { setSelectedCategory(""); setNearMe(false); setPosition(null); setUserLocation(null); setUsingFallback(false); setLocStatus("idle"); setAccuracy(null); stopWatching(); }}
                className="w-full mt-3 flex items-center justify-center gap-1 text-sm text-red-500 hover:text-red-600"
              >
                <X size={14} /> {t.resetFilters}
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <SearchBar onSearch={setQuery} initialValue={query} />
          </div>

          {showMap && (
            <div className="mb-6">
              <BusinessMap businesses={filtered} visible={showMap} />
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-navy-500 text-lg">
                {nearMe
                  ? (isArabic ? `لا توجد نتائج ضمن ${radius} كلم. يمكنك زيادة المسافة.` : `Aucun résultat dans un rayon de ${radius} km. Augmentez la distance.`)
                  : t.noResults}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((b) => (
                <BusinessCard key={b.id} business={b} distance={nearMe ? (b as any).distance : undefined} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnnuairePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-navy-500">Loading...</div>}>
      <AnnuaireContent />
    </Suspense>
  );
}
