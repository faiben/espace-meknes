"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useAppSettings } from "@/hooks/useAppSettings";
import { ArtisanProfile, ArtisanRequest } from "@/types";
import { sendArtisanRequestEmail } from "@/lib/email";
import { areas } from "@/data";
import { X, Send, CheckCircle } from "lucide-react";

interface ArtisanRequestFormProps {
  artisan: ArtisanProfile;
  onSave: (req: ArtisanRequest) => void;
  onClose: () => void;
}

export function ArtisanRequestForm({ artisan, onSave, onClose }: ArtisanRequestFormProps) {
  const { t, isArabic } = useLang();
  const { settings } = useAppSettings();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    userPhone: "",
    userEmail: "",
    descriptionFr: "",
    descriptionAr: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    onSave({
      id: `ar${Date.now()}`,
      artisanId: artisan.id,
      artisanName: isArabic ? artisan.nameAr : artisan.nameFr,
      userName: form.userName,
      userPhone: form.userPhone,
      userEmail: form.userEmail,
      descriptionFr: form.descriptionFr,
      descriptionAr: form.descriptionAr,
      specialty: artisan.specialty,
      areaId: artisan.areaId,
      status: "pending",
      contactedArtisans: [artisan.id],
      createdAt: now,
    });
    setSent(true);
    if (settings.supportEmail) {
      sendArtisanRequestEmail(settings.supportEmail, {
        userName: form.userName,
        userPhone: form.userPhone,
        userEmail: form.userEmail,
        artisanName: isArabic ? artisan.nameAr : artisan.nameFr,
        description: isArabic ? form.descriptionAr : form.descriptionFr,
      });
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-navy-700 mb-1";

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="font-bold text-navy-800 text-xl mb-2">
            {isArabic ? "تم الإرسال!" : "Envoyé !"}
          </h3>
          <p className="text-navy-500 mb-6">
            {isArabic
              ? "تم إرسال طلبك. سيتصل بك فريقنا قريباً."
              : "Votre demande a été envoyée. Notre équipe vous contactera bientôt."}
          </p>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
            {isArabic ? "إغلاق" : "Fermer"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="font-bold text-navy-800 text-lg">
            {isArabic ? "طلب حرفي" : "Demander un artisan"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Artisan info */}
          <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl">
              🔧
            </div>
            <div>
              <p className="font-medium text-navy-800 text-sm">{isArabic ? artisan.nameAr : artisan.nameFr}</p>
              <p className="text-xs text-primary-600">{t.specialties[artisan.specialty]}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "الاسم" : "Votre nom"}</label>
              <input required className={inputClass} value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "الهاتف" : "Téléphone"}</label>
              <input required type="tel" className={inputClass} value={form.userPhone} onChange={(e) => setForm({ ...form, userPhone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelClass}>{isArabic ? "البريد الإلكتروني" : "Email"}</label>
            <input required type="email" className={inputClass} value={form.userEmail} onChange={(e) => setForm({ ...form, userEmail: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>{isArabic ? "وصف المشكلة (بالدارجة)" : "Décrivez votre besoin (FR)"}</label>
            <textarea required rows={3} className={inputClass} value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })}
              placeholder={isArabic ? "صفي ما تحتاج..." : "Décrivez votre problème..."} />
          </div>
          <div>
            <label className={labelClass}>{isArabic ? "وصف المشكلة (بالعربية)" : "Décrivez votre besoin (AR)"}</label>
            <textarea required rows={3} className={inputClass + " text-right"} dir="rtl" value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
              placeholder="صف ما تحتاج..." />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
            {isArabic
              ? "سيتم مشاركة معلومات الاتصال الخاصة بك مع الحرفي فقط بعد الموافقة على المهمة."
              : "Vos coordonnées seront partagées avec l'artisan uniquement après acceptation de la mission."}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-navy-50 transition-colors">
              {t.cancel}
            </button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors">
              <Send size={14} /> {isArabic ? "إرسال الطلب" : "Envoyer la demande"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
