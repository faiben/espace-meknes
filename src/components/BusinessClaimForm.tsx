"use client";

import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessClaimStore } from "@/hooks/useBusinessClaimStore";
import { useAppSettings } from "@/hooks/useAppSettings";
import { sendClaimEmail } from "@/lib/email";
import { Business, PackageType } from "@/types";
import { X, MessageCircle, CheckCircle } from "lucide-react";
import clsx from "clsx";

interface BusinessClaimFormProps {
  business: Business;
  onClose: () => void;
}

const packageOptions: PackageType[] = ["free", "pro", "premium"];

export function BusinessClaimForm({ business, onClose }: BusinessClaimFormProps) {
  const { t, isArabic } = useLang();
  const { user } = useAuth();
  const { addClaim, getClaimForBusiness } = useBusinessClaimStore();
  const { settings } = useAppSettings();
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("free");
  const [step, setStep] = useState<"form" | "verify" | "done">("form");

  const existingClaim = getClaimForBusiness(business.id);

  const handleClaim = () => {
    if (!user || !whatsapp.trim()) return;
    addClaim({
      businessId: business.id,
      businessName: isArabic ? business.nameAr : business.nameFr,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      whatsapp: whatsapp.trim(),
      requestedPackage: selectedPackage,
    });
    setStep("verify");
    if (settings.supportEmail) {
      sendClaimEmail(settings.supportEmail, {
        userName: user.name,
        userEmail: user.email,
        businessName: isArabic ? business.nameAr : business.nameFr,
        whatsapp: whatsapp.trim(),
        requestedPackage: selectedPackage,
      });
    }
  };

  const handleVerify = () => {
    const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(
      `Bonjour Espace Meknès ! Je confirme la réclamation du commerce "${isArabic ? business.nameAr : business.nameFr}" (ID: ${business.id}). Mon numéro WhatsApp: ${whatsapp}. Package choisi: ${selectedPackage}.`
    );
    const url = `https://wa.me/${cleanWhatsApp}?text=${message}`;
    window.open(url, "_blank");
    setStep("done");
  };

  if (existingClaim && existingClaim.status !== "rejected") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-navy-400 hover:bg-navy-50">
            <X size={20} />
          </button>
          <div className="text-center">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-bold text-navy-800 mb-2">
              {existingClaim.status === "pending" && (isArabic ? "طلب قيد المراجعة" : "Demande en cours")}
              {existingClaim.status === "verified" && (isArabic ? "تم التحقق" : "Vérifié")}
              {existingClaim.status === "approved" && (isArabic ? "تم القبول" : "Approuvé")}
            </h3>
            <p className="text-sm text-navy-500">
              {existingClaim.status === "pending" && (isArabic ? "سيتم مراجعة طلبك من قبل الإدارة" : "Votre demande est en cours de traitement par l'administration.")}
              {existingClaim.status === "verified" && (isArabic ? "تم التحقق من رقم الواتساب الخاص بك" : "Votre numéro WhatsApp a été vérifié.")}
              {existingClaim.status === "approved" && (isArabic ? "تم قبولك كمالك لهذا commerce" : "Vous êtes maintenant propriétaire de ce commerce.")}
            </p>
            <button onClick={onClose} className="mt-4 px-5 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
              {t.close}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="font-bold text-navy-800 text-lg">
            {isArabic ? "مطالبة بالتجارة" : "Réclamer ce commerce"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === "form" && (
            <div className="space-y-5">
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="font-medium text-navy-800">{isArabic ? business.nameAr : business.nameFr}</p>
                <p className="text-xs text-navy-500 mt-1">{isArabic ? business.address : business.address}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  {isArabic ? "رقم الواتساب (مطلوب)" : "Numéro WhatsApp (requis)"}
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+212 6XX XXX XXX"
                  className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  {isArabic ? "اختر الباقة" : "Choisir le package"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {packageOptions.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPackage(p)}
                      className={clsx(
                        "p-3 rounded-xl border-2 text-center transition-all",
                        selectedPackage === p
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-emerald-100 hover:border-emerald-200 text-navy-600"
                      )}
                    >
                      <span className="block text-lg mb-1">
                        {p === "premium" ? "⭐" : p === "pro" ? "★" : "📷"}
                      </span>
                      <span className="block text-xs font-medium">
                        {p === "premium" ? t.premiumPackage : p === "pro" ? t.proPackage : t.freePackage}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleClaim}
                disabled={!whatsapp.trim()}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle size={18} /> {isArabic ? "إرسال عبر الواتساب" : "Envoyer via WhatsApp"}
              </button>
            </div>
          )}

          {step === "verify" && (
            <div className="text-center space-y-4">
              <div className="text-5xl">📱</div>
              <h4 className="font-bold text-navy-800">
                {isArabic ? "تأكيد عبر الواتساب" : "Confirmation via WhatsApp"}
              </h4>
              <p className="text-sm text-navy-500">
                {isArabic
                  ? `سيتم إرسال رسالة تأكيد إلى ${whatsapp} من خلال الواتساب.`
                  : `Un message de confirmation sera envoyé au ${whatsapp} via WhatsApp.`}
              </p>
              <p className="text-xs text-navy-400">
                {isArabic
                  ? "يجب أن يكون لديك واتساب مثبت على هذا الرقم"
                  : "Vous devez avoir WhatsApp installé sur ce numéro"}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setStep("form")}
                  className="px-5 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-navy-50 transition-colors"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={16} /> {isArabic ? "فتح الواتساب" : "Ouvrir WhatsApp"}
                </button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="text-center space-y-4">
              <CheckCircle size={56} className="mx-auto text-green-500" />
              <h4 className="font-bold text-navy-800">
                {isArabic ? "تم الإرسال بنجاح!" : "Envoyé avec succès!"}
              </h4>
              <p className="text-sm text-navy-500">
                {isArabic
                  ? "سيتم مراجعة طلبك من قبل الإدارة. يمكنك متابعة حالة الطلب من حسابك."
                  : "Votre demande sera examinée par l'administration. Vous pouvez suivre l'état de votre demande depuis votre compte."}
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                {t.close}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
