"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const { t, lang, setLang } = useLang();
  const { user, login, register, googleLogin } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("resident");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError(lang === "ar" ? "كلمتا المرور غير متطابقتين" : "Les mots de passe ne correspondent pas");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError(lang === "ar" ? "كلمة المرور 6 أحرف على الأقل" : "Le mot de passe doit contenir au moins 6 caractères");
        setLoading(false);
        return;
      }
      const result = await register(name, email, password, role as any);
      if (!result.ok) {
        setError(result.error || "");
        setLoading(false);
        return;
      }
    } else {
      const result = await login(email, password);
      if (!result.ok) {
        setError(result.error || "");
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    router.push("/dashboard");
  };

  const handleGoogle = async () => {
    setLoading(true);
    await googleLogin();
    setLoading(false);
  };

  const roles = [
    { key: "resident", label: t.resident, icon: "👤" },
    { key: "merchant", label: t.merchant, icon: "🏪" },
    { key: "artisan", label: t.artisanUser, icon: "🔧" },
    { key: "jobseeker", label: t.jobseeker, icon: "💼" },
    { key: "employer", label: t.employer, icon: "🏢" },
  ];

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
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {loading ? "..." : (lang === "ar" ? "المتابعة مع Google" : "Continuer avec Google")}
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {lang === "ar" ? "أو" : "ou"}
              </span>
            </div>
          </div>

          <div className="flex bg-navy-50 rounded-lg p-1 mb-4">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "login" ? "bg-white shadow text-navy-800" : "text-navy-500"
              }`}
            >
              {t.login}
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "register" ? "bg-white shadow text-navy-800" : "text-navy-500"
              }`}
            >
              {t.register}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">{t.nameLabel}</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder={lang === "ar" ? "محمد أمين" : "Mohamed Amine"}
                />
              </div>
            )}

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">{t.roleLabel}</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRole(r.key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        role === r.key
                          ? "bg-primary-50 border-primary-300 text-primary-700"
                          : "bg-navy-50 border-emerald-200 text-navy-600 hover:bg-navy-100"
                      }`}
                    >
                      <span>{r.icon}</span>
                      <span className="truncate">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">{t.emailLabel}</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">{t.passwordLabel}</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">{t.confirmPassword}</label>
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : mode === "login" ? t.login : t.register}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-navy-500">
            {mode === "login"
              ? (lang === "ar" ? "ليس لديك حساب؟" : "Pas de compte ?")
              : (lang === "ar" ? "لديك حساب بالفعل؟" : "Déjà un compte ?")}
            {" "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              {mode === "login" ? t.register : t.login}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}