"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Business, BusinessCategory, PackageType } from "@/types";
import { areas } from "@/data";
import { X } from "lucide-react";

interface BusinessFormProps {
  business?: Business | null;
  onSave: (business: Business) => void;
  onClose: () => void;
}

const categoryOptions: BusinessCategory[] = [
  "restaurant", "cafe", "boulangerie", "pharmacie", "coiffeur", "epicerie",
  "artisanat", "dentiste", "clinique", "medecin", "avocat", "immobilier",
  "garage", "electronique", "vetements", "education", "sport", "beaute",
  "hotel", "droguerie", "location_voiture", "autre"
];

const packageOptions: PackageType[] = ["free", "pro", "premium"];

export function BusinessForm({ business, onSave, onClose }: BusinessFormProps) {
  const { t, isArabic } = useLang();
  const [form, setForm] = useState({
    nameFr: "",
    nameAr: "",
    descriptionFr: "",
    descriptionAr: "",
    category: "restaurant" as BusinessCategory,
    areaId: areas[0]?.id || "",
    address: "",
    phone: "",
    email: "",
    website: "",
    whatsapp: "",
    images: "",
    video: "",
    lat: "34.0331",
    lng: "-5.5473",
    packageType: "free" as PackageType,
    rating: "4.5",
    userId: "",
  });

  useEffect(() => {
    if (business) {
      setForm({
        nameFr: business.nameFr,
        nameAr: business.nameAr,
        descriptionFr: business.descriptionFr,
        descriptionAr: business.descriptionAr,
        category: business.category,
        areaId: business.areaId,
        address: business.address,
        phone: business.phone,
        email: business.email,
        website: business.website || "",
        whatsapp: business.whatsapp || "",
        images: (business.images || []).join("\n"),
        video: business.video || "",
        lat: String(business.lat),
        lng: String(business.lng),
        packageType: business.packageType,
        rating: String(business.rating),
        userId: business.userId || "",
      });
    }
  }, [business]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split("T")[0];
    const imagesArr = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
    onSave({
      id: business?.id || `b${Date.now()}`,
      nameFr: form.nameFr,
      nameAr: form.nameAr,
      descriptionFr: form.descriptionFr,
      descriptionAr: form.descriptionAr,
      category: form.category,
      areaId: form.areaId,
      address: form.address,
      phone: form.phone,
      email: form.email,
      website: form.website || undefined,
      whatsapp: form.whatsapp || undefined,
      images: imagesArr.length > 0 ? imagesArr : undefined,
      video: form.video || undefined,
      lat: parseFloat(form.lat) || 34.0331,
      lng: parseFloat(form.lng) || -5.5473,
      rating: parseFloat(form.rating) || 4.5,
      reviewCount: business?.reviewCount || 0,
      isSponsored: form.packageType === "premium",
      packageType: form.packageType,
      createdAt: business?.createdAt || now,
      userId: form.userId || business?.userId,
    });
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-navy-700 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="font-bold text-navy-800 text-lg">
            {business ? (isArabic ? "تعديل Commerce" : "Modifier le commerce") : (isArabic ? "إضافة commerce" : "Ajouter un commerce")}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "الاسم (FR)" : "Nom (FR)"}</label>
              <input required className={inputClass} value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "الاسم (عربي)" : "Nom (AR)"}</label>
              <input required className={inputClass + " text-right"} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "الوصف (FR)" : "Description (FR)"}</label>
              <textarea required rows={3} className={inputClass} value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "الوصف (عربي)" : "Description (AR)"}</label>
              <textarea required rows={3} className={inputClass + " text-right"} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} dir="rtl" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "الفئة" : "Catégorie"}</label>
              <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as BusinessCategory })}>
                {categoryOptions.map((c) => <option key={c} value={c}>{t.categories[c]}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "الحي" : "Quartier"}</label>
              <select className={inputClass} value={form.areaId} onChange={(e) => setForm({ ...form, areaId: e.target.value })}>
                {areas.map((a) => <option key={a.id} value={a.id}>{isArabic ? a.nameAr : a.nameFr}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "الباقة" : "Package"}</label>
              <select className={inputClass} value={form.packageType} onChange={(e) => setForm({ ...form, packageType: e.target.value as PackageType })}>
                {packageOptions.map((p) => <option key={p} value={p}>{p === "premium" ? t.premiumPackage : p === "pro" ? t.proPackage : t.freePackage}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>{isArabic ? "العنوان" : "Adresse"}</label>
            <input required className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "الهاتف" : "Téléphone"}</label>
              <input required className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "البريد" : "Email"}</label>
              <input required type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "الموقع" : "Site web"}</label>
              <input className={inputClass} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input className={inputClass} value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelClass}>{isArabic ? "الصور (رابط لكل سطر)" : "Images (une URL par ligne)"}</label>
            <textarea rows={3} className={inputClass} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder="https://placehold.co/800x600/..." />
          </div>
          <div>
            <label className={labelClass}>{isArabic ? "الفيديو" : "Vidéo (URL YouTube embed)"}</label>
            <input className={inputClass} value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })}
              placeholder="https://www.youtube.com/embed/..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Latitude</label>
              <input type="number" step="any" className={inputClass} value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input type="number" step="any" className={inputClass} value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "التقييم" : "Note"}</label>
              <input type="number" step="0.1" min="0" max="5" className={inputClass} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelClass}>{isArabic ? "معرف المالك (User ID)" : "ID du propriétaire (optionnel)"}</label>
            <input className={inputClass} value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })}
              placeholder="user-123456" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-emerald-100">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-navy-50 transition-colors">
              {t.cancel}
            </button>
            <button type="submit" className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors">
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
