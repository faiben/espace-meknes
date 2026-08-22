"use client";

import { useLang } from "@/contexts/LanguageContext";
import { useAppSettings } from "@/hooks/useAppSettings";
import { ArtisanProfile } from "@/types";
import { getAreaName } from "@/utils/search";
import { specialtyEmojis } from "@/lib/specialtyEmojis";
import { MapPin, Star, CheckCircle, MessageCircle } from "lucide-react";

interface ArtisanCardProps {
  artisan: ArtisanProfile;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const { t, isArabic } = useLang();
  const { settings } = useAppSettings();
  const area = getAreaName(artisan.areaId);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 card-shadow overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <span className="text-2xl">{specialtyEmojis[artisan.specialty]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-navy-800">
                {isArabic ? artisan.nameAr : artisan.nameFr}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star size={14} className="text-accent-500 fill-accent-400" />
                <span className="text-sm font-medium text-navy-700">{artisan.rating}</span>
              </div>
            </div>
            <span className="inline-block mt-1 text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
              {t.specialties[artisan.specialty]}
            </span>
          </div>
        </div>

        <p className="text-sm text-navy-500 mt-3 line-clamp-2">
          {isArabic ? artisan.descriptionAr : artisan.descriptionFr}
        </p>

        <div className="flex items-center gap-3 mt-3 text-xs text-navy-400">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-primary-500" />
            {isArabic ? artisan.addressAr : artisan.addressFr}, {isArabic ? area.ar : area.fr}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle size={12} className="text-primary-500" />
            {artisan.jobsCompleted} {isArabic ? "مهمة" : "missions"}
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          <a
            href={`/artisans/${artisan.id}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium hover:bg-primary-100 transition-colors"
          >
            {t.viewDetails}
          </a>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              isArabic
                ? `مرحباً، أريد الاستفسار عن الحرفي "${artisan.nameAr}"`
                : `Bonjour, je souhaite des informations sur l'artisan "${artisan.nameFr}"`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
          >
            <MessageCircle size={12} /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
