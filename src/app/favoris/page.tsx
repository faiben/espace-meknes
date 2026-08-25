"use client";

import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { artisans } from "@/data";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { BusinessCard } from "@/components/BusinessCard";
import { ArtisanCard } from "@/components/ArtisanCard";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FavorisPage() {
  const { t, isArabic } = useLang();
  const { user } = useAuth();
  const { allBusinesses } = useBusinessStore();
  const router = useRouter();

  const favIds = user?.favorites || [];
  const favBusinesses = allBusinesses.filter((b) => favIds.includes(b.id));
  const favArtisans = artisans.filter((a) => favIds.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-navy-800 mb-8">{t.favoritesTitle}</h1>

      {favBusinesses.length === 0 && favArtisans.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={64} className="mx-auto text-navy-300 mb-4" />
          <h2 className="text-xl font-semibold text-navy-600 mb-2">
            {!user ? (isArabic ? "يجب تسجيل الدخول" : "Connexion requise") : t.noFavorites}
          </h2>
          <p className="text-navy-400 mb-6">
            {!user
              ? (isArabic ? "سجل الدخول لعرض مفضلاتك" : "Connectez-vous pour voir vos favoris")
              : (isArabic ? "استكشف دليلنا وأضفERCHANTS والحرفيين إلى مفضلاتك" : "Explorez notre annuaire et ajoutez vos commerces et artisans préférés")
            }
          </p>
          <a
            href={!user ? "/auth" : "/annuaire"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            {!user ? t.login : t.ctaAnnuaire}
          </a>
        </div>
      ) : (
        <div className="space-y-10">
          {favBusinesses.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-navy-800 mb-4">{t.annuaire}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favBusinesses.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            </div>
          )}
          {favArtisans.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-navy-800 mb-4">{t.artisans}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favArtisans.map((a) => (
                  <ArtisanCard key={a.id} artisan={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
