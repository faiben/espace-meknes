"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import { ArrowLeft, Shield, Lock, Mail, UserCheck, Database } from "lucide-react";

export default function ConfidentialitePage() {
  const { t, isArabic } = useLang();

  const collectedData = [
    {
      title: isArabic ? "للسكان" : "Pour les résidents",
      items: isArabic
        ? "الاسم الكامل، البريد الإلكتروني، رقم الهاتف."
        : "Nom complet, adresse e-mail, numéro de téléphone.",
    },
    {
      title: isArabic ? "للشركات والمؤسسات" : "Pour les entreprises",
      items: isArabic
        ? "اسم المؤسسة، العنوان، الفئة، رقم الهاتف."
        : "Nom de l\u2019entreprise, adresse, catégorie, numéro de téléphone.",
    },
    {
      title: isArabic ? "للحرفيين" : "Pour les artisans",
      items: isArabic
        ? "الاسم الكامل، التخصص، العنوان."
        : "Nom, spécialité, adresse.",
    },
  ];

  const purposes = [
    isArabic
      ? "ربط السكان بالشركات والحرفيين المحليين في مكناس."
      : "Mettre en relation les résidents avec les entreprises et artisans locaux de Meknès.",
    isArabic
      ? "نشر عروض العمل المتاحة بالمدينة."
      : "Diffuser les offres d\u2019emploi disponibles dans la ville.",
    isArabic
      ? "إدارة حسابات المستخدمين وتفضيلاتهم."
      : "Gérer les comptes utilisateurs et leurs préférences.",
  ];

  const legalBases = [
    isArabic
      ? "موافقة المستخدم (المادة 6 من القانون 09-08) عند ملء النماذج أو إنشاء حساب."
      : "Le consentement de l\u2019utilisateur (Art. 6 de la Loi 09-08) lors du remplissage des formulaires ou de la création d\u2019un compte.",
    isArabic
      ? "المصلحة المشروعة لتحسين جودة الخدمات المقدمة."
      : "L\u2019intérêt légitime pour l\u2019amélioration de nos services.",
  ];

  const rights = [
    {
      article: "Art. 7",
      name: isArabic ? "حق الاطلاع" : "Droit d\u2019accès",
      desc: isArabic
        ? "حقك في الاطلاع على جميع معطياتك الشخصية التي تتم معالجتها."
        : "Le droit d\u2019accéder à l\u2019ensemble de vos données personnelles faisant l\u2019objet d\u2019un traitement.",
    },
    {
      article: "Art. 8",
      name: isArabic ? "حق التصحيح" : "Droit de rectification",
      desc: isArabic
        ? "حقك في تصحيح أو تحديث المعطيات غير الدقيقة أو غير المكتملة."
        : "Le droit de faire rectifier ou compléter vos données inexactes ou incomplètes.",
    },
    {
      article: "Art. 9",
      name: isArabic ? "حق الاعتراض" : "Droit d\u2019opposition",
      desc: isArabic
        ? "حقك في الاعتراض على معالجة معطياتك لأسباب مشروعة."
        : "Le droit de vous opposer au traitement de vos données pour des motifs légitimes.",
    },
    {
      article: "",
      name: isArabic ? "حق حذف المعطيات" : "Droit à la suppression",
      desc: isArabic
        ? "حقك في طلب الحذف النهائي لجميع معطياتك."
        : "Le droit de demander la suppression définitive de vos données.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors mb-6">
        <ArrowLeft size={18} />
        <span>{t.home}</span>
      </Link>

      <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 md:p-10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 text-primary-600 shrink-0">
            <Lock size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-navy-800">
              {isArabic ? "سياسة الخصوصية" : "Politique de Confidentialité"}
            </h1>
            <p className="text-sm text-navy-500 mt-1">
              {isArabic ? "آخر تحديث: 21 أغسطس 2026" : "Dernière mise à jour : 21 août 2026"}
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Section 1 - Data controller */}
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-4">
              {isArabic ? "المسؤول عن المعالجة" : "Responsable du traitement"}
            </h2>
            <div className="bg-navy-50 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <UserCheck size={20} className="text-primary-600 mt-1 shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold text-navy-800">Espace Meknès</p>
                  <p className="text-navy-600">Meknès, Maroc</p>
                  <a href="mailto:contact@espacemeknes.ma" className="text-primary-600 hover:text-primary-700 transition-colors">
                    contact@espacemeknes.ma
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 - Data collected */}
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-4">
              {isArabic ? "البيانات المجمّعة" : "Données collectées"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {collectedData.map((data, index) => (
                <div key={index} className="bg-navy-50 rounded-xl p-5">
                  <Database size={20} className="text-primary-600 mb-3" />
                  <h3 className="font-bold text-navy-800 mb-2">{data.title}</h3>
                  <p className="text-sm text-navy-600 leading-relaxed">{data.items}</p>
                </div>
              ))}
            </div>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "تُجمَع هذه البيانات عبر النماذج المتوفرة في الموقع ويتم تخزينها محلياً في متصفحك عبر localStorage."
                : "Ces données sont collectées via les formulaires du site et stockées localement dans votre navigateur via le localStorage."}
            </p>
          </section>

          {/* Section 3 - Purposes */}
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-4">
              {isArabic ? "أغراض المعالجة" : "Finalités du traitement"}
            </h2>
            <ul className="space-y-2 mb-5">
              {purposes.map((purpose, index) => (
                <li key={index} className="flex items-start gap-2 text-navy-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                  <span>{purpose}</span>
                </li>
              ))}
            </ul>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "لا نقوم بأي تنميط لسلوك المستخدمين ولا نتخذ أي قرارات آلية بناءً على معطياتك."
                : "Aucun profilage des utilisateurs n\u2019est effectué et aucune décision automatisée n\u2019est prise sur la base de vos données."}
            </p>
          </section>

          {/* Section 4 - Legal basis */}
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-4">
              {isArabic ? "الأساس القانوني" : "Base légale"}
            </h2>
            <ul className="space-y-2">
              {legalBases.map((legal, index) => (
                <li key={index} className="flex items-start gap-2 text-navy-600 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                  <span>{legal}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5 - Recipients */}
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "المستلمون للمعطيات" : "Destinataires des données"}
            </h2>
            <p className="text-navy-600 leading-relaxed mb-3">
              {isArabic
                ? "تبقى جميع معطياتك مخزنة محلياً في متصفحك عبر localStorage ولا يتم إرسالها أبداً إلى أي خوادم خارجية."
                : "Toutes vos données restent stockées localement dans votre navigateur via le localStorage et ne sont jamais transmises à des serveurs externes."}
            </p>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "لا تتم أبداً مشاركة معطياتك مع أي أطراف ثالثة، ولا يتم نقل أي معطيات خارج المغرب."
                : "Vos données ne sont jamais partagées avec des tiers et aucune donnée n\u2019est transférée hors du Maroc."}
            </p>
          </section>

          {/* Section 6 - Retention period */}
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "مدة الاحتفاظ" : "Durée de conservation"}
            </h2>
            <p className="text-navy-600 leading-relaxed mb-3">
              {isArabic
                ? "يتم الاحتفاظ بمعطيات حسابك طوال فترة نشاطه. تبقى البيانات المخزنة في localStorage حتى تقوم بحذفها من إعدادات متصفحك أو حتى تحذف حسابك."
                : "Les données liées à votre compte sont conservées tant que celui-ci reste actif. Les données stockées dans le localStorage le sont jusqu\u2019à ce que vous les effaciez depuis votre navigateur ou que vous supprimiez votre compte."}
            </p>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "أما البيانات التحليلية فلا يتم الاحتفاظ بها لمدة تتجاوز 6 أشهر، وفقاً لتعليمات اللجنة الوطنية لحماية المعطيات ذات الطابع الشخصي."
                : "Les données analytiques ne sont pas conservées au-delà de 6 mois maximum, conformément aux recommandations de la CNDP."}
            </p>
          </section>

          {/* Section 7 - Your rights */}
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-4">
              {isArabic ? "حقوقك" : "Vos droits"}
            </h2>
            <p className="text-navy-600 leading-relaxed mb-4">
              {isArabic
                ? "وفقاً للقانون 09-08، تتوفر لديك الحقوق التالية:"
                : "Conformément à la Loi 09-08, vous disposez des droits suivants :"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {rights.map((right, index) => (
                <div key={index} className="bg-navy-50 rounded-xl p-5">
                  {right.article && (
                    <span className="inline-block px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-xs font-semibold mb-2">
                      {right.article}
                    </span>
                  )}
                  <h3 className="font-bold text-navy-800 mb-2">{right.name}</h3>
                  <p className="text-sm text-navy-600 leading-relaxed">{right.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "يمكنك ممارسة هذه الحقوق في أي وقت عبر مراسلتنا على البريد الإلكتروني التالي:"
                : "Vous pouvez exercer ces droits à tout moment en nous écrivant à l\u2019adresse suivante :"}{" "}
              <a href="mailto:contact@espacemeknes.ma" className="text-primary-600 hover:text-primary-700 transition-colors">
                contact@espacemeknes.ma
              </a>
            </p>
          </section>

          {/* Section 8 - Security */}
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "أمن المعطيات" : "Sécurité"}
            </h2>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "نضع تدابير تقنية وتنظيمية مناسبة لحماية معطياتك الشخصية من الفقدان أو الوصول غير المصرح به، وفقاً للمادتين 23 و24 من القانون 09-08."
                : "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte ou tout accès non autorisé, conformément aux articles 23 et 24 de la Loi 09-08."}
            </p>
          </section>

          {/* Section 9 - Modifications */}
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "تعديل سياسة الخصوصية" : "Modification de la politique de confidentialité"}
            </h2>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "قد يتم تحديث سياسة الخصوصية هذه من وقت لآخر. سيتم إشعارك بأي تغييرات عبر الموقع، ونحن نحثكم على مراجعتها بانتظام."
                : "La présente politique de confidentialité peut être mise à jour de temps en temps. Vous serez informé de toute modification via le site, et nous vous invitons à la consulter régulièrement."}
            </p>
          </section>

          {/* Compliance banner */}
          <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl p-4">
            <Shield size={24} className="text-primary-600 shrink-0" />
            <p className="font-medium text-primary-700">
              {isArabic
                ? "هذه السياسة مطابقة للقانون 09-08 ولقرارات اللجنة الوطنية لحماية المعطيات ذات الطابع الشخصي"
                : "Conforme à la Loi 09-08 et aux délibérations de la CNDP"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-emerald-100 mt-10 pt-6 flex items-center justify-center gap-2">
          <Mail size={16} className="text-primary-600" />
          <a href="mailto:contact@espacemeknes.ma" className="text-primary-600 hover:text-primary-700 transition-colors">
            contact@espacemeknes.ma
          </a>
        </div>
      </div>
    </div>
  );
}
