"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { useAppSettings } from "@/hooks/useAppSettings";
import { BusinessCategory, PackageType, PaymentMethod } from "@/types";
import { areas } from "@/data";
import {
  CheckCircle, Zap, Crown, ArrowLeft, Store, ChevronDown,
  Banknote, CreditCard, Building2,
} from "lucide-react";
import clsx from "clsx";

type Step = "plan" | "account" | "details" | "payment" | "done";

const categoryOptions: BusinessCategory[] = [
  "restaurant", "cafe", "boulangerie", "pharmacie", "coiffeur", "epicerie",
  "artisanat", "dentiste", "clinique", "medecin", "avocat", "immobilier",
  "garage", "electronique", "vetements", "education", "sport", "beaute",
  "hotel", "droguerie", "location_voiture", "autre"
];

const plans = [
  {
    id: "free" as PackageType,
    icon: Store,
    iconBg: "bg-emerald-100 text-primary-600",
    price: 0,
    label: { fr: "Gratuit", ar: "مجاني" },
    desc: { fr: "Pour commencer", ar: "للبدء" },
    features: {
      fr: [
        "Fiche commerce dans l'annuaire",
        "1 photo maximum",
        "Numéro de téléphone visible",
        "Catégorie et quartier",
      ],
      ar: [
        "صفحة تجارية في الدليل",
        "صورة واحدة كحد أقصى",
        "رقم الهاتف مرئي",
        "الفئة والحي",
      ],
    },
    cta: { fr: "Commencer gratuitement", ar: "ابدأ مجاناً" },
  },
  {
    id: "pro" as PackageType,
    icon: Zap,
    iconBg: "bg-blue-100 text-blue-600",
    price: 99,
    label: { fr: "Pro", ar: "برو" },
    desc: { fr: "Pour les commerces ambitieux", ar: "للتجار الطموحين" },
    features: {
      fr: [
        "Fiche prioritaire dans les résultats",
        "Jusqu'à 3 photos",
        "Vidéo YouTube intégrée",
        "Bouton WhatsApp direct",
        "Bouton Itinéraire Google Maps",
        "Badge « Pro » sur la fiche",
        "Lien email et site web",
      ],
      ar: [
        "صفحة مميزة في نتائج البحث",
        "حتى 3 صور",
        "فيديو يوتيوب مدمج",
        "زر واتساب مباشر",
        "زر الاتجاهات على خرائط جوجل",
        "شارة « برو » على الصفحة",
        "رابط البريد الإلكتروني والموقع",
      ],
    },
    cta: { fr: "Passer au Pro — 99 DH/mois", ar: "اشترك برو — 99 درهم/شهر" },
    popular: true,
  },
  {
    id: "premium" as PackageType,
    icon: Crown,
    iconBg: "bg-amber-100 text-amber-600",
    price: 159,
    label: { fr: "Premium", ar: "بريميوم" },
    desc: { fr: "Pour les pros de Meknès", ar: "للكفاءات في مكناس" },
    features: {
      fr: [
        "Tout le plan Pro inclus",
        "Photos illimitées",
        "Vidéo intégrée",
        "Mise en avant sur la page d'accueil",
        "Badge « Premium Premium » doré",
        "Position dans les résultats les plus élevés",
        "Statistiques et analyse de vues",
        "Support prioritaire",
      ],
      ar: [
        "جميع مميزات برو",
        "صور غير محدودة",
        "فيديو مدمج",
        "ظهور في الصفحة الرئيسية",
        "شارة « بريميوم » ذهبية",
        "أعلى مرتبة في نتائج البحث",
        "إحصائيات وتحليل المشاهدات",
        "دعم أولوي",
      ],
    },
    cta: { fr: "Passer au Premium — 159 DH/mois", ar: "اشترك بريميوم — 159 درهم/شهر" },
  },
];

export default function BusinessRegisterPage() {
  const { t, isArabic } = useLang();
  const { user, register } = useAuth();
  const { addBusiness } = useBusinessStore();
  const { settings } = useAppSettings();
  const router = useRouter();

  const [step, setStep] = useState<Step>("plan");
  const [selectedPlan, setSelectedPlan] = useState<PackageType>("free");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [error, setError] = useState("");

  const [account, setAccount] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [form, setForm] = useState({
    nameFr: "",
    nameAr: "",
    descriptionFr: "",
    descriptionAr: "",
    category: "restaurant" as BusinessCategory,
    areaId: areas[0]?.id || "medina",
    address: "",
    phone: "",
    email: "",
    website: "",
    whatsapp: "",
  });

  useEffect(() => {
    if (user && step === "account") {
      setStep("details");
    }
  }, [user, step]);

  const plan = plans.find((p) => p.id === selectedPlan)!;

  function handlePlanSelect(id: PackageType) {
    setSelectedPlan(id);
  }

  function handlePlanConfirm() {
    if (user) {
      setStep("details");
    } else {
      setStep("account");
    }
  }

  async function handleAccountSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (account.password !== account.confirmPassword) {
      setError(isArabic ? "كلمتا المرور غير متطابقتين" : "Les mots de passe ne correspondent pas");
      return;
    }
    if (account.password.length < 6) {
      setError(isArabic ? "كلمة المرور 6 أحرف على الأقل" : "Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    const result = await register(account.name, account.email, account.password, "merchant");
    if (!result.ok) {
      setError(result.error || "");
      return;
    }
    setStep("details");
  }

  function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.nameFr.trim()) {
      setError(isArabic ? "أدخل اسم بالفرنسية" : "Veuillez saisir un nom en français");
      return;
    }
    if (!form.phone.trim()) {
      setError(isArabic ? "أدخل رقم الهاتف" : "Veuillez saisir un numéro de téléphone");
      return;
    }

    if (selectedPlan === "free") {
      submitBusiness("cash");
    } else {
      setStep("payment");
    }
  }

  function submitBusiness(method: PaymentMethod) {
    const newBusiness = {
      id: `biz-${Date.now()}`,
      nameFr: form.nameFr.trim(),
      nameAr: form.nameAr.trim() || form.nameFr.trim(),
      descriptionFr: form.descriptionFr.trim() || "",
      descriptionAr: form.descriptionAr.trim() || "",
      category: form.category,
      areaId: form.areaId,
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      website: form.website.trim(),
      whatsapp: form.whatsapp.trim(),
      lat: 34.0331,
      lng: -5.5473,
      rating: 0,
      reviewCount: 0,
      isSponsored: selectedPlan === "premium",
      packageType: selectedPlan,
      paymentMethod: method,
      createdAt: new Date().toISOString().split("T")[0],
      userId: user?.id,
    };

    addBusiness(newBusiness as any);
    setStep("done");
  }

  return (
    <div className="min-h-[70vh] bg-[#EEF3F9]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-600 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {step !== "plan" && step !== "done" && (
            <button
              onClick={() => setStep(step === "account" ? "plan" : "account")}
              className="inline-flex items-center gap-1 text-sm text-emerald-200 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={16} /> {isArabic ? "رجوع" : "Retour"}
            </button>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            {isArabic ? "سجّل متجرك على منصة مكناس" : "Inscrivez votre commerce sur Meknès"}
          </h1>
          <p className="text-emerald-100 text-lg max-w-xl mx-auto">
            {isArabic
              ? "انضم لآلاف التجار واستفد من وصول مئات الزوار يومياً"
              : "Rejoignez des milliers de commerçants et touvez des centaines de clients chaque jour"}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Step: Plan selection */}
        {step === "plan" && (
          <>
            <h2 className="text-2xl font-bold text-navy-800 text-center mb-8">
              {isArabic ? "اختر خطتك" : "Choisissez votre formule"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {plans.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handlePlanSelect(p.id)}
                  className={clsx(
                    "relative bg-white rounded-2xl p-6 text-center cursor-pointer transition-all duration-200",
                    selectedPlan === p.id
                      ? "border-2 border-primary-500 ring-2 ring-primary-100 shadow-lg scale-[1.02]"
                      : "border border-gray-200 hover:border-primary-300 shadow-sm",
                    p.popular && "md:-mt-2"
                  )}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                        {isArabic ? "الأكثر طلباً" : "Le plus populaire"}
                      </span>
                    </div>
                  )}
                  <div className={clsx("w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4", p.iconBg)}>
                    <p.icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-navy-800">{isArabic ? p.label.ar : p.label.fr}</h3>
                  <p className="text-sm text-navy-500 mb-3">{isArabic ? p.desc.ar : p.desc.fr}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-primary-600">
                      {p.price === 0 ? (isArabic ? "مجاني" : "Gratuit") : `${p.price}`}
                    </span>
                    {p.price > 0 && (
                      <span className="text-sm text-navy-400 ml-1">DH/{isArabic ? "شهر" : "mois"}</span>
                    )}
                  </div>
                  <ul className="text-left space-y-2 mb-6">
                    {(isArabic ? p.features.ar : p.features.fr).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-navy-600">
                        <CheckCircle size={14} className="text-primary-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(p.id);
                      handlePlanConfirm();
                    }}
                    className={clsx(
                      "w-full py-2.5 rounded-lg text-sm font-medium transition-colors",
                      selectedPlan === p.id
                        ? "bg-primary-600 text-white hover:bg-primary-700"
                        : "bg-navy-50 text-navy-700 hover:bg-navy-100"
                    )}
                  >
                    {isArabic ? p.cta.ar : p.cta.fr}
                  </button>
                </div>
              ))}
            </div>

            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-emerald-100 p-6 text-center">
              <h3 className="font-bold text-navy-800 mb-2">
                {isArabic ? "كيف يعمل؟" : "Comment ça marche ?"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-navy-600 mt-4">
                <div>
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                  <p className="font-medium text-navy-800 mb-1">{isArabic ? "اختر الخطّة" : "Choisissez la formule"}</p>
                  <p className="text-navy-500 text-xs">{isArabic ? "مجاني، برو، أو بريميوم" : "Gratuit, Pro ou Premium"}</p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                  <p className="font-medium text-navy-800 mb-1">{isArabic ? "أدخل بيانات المتجر" : "Renseignez votre commerce"}</p>
                  <p className="text-navy-500 text-xs">{isArabic ? "الاسم، الفئة، العنوان..." : "Nom, catégorie, adresse..."}</p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                  <p className="font-medium text-navy-800 mb-1">{isArabic ? "انشر وانطلق!" : "Publiez et c&apos;est parti!"}</p>
                  <p className="text-navy-500 text-xs">{isArabic ? "الفعل في الدليل مباشرة" : "Immédiatement dans l&apos;annuaire"}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step: Account creation */}
        {step === "account" && (
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-emerald-100 p-6">
            <h2 className="text-xl font-bold text-navy-800 mb-1 text-center">
              {isArabic ? "أنشئ حسابك" : "Créez votre compte"}
            </h2>
            <p className="text-sm text-navy-500 text-center mb-6">
              {isArabic ? "حسابكم يُربط بمتجرك ليتمكنك من إدارة الفعل" : "Votre compte sera lié à votre commerce pour la gestion"}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">{t.nameLabel}</label>
                <input
                  required type="text" value={account.name}
                  onChange={(e) => setAccount({ ...account, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                  placeholder={isArabic ? "محمد أمين" : "Mohamed Amine"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">{t.emailLabel}</label>
                <input
                  required type="email" value={account.email}
                  onChange={(e) => setAccount({ ...account, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">{t.passwordLabel}</label>
                <input
                  required type="password" value={account.password}
                  onChange={(e) => setAccount({ ...account, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">{t.confirmPassword}</label>
                <input
                  required type="password" value={account.confirmPassword}
                  onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
                {isArabic ? "أنشئ الحساب" : "Créer le compte"}
              </button>
            </form>

            <div className="text-center mt-4 text-sm text-navy-500">
              {isArabic ? "لديك حساب بالفعل؟" : "Vous avez déjà un compte ?"}{" "}
              <button
                onClick={() => { setError(""); setStep("details"); }}
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                {isArabic ? "سجّل الدخول" : "Connectez-vous"}
              </button>
            </div>
          </div>
        )}

        {/* Step: Business details */}
        {step === "details" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 mb-4">
              <div className="flex items-center gap-3 mb-6">
                <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", plan.iconBg)}>
                  <plan.icon size={20} />
                </div>
                <div>
                  <p className="text-sm text-navy-500">{isArabic ? "الخطّة المختارة" : "Formule choisie"}</p>
                  <p className="font-bold text-navy-800">
                    {isArabic ? plan.label.ar : plan.label.fr}
                    {plan.price > 0 && <span className="text-primary-600 ml-1">{plan.price} DH/{isArabic ? "شهر" : "mois"}</span>}
                  </p>
                </div>
                <button
                  onClick={() => setStep("plan")}
                  className="ml-auto text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {isArabic ? "تغيير" : "Changer"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100 p-6">
              <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">
                {isArabic ? "بيانات المتجر" : "Informations du commerce"}
              </h2>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
              )}

              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">
                      {isArabic ? "الاسم بالفرنسية *" : "Nom en français *"}
                    </label>
                    <input
                      required type="text" value={form.nameFr}
                      onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                      placeholder="Ex: Pâtisserie Aziza"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">
                      {isArabic ? "الاسم بالعربية" : "Nom en arabe"}
                    </label>
                    <input
                      type="text" dir="rtl" value={form.nameAr}
                      onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                      placeholder="حلويات عزيزة"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {isArabic ? "الفئة" : "Catégorie"}
                  </label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as BusinessCategory })}
                      className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm appearance-none pr-8 bg-white"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {t.categories[cat]}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {isArabic ? "الحي / المنطقة *" : "Quartier / Ville *"}
                  </label>
                  <select
                    required value={form.areaId}
                    onChange={(e) => setForm({ ...form, areaId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm appearance-none pr-8 bg-white"
                  >
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {isArabic ? a.nameAr : a.nameFr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {isArabic ? "العنوان التفصيلي" : "Adresse complète"}
                  </label>
                  <input
                    type="text" value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                    placeholder={isArabic ? "شارع محمد الخامس، رقم 12" : "Rue Mohammed V, n°12"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">
                      {isArabic ? "رقم الهاتف *" : "Téléphone *"}
                    </label>
                    <input
                      required type="tel" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                      placeholder="05 99 XX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">
                      {isArabic ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <input
                      type="email" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                      placeholder="contact@moncommerce.ma"
                    />
                  </div>
                </div>

                {selectedPlan !== "free" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">
                        {isArabic ? "رقم الواتساب" : "WhatsApp"}
                      </label>
                      <input
                        type="tel" value={form.whatsapp}
                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                        placeholder="+212 6 XX XX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">
                        {isArabic ? "الموقع الإلكتروني" : "Site web"}
                      </label>
                      <input
                        type="url" value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm"
                        placeholder="https://www.moncommerce.ma"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {isArabic ? "وصف بالفرنسية" : "Description en français"}
                  </label>
                  <textarea
                    rows={3} value={form.descriptionFr}
                    onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm resize-none"
                    placeholder={isArabic ? "صف نشاطك باختصار" : "Décrivez brièvement votre activité"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    {isArabic ? "وصف بالعربية" : "Description en arabe"}
                  </label>
                  <textarea
                    rows={3} dir="rtl" value={form.descriptionAr}
                    onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm resize-none"
                    placeholder={isArabic ? "صف نشاطك باختصار" : "Décrivez brièvement votre activité"}
                  />
                </div>

                {selectedPlan === "premium" && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
                    {isArabic
                      ? "💎 الخطّة البريميوم تمنحك ظهوراً على الصفحة الرئيسية وشارة ذهبية. يمكنك لاحقاً إضافة الصور والفيديو من لوحة التحكم."
                      : "💎 Le plan Premium vous offre une mise en avant sur la page d&apos;accueil et un badge doré. Vous pourrez ajouter photos et vidéo depuis votre tableau de bord."}
                  </div>
                )}

                <button type="submit" className="w-full py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors text-lg">
                  {isArabic ? "نشر المتجر" : "Publier mon commerce"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === "payment" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", plan.iconBg)}>
                  <plan.icon size={20} />
                </div>
                <div>
                  <p className="text-sm text-navy-500">{isArabic ? "الخطّة المختارة" : "Formule choisie"}</p>
                  <p className="font-bold text-navy-800">
                    {isArabic ? plan.label.ar : plan.label.fr}
                    <span className="text-primary-600 ml-1">{plan.price} DH/{isArabic ? "شهر" : "mois"}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100 p-6">
              <h2 className="text-xl font-bold text-navy-800 mb-2 text-center">
                {isArabic ? "اختر طريقة الدفع" : "Choisissez votre mode de paiement"}
              </h2>
              <p className="text-sm text-navy-500 text-center mb-6">
                {isArabic ? "يمكنك تغيير طريقة الدفع لاحقاً من لوحة التحكم" : "Vous pourrez modifier le mode de paiement depuis votre tableau de bord"}
              </p>

              <div className="space-y-3 mb-6">
                {/* Cash */}
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={clsx(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                    paymentMethod === "cash"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300"
                  )}
                >
                  <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    paymentMethod === "cash" ? "bg-primary-100 text-primary-600" : "bg-navy-100 text-navy-500"
                  )}>
                    <Banknote size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-navy-800">{isArabic ? "الدفع نقداً" : "Paiement en espèces"}</p>
                    <p className="text-sm text-navy-500">
                      {isArabic ? "ادفع نقداً عند لقاء الممثل أو عبر التحويل" : "Payez en espèces lors de la rencontre ou par virement"}
                    </p>
                  </div>
                  <div className={clsx(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    paymentMethod === "cash" ? "border-primary-500" : "border-gray-300"
                  )}>
                    {paymentMethod === "cash" && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                  </div>
                </button>

                {/* Credit Card */}
                <button
                  onClick={() => setPaymentMethod("credit_card")}
                  className={clsx(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                    paymentMethod === "credit_card"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300"
                  )}
                >
                  <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    paymentMethod === "credit_card" ? "bg-primary-100 text-primary-600" : "bg-navy-100 text-navy-500"
                  )}>
                    <CreditCard size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-navy-800">{isArabic ? "بطاقة الائتمان" : "Carte bancaire"}</p>
                    <p className="text-sm text-navy-500">
                      {isArabic ? "الدفع بالبطاقة الائتمانية (قريباً)" : "Paiement par carte bancaire (bientôt disponible)"}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      {isArabic ? "قريباً" : "Coming soon"}
                    </span>
                  </div>
                  <div className={clsx(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    paymentMethod === "credit_card" ? "border-primary-500" : "border-gray-300"
                  )}>
                    {paymentMethod === "credit_card" && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                  </div>
                </button>

                {/* Bank Transfer */}
                <button
                  onClick={() => setPaymentMethod("bank_transfer")}
                  className={clsx(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                    paymentMethod === "bank_transfer"
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300"
                  )}
                >
                  <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    paymentMethod === "bank_transfer" ? "bg-primary-100 text-primary-600" : "bg-navy-100 text-navy-500"
                  )}>
                    <Building2 size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-navy-800">{isArabic ? "التحويل البنكي" : "Virement bancaire"}</p>
                    <p className="text-sm text-navy-500">
                      {isArabic ? "قم بالتحويل إلى حسابنا البنكي" : "Effectuez un virement vers notre compte bancaire"}
                    </p>
                  </div>
                  <div className={clsx(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    paymentMethod === "bank_transfer" ? "border-primary-500" : "border-gray-300"
                  )}>
                    {paymentMethod === "bank_transfer" && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                  </div>
                </button>
              </div>

              {/* Bank details when bank_transfer selected */}
              {paymentMethod === "bank_transfer" && settings.bankName && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <h4 className="font-bold text-navy-800 mb-3 text-sm">
                    {isArabic ? "معلومات التحويل البنكي" : "Coordonnées bancaires"}
                  </h4>
                  <div className="space-y-2 text-sm">
                    {settings.bankName && (
                      <div className="flex justify-between">
                        <span className="text-navy-500">{isArabic ? "البنك" : "Banque"}</span>
                        <span className="font-medium text-navy-800">{settings.bankName}</span>
                      </div>
                    )}
                    {settings.bankAccountHolder && (
                      <div className="flex justify-between">
                        <span className="text-navy-500">{isArabic ? "صاحب الحساب" : "Titulaire"}</span>
                        <span className="font-medium text-navy-800">{settings.bankAccountHolder}</span>
                      </div>
                    )}
                    {settings.bankIban && (
                      <div className="flex justify-between">
                        <span className="text-navy-500">IBAN</span>
                        <span className="font-medium text-navy-800">{settings.bankIban}</span>
                      </div>
                    )}
                    {settings.bankRib && (
                      <div className="flex justify-between">
                        <span className="text-navy-500">RIB</span>
                        <span className="font-medium text-navy-800">{settings.bankRib}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {paymentMethod === "bank_transfer" && !settings.bankName && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
                  {isArabic
                    ? "⚠️ لم يتم تكوين معلومات الحساب البنكي بعد. يرجى الاتصال بالإدارة."
                    : "⚠️ Les coordonnées bancaires n'ont pas encore été configurées. Veuillez contacter l'administration."}
                </div>
              )}

              {paymentMethod === "credit_card" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
                  {isArabic
                    ? "💳 الدفع بالبطاقة الائتمان غير متاح بعد. يرجى اختيار طريقة أخرى."
                    : "💳 Le paiement par carte bancaire n'est pas encore disponible. Veuillez choisir un autre mode."}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("details")}
                  className="flex-1 py-3 rounded-lg bg-navy-50 text-navy-700 font-medium hover:bg-navy-100 transition-colors"
                >
                  {isArabic ? "رجوع" : "Retour"}
                </button>
                <button
                  onClick={() => submitBusiness(paymentMethod)}
                  disabled={paymentMethod === "credit_card"}
                  className={clsx(
                    "flex-[2] py-3 rounded-lg font-medium transition-colors text-lg",
                    paymentMethod === "credit_card"
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  )}
                >
                  {isArabic ? "تأكيد ونشر المتجر" : "Confirmer et publier"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-emerald-100 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy-800 mb-2">
              {isArabic ? "مرحباً بك في منصة مكناس!" : "Bienvenue sur Espace Meknès !"}
            </h2>
            <p className="text-navy-500 mb-6">
              {isArabic
                ? "تم نشر متجرك بنجاح. يظهر الآن في الدليل ويمكن للزوار اكتشافه."
                : "Votre commerce a bien été publié. Il est maintenant visible dans l&apos;annuaire."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/annuaire")}
                className="px-6 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                {isArabic ? "تصفح الدليل" : "Voir l'annuaire"}
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2.5 rounded-lg bg-navy-50 text-navy-700 font-medium hover:bg-navy-100 transition-colors"
              >
                {t.dashboard}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
