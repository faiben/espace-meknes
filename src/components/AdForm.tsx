"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Ad, PaymentMethod } from "@/types";
import { X } from "lucide-react";
import clsx from "clsx";

interface AdFormProps {
  ad?: Ad | null;
  onSave: (ad: Ad) => void;
  onClose: () => void;
}

export function AdForm({ ad, onSave, onClose }: AdFormProps) {
  const { isArabic } = useLang();
  const [titleFr, setTitleFr] = useState(ad?.titleFr ?? "");
  const [titleAr, setTitleAr] = useState(ad?.titleAr ?? "");
  const [imageUrl, setImageUrl] = useState(ad?.imageUrl ?? "");
  const [linkUrl, setLinkUrl] = useState(ad?.linkUrl ?? "");
  const [advertiserName, setAdvertiserName] = useState(ad?.advertiserName ?? "");
  const [advertiserEmail, setAdvertiserEmail] = useState(ad?.advertiserEmail ?? "");
  const [position, setPosition] = useState<"banner" | "sidebar" | "inline">(ad?.position ?? "banner");
  const [startsAt, setStartsAt] = useState(ad?.startsAt ?? new Date().toISOString().split("T")[0]);
  const [expiresAt, setExpiresAt] = useState(ad?.expiresAt ?? "");
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "expired">(ad?.status ?? "pending");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(ad?.paymentMethod ?? "cash");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: ad?.id ?? `ad-${Date.now()}`,
      titleFr,
      titleAr,
      imageUrl,
      linkUrl,
      advertiserName,
      advertiserEmail,
      status,
      position,
      startsAt,
      expiresAt,
      impressions: ad?.impressions ?? 0,
      clicks: ad?.clicks ?? 0,
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto card-shadow" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-emerald-100">
          <h3 className="font-bold text-navy-800">
            {ad ? (isArabic ? "تعديل الإعلان" : "Modifier l\u2019annonce") : (isArabic ? "إضافة إعلان" : "Nouvelle annonce")}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-navy-50"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">{isArabic ? "العنوان بالفرنسية" : "Titre (FR)"}</label>
              <input value={titleFr} onChange={(e) => setTitleFr(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">{isArabic ? "العنوان بالعربية" : "Titre (AR)"}</label>
              <input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500" dir="rtl" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1">{isArabic ? "رابط الصورة" : "URL de l\u2019image"}</label>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1">{isArabic ? "رابط الإعلان" : "URL de destination"}</label>
            <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">{isArabic ? "اسم المعلن" : "Nom de l\u2019annonceur"}</label>
              <input value={advertiserName} onChange={(e) => setAdvertiserName(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">{isArabic ? "بريد المعلن" : "Email annonceur"}</label>
              <input type="email" value={advertiserEmail} onChange={(e) => setAdvertiserEmail(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">{isArabic ? "الموضع" : "Position"}</label>
              <select value={position} onChange={(e) => setPosition(e.target.value as typeof position)} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white">
                <option value="banner">{isArabic ? "بانر" : "Bannière"}</option>
                <option value="sidebar">{isArabic ? "شريط جانبي" : "Barre latérale"}</option>
                <option value="inline">{isArabic ? "داخل المحتوى" : "Intégré"}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">{isArabic ? "الحالة" : "Statut"}</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white">
                <option value="pending">{isArabic ? "قيد المراجعة" : "En attente"}</option>
                <option value="approved">{isArabic ? "مقبول" : "Approuvé"}</option>
                <option value="rejected">{isArabic ? "مرفوض" : "Rejeté"}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">{isArabic ? "طريقة الدفع" : "Paiement"}</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white">
                <option value="cash">{isArabic ? "نقداً" : "Espèces"}</option>
                <option value="credit_card">{isArabic ? "بطاقة" : "CB"}</option>
                <option value="bank_transfer">{isArabic ? "تحويل" : "Virement"}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">{isArabic ? "تاريخ البداية" : "Date de début"}</label>
              <input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1">{isArabic ? "تاريخ النهاية" : "Date de fin"}</label>
              <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white" />
            </div>
          </div>
          {imageUrl && (
            <div>
              <p className="text-xs text-navy-500 mb-1">{isArabic ? "معاينة" : "Aperçu"}</p>
              <img src={imageUrl} alt="" className="w-full h-auto max-h-32 object-cover rounded-lg border border-emerald-100" />
            </div>
          )}
          <button type="submit" className="w-full px-4 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
            {isArabic ? "حفظ" : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
