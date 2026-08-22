"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Job, JobSector, JobType } from "@/types";
import { areas } from "@/data";
import { X } from "lucide-react";

interface JobFormProps {
  job?: Job | null;
  onSave: (job: Job) => void;
  onClose: () => void;
}

const sectorOptions: JobSector[] = ["informatique", "construction", "sante", "education", "commerce", "restauration", "transport", "admin", "autre"];
const jobTypeOptions: JobType[] = ["CDI", "CDD", "freelance", "stage", "temps_partiel", "autre"];

export function JobForm({ job, onSave, onClose }: JobFormProps) {
  const { t, isArabic } = useLang();
  const [form, setForm] = useState({
    titleFr: "",
    titleAr: "",
    descriptionFr: "",
    descriptionAr: "",
    company: "",
    sector: "informatique" as JobSector,
    jobType: "CDI" as JobType,
    areaId: areas[0]?.id || "",
    salary: "",
    requirements: "",
    sourceUrl: "",
    sourceName: "",
    lat: "34.0331",
    lng: "-5.5473",
  });

  useEffect(() => {
    if (job) {
      setForm({
        titleFr: job.titleFr,
        titleAr: job.titleAr,
        descriptionFr: job.descriptionFr,
        descriptionAr: job.descriptionAr,
        company: job.company,
        sector: job.sector,
        jobType: job.jobType,
        areaId: job.areaId,
        salary: job.salary || "",
        requirements: job.requirements || "",
        sourceUrl: job.sourceUrl || "",
        sourceName: job.sourceName || "",
        lat: String(job.lat),
        lng: String(job.lng),
      });
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split("T")[0];
    onSave({
      id: job?.id || `j${Date.now()}`,
      titleFr: form.titleFr,
      titleAr: form.titleAr,
      descriptionFr: form.descriptionFr,
      descriptionAr: form.descriptionAr,
      company: form.company,
      sector: form.sector,
      jobType: form.jobType,
      areaId: form.areaId,
      salary: form.salary || undefined,
      requirements: form.requirements || undefined,
      sourceUrl: form.sourceUrl || undefined,
      sourceName: form.sourceName || undefined,
      lat: parseFloat(form.lat) || 34.0331,
      lng: parseFloat(form.lng) || -5.5473,
      createdAt: job?.createdAt || now,
      employerId: job?.employerId || "admin",
      isActive: job?.isActive ?? true,
      applications: job?.applications || 0,
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
            {job ? (isArabic ? "تعديل الوظيفة" : "Modifier l'offre") : (isArabic ? "إضافة وظيفة" : "Ajouter une offre")}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "العنوان (_fr)" : "Titre (FR)"}</label>
              <input required className={inputClass} value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "العنوان (عربي)" : "Titre (AR)"}</label>
              <input required className={inputClass + " text-right"} value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} dir="rtl" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "الوصف (_fr)" : "Description (FR)"}</label>
              <textarea required rows={3} className={inputClass} value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "الوصف (عربي)" : "Description (AR)"}</label>
              <textarea required rows={3} className={inputClass + " text-right"} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} dir="rtl" />
            </div>
          </div>
          <div>
            <label className={labelClass}>{isArabic ? "الشركة" : "Entreprise"}</label>
            <input required className={inputClass} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "القطاع" : "Secteur"}</label>
              <select className={inputClass} value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value as JobSector })}>
                {sectorOptions.map((s) => <option key={s} value={s}>{t.sectors[s]}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "النوع" : "Type"}</label>
              <select className={inputClass} value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value as JobType })}>
                {jobTypeOptions.map((j) => <option key={j} value={j}>{t.jobTypes[j]}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "الحي" : "Quartier"}</label>
              <select className={inputClass} value={form.areaId} onChange={(e) => setForm({ ...form, areaId: e.target.value })}>
                {areas.map((a) => <option key={a.id} value={a.id}>{isArabic ? a.nameAr : a.nameFr}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>{isArabic ? "الراتب" : "Salaire"}</label>
            <input className={inputClass} placeholder="e.g. 5000-8000 MAD" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>{isArabic ? "المتطلبات" : "Prérequis"}</label>
            <input className={inputClass} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "رابط المصدر" : "URL source"}</label>
              <input className={inputClass} placeholder="https://..." value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "اسم المصدر" : "Nom de la source"}</label>
              <input className={inputClass} placeholder="ex. Jobsquare" value={form.sourceName} onChange={(e) => setForm({ ...form, sourceName: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Latitude</label>
              <input type="number" step="any" className={inputClass} value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input type="number" step="any" className={inputClass} value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
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
