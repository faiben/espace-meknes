"use client";

import { useState, useMemo, Suspense, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { areas } from "@/data";
import { useJobStore } from "@/hooks/useJobStore";
import { JobCard } from "@/components/JobCard";
import { AdBanner } from "@/components/AdBanner";
import { SearchBar } from "@/components/SearchBar";
import { Briefcase, Building2, Users } from "lucide-react";

function EmploisContent() {
  const { t, isArabic } = useLang();
  const [query, setQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [activeTab, setActiveTab] = useState<"jobs" | "seekers">("jobs");

  const { allJobs, loaded } = useJobStore();

  const filtered = useMemo(() => {
    const normalized = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "");

    return allJobs.filter((j) => {
      const titleMatch =
        j.titleFr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalized) ||
        j.titleAr.includes(query) ||
        j.company.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalized);
      const areaMatch = !selectedArea || j.areaId === selectedArea;
      const sectorMatch = !selectedSector || j.sector === selectedSector;
      const typeMatch = !selectedType || j.jobType === selectedType;
      return titleMatch && areaMatch && sectorMatch && typeMatch;
    });
  }, [query, selectedArea, selectedSector, selectedType, allJobs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-800 mb-2">{t.jobsTitle}</h1>
        <p className="text-navy-600">{filtered.length} {isArabic ? "عرض" : "offres"}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
            activeTab === "jobs" ? "bg-primary-600 text-white" : "bg-emerald-50 text-navy-600 hover:bg-emerald-100"
          }`}
        >
          <Briefcase size={16} /> {t.jobsTitle}
        </button>
        <button
          onClick={() => setActiveTab("seekers")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
            activeTab === "seekers" ? "bg-primary-600 text-white" : "bg-emerald-50 text-navy-600 hover:bg-emerald-100"
          }`}
        >
          <Users size={16} /> {t.jobSeekers}
        </button>
      </div>

      {activeTab === "jobs" ? (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <SearchBar onSearch={setQuery} initialValue={query} />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2 rounded-xl border border-emerald-200 text-sm bg-white"
            >
              <option value="">{t.allAreas}</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{isArabic ? a.nameAr : a.nameFr}</option>
              ))}
            </select>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2 rounded-xl border border-emerald-200 text-sm bg-white"
            >
              <option value="">{t.allCategories}</option>
              {Object.entries(t.sectors).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-emerald-200 text-sm bg-white"
            >
              <option value="">{t.allCategories}</option>
              {Object.entries(t.jobTypes).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {/* Job post button */}
          <div className="flex justify-end mb-6">
            <a
              href="/emplois/new"
              className="px-5 py-2.5 rounded-xl bg-accent-500 text-white font-medium text-sm hover:bg-accent-600 transition-colors"
            >
              {t.postJob}
            </a>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">💼</p>
              <p className="text-navy-500 text-lg">{t.noResults}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((j, i) => (
                <Fragment key={j.id}>
                  <JobCard job={j} />
                  {(i + 1) % 6 === 0 && <AdBanner position="inline" className="sm:col-span-2 lg:col-span-3" />}
                </Fragment>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Job Seekers Tab */
        <div>
          <div className="text-center py-12 bg-navy-50 rounded-2xl">
            <Users size={48} className="mx-auto text-navy-300 mb-4" />
            <h3 className="text-xl font-semibold text-navy-700 mb-2">
              {isArabic ? "انضم كباحث عن عمل" : "Inscrivez-vous en tant que chercheur d'emploi"}
            </h3>
            <p className="text-navy-500 mb-6 max-w-md mx-auto">
              {isArabic ? "أنشئ ملفك الشخصي واحصل على عروض عمل مناسبة" : "Créez votre profil et recevez des offres adaptées à votre profil"}
            </p>
            <a
              href="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
            >
              {t.createProfile}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmploisPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-navy-500">Loading...</div>}>
      <EmploisContent />
    </Suspense>
  );
}
