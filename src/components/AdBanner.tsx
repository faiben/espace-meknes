"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useAdStore } from "@/hooks/useAdStore";
import { useAppSettings } from "@/hooks/useAppSettings";
import { Ad } from "@/types";
import { Megaphone } from "lucide-react";

function AdCard({ ad, variant }: { ad: Ad; variant: "banner" | "sidebar" | "inline" }) {
  const { isArabic } = useLang();
  const ref = useRef<HTMLAnchorElement>(null);
  const counted = useRef(false);
  const { updateAd, allAds } = useAdStore();

  useEffect(() => {
    if (counted.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          updateAd({ ...ad, impressions: ad.impressions + 1 });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ad, updateAd]);

  const handleClick = () => {
    updateAd({ ...ad, clicks: ad.clicks + 1 });
  };

  if (variant === "banner") {
    return (
      <a
        ref={ref}
        href={ad.linkUrl}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
        <div className="w-full overflow-hidden rounded-xl border border-emerald-100 card-shadow bg-white hover:shadow-md transition-shadow">
          <img
            src={ad.imageUrl}
            alt={isArabic ? ad.titleAr : ad.titleFr}
            className="w-full h-auto max-h-24 object-cover"
          />
          <div className="flex items-center justify-between px-3 py-1.5 text-[10px] text-navy-400 bg-emerald-50/50">
            <span className="flex items-center gap-1">
              <Megaphone size={10} /> {isArabic ? "إعلان ممول" : "Sponsorisé"}
            </span>
            <span>{ad.advertiserName}</span>
          </div>
        </div>
      </a>
    );
  }

  if (variant === "sidebar") {
    return (
      <a
        ref={ref}
        href={ad.linkUrl}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
        <div className="w-full overflow-hidden rounded-xl border border-emerald-100 card-shadow bg-white hover:shadow-md transition-shadow">
          <img
            src={ad.imageUrl}
            alt={isArabic ? ad.titleAr : ad.titleFr}
            className="w-full h-auto object-cover"
          />
          <div className="p-3 text-center">
            <p className="text-xs font-medium text-navy-700 truncate">{isArabic ? ad.titleAr : ad.titleFr}</p>
            <p className="flex items-center justify-center gap-1 text-[10px] text-navy-400 mt-1">
              <Megaphone size={10} /> {isArabic ? "إعلان ممول" : "Sponsorisé"} · {ad.advertiserName}
            </p>
          </div>
        </div>
      </a>
    );
  }

  // inline
  return (
    <a
      ref={ref}
      href={ad.linkUrl}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <div className="w-full overflow-hidden rounded-xl border border-emerald-100 card-shadow bg-white hover:shadow-md transition-shadow flex items-center gap-4 p-3">
        <img
          src={ad.imageUrl}
          alt={isArabic ? ad.titleAr : ad.titleFr}
          className="w-24 h-16 object-cover rounded-lg shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-navy-700 truncate">{isArabic ? ad.titleAr : ad.titleFr}</p>
          <p className="flex items-center gap-1 text-[10px] text-navy-400 mt-1">
            <Megaphone size={10} /> {isArabic ? "إعلان ممول" : "Sponsorisé"} · {ad.advertiserName}
          </p>
        </div>
      </div>
    </a>
  );
}

interface AdBannerProps {
  position: "banner" | "sidebar" | "inline";
  className?: string;
}

export function AdBanner({ position, className = "" }: AdBannerProps) {
  const { settings } = useAppSettings();
  const { getActiveAds } = useAdStore();

  if (!settings.adsEnabled) return null;

  const ads = getActiveAds(position);
  if (ads.length === 0) return null;

  const ad = ads[Math.floor(Math.random() * ads.length)];

  return (
    <div className={className}>
      <AdCard ad={ad} variant={position} />
    </div>
  );
}
