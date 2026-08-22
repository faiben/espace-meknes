"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { ArtisanProfile, ArtisanSpecialty } from "@/types";
import { areas } from "@/data";
import { X } from "lucide-react";

interface ArtisanFormProps {
  artisan?: ArtisanProfile | null;
  onSave: (artisan: ArtisanProfile) => void;
  onClose: () => void;
}

const specialtyOptions: ArtisanSpecialty[] = [
  "plomberie", "electricite", "peinture", "menuiserie", "ferronnerie",
  "maconnerie", "carrelage", "jardinage", "demenagement", "climatisation",
  "electromenager", "reparation_auto", "couture", "informatique", "nettoyage",
  "bricolage", "autre"
];

export function ArtisanForm({ artisan, onSave, onClose }: ArtisanFormProps) {
  const { t, isArabic } = useLang();
  const [form, setForm] = useState({
    nameFr: "",
    nameAr: "",
    specialty: "plomberie" as ArtisanSpecialty,
    descriptionFr: "",
    descriptionAr: "",
    phone: "",
    email: "",
    addressFr: "",
    addressAr: "",
    areaId: areas[0]?.id || "",
    lat: "34.0331",
    lng: "-5.5473",
    rating: "4.5",
    jobsCompleted: "0",
    isVisible: true,
  });

  useEffect(() => {
    if (artisan) {
      setForm({
        nameFr: artisan.nameFr,
        nameAr: artisan.nameAr,
        specialty: artisan.specialty,
        descriptionFr: artisan.descriptionFr,
        descriptionAr: artisan.descriptionAr,
        phone: artisan.phone,
        email: artisan.email,
        addressFr: artisan.addressFr,
        addressAr: artisan.addressAr,
        areaId: artisan.areaId,
        lat: String(artisan.lat),
        lng: String(artisan.lng),
        rating: String(artisan.rating),
        jobsCompleted: String(artisan.jobsCompleted),
        isVisible: artisan.isVisible,
      });
    }
  }, [artisan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split("T")[0];
    onSave({
      id: artisan?.id || `a${Date.now()}`,
      nameFr: form.nameFr,
      nameAr: form.nameAr,
      specialty: form.specialty,
      descriptionFr: form.descriptionFr,
      descriptionAr: form.descriptionAr,
      phone: form.phone,
      email: form.email,
      addressFr: form.addressFr,
      addressAr: form.addressAr,
      areaId: form.areaId,
      lat: parseFloat(form.lat) || 34.0331,
      lng: parseFloat(form.lng) || -5.5473,
      rating: parseFloat(form.rating) || 4.5,
      jobsCompleted: parseInt(form.jobsCompleted) || 0,
      isVisible: form.isVisible,
      createdAt: artisan?.createdAt || now,
      userId: artisan?.userId,
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
            {artisan ? (isArabic ? "تعديل الحرفي" : "Modifier l'artisan") : (isArabic ? "إضافة حرفي" : "Ajouter un artisan")}
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
          <div>
            <label className={labelClass}>{isArabic ? "التخصص" : "Spécialité"}</label>
            <select className={inputClass} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value as ArtisanSpecialty })}>
              {specialtyOptions.map((s) => <option key={s} value={s}>{t.specialties[s]}</option>)}
            </select>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "العنوان (FR)" : "Adresse (FR)"}</label>
              <input required className={inputClass} value={form.addressFr} onChange={(e) => setForm({ ...form, addressFr: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "العنوان (عربي)" : "Adresse (AR)"}</label>
              <input required className={inputClass + " text-right"} value={form.addressAr} onChange={(e) => setForm({ ...form, addressAr: e.target.value })} dir="rtl" />
            </div>
          </div>
          <div>
            <label className={labelClass}>{isArabic ? "الحي" : "Quartier"}</label>
            <select className={inputClass} value={form.areaId} onChange={(e) => setForm({ ...form, areaId: e.target.value })}>
              {areas.map((a) => <option key={a.id} value={a.id}>{isArabic ? a.nameAr : a.nameFr}</option>)}
            </select>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "المهام المنجزة" : "Missions réalisées"}</label>
              <input type="number" min="0" className={inputClass} value={form.jobsCompleted} onChange={(e) => setForm({ ...form, jobsCompleted: e.target.value })} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isVisible} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} className="w-4 h-4 rounded border-emerald-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm font-medium text-navy-700">{isArabic ? "مرئي" : "Visible"}</span>
              </label>
            </div>
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
