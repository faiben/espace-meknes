"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { Heart, Settings, User, Shield, Store, Image, Trash2, Plus, Save, CheckCircle, Video, AlertCircle } from "lucide-react";
import clsx from "clsx";

export default function DashboardPage() {
  const { t, isArabic } = useLang();
  const { user } = useAuth();
  const router = useRouter();
  const { allBusinesses, updateBusiness } = useBusinessStore();

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [saveMsg, setSaveMsg] = useState<"images" | "video" | null>(null);

  const myBusiness = useMemo(() => {
    if (!user) return null;
    return allBusinesses.find((b) => b.userId === user.id) || null;
  }, [user, allBusinesses]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl border border-emerald-100 card-shadow p-10 max-w-md">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-xl font-bold text-navy-800 mb-2">{isArabic ? "يجب تسجيل الدخول" : "Connexion requise"}</h2>
          <button onClick={() => router.push("/auth")} className="mt-4 px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
            {t.login}
          </button>
        </div>
      </div>
    );
  }

  const roleLabel: Record<string, string> = {
    admin: isArabic ? "مدير" : "Administrateur",
    resident: t.resident,
    merchant: t.merchant,
    artisan: t.artisanUser,
    jobseeker: t.jobseeker,
    employer: t.employer,
  };

  const menuItems = [
    { label: t.favorites, icon: <Heart size={20} />, href: "/favoris", color: "text-navy-400" },
    { label: t.accountSettings, icon: <Settings size={20} />, href: "/dashboard/settings", color: "text-navy-400" },
  ];

  if (user.role === "admin") {
    menuItems.unshift({ label: t.admin, icon: <Shield size={20} />, href: "/admin", color: "text-red-400" });
  }

  const tier = myBusiness?.packageType || "free";
  const isPremium = tier === "premium";
  const isPro = tier === "pro";
  const hasMedia = isPro || isPremium;

  const maxImages = isPremium ? 99 : isPro ? 3 : 1;
  const currentImages = myBusiness?.images || [];
  const canAddImage = currentImages.length < maxImages;
  const canAddVideo = hasMedia;

  const handleAddImage = () => {
    if (!myBusiness || !newImageUrl.trim()) return;
    const updated = {
      ...myBusiness,
      images: [...(myBusiness.images || []), newImageUrl.trim()],
    };
    updateBusiness(updated);
    setNewImageUrl("");
    setSaveMsg("images");
    setTimeout(() => setSaveMsg(null), 2000);
  };

  const handleRemoveImage = (idx: number) => {
    if (!myBusiness) return;
    const imgs = [...(myBusiness.images || [])];
    imgs.splice(idx, 1);
    updateBusiness({ ...myBusiness, images: imgs });
  };

  const handleSaveVideo = () => {
    if (!myBusiness) return;
    const embedUrl = newVideoUrl.trim();
    updateBusiness({ ...myBusiness, video: embedUrl || undefined });
    setSaveMsg("video");
    setTimeout(() => setSaveMsg(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className={clsx(
          "w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold",
          user.role === "admin" ? "bg-red-500" : "bg-primary-600"
        )}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy-800">{t.welcomeBack}, {user.name} !</h1>
          <p className="text-navy-500 text-sm">{isArabic ? "الدور" : "Rôle"}: {roleLabel[user.role] || user.role}</p>
          <p className="text-navy-400 text-xs">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 mb-3">
            <Heart size={24} />
          </div>
          <p className="text-2xl font-bold text-navy-800">{user.favorites.length}</p>
          <p className="text-sm text-navy-500">{t.favorites}</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 mb-3">
            <User size={24} />
          </div>
          <p className="text-lg font-bold text-navy-800">{roleLabel[user.role]}</p>
          <p className="text-sm text-navy-500">{isArabic ? "الدور" : "Rôle"}</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 text-green-600 mb-3">
            <span className="text-xl">📧</span>
          </div>
          <p className="text-sm font-bold text-navy-800 truncate">{user.email}</p>
          <p className="text-sm text-navy-500">{t.emailLabel}</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-purple-600 mb-3">
            <span className="text-xl">📅</span>
          </div>
          <p className="text-sm font-bold text-navy-800">{new Date(user.createdAt).toLocaleDateString("fr-MA")}</p>
          <p className="text-sm text-navy-500">{isArabic ? "عضو منذ" : "Membre depuis"}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl border border-emerald-100 card-shadow mb-8">
        {menuItems.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 px-5 py-4 transition-colors",
              item.color === "text-red-400" ? "text-red-600 hover:bg-red-50" : "text-navy-700 hover:bg-primary-50",
              i < menuItems.length - 1 && "border-b border-emerald-100"
            )}
          >
            <span className={item.color}>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            <span className={clsx("ml-auto text-navy-300", isArabic && "mr-auto ml-0")}>→</span>
          </a>
        ))}
      </div>

      {/* Business Media Management */}
      {(user.role === "merchant" || user.role === "admin") && (
        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Store size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-800">{t.myBusiness}</h2>
              {myBusiness && (
                <p className="text-sm text-navy-500">
                  {isArabic ? myBusiness.nameAr : myBusiness.nameFr} · <span className={clsx(
                    "font-medium",
                    isPremium ? "text-yellow-600" : isPro ? "text-blue-600" : "text-navy-500"
                  )}>{isPremium ? t.planPremium : isPro ? t.planPro : t.planGratuit}</span>
                </p>
              )}
            </div>
          </div>

          {!myBusiness ? (
            <div className="text-center py-8">
              <AlertCircle size={40} className="mx-auto text-navy-300 mb-3" />
              <p className="text-navy-500">{t.noBusiness}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tier Info */}
              <div className={clsx(
                "p-4 rounded-xl text-sm",
                isPremium ? "bg-yellow-50 text-yellow-800" : isPro ? "bg-blue-50 text-blue-800" : "bg-navy-50 text-navy-700"
              )}>
                {isPremium && <p>⭐ {t.maxImagesPremium}</p>}
                {isPro && <p>★ {t.maxImagesPro}</p>}
                {!hasMedia && <p>📷 {t.maxImagesFree}</p>}
              </div>

              {/* Images */}
              <div>
                <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-2">
                  <Image size={16} /> {t.images} ({currentImages.length}/{isPremium ? "∞" : isPro ? 3 : 1})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                  {currentImages.map((img, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden aspect-square bg-navy-100">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                {canAddImage && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder={t.imageUrl}
                      className="flex-1 px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={handleAddImage}
                      disabled={!newImageUrl.trim()}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={14} /> {t.addImage}
                    </button>
                  </div>
                )}
                {!canAddImage && (
                  <p className="text-xs text-navy-400 mt-2">
                    {isPremium ? t.maxImagesPremium : isPro ? t.maxImagesPro : t.maxImagesFree}
                  </p>
                )}
                {saveMsg === "images" && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle size={12} /> {t.imageSaved}
                  </p>
                )}
              </div>

              {/* Video */}
              <div>
                <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-2">
                  <Video size={16} /> {t.video}
                </h3>
                {!hasMedia ? (
                  <div className="p-4 rounded-xl bg-navy-50 text-sm text-navy-500">
                    {isPremium ? t.maxImagesPremium : isPro ? t.maxImagesPro : t.maxImagesFree}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder={t.videoUrl}
                      className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {myBusiness.video && (
                      <div className="aspect-video rounded-xl overflow-hidden bg-navy-100">
                        <iframe src={myBusiness.video} className="w-full h-full" allowFullScreen title="Video preview" />
                      </div>
                    )}
                    <button
                      onClick={handleSaveVideo}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      <Save size={14} /> {t.saveChanges}
                    </button>
                    {saveMsg === "video" && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle size={12} /> {t.videoSaved}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
