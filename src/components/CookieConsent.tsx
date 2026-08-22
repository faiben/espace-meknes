"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Shield } from "lucide-react";

const CONSENT_KEY = "espace-meknes-cookie-consent";

export function CookieConsent() {
  const { t, isArabic } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (value: "accepted" | "rejected") => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={`fixed bottom-0 inset-x-0 z-50 bg-navy-800 text-white px-4 py-4 ${isArabic ? "font-arabic" : ""}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Shield size={28} className="shrink-0 text-accent-400 mt-0.5" />
          <div>
            <h2 className="font-bold">{t.cookieConsentTitle}</h2>
            <p className="text-sm text-white/80 mt-1">
              {t.cookieConsentText}{" "}
              <Link href="/cookies" className="underline hover:text-accent-400 transition-colors">
                {t.cookieLearnMore}
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleConsent("accepted")}
            className="px-5 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
          >
            {t.cookieAccept}
          </button>
          <button
            onClick={() => handleConsent("rejected")}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            {t.cookieReject}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
