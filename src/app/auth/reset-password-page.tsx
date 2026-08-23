"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import clsx from "clsx";

export default function ResetPasswordPage() {
  const { t, isArabic } = useLang();
  const { user, resetPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent(false);

    if (!email.trim()) {
      setError(isArabic ? "أدخل بريدك الإلكتروني" : "Enter your email");
      return;
    }

    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password-confirm`,
      });
      setSent(true);
    } catch (err) {
      setError(isArabic ? "فشل إرسال رابط إعادة الضبط" : "Failed to send reset link");
      console.error(err);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-emerald-600">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-navy-800 mb-2">
            {isArabic ? "رابط إعادة الضبط أرسل" : "Password reset link sent"}
          </h2>
          <p className="text-navy-500 mb-4">
            {isArabic ? "تم إرسال رابط إعادة ضبط كلمة المرور إلى بريدك الإلكتروني" : "A password reset link has been sent to your email"}
          </p>
          <button
            onClick={() => router.push("/auth")}
            className="px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
            {isArabic ? "العودة إلى تسجيل الدخول" : "Back to login"}
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
            {isArabic ? "إعادة ضبط كلمة المرور" : "Password Reset"}
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          }

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">
                {isArabic ? "البريد الإلكتروني" : "Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                placeholder={isArabic ? "faical@example.com" : "email@example.com"}
              />
            </div>

            <button type="submit" className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
              {isArabic ? "إرسال رابط إعادة الضبط" : "Send reset link"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}