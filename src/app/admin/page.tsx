"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { businesses as seedBusinesses, artisans, areas } from "@/data";
import { useJobStore } from "@/hooks/useJobStore";
import { useArtisanRequestStore } from "@/hooks/useArtisanRequestStore";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { useBusinessClaimStore } from "@/hooks/useBusinessClaimStore";
import { useArtisanStore } from "@/hooks/useArtisanStore";
import { useAdStore } from "@/hooks/useAdStore";
import { useAppSettings } from "@/hooks/useAppSettings";
import { JobForm } from "@/components/JobForm";
import { BusinessForm } from "@/components/BusinessForm";
import { ArtisanForm } from "@/components/ArtisanForm";
import { BusinessCsvImport } from "@/components/BusinessCsvImport";
import { ArtisanCsvImport } from "@/components/ArtisanCsvImport";
import { AdForm } from "@/components/AdForm";
import { Job, Business, ArtisanRequest, BusinessClaim, ArtisanProfile, Ad } from "@/types";
import { categoryEmojis } from "@/lib/categoryEmojis";
import {
  Store, Users, Briefcase, Megaphone, MapPin, Upload, Download, BarChart3, Settings,
  CheckCircle, XCircle, Eye, Plus, Trash2, Shield, UserX, AlertTriangle, Pencil, Send, Clock, Search
} from "lucide-react";
import clsx from "clsx";

type AdminTab = "overview" | "users" | "businesses" | "artisans" | "jobs" | "artisanRequests" | "claims" | "ads" | "areas" | "settings";

export default function AdminPage() {
  const { t, isArabic } = useLang();
  const { user, users, deleteUser, updateUser } = useAuth();
  const { allJobs, addJob, updateJob, deleteJob } = useJobStore();
  const { allBusinesses, addBusiness, updateBusiness, deleteBusiness } = useBusinessStore();
  const { allArtisans, addArtisan, updateArtisan, deleteArtisan } = useArtisanStore();
  const { requests: artisanRequests, updateRequest, deleteRequest } = useArtisanRequestStore();
  const { claims, updateClaim, deleteClaim } = useBusinessClaimStore();
  const { allAds, addAd, updateAd, deleteAd } = useAdStore();
  const { settings, updateSettings } = useAppSettings();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [deletedItems, setDeletedItems] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [businessFormOpen, setBusinessFormOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [artisanCsvImportOpen, setArtisanCsvImportOpen] = useState(false);
  const [artisanFormOpen, setArtisanFormOpen] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState<ArtisanProfile | null>(null);
  const [adFormOpen, setAdFormOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [businessSearch, setBusinessSearch] = useState("");
  const [artisanSearch, setArtisanSearch] = useState("");

  const filteredBusinesses = useMemo(() => {
    if (!businessSearch.trim()) return allBusinesses;
    const q = businessSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return allBusinesses.filter((b) =>
      b.nameFr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q) ||
      b.nameAr.includes(businessSearch) ||
      b.phone.includes(businessSearch) ||
      b.category.includes(q)
    );
  }, [businessSearch, allBusinesses]);

  const filteredArtisans = useMemo(() => {
    if (!artisanSearch.trim()) return allArtisans;
    const q = artisanSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return allArtisans.filter((a) =>
      a.nameFr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(q) ||
      a.nameAr.includes(artisanSearch) ||
      a.phone.includes(artisanSearch) ||
      a.specialty.includes(q)
    );
  }, [artisanSearch, allArtisans]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl border border-emerald-100 card-shadow p-10 max-w-md">
          <Shield size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-navy-800 mb-2">
            {isArabic ? "الوصول مرفوض" : "Accès refusé"}
          </h2>
          <p className="text-navy-500 mb-4">
            {isArabic ? "هذا الصفحة محجوزة للمديرين فقط" : "Cette page est réservée aux administrateurs"}
          </p>
          <button onClick={() => router.push("/auth")} className="px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
            {t.login}
          </button>
        </div>
      </div>
    );
  }

  const activeBusinesses = allBusinesses;
  const activeArtisans = allArtisans;
  const activeJobs = allJobs;
  const activeAds = allAds;

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: isArabic ? "نظرة عامة" : "Vue d'ensemble", icon: <BarChart3 size={18} /> },
    { key: "users", label: isArabic ? "المستخدمون" : "Utilisateurs", icon: <Users size={18} /> },
    { key: "businesses", label: t.manageBusinesses, icon: <Store size={18} /> },
    { key: "artisans", label: t.manageArtisans, icon: <Users size={18} /> },
    { key: "jobs", label: t.manageJobs, icon: <Briefcase size={18} /> },
    { key: "artisanRequests", label: isArabic ? "طلبات الحرفيين" : "Demandes artisans", icon: <Send size={18} /> },
    { key: "claims", label: isArabic ? "المطالبات" : "Réclamations", icon: <CheckCircle size={18} /> },
    { key: "ads", label: t.manageAds, icon: <Megaphone size={18} /> },
    { key: "areas", label: t.manageAreas, icon: <MapPin size={18} /> },
    { key: "settings", label: isArabic ? "الإعدادات" : "Paramètres", icon: <Settings size={18} /> },
  ];

  const handleDelete = (id: string) => {
    setDeletedItems((prev) => { const next = new Set(prev); next.add(id); return next; });
    setConfirmDelete(null);
  };

  const handleUserDelete = (id: string) => {
    deleteUser(id);
    setConfirmDelete(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield size={28} className="text-red-500" />
        <h1 className="text-3xl font-bold text-navy-800">{t.adminDashboard}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-2 lg:sticky lg:top-24">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.key}
                onClick={() => setTab(tabItem.key)}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  tab === tabItem.key
                    ? "bg-primary-50 text-primary-700"
                    : "text-navy-600 hover:bg-primary-50"
                )}
              >
                {tabItem.icon}
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Overview */}
          {tab === "overview" && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: isArabic ? "المستخدمون" : "Utilisateurs", value: users.length, icon: <Users size={20} />, color: "bg-blue-50 text-blue-600" },
                  { label: t.manageBusinesses, value: activeBusinesses.length, icon: <Store size={20} />, color: "bg-green-50 text-green-600" },
                  { label: t.manageArtisans, value: activeArtisans.length, icon: <Users size={20} />, color: "bg-purple-50 text-purple-600" },
                  { label: t.manageJobs, value: activeJobs.length, icon: <Briefcase size={20} />, color: "bg-accent-50 text-accent-600" },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-xl border border-emerald-100 card-shadow p-4">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${s.color} mb-2`}>
                      {s.icon}
                    </div>
                    <p className="text-2xl font-bold text-navy-800">{s.value}</p>
                    <p className="text-xs text-navy-500">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6">
                <h2 className="font-bold text-navy-800 mb-3">{isArabic ? "إجراءات سريعة" : "Actions rapides"}</h2>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setTab("users")} className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100">{isArabic ? "إدارة المستخدمين" : "Gérer utilisateurs"}</button>
                  <button onClick={() => setTab("businesses")} className="px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100">{isArabic ? "إدارة المحلات" : "Gérer commerces"}</button>
                  <button onClick={() => setTab("ads")} className="px-4 py-2 rounded-lg bg-purple-50 text-purple-700 text-sm font-medium hover:bg-purple-100">{isArabic ? "إدارة الإعلانات" : "Gérer publicités"}</button>
                  <button onClick={() => setTab("areas")} className="px-4 py-2 rounded-lg bg-orange-50 text-orange-700 text-sm font-medium hover:bg-orange-100">{isArabic ? "إدارة الأحياء" : "Gérer quartiers"}</button>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === "users" && (
            <div className="bg-white rounded-2xl border border-emerald-100 card-shadow overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-emerald-100">
                <h2 className="font-bold text-navy-800">{isArabic ? "إدارة المستخدمين" : "Gestion des utilisateurs"} ({users.length})</h2>
              </div>
              <div className="divide-y divide-emerald-100">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-primary-50">
                    <div className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0",
                      u.role === "admin" ? "bg-red-500" : "bg-primary-600"
                    )}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-800 truncate">{u.name}</p>
                      <p className="text-xs text-navy-500 truncate">{u.email}</p>
                    </div>
                    <span className={clsx(
                      "text-xs font-medium px-2 py-1 rounded-lg shrink-0",
                      u.role === "admin" ? "bg-red-50 text-red-700" :
                      u.role === "merchant" ? "bg-green-50 text-green-700" :
                      u.role === "artisan" ? "bg-orange-50 text-orange-700" :
                      u.role === "employer" ? "bg-purple-50 text-purple-700" :
                      "bg-navy-50 text-navy-600"
                    )}>
                      {u.role}
                    </span>
                    <div className="text-xs text-navy-400 shrink-0 hidden sm:block">
                      {u.favorites.length} {isArabic ? "مفضلات" : "favoris"}
                    </div>
                    {u.role !== "admin" && (
                      <div className="flex gap-1 shrink-0">
                        {confirmDelete === u.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleUserDelete(u.id)} className="px-2 py-1 rounded text-xs bg-red-500 text-white">{t.yes}</button>
                            <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 rounded text-xs bg-navy-50 text-navy-600">{t.no}</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(u.id)} className="p-1.5 rounded-lg text-navy-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Businesses */}
          {tab === "businesses" && (
            <div className="bg-white rounded-2xl border border-emerald-100 card-shadow overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-emerald-100">
                <h2 className="font-bold text-navy-800">{t.manageBusinesses} ({filteredBusinesses.length})</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      value={businessSearch}
                      onChange={(e) => setBusinessSearch(e.target.value)}
                      placeholder={isArabic ? "بحث..." : "Rechercher..."}
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 w-48"
                    />
                  </div>
                  <button
                    onClick={() => setCsvImportOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100"
                  >
                    <Upload size={14} /> CSV
                  </button>
                  <button
                    onClick={() => { setEditingBusiness(null); setBusinessFormOpen(true); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100"
                  >
                    <Plus size={14} /> {isArabic ? "إضافة" : "Ajouter"}
                  </button>
                </div>
              </div>
              <div className="divide-y divide-emerald-100">
                {filteredBusinesses.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-primary-50">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-lg shrink-0">
                      {categoryEmojis[b.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-800 truncate">{isArabic ? b.nameAr : b.nameFr}</p>
                      <p className="text-xs text-navy-500">{t.categories[b.category]} · ⭐ {b.rating}</p>
                    </div>
                    <span className={clsx(
                      "text-xs font-medium px-2 py-1 rounded-lg shrink-0",
                      b.packageType === "premium" ? "bg-yellow-50 text-yellow-700" :
                      b.packageType === "pro" ? "bg-blue-50 text-blue-700" :
                      "bg-navy-50 text-navy-600"
                    )}>
                      {b.packageType === "premium" ? t.premiumPackage : b.packageType === "pro" ? t.proPackage : t.freePackage}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => { setEditingBusiness(b); setBusinessFormOpen(true); }}
                        className="p-1.5 rounded-lg text-navy-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </button>
                      {confirmDelete === b.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => { deleteBusiness(b.id); setConfirmDelete(null); }} className="px-2 py-1 rounded text-xs bg-red-500 text-white">{t.yes}</button>
                          <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 rounded text-xs bg-navy-50 text-navy-600">{t.no}</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(b.id)} className="p-1.5 rounded-lg text-navy-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artisans */}
          {tab === "artisans" && (
            <div className="bg-white rounded-2xl border border-emerald-100 card-shadow overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-emerald-100">
                <h2 className="font-bold text-navy-800">{t.manageArtisans} ({filteredArtisans.length})</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                      type="text"
                      value={artisanSearch}
                      onChange={(e) => setArtisanSearch(e.target.value)}
                      placeholder={isArabic ? "بحث..." : "Rechercher..."}
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 w-48"
                    />
                  </div>
                  <button
                    onClick={() => { setEditingArtisan(null); setArtisanFormOpen(true); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100"
                  >
                    <Plus size={14} /> {isArabic ? "إضافة حرفي" : "Ajouter"}
                  </button>
                  <button
                    onClick={() => setArtisanCsvImportOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100"
                  >
                    <Upload size={14} /> {t.importCSV}
                  </button>
                </div>
              </div>
              <div className="divide-y divide-emerald-100">
                {filteredArtisans.map((a) => (
                  <div key={a.id} className="flex items-center gap-4 p-4 hover:bg-primary-50">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-lg shrink-0">🔧</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-800 truncate">{isArabic ? a.nameAr : a.nameFr}</p>
                      <p className="text-xs text-navy-500">{t.specialties[a.specialty]} · ⭐ {a.rating} · {a.jobsCompleted} {isArabic ? "مهمة" : "missions"}</p>
                      <p className="text-xs text-navy-500 mt-0.5">📞 {a.phone}</p>
                    </div>
                    <span className={clsx(
                      "text-xs font-medium px-2 py-1 rounded-lg shrink-0",
                      a.isVisible ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    )}>
                      {a.isVisible ? (isArabic ? "مرئي" : "Visible") : (isArabic ? "مخفي" : "Masqué")}
                    </span>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => { setEditingArtisan(a); setArtisanFormOpen(true); }}
                        className="p-1.5 rounded-lg text-navy-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </button>
                      {confirmDelete === a.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => { deleteArtisan(a.id); setConfirmDelete(null); }} className="px-2 py-1 rounded text-xs bg-red-500 text-white">{t.yes}</button>
                          <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 rounded text-xs bg-navy-50 text-navy-600">{t.no}</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(a.id)} className="p-1.5 rounded-lg text-navy-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jobs */}
          {tab === "jobs" && (
            <div className="bg-white rounded-2xl border border-emerald-100 card-shadow overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-emerald-100">
                <h2 className="font-bold text-navy-800">{t.manageJobs} ({activeJobs.length})</h2>
                <button
                  onClick={() => { setEditingJob(null); setJobFormOpen(true); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100"
                >
                  <Plus size={14} /> {isArabic ? "إضافة وظيفة" : "Ajouter"}
                </button>
              </div>
              <div className="divide-y divide-emerald-100">
                {activeJobs.map((j) => (
                  <div key={j.id} className="flex items-center gap-4 p-4 hover:bg-primary-50">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-lg shrink-0">💼</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-800 truncate">{isArabic ? j.titleAr : j.titleFr}</p>
                      <p className="text-xs text-navy-500">{j.company} · {t.sectors[j.sector]} · {j.applications} {isArabic ? "طلبات" : "candidatures"}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-lg bg-purple-50 text-purple-700 shrink-0">{j.jobType}</span>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => { setEditingJob(j); setJobFormOpen(true); }}
                        className="p-1.5 rounded-lg text-navy-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </button>
                      {confirmDelete === j.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => { deleteJob(j.id); setConfirmDelete(null); }} className="px-2 py-1 rounded text-xs bg-red-500 text-white">{t.yes}</button>
                          <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 rounded text-xs bg-navy-50 text-navy-600">{t.no}</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(j.id)} className="p-1.5 rounded-lg text-navy-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {activeJobs.length === 0 && (
                  <div className="p-8 text-center text-navy-400">
                    {isArabic ? "لا توجد وظائف" : "Aucune offre d'emploi"}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Artisan Requests */}
          {tab === "artisanRequests" && (
            <div className="bg-white rounded-2xl border border-emerald-100 card-shadow overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-emerald-100">
                <h2 className="font-bold text-navy-800">{isArabic ? "طلبات الحرفيين" : "Demandes artisans"} ({artisanRequests.length})</h2>
              </div>
              <div className="divide-y divide-emerald-100">
                {artisanRequests.map((req) => (
                  <div key={req.id} className="p-4 hover:bg-primary-50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-navy-800 text-sm">{req.userName}</span>
                          <span className="text-xs text-navy-400">→</span>
                          <span className="font-medium text-navy-800 text-sm">{req.artisanName}</span>
                        </div>
                        <p className="text-xs text-navy-500 mb-1">
                          {req.userPhone} · {req.userEmail}
                        </p>
                        <p className="text-sm text-navy-600 mb-1">{isArabic ? req.descriptionAr : req.descriptionFr}</p>
                        <p className="text-xs text-navy-400">
                          {isArabic ? "التخصص" : "Spécialité"}: {t.specialties[req.specialty]}
                          {req.contactedArtisans.length > 1 && (
                            <span className="ml-2 text-orange-500">
                              · {isArabic ? "تم الاتصال بـ" : "Contacté"} {req.contactedArtisans.length} {isArabic ? "حرفيين" : "artisans"}
                            </span>
                          )}
                        </p>
                        {req.notes && (
                          <p className="text-xs text-blue-600 mt-1 italic">{req.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={clsx(
                          "text-xs font-medium px-2 py-1 rounded-lg",
                          req.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                          req.status === "contacted" ? "bg-blue-50 text-blue-700" :
                          req.status === "assigned" ? "bg-green-50 text-green-700" :
                          req.status === "completed" ? "bg-gray-50 text-gray-700" :
                          "bg-red-50 text-red-700"
                        )}>
                          {req.status === "pending" ? (isArabic ? "قيد الانتظار" : "En attente") :
                           req.status === "contacted" ? (isArabic ? "تم الاتصال" : "Contacté") :
                           req.status === "assigned" ? (isArabic ? "تم التعيين" : "Assigné") :
                           req.status === "completed" ? (isArabic ? "مكتمل" : "Terminé") :
                           (isArabic ? "ملغي" : "Annulé")}
                        </span>
                        <div className="flex gap-1">
                          <select
                            value={req.status}
                            onChange={(e) => updateRequest({ ...req, status: e.target.value as ArtisanRequest["status"] })}
                            className="text-xs px-2 py-1 rounded border border-emerald-200 bg-white"
                          >
                            <option value="pending">{isArabic ? "قيد الانتظار" : "En attente"}</option>
                            <option value="contacted">{isArabic ? "تم الاتصال" : "Contacté"}</option>
                            <option value="assigned">{isArabic ? "تم التعيين" : "Assigné"}</option>
                            <option value="completed">{isArabic ? "مكتمل" : "Terminé"}</option>
                            <option value="cancelled">{isArabic ? "ملغي" : "Annulé"}</option>
                          </select>
                          {confirmDelete === req.id ? (
                            <div className="flex gap-1">
                              <button onClick={() => { deleteRequest(req.id); setConfirmDelete(null); }} className="px-2 py-1 rounded text-xs bg-red-500 text-white">{t.yes}</button>
                              <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 rounded text-xs bg-navy-50 text-navy-600">{t.no}</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(req.id)} className="p-1 rounded text-navy-400 hover:text-red-600 hover:bg-red-50">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-navy-300 mt-2">
                      {new Date(req.createdAt).toLocaleDateString("fr-FR")} {new Date(req.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
                {artisanRequests.length === 0 && (
                  <div className="p-8 text-center text-navy-400">
                    {isArabic ? "لا توجد طلبات" : "Aucune demande"}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Claims */}
          {tab === "claims" && (
            <div className="bg-white rounded-2xl border border-emerald-100 card-shadow overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-emerald-100">
                <h2 className="font-bold text-navy-800">{isArabic ? "المطالبات" : "Réclamations"} ({claims.length})</h2>
              </div>
              <div className="divide-y divide-emerald-100">
                {claims.map((claim) => (
                  <div key={claim.id} className="p-4 hover:bg-primary-50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-navy-800 text-sm">{claim.userName}</span>
                          <span className="text-xs text-navy-400">→</span>
                          <span className="font-medium text-navy-800 text-sm">{claim.businessName}</span>
                        </div>
                        <p className="text-xs text-navy-500 mb-1">
                          {claim.userEmail} · WhatsApp: {claim.whatsapp}
                        </p>
                        <p className="text-xs text-navy-400">
                          {isArabic ? "الباقة المطلوبة" : "Package demandé"}: {claim.requestedPackage === "premium" ? t.premiumPackage : claim.requestedPackage === "pro" ? t.proPackage : t.freePackage}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={clsx(
                          "text-xs font-medium px-2 py-1 rounded-lg",
                          claim.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                          claim.status === "verified" ? "bg-blue-50 text-blue-700" :
                          claim.status === "approved" ? "bg-green-50 text-green-700" :
                          "bg-red-50 text-red-700"
                        )}>
                          {claim.status === "pending" ? t.pending :
                           claim.status === "verified" ? t.verified :
                           claim.status === "approved" ? t.approved : t.rejected}
                        </span>
                        <div className="flex gap-1">
                          {claim.status === "pending" && (
                            <button
                              onClick={() => {
                                updateClaim({ ...claim, status: "verified" });
                              }}
                              className="px-2 py-1 rounded text-xs bg-blue-500 text-white hover:bg-blue-600"
                            >
                              {t.verified}
                            </button>
                          )}
                          {claim.status === "verified" && (
                            <button
                              onClick={() => {
                                updateClaim({ ...claim, status: "approved" });
                                updateBusiness({ ...allBusinesses.find((b) => b.id === claim.businessId)!, userId: claim.userId, packageType: claim.requestedPackage });
                              }}
                              className="px-2 py-1 rounded text-xs bg-green-500 text-white hover:bg-green-600"
                            >
                              {t.approveClaim}
                            </button>
                          )}
                          {claim.status !== "approved" && claim.status !== "rejected" && (
                            <button
                              onClick={() => updateClaim({ ...claim, status: "rejected" })}
                              className="px-2 py-1 rounded text-xs bg-red-500 text-white hover:bg-red-600"
                            >
                              {t.rejectClaim}
                            </button>
                          )}
                          {confirmDelete === claim.id ? (
                            <div className="flex gap-1">
                              <button onClick={() => { deleteClaim(claim.id); setConfirmDelete(null); }} className="px-2 py-1 rounded text-xs bg-red-500 text-white">{t.yes}</button>
                              <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 rounded text-xs bg-navy-50 text-navy-600">{t.no}</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(claim.id)} className="p-1 rounded text-navy-400 hover:text-red-600 hover:bg-red-50">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-navy-300 mt-2">
                      {new Date(claim.createdAt).toLocaleDateString("fr-FR")} {new Date(claim.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
                {claims.length === 0 && (
                  <div className="p-8 text-center text-navy-400">
                    {isArabic ? "لا توجد مطالبات" : "Aucune réclamation"}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ads */}
          {tab === "ads" && (
            <div className="bg-white rounded-2xl border border-emerald-100 card-shadow overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-emerald-100">
                <h2 className="font-bold text-navy-800">{t.manageAds} ({activeAds.length})</h2>
                <button
                  onClick={() => { setEditingAd(null); setAdFormOpen(true); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100"
                >
                  <Plus size={14} /> {isArabic ? "إضافة إعلان" : "Ajouter une annonce"}
                </button>
              </div>
              <div className="divide-y divide-emerald-100">
                {activeAds.map((ad) => (
                  <div key={ad.id} className="flex items-center gap-4 p-4 hover:bg-primary-50">
                    <img src={ad.imageUrl} alt="" className="w-20 h-10 object-cover rounded shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-800 truncate">{isArabic ? ad.titleAr : ad.titleFr}</p>
                      <p className="text-xs text-navy-500">{ad.advertiserName} · {ad.impressions.toLocaleString()} {isArabic ? "مشاهدة" : "vues"} · {ad.clicks.toLocaleString()} {isArabic ? "نقرات" : "clics"}</p>
                    </div>
                    <span className={clsx(
                      "text-xs font-medium px-2 py-1 rounded-lg shrink-0",
                      ad.status === "approved" ? "bg-green-50 text-green-700" :
                      ad.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                      "bg-red-50 text-red-700"
                    )}>
                      {ad.status === "approved" ? (isArabic ? "مقبول" : "Approuvé") :
                       ad.status === "pending" ? (isArabic ? "قيد المراجعة" : "En attente") :
                       (isArabic ? "مرفوض" : "Rejeté")}
                    </span>
                    <span className="text-[10px] text-navy-400 shrink-0 hidden sm:block uppercase">{ad.position}</span>
                    <div className="flex gap-1 shrink-0">
                      {ad.status !== "approved" && (
                        <button
                          onClick={() => updateAd({ ...ad, status: "approved" })}
                          className="p-1.5 rounded-lg text-navy-400 hover:text-green-600 hover:bg-green-50"
                          title={isArabic ? "قبول" : "Approuver"}
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {ad.status !== "rejected" && (
                        <button
                          onClick={() => updateAd({ ...ad, status: "rejected" })}
                          className="p-1.5 rounded-lg text-navy-400 hover:text-red-600 hover:bg-red-50"
                          title={isArabic ? "رفض" : "Rejeter"}
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => { setEditingAd(ad); setAdFormOpen(true); }}
                        className="p-1.5 rounded-lg text-navy-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </button>
                      {confirmDelete === ad.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => { deleteAd(ad.id); setConfirmDelete(null); }} className="px-2 py-1 rounded text-xs bg-red-500 text-white">{t.yes}</button>
                          <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 rounded text-xs bg-navy-50 text-navy-600">{t.no}</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(ad.id)} className="p-1.5 rounded-lg text-navy-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {activeAds.length === 0 && (
                  <div className="p-8 text-center text-navy-400">
                    {isArabic ? "لا توجد إعلانات" : "Aucune annonce"}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Areas */}
          {tab === "areas" && (
            <div className="bg-white rounded-2xl border border-emerald-100 card-shadow overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-emerald-100">
                <h2 className="font-bold text-navy-800">{t.manageAreas} ({areas.length})</h2>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100">
                  <Plus size={14} /> {isArabic ? "إضافة حي" : "Ajouter un quartier"}
                </button>
              </div>
              <div className="divide-y divide-emerald-100">
                {areas.map((a) => (
                  <div key={a.id} className="flex items-center gap-4 p-4 hover:bg-primary-50">
                    <MapPin size={18} className="text-primary-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-800">{isArabic ? a.nameAr : a.nameFr}</p>
                      <p className="text-xs text-navy-500">{isArabic ? a.nameFr : a.nameAr} · {a.postalCode}</p>
                    </div>
                    <div className="text-xs text-navy-400 shrink-0 hidden sm:block">
                      {a.lat.toFixed(4)}, {a.lng.toFixed(4)}
                    </div>
                    <button className="p-1.5 rounded-lg text-navy-400 hover:text-blue-600 hover:bg-blue-50 shrink-0">
                      <Settings size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {tab === "settings" && (
            <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6">
              <h2 className="font-bold text-navy-800 text-lg mb-6">{isArabic ? "إعدادات التطبيق" : "Paramètres de l'application"}</h2>
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">{t.whatsappNumber}</label>
                  <input
                    type="tel"
                    value={settings.whatsappNumber}
                    onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="+212600000000"
                  />
                  <p className="text-xs text-navy-400 mt-1">{t.whatsappHelp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">{t.emailLabel} ({isArabic ? "الدعم" : "Support"})</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => updateSettings({ supportEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="admin@espace-meknes.ma"
                  />
                  <p className="text-xs text-navy-400 mt-1">{t.supportEmailHelp}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-navy-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-navy-800">{isArabic ? "تفعيل الإعلانات" : "Publicité activée"}</p>
                    <p className="text-xs text-navy-500">{isArabic ? "إظهار/إخفاء الإعلانات في جميع أنحاء الموقع" : "Afficher ou masquer les publicités sur tout le site"}</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ adsEnabled: !settings.adsEnabled })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.adsEnabled ? "bg-primary-600" : "bg-navy-300"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.adsEnabled ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                <button
                  onClick={() => { setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2000); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                >
                  <Settings size={16} /> {t.saveSettings}
                </button>
                {settingsSaved && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={14} /> {t.settingsSaved}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {jobFormOpen && (
        <JobForm
          job={editingJob}
          onSave={(job) => {
            if (editingJob) {
              updateJob(job);
            } else {
              addJob(job);
            }
            setJobFormOpen(false);
            setEditingJob(null);
          }}
          onClose={() => { setJobFormOpen(false); setEditingJob(null); }}
        />
      )}

      {businessFormOpen && (
        <BusinessForm
          business={editingBusiness}
          onSave={(biz) => {
            if (editingBusiness) {
              updateBusiness(biz);
            } else {
              addBusiness(biz);
            }
            setBusinessFormOpen(false);
            setEditingBusiness(null);
          }}
          onClose={() => { setBusinessFormOpen(false); setEditingBusiness(null); }}
        />
      )}

      {artisanFormOpen && (
        <ArtisanForm
          artisan={editingArtisan}
          onSave={(art) => {
            if (editingArtisan) {
              updateArtisan(art);
            } else {
              addArtisan(art);
            }
            setArtisanFormOpen(false);
            setEditingArtisan(null);
          }}
          onClose={() => { setArtisanFormOpen(false); setEditingArtisan(null); }}
        />
      )}

      {csvImportOpen && (
        <BusinessCsvImport onClose={() => setCsvImportOpen(false)} />
      )}

      {artisanCsvImportOpen && (
        <ArtisanCsvImport addArtisan={addArtisan} onClose={() => setArtisanCsvImportOpen(false)} />
      )}

      {adFormOpen && (
        <AdForm
          ad={editingAd}
          onSave={(ad) => {
            if (editingAd) {
              updateAd(ad);
            } else {
              addAd(ad);
            }
            setAdFormOpen(false);
            setEditingAd(null);
          }}
          onClose={() => { setAdFormOpen(false); setEditingAd(null); }}
        />
      )}
    </div>
  );
}
