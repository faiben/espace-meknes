"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { useRatingStore } from "@/hooks/useRatingStore";
import { useAuth } from "@/contexts/AuthContext";
import { BusinessClaimForm } from "@/components/BusinessClaimForm";
import { getAreaName } from "@/utils/search";
import { categoryEmojis } from "@/lib/categoryEmojis";
import { StarRating } from "@/components/StarRating";
import { AdBanner } from "@/components/AdBanner";
import { MapPin, Star, Phone, Mail, Globe, ArrowLeft, Heart, Share2, Navigation, MessageCircle, ChevronLeft, ChevronRight, Play, Send, BadgeCheck } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const BusinessMap = dynamic(() => import("@/components/BusinessMap").then((m) => m.BusinessMap), { ssr: false });

function BusinessDetailContent() {
  const { t, isArabic } = useLang();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { allBusinesses } = useBusinessStore();
  const { addRating, getBusinessRatings, getBusinessAverage, hasUserRated } = useRatingStore();
  const { user, toggleFavorite, isFavorite } = useAuth();
  const business = allBusinesses.find((b) => b.id === searchParams.get("id"));
  const [imgIndex, setImgIndex] = useState(0);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const businessRatings = business ? getBusinessRatings(business.id) : [];
  const userAverage = business ? getBusinessAverage(business.id) : null;
  const userHasRated = business ? hasUserRated(business.id) : false;

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-navy-500 text-lg">{t.noResults}</p>
        <Link href="/annuaire" className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
          <ArrowLeft size={16} /> {t.back}
        </Link>
      </div>
    );
  }

  const area = getAreaName(business.areaId);
  const isPro = business.packageType === "pro";
  const isPremium = business.packageType === "premium";
  const hasExtra = isPro || isPremium;
  const images = business.images || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0 max-w-4xl">
      <Link href="/annuaire" className="inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-700 mb-6">
        <ArrowLeft size={16} className={isArabic ? "rotate-180" : ""} /> {t.annuaire}
      </Link>

      {/* Cover / Gallery */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        {images.length > 0 ? (
          <div className="relative h-64 md:h-80">
            <img src={images[imgIndex]} alt="" className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setImgIndex((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60">
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIndex(i)} className={`w-2 h-2 rounded-full ${i === imgIndex ? "bg-white" : "bg-white/40"}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-48 md:h-64 bg-gradient-to-br from-primary-200 to-meknes-light flex items-center justify-center">
            <span className="text-7xl">{categoryEmojis[business.category]}</span>
          </div>
        )}
        {/* Badge */}
        {isPremium && (
          <span className="absolute top-4 left-4 bg-accent-500 text-navy-900 text-sm font-bold px-3 py-1 rounded-lg shadow">
            ⭐ {t.premiumPackage}
          </span>
        )}
        {isPro && (
          <span className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow">
            ★ {t.proPackage}
          </span>
        )}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => user ? toggleFavorite(business.id) : router.push("/auth")}
            className={`p-2 bg-white/80 backdrop-blur rounded-lg transition-colors ${
              isFavorite(business.id) ? "text-red-500" : "text-navy-600 hover:text-red-500"
            }`}
          >
            <Heart size={18} className={isFavorite(business.id) ? "fill-red-500" : ""} />
          </button>
          <button
            onClick={() => {
              const url = typeof window !== "undefined" ? window.location.href : "";
              if (navigator.share) {
                navigator.share({ title: isArabic ? business.nameAr : business.nameFr, url });
              } else {
                navigator.clipboard.writeText(url);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
              }
            }}
            className="p-2 bg-white/80 backdrop-blur rounded-lg text-navy-600 hover:text-primary-600 transition-colors"
          >
            <Share2 size={18} />
          </button>
          {shareCopied && (
            <span className="absolute -bottom-8 right-0 text-xs bg-navy-800 text-white px-2 py-1 rounded-lg whitespace-nowrap">
              {isArabic ? "تم النسخ!" : "Lien copié !"}
            </span>
          )}
        </div>
      </div>

      {/* Video (pro/premium only) */}
      {hasExtra && business.video && (
        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-4 mb-6">
          <h3 className="font-semibold text-navy-800 mb-3 flex items-center gap-2">
            <Play size={18} className="text-primary-500" /> {isArabic ? "فيديو" : "Vidéo"}
          </h3>
          <div className="aspect-video rounded-xl overflow-hidden">
            <iframe src={business.video} className="w-full h-full" allowFullScreen title="Video" />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy-800">
              {isArabic ? business.nameAr : business.nameFr}
            </h1>
            <span className="inline-block mt-2 text-sm font-medium text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
              {t.categories[business.category]}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Star size={20} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xl font-bold text-navy-800">{userAverage ?? business.rating}</span>
            <span className="text-sm text-navy-400">({businessRatings.length + business.reviewCount} {t.reviews})</span>
          </div>
        </div>

        <p className="text-navy-600 mb-6">
          {isArabic ? business.descriptionAr : business.descriptionFr}
        </p>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
            <MapPin size={18} className="text-primary-500 shrink-0" />
            <div>
              <p className="text-xs text-navy-400">{t.address}</p>
              <p className="text-sm font-medium text-navy-700">{business.address} — {isArabic ? area.ar : area.fr}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {hasExtra && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
            >
              <Navigation size={16} /> {t.takeMeThere}
            </a>
          )}
          {hasExtra && (
            <a
              href={`tel:${business.phone}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-800 text-white font-medium hover:bg-navy-900 transition-colors"
            >
              <Phone size={16} /> {t.call} — {business.phone}
            </a>
          )}
          {hasExtra && business.whatsapp && (
            <a
              href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={16} /> {t.whatsapp}
            </a>
          )}
          {hasExtra && (
            <a
              href={`mailto:${business.email}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-50 text-navy-700 font-medium hover:bg-emerald-200 transition-colors"
            >
              <Mail size={16} /> {t.sendEmail}
            </a>
          )}
          {hasExtra && business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-50 text-navy-700 font-medium hover:bg-emerald-200 transition-colors"
            >
              <Globe size={16} /> {t.website}
            </a>
          )}
        </div>

        {/* Claim Business Button */}
        {!business.userId && (
          <button
            onClick={() => user ? setClaimOpen(true) : router.push("/auth")}
            className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-500 text-navy-900 font-bold hover:bg-accent-400 transition-colors"
          >
            <BadgeCheck size={18} /> {t.claimBusiness}
          </button>
        )}

        {/* Map */}
        {hasExtra && business.lat !== 0 && business.lng !== 0 && (
          <div className="mt-6">
            <BusinessMap
              businesses={[business]}
              visible={true}
              height="h-64"
              center={[business.lat, business.lng]}
              zoom={15}
              singleMarker
            />
          </div>
        )}
      </div>

      {/* Rating Form */}
      <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 mt-6">
        <h2 className="text-lg font-bold text-navy-800 mb-4">{t.writeReview}</h2>
        {userHasRated && !reviewSubmitted ? (
          <p className="text-navy-500 text-sm">{t.alreadyRated}</p>
        ) : reviewSubmitted ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">⭐</p>
            <p className="text-primary-700 font-medium">{t.thankYou}</p>
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (reviewStars === 0) return;
            addRating({
              businessId: business.id,
              userName: reviewName.trim() || "Anonyme",
              stars: reviewStars,
              comment: reviewComment.trim(),
            });
            setReviewSubmitted(true);
          }} className="space-y-4">
            <div>
              <p className="text-sm font-medium text-navy-700 mb-2">{t.rating}</p>
              <StarRating value={reviewStars} onChange={setReviewStars} size={28} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">{t.yourName}</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder={isArabic ? "اسمك" : "Votre nom"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">{t.yourComment}</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={isArabic ? "تعليقك اختياري..." : "Votre commentaire (optionnel)..."}
              />
            </div>
            <button
              type="submit"
              disabled={reviewStars === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} /> {t.submitReview}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      {businessRatings.length > 0 && (
        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 mt-6">
          <h2 className="text-lg font-bold text-navy-800 mb-4">
            {t.averageRating} : <span className="text-yellow-500">{userAverage}</span> / 5
            <span className="text-sm font-normal text-navy-400 ml-2">({businessRatings.length} {t.reviews})</span>
          </h2>
          <div className="space-y-4">
            {businessRatings.map((r) => (
              <div key={r.id} className="border-b border-emerald-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-bold">
                    {r.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-800">{r.userName}</p>
                    <StarRating value={r.stars} readonly size={14} />
                  </div>
                  <span className="text-xs text-navy-400 ml-auto">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {r.comment && <p className="text-sm text-navy-600 ml-11">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {claimOpen && business && (
        <BusinessClaimForm business={business} onClose={() => setClaimOpen(false)} />
      )}
        </div>

        <div className="hidden lg:block w-72 shrink-0 pt-14">
          <div className="sticky top-24">
            <AdBanner position="sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BusinessDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-navy-500">Loading...</div>}>
      <BusinessDetailContent />
    </Suspense>
  );
}
