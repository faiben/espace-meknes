"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Send, CheckCircle, Monitor, PanelRight, AlignLeft, Star, Zap, Crown } from "lucide-react";
import clsx from "clsx";

const positions = [
  { key: "banner", icon: <Monitor size={24} />, desc: { fr: "En haut des pages", ar: "في أعلى الصفحات" }, size: "728×90" },
  { key: "sidebar", icon: <PanelRight size={24} />, desc: { fr: "Barre latérale", ar: "شريط جانبي" }, size: "300×250" },
  { key: "inline", icon: <AlignLeft size={24} />, desc: { fr: "Dans le contenu", ar: "في المحتوى" }, size: "Responsive" },
];

const packages = [
  {
    id: "starter",
    icon: <Star size={28} />,
    name: { fr: "Starter", ar: "ستارتر" },
    price: { fr: "200 MAD/mois", ar: "200 درهم/شهر" },
    color: "bg-emerald-50 text-emerald-600",
    features: {
      fr: ["1 emplacement banner", "Affichage 7 jours", "Statistiques de base"],
      ar: ["1 موقع بانر", "عرض لمدة 7 أيام", "إحصائيات أساسية"],
    },
  },
  {
    id: "pro",
    icon: <Zap size={28} />,
    name: { fr: "Professionnel", ar: "احترافي" },
    price: { fr: "500 MAD/mois", ar: "500 درهم/شهر" },
    color: "bg-blue-50 text-blue-600",
    popular: true,
    features: {
      fr: ["2 emplacements au choix", "Affichage 30 jours", "Statistiques détaillées", "Rotation entre emplacements"],
      ar: ["2 مواقع للاختيار", "عرض لمدة 30 يوم", "إحصائيات مفصلة", "تناوب بين المواقع"],
    },
  },
  {
    id: "premium",
    icon: <Crown size={28} />,
    name: { fr: "Premium", ar: "مميز" },
    price: { fr: "1000 MAD/mois", ar: "1000 درهم/شهر" },
    color: "bg-amber-50 text-amber-600",
    features: {
      fr: ["Tous les emplacements", "Affichage 30 jours", "Emplacement en homepage", "Statistiques avancées", "Support prioritaire"],
      ar: ["جميع المواقع", "عرض لمدة 30 يوم", "موقع في الصفحة الرئيسية", "إحصائيات متقدمة", "دعم ذو أولوية"],
    },
  },
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-navy-800 mb-3">{t.advertisingTitle}</h1>
        <p className="text-navy-600 max-w-2xl mx-auto">
          {isArabic
            ? "اعلن عن نشاطك على منصتنا واصل إلى آلاف السكان في مكناس"
            : "Faites la promotion de votre activit\u00e9 sur notre plateforme et touchez des milliers de r\u00e9sidents \u00e0 Mekn\u00e8s"}
        </p>
      </div>

      <h2 className="text-xl font-bold text-navy-800 mb-4">{t.adPositions}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
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

      <div className="mb-16">
        <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">
          {isArabic ? "خطط الأسعار" : "Nos offres"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={clsx(
                "relative bg-white rounded-2xl border card-shadow p-6 text-center",
                pkg.popular ? "border-blue-300 ring-2 ring-blue-100" : "border-emerald-100"
              )}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {isArabic ? "الأكثر طلبا" : "Le plus populaire"}
                </span>
              )}
              <div className={clsx("inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4", pkg.color)}>
                {pkg.icon}
              </div>
              <h3 className="text-lg font-bold text-navy-800 mb-1">{isArabic ? pkg.name.ar : pkg.name.fr}</h3>
              <p className="text-xl font-extrabold text-primary-600 mb-4">{isArabic ? pkg.price.ar : pkg.price.fr}</p>
              <ul className="space-y-2 mb-6">
                {(isArabic ? pkg.features.ar : pkg.features.fr).map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-navy-600">
                    <CheckCircle size={14} className="text-primary-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setForm({ ...form, position: pkg.id });
                  document.getElementById("ad-form")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={clsx(
                  "w-full py-2.5 rounded-xl font-medium text-sm transition-colors",
                  pkg.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                )}
              >
                {isArabic ? "طلب عرض أسعار" : "Demander un devis"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div id="ad-form" className="max-w-xl mx-auto">
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