"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Lang } from "@/types";
import translations from "@/i18n";

interface LanguageContextType {
  lang: Lang;
  t: typeof translations.fr;
  toggleLang: () => void;
  setLang: (l: Lang) => void;
  isArabic: boolean;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "fr" ? "ar" : "fr"));
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
  }, []);

  const value: LanguageContextType = {
    lang,
    t: translations[lang],
    toggleLang,
    setLang,
    isArabic: lang === "ar",
    dir: lang === "ar" ? "rtl" : "ltr",
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
}
