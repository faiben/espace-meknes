"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import { Shield } from "lucide-react";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-navy-800 text-emerald-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Espace Meknès" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-white">{t.footerAboutText}</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.footerLinks}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/annuaire" className="text-white hover:text-accent-400 transition-colors">{t.annuaire}</Link></li>
              <li><Link href="/artisans" className="text-white hover:text-accent-400 transition-colors">{t.artisans}</Link></li>
              <li><Link href="/emplois" className="text-white hover:text-accent-400 transition-colors">{t.emplois}</Link></li>
              <li><Link href="/contact" className="text-white hover:text-accent-400 transition-colors">{t.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.help}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-white hover:text-accent-400 transition-colors">{t.contactTitle}</Link></li>
              <li><Link href="/publicite" className="text-white hover:text-accent-400 transition-colors">{t.advertisingTitle}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.footerLegal}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cookies" className="text-white hover:text-accent-400 transition-colors">{t.footerCookies || "Politique de cookies"}</Link></li>
              <li><Link href="/confidentialite" className="text-white hover:text-accent-400 transition-colors">{t.footerPrivacy}</Link></li>
              <li><Link href="/conditions" className="text-white hover:text-accent-400 transition-colors">{t.footerTerms}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700/50 mt-8 pt-8 text-center text-sm text-white">
          <div className="flex items-center justify-center gap-1 mb-2 text-primary-300 text-xs">
            <Shield size={12} />
            <span>{t.footerCompliance || "Conforme Loi 09-08 — CNDP"}</span>
          </div>
          &copy; 2026 {t.siteName}. {t.footerRights}.
        </div>
      </div>
    </footer>
  );
}
