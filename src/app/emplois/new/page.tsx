"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useJobStore } from "@/hooks/useJobStore";
import { areas } from "@/data";
import { Job, JobSector, JobType } from "@/types";
import { Briefcase, ArrowLeft } from "lucide-react";
import Link from "next/link";

const jobSectors: JobSector[] = [
  "informatique", "construction", "sante", "education",
  "commerce", "restauration", "transport", "admin", "autre",
];

const jobTypes: JobType[] = [
  "CDI", "CDD", "freelance", "stage", "temps_partiel", "autre",
];

function PostJobForm() {
  const { t, isArabic } = useLang();
  const { user } = useAuth();
  const { addJob } = useJobStore();
  const router = useRouter();

  const [titleFr, setTitleFr] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState<JobSector>("autre");
  const [jobType, setJobType] = useState<JobType>("CDI");
  const [areaId, setAreaId] = useState("");
  const [salary, setSalary] = useState("");
  const [requirements, setRequirements] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFr.trim()) {
      setError(isArabic ? "عنوان العرض مطلوب" : "Le titre de l'offre est requis");
      return;
    }
    if (!company.trim()) {
      setError(isArabic ? "اسم الشركة مطلوب" : "Le nom de l'entreprise est requis");
      return;
    }
    if (!descriptionFr.trim()) {
      setError(isArabic ? "وصف العرض مطلوب" : "La description de l'offre est requise");
      return;
    }

    const area = areas.find((a) => a.id === areaId) || areas[0];

    const newJob: Job = {
      id: `job-${Date.now()}`,
      titleFr: titleFr.trim(),
      titleAr: titleAr.trim() || titleFr.trim(),
      descriptionFr: descriptionFr.trim(),
      descriptionAr: descriptionAr.trim() || descriptionFr.trim(),
      company: company.trim(),
      sector,
      jobType,
      areaId: area.id,
      salary: salary.trim() || undefined,
      requirements: requirements.trim() || undefined,
      lat: area.lat,
      lng: area.lng,
      createdAt: new Date().toISOString(),
      employerId: user?.id || "anonymous",
      isActive: true,
      applications: 0,
    };

    addJob(newJob);
    router.push("/emplois");
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Briefcase size={48} className="mx-auto text-navy-300 mb-4" />
        <h2 className="text-xl font-bold text-navy-800 mb-2">
          {isArabic ? "يجب تسجيل الدخول أولاً" : "Connectez-vous d'abord"}
        </h2>
        <p className="text-navy-500 mb-6">
          {isArabic ? "سجل دخولك لنشر عرض عمل" : "Connectez-vous pour publier une offre d'emploi"}
        </p>
        <Link
          href="/auth"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
        >
          {t.loginTitle}
        </Link>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-emerald-200 text-sm bg-white text-navy-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all";
  const labelClass = "block text-sm font-medium text-navy-700 mb-1";
  const selectClass = "w-full px-4 py-2.5 rounded-xl border border-emerald-200 text-sm bg-white text-navy-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/emplois" className="inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-700 mb-6">
        <ArrowLeft size={16} className={isArabic ? "rotate-180" : ""} /> {isArabic ? "العودة" : "Retour"}
      </Link>

      <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 md:p-8">
        <h1 className="text-2xl font-bold text-navy-800 mb-6">
          {isArabic ? "نشر عرض عمل جديد" : "Publier une offre d'emploi"}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>{isArabic ? "العنوان (فرنسي) *" : "Titre (FR) *"}</label>
            <input
              type="text"
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              placeholder="Ex: Développeur Web"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>{isArabic ? "العنوان (عربي)" : "Titre (AR)"}</label>
            <input
              type="text"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="مثال: مطور ويب"
              className={inputClass + " font-arabic"}
              dir="rtl"
            />
          </div>

          <div>
            <label className={labelClass}>{isArabic ? "الوصف (فرنسي) *" : "Description (FR) *"}</label>
            <textarea
              value={descriptionFr}
              onChange={(e) => setDescriptionFr(e.target.value)}
              placeholder="Décrivez le poste..."
              rows={4}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>{isArabic ? "الوصف (عربي)" : "Description (AR)"}</label>
            <textarea
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="صف المنصب..."
              rows={4}
              className={inputClass + " font-arabic"}
              dir="rtl"
            />
          </div>

          <div>
            <label className={labelClass}>{isArabic ? "اسم الشركة / المؤسسة *" : "Entreprise *"}</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Nom de l'entreprise"
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "المجال" : "Secteur"}</label>
              <select value={sector} onChange={(e) => setSector(e.target.value as JobSector)} className={selectClass}>
                {jobSectors.map((s) => (
                  <option key={s} value={s}>{t.sectors[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "نوع العقد" : "Type de contrat"}</label>
              <select value={jobType} onChange={(e) => setJobType(e.target.value as JobType)} className={selectClass}>
                {jobTypes.map((j) => (
                  <option key={j} value={j}>{t.jobTypes[j]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{isArabic ? "الحي" : "Quartier"}</label>
              <select value={areaId} onChange={(e) => setAreaId(e.target.value)} className={selectClass}>
                <option value="">{isArabic ? "اختر الحي" : "Choisir un quartier"}</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{isArabic ? a.nameAr : a.nameFr}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{isArabic ? "الراتب (اختياري)" : "Salaire (optionnel)"}</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Ex: 5000-8000 MAD"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>{isArabic ? "المتطلبات (اختياري)" : "Prérequis (optionnel)"}</label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder={isArabic ? "المهارات والخبرات المطلوبة..." : "Compétences et expériences requises..."}
              rows={3}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            {isArabic ? "نشر العرض" : "Publier l'offre"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewJobPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-navy-500">Loading...</div>}>
      <PostJobForm />
    </Suspense>
  );
}
