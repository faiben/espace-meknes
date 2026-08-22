"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import clsx from "clsx";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const { t, isArabic } = useLang();
  const { user, login, register } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "resident" as string });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (form.password !== form.confirmPassword) {
        setError(isArabic ? "كلمتا المرور غير متطابقتين" : "Les mots de passe ne correspondent pas");
        return;
      }
      if (form.password.length < 6) {
        setError(isArabic ? "كلمة المرور 6 أحرف على الأقل" : "Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
      const result = await register(form.name, form.email, form.password, form.role as any);
      if (!result.ok) { setError(result.error || ""); return; }
    } else {
      const result = await login(form.email, form.password);
      if (!result.ok) { setError(result.error || ""); return; }
    }
    setSubmitted(true);
  };

  const roles = [
    { key: "resident", label: t.resident, icon: "👤" },
    { key: "merchant", label: t.merchant, icon: "🏪" },
    { key: "artisan", label: t.artisanUser, icon: "🔧" },
    { key: "jobseeker", label: t.jobseeker, icon: "💼" },
    { key: "employer", label: t.employer, icon: "🏢" },
  ];

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl border border-emerald-100 card-shadow p-10 max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-navy-800 mb-2">{t.welcomeBack} !</h2>
          <p className="text-navy-500 mb-4">{isArabic ? "تم تسجيل الدخول بنجاح" : "Connexion réussie"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            {t.dashboard}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl gradient-meknes flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl">EM</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-800">
            {mode === "login" ? t.loginTitle : t.registerTitle}
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6">
          <div className="flex bg-navy-50 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={clsx("flex-1 py-2 rounded-md text-sm font-medium transition-colors", mode === "login" ? "bg-white text-navy-800 shadow" : "text-navy-500")}
            >
              {t.login}
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={clsx("flex-1 py-2 rounded-md text-sm font-medium transition-colors", mode === "register" ? "bg-white text-navy-800 shadow" : "text-navy-500")}
            >
              {t.register}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">{t.nameLabel}</label>
                  <input
                    required type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                    placeholder={isArabic ? "محمد أمين" : "Mohamed Amine"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">{t.roleLabel}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setForm({ ...form, role: r.key })}
                        className={clsx(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                          form.role === r.key
                            ? "bg-primary-50 border-primary-300 text-primary-700"
                            : "bg-navy-50 border-emerald-200 text-navy-600 hover:bg-navy-50"
                        )}
                      >
                        <span>{r.icon}</span>
                        <span className="truncate">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">{t.emailLabel}</label>
              <input
                required type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">{t.passwordLabel}</label>
              <input
                required type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">{t.confirmPassword}</label>
                <input
                  required type="password" value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                />
              </div>
            )}

            <button type="submit" className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
              {mode === "login" ? t.login : t.register}
            </button>
          </form>

          {mode === "login" && (
            <div className="mt-4 p-3 rounded-lg bg-navy-50 text-xs text-navy-500">
              <p className="font-medium text-navy-700 mb-1">
                {isArabic ? "حساب المدير الافتراضي:" : "Compte admin par défaut :"}
              </p>
              <p>Email: <span className="font-mono text-primary-600">admin@espace-meknes.ma</span></p>
              <p>Mot de passe: <span className="font-mono text-primary-600">admin123</span></p>
            </div>
          )}

          <div className="text-center mt-4 text-sm text-navy-500">
            {mode === "login" ? t.noAccount : t.hasAccount}{" "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="text-primary-600 font-medium hover:text-primary-700">
              {mode === "login" ? t.register : t.login}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
