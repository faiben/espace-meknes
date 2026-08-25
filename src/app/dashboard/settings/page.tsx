"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Save, CheckCircle, User, Mail, Shield } from "lucide-react";
import clsx from "clsx";

export default function DashboardSettingsPage() {
  const { t, isArabic } = useLang();
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl border border-emerald-100 card-shadow p-10 max-w-md">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="text-xl font-bold text-navy-800 mb-2">{isArabic ? "يجب تسجيل الدخول" : "Connexion requise"}</h2>
          <button onClick={() => router.push("/auth")} className="mt-4 px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
            {t.login}
          </button>
        </div>
      </div>
    );
  }

  const roleLabel: Record<string, string> = {
    admin: isArabic ? "مدير" : "Administrateur",
    resident: t.resident,
    merchant: t.merchant,
    artisan: t.artisanUser,
    jobseeker: t.jobseeker,
    employer: t.employer,
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    await updateUser(user.id, { name: name.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-1 text-sm text-navy-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> {isArabic ? "العودة" : "Retour"}
      </button>

      <h1 className="text-2xl font-bold text-navy-800 mb-6">{t.accountSettings}</h1>

      <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">{t.nameLabel}</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-emerald-200 bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">{t.emailLabel || "Email"}</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-emerald-100 bg-navy-50 text-navy-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">{isArabic ? "الدور" : "Rôle"}</label>
          <div className="relative">
            <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              value={roleLabel[user.role] || user.role}
              disabled
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-emerald-100 bg-navy-50 text-navy-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!name.trim() || name.trim() === user.name}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} /> {t.saveChanges}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle size={14} /> {isArabic ? "تم الحفظ" : "Enregistré"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
