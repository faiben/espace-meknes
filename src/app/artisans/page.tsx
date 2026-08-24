"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useArtisanStore } from "@/hooks/useArtisanStore";
import { useArtisanRequestStore } from "@/hooks/useArtisanRequestStore";
import { areas } from "@/data";
import { searchArtisans, sortByDistance } from "@/utils/search";
import { ArtisanCard } from "@/components/ArtisanCard";
import { SearchBar } from "@/components/SearchBar";
import { Shield, Users, Phone as PhoneIcon, CheckCircle, Navigation, X, SlidersHorizontal, MessageCircle } from "lucide-react";
import clsx from "clsx";
import { useAppSettings } from "@/hooks/useAppSettings";

function ArtisansContent() {
  const { t, isArabic } = useLang();
  const { settings } = useAppSettings();
  const { allArtisans } = useArtisanStore();
  const { addRequest } = useArtisanRequestStore();
  const [query, setQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [nearMe, setNearMe] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(10);
  const [locating, setLocating] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [requestForm, setRequestForm] = useState({ description: "", specialty: "", area: "", phone: "", name: "" });
  const [requestSent, setRequestSent] = useState(false);

  const handleNearMe = () => {
    if (nearMe) {
      setNearMe(false);
      setUserLocation(null);
      return;
    }
    if (!("geolocation" in navigator)) {
      alert(isArabic ? "المتصفح لا يدعم تحديد الموقع" : "La géolocalisation n'est pas disponible");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearMe(true);
        setLocating(false);
      },
      () => {
        alert(isArabic ? "تعذر تحديد الموقع. تأكد من تفعيل خدمات الموقع." : "Impossible d'obtenir la localisation. Vérifiez les paramètres de localisation.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const filtered = useMemo(() => {
    let results = searchArtisans(query, undefined, selectedSpecialty || undefined, allArtisans).filter((a) => a.isVisible);
    if (nearMe && userLocation) {
      results = sortByDistance(results, userLocation.lat, userLocation.lng)
        .filter((a) => a.distance <= radius);
    }
    return results;
  }, [query, selectedSpecialty, nearMe, userLocation, radius, allArtisans]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const specialtyLabel = t.specialties[(requestForm.specialty || "autre") as keyof typeof t.specialties] || requestForm.specialty;
    const areaLabel = requestForm.area ? (areas.find((a) => a.id === requestForm.area) ? (isArabic ? areas.find((a) => a.id === requestForm.area)!.nameAr : areas.find((a) => a.id === requestForm.area)!.nameFr) : requestForm.area) : "";
    try {
      await addRequest({
        id: `ar${Date.now()}`,
        artisanId: "",
        artisanName: isArabic ? "طلب عام" : "Demande générale",
        userName: requestForm.name,
        userPhone: requestForm.phone,
        userEmail: "",
        descriptionFr: requestForm.description,
        descriptionAr: requestForm.description,
        specialty: (requestForm.specialty || "autre") as any,
        areaId: requestForm.area || "",
        status: "pending",
        contactedArtisans: [],
        notes: "",
        createdAt: now,
      });
      const phone = settings.whatsappNumber.replace(/[^0-9]/g, "");
      const msg = encodeURIComponent(
        isArabic
          ? `طلب حرفي جديد:\nالاسم: ${requestForm.name}\nالهاتف: ${requestForm.phone}\nالتخصص: ${specialtyLabel}\nالمنطقة: ${areaLabel}\nالوصف: ${requestForm.description}`
          : `Nouvelle demande artisan:\nNom: ${requestForm.name}\nTél: ${requestForm.phone}\nSpécialité: ${specialtyLabel}\nQuartier: ${areaLabel}\nDescription: ${requestForm.description}`
      );
      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    } catch (err: any) {
      alert(isArabic ? "خطأ: " + err.message : "Erreur: " + err.message);
      return;
    }
    setRequestSent(true);
    setTimeout(() => { setRequestSent(false); setShowRequest(false); }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-800 mb-2">{t.artisansTitle}</h1>
        <p className="text-navy-600">{filtered.length} {t.results}</p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: <Shield size={28} />, title: t.step1, desc: t.step1Detail, color: "bg-primary-50 text-primary-600" },
          { icon: <Users size={28} />, title: t.step2, desc: t.step2Detail, color: "bg-primary-50 text-primary-700" },
          { icon: <PhoneIcon size={28} />, title: t.step3, desc: t.step3Detail, color: "bg-accent-50 text-accent-600" },
        ].map((step, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-emerald-100 card-shadow text-center">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${step.color} mb-3`}>
              {step.icon}
            </div>
            <h3 className="font-bold text-navy-800 mb-1">{step.title}</h3>
            <p className="text-sm text-navy-500">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Request buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setShowRequest(true)}
          className="px-6 py-3 rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-colors"
        >
          {t.requestArtisan}
        </button>
        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
            isArabic
              ? "مرحباً، أريد الاستفسار عن خدمات الحرفيين"
              : "Bonjour, je souhaite des informations sur les services d'artisans"
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
        >
          <MessageCircle size={18} /> WhatsApp
        </a>
      </div>

      {/* Request Modal */}
      {showRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{t.requestArtisan}</h2>
              <button onClick={() => setShowRequest(false)} className="text-navy-400 hover:text-navy-600">
                <X size={24} />
              </button>
            </div>
            {requestSent ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
                <p className="text-lg font-semibold text-navy-800">{isArabic ? "تم إرسال طلبك!" : "Votre demande a été envoyée !"}</p>
                <p className="text-sm text-navy-500 mt-1">{isArabic ? "سيتواصل معك فريقنا قريباً" : "Notre équipe vous contactera bientôt"}</p>
              </div>
            ) : (
              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">{t.nameLabel}</label>
                  <input
                    required type="text" value={requestForm.name}
                    onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">{t.phone}</label>
                  <input
                    required type="tel" value={requestForm.phone}
                    onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">{isArabic ? "التخصص" : "Spécialité"}</label>
                  <select
                    required value={requestForm.specialty}
                    onChange={(e) => setRequestForm({ ...requestForm, specialty: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200"
                  >
                    <option value="">{t.allCategories}</option>
                    {Object.entries(t.specialties).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">{t.neighborhood}</label>
                  <select
                    required value={requestForm.area}
                    onChange={(e) => setRequestForm({ ...requestForm, area: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200"
                  >
                    <option value="">{t.allAreas}</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>{isArabic ? a.nameAr : a.nameFr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {isArabic ? "صف احتياجك" : "Décrivez votre besoin"}
                  </label>
                  <textarea
                    required rows={4} value={requestForm.description}
                    onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200"
                    placeholder={isArabic ? "مثال: يحتاج سباك لإصلاح صنبور المطبخ" : "Ex: Besoin d'un plombier pour réparer un robinet de cuisine"}
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
                  {t.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={setQuery} initialValue={query} />
        </div>
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="px-3 py-2 rounded-xl border border-emerald-200 text-sm bg-white"
        >
          <option value="">{t.allCategories}</option>
          {Object.entries(t.specialties).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button
          onClick={handleNearMe}
          disabled={locating}
          className={clsx(
            "flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors",
            nearMe
              ? "bg-primary-600 text-white"
              : "bg-primary-50 text-primary-700 hover:bg-primary-100 border border-emerald-200",
            locating && "opacity-60 cursor-wait"
          )}
        >
          <Navigation size={16} className={locating ? "animate-spin" : ""} />
          {locating ? (isArabic ? "جاري التحديد..." : "Localisation...") : t.nearMe}
        </button>
        {(selectedSpecialty || nearMe) && (
          <button
            onClick={() => { setSelectedSpecialty(""); setNearMe(false); setUserLocation(null); }}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
          >
            <X size={14} /> {t.resetFilters}
          </button>
        )}
      </div>

      {nearMe && (
        <div className="mb-6 bg-white rounded-xl border border-emerald-100 p-4 card-shadow">
          <label className="text-sm text-navy-600">
            {t.distance}: <span className="font-semibold text-navy-800">{radius} {t.km}</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full mt-2 accent-primary-600"
          />
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔧</p>
          <p className="text-navy-500 text-lg">{t.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a) => (
            <ArtisanCard key={a.id} artisan={a} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArtisansPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-navy-500">Loading...</div>}>
      <ArtisansContent />
    </Suspense>
  );
}
