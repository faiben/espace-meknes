"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useJobStore } from "@/hooks/useJobStore";
import { getAreaName } from "@/utils/search";
import { MapPin, Clock, Building2, Banknote, Users, ArrowLeft, Share2, Briefcase, ExternalLink } from "lucide-react";
import Link from "next/link";

function JobDetailContent() {
  const { t, isArabic } = useLang();
  const searchParams = useSearchParams();
  const { allJobs } = useJobStore();
  const job = allJobs.find((j) => j.id === searchParams.get("id"));

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">💼</p>
        <p className="text-navy-500 text-lg">{t.noResults}</p>
        <Link href="/emplois" className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
          <ArrowLeft size={16} /> {t.back}
        </Link>
      </div>
    );
  }

  const area = getAreaName(job.areaId);
  const typeColors: Record<string, string> = {
    CDI: "bg-green-100 text-green-700",
    CDD: "bg-blue-100 text-blue-700",
    freelance: "bg-purple-100 text-purple-700",
    stage: "bg-yellow-100 text-yellow-700",
    temps_partiel: "bg-orange-100 text-orange-700",
    autre: "bg-navy-50 text-navy-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/emplois" className="inline-flex items-center gap-1 text-sm text-navy-500 hover:text-navy-700 mb-6">
        <ArrowLeft size={16} className={isArabic ? "rotate-180" : ""} /> {t.emplois}
      </Link>

      <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${typeColors[job.jobType]}`}>
                {t.jobTypes[job.jobType]}
              </span>
              <span className="text-xs font-medium text-navy-500 bg-navy-50 px-2 py-1 rounded-lg">
                {t.sectors[job.sector]}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy-800">
              {isArabic ? job.titleAr : job.titleFr}
            </h1>
          </div>
          <button className="p-2 bg-navy-50 rounded-lg text-navy-600 hover:text-primary-600 transition-colors shrink-0">
            <Share2 size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-navy-600 mb-4">
          <Building2 size={18} className="text-navy-400" />
          <span className="font-medium">{job.company}</span>
        </div>

        <p className="text-navy-600 mb-6">
          {isArabic ? job.descriptionAr : job.descriptionFr}
        </p>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
            <MapPin size={18} className="text-primary-500 shrink-0" />
            <div>
              <p className="text-xs text-navy-400">{t.neighborhood}</p>
              <p className="text-sm font-medium text-navy-700">{isArabic ? area.ar : area.fr}</p>
            </div>
          </div>
          {job.salary && (
            <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
              <Banknote size={18} className="text-green-500 shrink-0" />
              <div>
                <p className="text-xs text-navy-400">{isArabic ? "الراتب" : "Salaire"}</p>
                <p className="text-sm font-medium text-navy-700">{job.salary}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
            <Clock size={18} className="text-primary-500 shrink-0" />
            <div>
              <p className="text-xs text-navy-400">{isArabic ? "تاريخ النشر" : "Date de publication"}</p>
              <p className="text-sm font-medium text-navy-700">
                {new Date(job.createdAt).toLocaleDateString(isArabic ? "ar-MA" : "fr-MA")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl">
            <Users size={18} className="text-purple-500 shrink-0" />
            <div>
              <p className="text-xs text-navy-400">{isArabic ? "الطلبات" : "Candidatures"}</p>
              <p className="text-sm font-medium text-navy-700">{job.applications}</p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="mb-6">
            <h3 className="font-bold text-navy-800 mb-2">
              {isArabic ? "المتطلبات" : "Prérequis"}
            </h3>
            <p className="text-navy-600 text-sm">{job.requirements}</p>
          </div>
        )}

        {/* Source */}
        {job.sourceName && (
          <div className="mb-6 p-4 bg-navy-50 rounded-xl">
            <p className="text-xs text-navy-400 mb-1">{isArabic ? "المصدر" : "Source de l'offre"}</p>
            <p className="text-sm font-medium text-navy-700 flex items-center gap-1">
              <ExternalLink size={12} className="text-primary-500" />
              {job.sourceName}
            </p>
          </div>
        )}

        {/* Apply */}
        <div className="flex flex-wrap gap-3">
          {job.sourceUrl ? (
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              <Briefcase size={18} /> {isArabic ? "قدّم على المصدر" : "Postuler sur"} {job.sourceName || "l'offre"}
              <ExternalLink size={14} />
            </a>
          ) : (
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
              <Briefcase size={18} /> {t.applyNow}
            </button>
          )}
          <Link
            href="/auth"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-navy-50 text-navy-700 font-medium hover:bg-emerald-200 transition-colors"
          >
            {t.register}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-16 text-center text-navy-500">Loading...</div>}>
      <JobDetailContent />
    </Suspense>
  );
}
