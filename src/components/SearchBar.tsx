"use client";

import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, X, Navigation } from "lucide-react";
import clsx from "clsx";

interface SearchBarProps {
  large?: boolean;
  placeholder?: string;
  onSearch?: (q: string) => void;
  navigateTo?: string;
  initialValue?: string;
}

export function SearchBar({ large, placeholder, onSearch, navigateTo, initialValue = "" }: SearchBarProps) {
  const { t, isArabic } = useLang();
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navigateTo) {
      router.push(`${navigateTo}?q=${encodeURIComponent(query)}`);
    } else {
      onSearch?.(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={clsx(
      "relative flex items-center bg-white rounded-2xl border border-emerald-200 overflow-hidden",
      large ? "shadow-xl" : "shadow-md",
    )}>
      <Search size={20} className={clsx("absolute text-navy-400", isArabic ? "right-4" : "left-4")} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || t.searchPlaceholder}
        className={clsx(
          "w-full bg-transparent outline-none text-navy-800",
          large ? "py-4 px-12 text-lg" : "py-3 px-12 text-sm",
          isArabic ? "pl-12 pr-4 text-right font-arabic" : "pr-12 pl-12"
        )}
      />
      <button
        type="submit"
        className={clsx(
          "absolute bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors rounded-xl",
          large ? "right-2 px-6 py-2.5" : "right-1.5 px-4 py-2 text-sm",
          isArabic ? "right-auto left-2" : ""
        )}
      >
        {t.filter}
      </button>
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(""); onSearch?.(""); }}
          className={clsx("absolute text-navy-400 hover:text-navy-600", isArabic ? "left-16" : "right-16")}
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
