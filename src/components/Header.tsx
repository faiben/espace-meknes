"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Globe, Heart, User, LogOut, LayoutDashboard, Shield } from "lucide-react";
import clsx from "clsx";

const navLinks = [
  { key: "annuaire", href: "/annuaire" },
  { key: "artisans", href: "/artisans" },
  { key: "emplois", href: "/emplois" },
  { key: "contact", href: "/contact" },
];

export function Header() {
  const { t, isArabic, toggleLang } = useLang();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-navy-800 border-b border-navy-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Espace Meknès" className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={clsx(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-white bg-white/10"
                    : "text-white hover:text-accent-400 hover:bg-white/5"
                )}
              >
                {t[link.key as keyof typeof t] as string}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/favoris" className="p-2 rounded-lg text-emerald-200/50 hover:text-red-400 hover:bg-white/5 transition-colors">
              <Heart size={20} />
            </Link>

            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-medium text-emerald-200/70 hover:bg-white/10 transition-colors border border-emerald-700/30"
            >
              <Globe size={16} className="text-accent-400" />
              <span>{isArabic ? "FR" : "عربي"}</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors border border-emerald-700/30"
                >
                  <div className={clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold",
                    user.role === "admin" ? "bg-red-500" : "bg-primary-500"
                  )}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-emerald-100">{user.name.split(" ")[0]}</span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className={clsx(
                      "absolute top-full mt-2 w-56 bg-navy-800 rounded-xl border border-navy-600/50 shadow-2xl py-1 z-50",
                      isArabic ? "left-0" : "right-0"
                    )}>
                      <div className="px-4 py-3 border-b border-navy-600/50">
                        <p className="font-medium text-white text-sm">{user.name}</p>
                        <p className="text-xs text-emerald-200/50">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-600/20 text-primary-400 capitalize">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-100/80 hover:bg-white/5"
                      >
                        <LayoutDashboard size={16} /> {t.dashboard}
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                        >
                          <Shield size={16} /> {t.admin}
                        </Link>
                      )}
                      <Link
                        href="/favoris"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-100/80 hover:bg-white/5"
                      >
                        <Heart size={16} /> {t.favorites}
                      </Link>
                      <hr className="my-1 border-navy-600/50" />
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut size={16} /> {t.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-navy-900 bg-accent-400 hover:bg-accent-300 transition-colors shadow-sm"
              >
                <User size={16} />
                <span>{t.login}</span>
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-emerald-200/50 hover:bg-white/10"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-navy-700/50 bg-navy-800">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-100/70 hover:bg-white/5"
              >
                {t[link.key as keyof typeof t] as string}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-100/70 hover:bg-white/5">
                  {t.dashboard}
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10">
                    {t.admin}
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10">
                  {t.logout}
                </button>
              </>
            ) : (
              <Link href="/auth" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-accent-400 hover:bg-white/5">
                {t.login}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
