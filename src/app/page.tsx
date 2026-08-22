"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import { jobs, areas } from "@/data";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { useJobStore } from "@/hooks/useJobStore";
import { useArtisanStore } from "@/hooks/useArtisanStore";
import { BusinessCard } from "@/components/BusinessCard";
import { ArtisanCard } from "@/components/ArtisanCard";
import { JobCard } from "@/components/JobCard";
import { AdBanner } from "@/components/AdBanner";
import { MapPin, Briefcase, Hammer, Store, ArrowRight, Search, CheckCircle, Phone } from "lucide-react";

const categoryIcons: Record<string, { fr: string; ar: string; icon: string }> = {
  restaurant: { fr: "Restaurant", ar: "مطعم", icon: "🍽️" },
  cafe: { fr: "Café", ar: "مقهى", icon: "☕" },
  boulangerie: { fr: "Boulangerie", ar: "مخبزة", icon: "🥐" },
  pharmacie: { fr: "Pharmacie", ar: "صيدلية", icon: "💊" },
  garage: { fr: "Garage", ar: "ورشة", icon: "🔧" },
  coiffure: { fr: "Coiffure", ar: "صالون", icon: "💇" },
  immobilier: { fr: "Immobilier", ar: "عقارات", icon: "🏠" },
  sante: { fr: "Santé", ar: "صحة", icon: "🏥" },
  technologie: { fr: "Tech", ar: "تكنولوجيا", icon: "💻" },
  epicerie: { fr: "Épicerie", ar: "بقالة", icon: "🛒" },
};

export default function HomePage() {
  const { t, isArabic } = useLang();
  const { allBusinesses } = useBusinessStore();
  const { allArtisans } = useArtisanStore();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden min-h-[520px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-navy-800/70 to-navy-900/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              {isArabic ? (
                <>{t.heroTitle.replace("أخيراً مترابط.", "").trim()} <span className="text-accent-400">أخيراً مترابط.</span></>
              ) : (
                <>{t.heroTitle.replace("enfin connecté.", "").trim()} <span className="text-accent-400">enfin connecté.</span></>
              )}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/annuaire"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
              >
                <Store size={20} />
                {t.ctaAnnuaire}
              </Link>
              <Link
                href="/artisans"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 text-white font-semibold hover:bg-white/25 transition-colors border border-white/25 backdrop-blur"
              >
                <Hammer size={20} />
                {t.ctaArtisans}
              </Link>
              <Link
                href="/emplois"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 text-navy-900 font-semibold hover:bg-accent-400 transition-colors shadow-lg"
              >
                <Briefcase size={20} />
                {t.ctaEmplois}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AdBanner position="banner" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-navy-800">{t.howItWorks}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Search size={32} />, title: t.step1Title, desc: t.step1Desc, color: "bg-primary-50 text-primary-600" },
              { icon: <CheckCircle size={32} />, title: t.step2Title, desc: t.step2Desc, color: "bg-emerald-50 text-emerald-600" },
              { icon: <Phone size={32} />, title: t.step3Title, desc: t.step3Desc, color: "bg-accent-50 text-accent-700" },
            ].map((step, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white card-shadow border border-emerald-50">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.color} mb-4`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-navy-800 mb-2">{step.title}</h3>
                <p className="text-navy-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by category */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-navy-800">{t.browseByCategory}</h2>
            <Link href="/annuaire" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              {isArabic ? "الكل" : "Tout voir"} <ArrowRight size={16} className={isArabic ? "rotate-180" : ""} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Object.entries(categoryIcons).map(([key, val]) => (
              <Link
                key={key}
                href={`/annuaire?category=${key}`}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-emerald-100 card-shadow hover:border-primary-300 transition-all group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{val.icon}</span>
                <span className="text-sm font-medium text-navy-700">{isArabic ? val.ar : val.fr}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-navy-800">{t.featuredBusinesses}</h2>
            <Link href="/annuaire" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              {isArabic ? "الكل" : "Tout voir"} <ArrowRight size={16} className={isArabic ? "rotate-180" : ""} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBusinesses.filter((b) => b.packageType === "premium").slice(0, 6).map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Artisans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-navy-800">{t.topArtisans}</h2>
            <Link href="/artisans" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              {isArabic ? "الكل" : "Tout voir"} <ArrowRight size={16} className={isArabic ? "rotate-180" : ""} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArtisans.filter((a) => a.isVisible).sort((a, b) => b.rating - a.rating).slice(0, 3).map((a) => (
              <ArtisanCard key={a.id} artisan={a} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-navy-800">{t.latestJobs}</h2>
            <Link href="/emplois" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              {isArabic ? "الكل" : "Tout voir"} <ArrowRight size={16} className={isArabic ? "rotate-180" : ""} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, 3).map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </div>
      </section>

      {/* Map preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-navy-800">{t.viewOnMap}</h2>
          <div className="rounded-2xl overflow-hidden border border-emerald-200 card-shadow bg-navy-50 h-80 flex items-center justify-center relative">
            <div className="text-center">
              <MapPin size={48} className="mx-auto text-primary-500 mb-3" />
              <p className="text-navy-600 font-medium">{t.nearMe}</p>
              <Link href="/annuaire?map=true" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-sm shadow">
                <MapPin size={16} /> {isArabic ? "فتح الخريطة" : "Ouvrir la carte"}
              </Link>
            </div>
            {areas.slice(0, 5).map((area, i) => (
              <div
                key={area.id}
                className="absolute bg-primary-500 text-white rounded-full w-3 h-3 border-2 border-white shadow"
                style={{ left: `${20 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                title={isArabic ? area.nameAr : area.nameFr}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-navy-800">{t.allAreas}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/annuaire?area=${area.id}`}
                className="p-4 rounded-xl bg-white border border-emerald-100 hover:border-primary-300 hover:bg-primary-50/50 card-shadow transition-all text-center"
              >
                <MapPin size={20} className="mx-auto text-primary-500 mb-2" />
                <p className="font-medium text-navy-800 text-sm">{isArabic ? area.nameAr : area.nameFr}</p>
                <p className="text-xs text-navy-400">{area.postalCode}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
