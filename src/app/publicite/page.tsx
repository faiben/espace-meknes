"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { ads } from "@/data";
import { Send, CheckCircle, Monitor, PanelRight, AlignLeft, Eye, MousePointerClick } from "lucide-react";
import clsx from "clsx";

const positions = [
  { key: "banner", icon: <Monitor size={24} />, desc: { fr: "En haut des pages", ar: "في أعلى الصفحات" }, size: "728×90" },
  { key: "sidebar", icon: <PanelRight size={24} />, desc: { fr: "Barre latérale", ar: "شريط جانبي" }, size: "300×250" },
  { key: "inline", icon: <AlignLeft size={24} />, desc: { fr: "Dans le contenu", ar: "في المحتوى" }, size: "Responsive" },
];

export default function PublicitePage() {
  const { t, isArabic } = useLang();
  const [form, setForm] = useState({ name: "", email: "", company: "", position: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: "", email: "", company: "", position: "", message: "" }); }, 4000);
  };

  const activeAds = ads.filter((a) => a.status === "approved");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-navy-800 mb-2">{t.advertisingTitle}</h1>
      <p className="text-navy-600 mb-8">
        {isArabic ? "اعلن عن نشاطك على منصتنا" : "Faites la promotion de votre activité sur notre plateforme"}
      </p>

      {/* Ad Positions */}
      <h2 className="text-xl font-bold text-navy-800 mb-4">{t.adPositions}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {positions.map((pos) => (
          <div key={pos.key} className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 text-primary-600 mb-3">
              {pos.icon}
            </div>
            <h3 className="font-bold text-navy-800 mb-1">{t[pos.key as keyof typeof t] as string}</h3>
            <p className="text-sm text-navy-500 mb-2">{isArabic ? pos.desc.ar : pos.desc.fr}</p>
            <p className="text-xs text-navy-400 font-mono">{pos.size}</p>
          </div>
        ))}
      </div>

      {/* Live Ads Preview */}
      {activeAds.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-navy-800 mb-4">
            {isArabic ? "إعلانات حالية" : "Annonces actives"}
          </h2>
          <div className="space-y-4">
            {activeAds.map((ad) => (
              <div key={ad.id} className="bg-white rounded-xl border border-emerald-100 card-shadow overflow-hidden">
                <img src={ad.imageUrl} alt={isArabic ? ad.titleAr : ad.titleFr} className="w-full h-auto" />
                <div className="p-3 flex items-center justify-between text-xs text-navy-400">
                  <span>{isArabic ? ad.titleAr : ad.titleFr}</span>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye size={12} /> {ad.impressions.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><MousePointerClick size={12} /> {ad.clicks.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ad Request Form */}
      <div className="max-w-xl">
        <h2 className="text-xl font-bold text-navy-800 mb-4">{t.adRequest}</h2>
        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6">
          {sent ? (
            <div className="text-center py-10">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
              <p className="text-lg font-semibold text-green-700">{t.messageSent}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">{t.nameLabel}</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">{t.emailLabel}</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">{isArabic ? "الشركة" : "Entreprise"}</label>
                <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">{isArabic ? "الموضع" : "Emplacement"}</label>
                <div className="grid grid-cols-3 gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos.key}
                      type="button"
                      onClick={() => setForm({ ...form, position: pos.key })}
                      className={clsx(
                        "flex flex-col items-center gap-1 px-3 py-3 rounded-lg text-xs font-medium transition-colors border",
                        form.position === pos.key
                          ? "bg-primary-50 border-primary-300 text-primary-700"
                          : "bg-navy-50 border-emerald-200 text-navy-600 hover:bg-emerald-100"
                      )}
                    >
                      {pos.icon}
                      {t[pos.key as keyof typeof t] as string}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">{isArabic ? "الرسالة" : "Message"}</label>
                <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm" />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
                <Send size={16} /> {t.adRequest}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
