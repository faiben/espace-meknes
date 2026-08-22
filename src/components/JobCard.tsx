"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import { Job } from "@/types";
import { getAreaName } from "@/utils/search";
import { MapPin, Clock, Building2, Users, Banknote, ExternalLink } from "lucide-react";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const { t, isArabic } = useLang();
  const area = getAreaName(job.areaId);

  const typeColors: Record<string, string> = {
    CDI: "bg-emerald-50 text-emerald-700",
    CDD: "bg-primary-50 text-primary-700",
    freelance: "bg-purple-50 text-purple-700",
    stage: "bg-accent-50 text-accent-700",
    temps_partiel: "bg-orange-50 text-orange-700",
    autre: "bg-navy-50 text-navy-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-navy-800 leading-tight">
          {isArabic ? job.titleAr : job.titleFr}
        </h3>
        <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-lg ${typeColors[job.jobType] || typeColors.autre}`}>
          {t.jobTypes[job.jobType]}
        </span>
      </div>

      <div className="flex items-center gap-1 text-sm text-navy-600 mb-1">
        <Building2 size={14} className="text-navy-400" />
        <span>{job.company}</span>
      </div>

      <p className="text-sm text-navy-500 mt-2 line-clamp-2">
        {isArabic ? job.descriptionAr : job.descriptionFr}
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-navy-400">
        <span className="flex items-center gap-1">
          <MapPin size={12} className="text-primary-500" />
          {isArabic ? area.ar : area.fr}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {new Date(job.createdAt).toLocaleDateString(isArabic ? "ar-MA" : "fr-MA")}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <Banknote size={12} className="text-accent-500" />
            {job.salary}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users size={12} />
          {job.applications} {isArabic ? "طلبات" : "candidatures"}
        </span>
      </div>

      <Link
        href={job.sourceUrl || `/emplois/${job.id}`}
        {...(job.sourceUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="inline-flex items-center gap-1 mt-4 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
      >
        {t.applyNow} {job.sourceUrl && <ExternalLink size={12} />}
      </Link>
      {job.sourceName && (
        <p className="text-[11px] text-navy-400 mt-2 flex items-center gap-1">
          <ExternalLink size={10} /> {isArabic ? "المصدر" : "Source"}: {job.sourceName}
        </p>
      )}
    </div>
  );
}
