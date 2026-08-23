"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Business } from "@/types";
import { getAreaName } from "@/utils/search";
import { categoryEmojis } from "@/lib/categoryEmojis";
import { MapPin, Star, Phone, Navigation, MessageCircle, Heart, Share2 } from "lucide-react";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const { t, isArabic } = useLang();
  const { user, toggleFavorite, isFavorite } = useAuth();
  const area = getAreaName(business.areaId);
  const isPro = business.packageType === "pro";
  const isPremium = business.packageType === "premium";
  const hasExtra = isPro || isPremium;
  const [shareCopied, setShareCopied] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 card-shadow overflow-hidden group">
      {/* Cover */}
      <div className="relative h-40 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
        {business.images && business.images[0] ? (
          <img src={business.images[0]} alt={isArabic ? business.nameAr : business.nameFr} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">{categoryEmojis[business.category]}</span>
        )}
        {/* Badge */}
        {isPremium && (
          <span className="absolute top-3 left-3 bg-accent-500 text-navy-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
            ⭐ {t.premiumPackage}
          </span>
        )}
        {isPro && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
            ★ {t.proPackage}
          </span>
        )}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={(e) => { e.preventDefault(); user ? toggleFavorite(business.id) : null; }}
            className={`p-1.5 rounded-lg transition-colors ${
              isFavorite(business.id)
                ? "bg-red-500 text-white"
                : "bg-white/80 backdrop-blur text-navy-600 hover:text-red-500"
            }`}
          >
            <Heart size={14} className={isFavorite(business.id) ? "fill-white" : ""} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              const url = `${window.location.origin}/annuaire/detail?id=${business.id}`;
              if (navigator.share) {
                navigator.share({ title: isArabic ? business.nameAr : business.nameFr, url });
              } else {
                navigator.clipboard.writeText(url);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 1500);
              }
            }}
            className="p-1.5 bg-white/80 backdrop-blur rounded-lg text-navy-600 hover:text-primary-600 transition-colors relative"
          >
            <Share2 size={14} />
            {shareCopied && (
              <span className="absolute top-full right-0 mt-1 text-[10px] bg-navy-800 text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                {isArabic ? "تم" : "Copié"}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-navy-800 leading-tight">
            {isArabic ? business.nameAr : business.nameFr}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={14} className="text-accent-500 fill-accent-400" />
            <span className="text-sm font-medium text-navy-700">{business.rating}</span>
            <span className="text-xs text-navy-400">({business.reviewCount})</span>
          </div>
        </div>
        <p className="text-sm text-navy-500 mb-3 line-clamp-2">
          {isArabic ? business.descriptionAr : business.descriptionFr}
        </p>
        <div className="flex items-center gap-1 text-xs text-navy-400 mb-3">
          <MapPin size={12} className="text-primary-500" />
          <span>{isArabic ? area.ar : area.fr}</span>
          <span className="mx-1 text-navy-300">·</span>
          <span>{t.categories[business.category]}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasExtra && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium hover:bg-primary-100 transition-colors"
            >
              <Navigation size={12} /> {t.takeMeThere}
            </a>
          )}
          {hasExtra && business.whatsapp && (
            <a
              href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
            >
              <MessageCircle size={12} /> {t.whatsapp}
            </a>
          )}
          {hasExtra && (
            <a
              href={`tel:${business.phone}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-50 text-navy-600 text-xs font-medium hover:bg-navy-100 transition-colors"
            >
              <Phone size={12} /> {t.call}
            </a>
          )}
          <Link
            href={`/annuaire/detail?id=${business.id}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-50 text-navy-600 text-xs font-medium hover:bg-navy-100 transition-colors"
          >
            {t.viewDetails}
          </Link>
        </div>
      </div>
    </div>
  );
}
