"use client";

import { useParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useArtisanRequestStore } from "@/hooks/useArtisanRequestStore";
import { useArtisanStore } from "@/hooks/useArtisanStore";
import { useRatingStore } from "@/hooks/useRatingStore";
import { useAppSettings } from "@/hooks/useAppSettings";
import { ArtisanRequestForm } from "@/components/ArtisanRequestForm";
import { StarRating } from "@/components/StarRating";
import { getAreaName } from "@/utils/search";
import { specialtyEmojis } from "@/lib/specialtyEmojis";
import { MapPin, Star, ArrowLeft, Heart, Share2, CheckCircle, Shield, Send, MessageCircle } from "lucide-react";
import Link from "next/link";

function ArtisanDetailContent() {
  const params = useParams();
  const { t, isArabic } = useLang();
  const { allArtisans } = useArtisanStore();
  const artisan = allArtisans.find((a) => a.id === params.id);
  const { addRequest } = useArtisanRequestStore();
  const { settings } = useAppSettings();
  const { addRating, getArtisanRatings, getArtisanAverage, hasUserRatedArtisan } = useRatingStore();
  const [formOpen, setFormOpen] = useState(false);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const artisanRatings = artisan ? getArtisanRatings(artisan.id) : [];
  const userAverage = artisan ? getArtisanAverage(artisan.id) : null;
  const userHasRated = artisan ? hasUserRatedArtisan(artisan.id) : false;

  if (!artisan) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔧</p>
        <p className="text-navy-500 text-lg">{t.noResults}</p>
        <Link href="/artisans" className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
          <ArrowLeft size={16} /> {t.back}
        </Link>
      </div>
    );
  }

  const area = getAreaName(artisan.areaId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/artisans" className="inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-700 mb-6">
        <ArrowLeft size={16} className={isArabic ? "rotate-180" : ""} /> {t.artisans}
      </Link>

      <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 md:p-8">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0">
            <span className="text-4xl">{specialtyEmojis[artisan.specialty]}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-navy-800">
              {isArabic ? artisan.nameAr : artisan.nameFr}
            </h1>
            <span className="inline-block mt-2 text-sm font-medium text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
              {t.specialties[artisan.specialty]}
            </span>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="p-2 bg-navy-50 rounded-lg text-navy-600 hover:text-red-500 transition-colors">
              <Heart size={18} />
            </button>
            <button className="p-2 bg-navy-50 rounded-lg text-navy-600 hover:text-primary-600 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-navy-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-lg text-navy-800">{userAverage ?? artisan.rating}</span>
            </div>
            <p className="text-xs text-navy-500">{t.rating} ({artisanRatings.length} {t.reviews})</p>
          </div>
          <div className="text-center p-3 bg-navy-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle size={16} className="text-green-500" />
              <span className="font-bold text-lg text-navy-800">{artisan.jobsCompleted}</span>
            </div>
            <p className="text-xs text-navy-500">{isArabic ? "مهام منجزة" : "Missions"}</p>
          </div>
          <div className="text-center p-3 bg-navy-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield size={16} className="text-blue-500" />
            </div>
            <p className="text-xs text-navy-500">{isArabic ? "محقق" : "Vérifié"}</p>
          </div>
        </div>

        <p className="text-navy-600 mb-6">
          {isArabic ? artisan.descriptionAr : artisan.descriptionFr}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
            <MapPin size={18} className="text-primary-500 shrink-0" />
            <div>
              <p className="text-xs text-navy-400">{isArabic ? "العنوان" : "Adresse"}</p>
              <p className="text-sm font-medium text-navy-700">{isArabic ? artisan.addressAr : artisan.addressFr}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
            <MapPin size={18} className="text-primary-500 shrink-0" />
            <div>
              <p className="text-xs text-navy-400">{t.neighborhood}</p>
              <p className="text-sm font-medium text-navy-700">{isArabic ? area.ar : area.fr}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Shield size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              {isArabic ? "الخصوصية محمية" : "Confidentialité protégée"}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {isArabic
                ? "سيتطلع فريقنا الحرفي ومتاح. نحن نتصل بك عندما يكون متاحاً."
                : "Notre équipe contactera l'artisan pour vous. Si indisponible, nous vous proposerons un autre artisan."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            <Send size={18} /> {isArabic ? "طلب هذا الحرفي" : "Demander cet artisan"}
          </button>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              isArabic
                ? `مرحباً، أريد الاستفسار عن الحرفي "${artisan.nameAr}" (${t.specialties[artisan.specialty]})`
                : `Bonjour, je souhaite des informations sur l'artisan "${artisan.nameFr}" (${t.specialties[artisan.specialty]})`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
          >
            <MessageCircle size={18} /> {t.whatsapp}
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 md:p-8 mt-6">
        <h3 className="font-bold text-navy-800 mb-4">{isArabic ? "تقييم" : "Laisser un avis"}</h3>
        {userHasRated && !reviewSubmitted ? (
          <p className="text-sm text-navy-500">{isArabic ? "لقد قمت بتقييم هذا الحرفي بالفعل" : "Vous avez déjà évalué cet artisan."}</p>
        ) : reviewSubmitted ? (
          <p className="text-sm text-green-600 font-medium">{isArabic ? "شكراً لتقييمك!" : "Merci pour votre avis !"}</p>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (reviewStars === 0) return;
            addRating({
              artisanId: artisan.id,
              userName: reviewName.trim() || "Anonyme",
              stars: reviewStars,
              comment: reviewComment.trim(),
            });
            setReviewSubmitted(true);
          }} className="space-y-3">
            <StarRating value={reviewStars} onChange={setReviewStars} size={28} />
            <input
              type="text"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder={isArabic ? "اسمك (اختياري)" : "Votre nom (optionnel)"}
              className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
            />
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder={t.yourComment}
              className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
            />
            <button
              type="submit"
              disabled={reviewStars === 0}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {t.submit}
            </button>
          </form>
        )}
      </div>

      {artisanRatings.length > 0 && (
        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 md:p-8 mt-6">
          <h3 className="font-bold text-navy-800 mb-4">
            {t.averageRating} : <span className="text-yellow-500">{userAverage}</span> / 5
            <span className="text-sm font-normal text-navy-400 ml-2">({artisanRatings.length} {t.reviews})</span>
          </h3>
          <div className="space-y-4">
            {artisanRatings.map((r) => (
              <div key={r.id} className="border-b border-emerald-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-navy-700">{r.userName}</span>
                  <StarRating value={r.stars} readonly size={14} />
                </div>
                {r.comment && <p className="text-sm text-navy-500">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {formOpen && (
        <ArtisanRequestForm
          artisan={artisan}
          onSave={(req) => { addRequest(req); setFormOpen(false); }}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}

export default function ArtisanDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-20 text-center text-navy-500">Loading...</div>}>
      <ArtisanDetailContent />
    </Suspense>
  );
}
