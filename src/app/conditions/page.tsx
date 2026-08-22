"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import { ArrowLeft, FileText, Scale, Shield, Mail, AlertTriangle } from "lucide-react";

export default function ConditionsPage() {
  const { t, isArabic } = useLang();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors mb-6">
        <ArrowLeft size={18} />
        <span>{t.home}</span>
      </Link>

      <div className="bg-white rounded-2xl border border-emerald-100 card-shadow p-6 md:p-10">
        <div className="flex items-start gap-4 mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 text-primary-600 shrink-0">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-navy-800">
              {isArabic ? "شروط الاستخدام" : "Conditions d\u2019Utilisation"}
            </h1>
            <p className="text-sm text-navy-500 mt-1">
              {isArabic ? "آخر تحديث: 21 أغسطس 2026" : "Dernière mise à jour : 21 août 2026"}
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "الموضوع" : "Objet"}
            </h2>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "تحكم هذه الشروط استخدامك لموقع espacemeknes.ma. باستخدام الموقع، أنت توافق على هذه الشروط."
                : "Les présentes conditions régissent votre utilisation du site espacemeknes.ma. En utilisant le site, vous acceptez ces conditions."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "وصف الخدمة" : "Description du service"}
            </h2>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "سباس مكناس هو منصة تربط سكان مكناس بالتجار والحرفيين المحليين وفرص العمل. الموقع ثنائي اللغة (فرنسي/عربي). التصفح مجاني، والتسجيل اختياري للنشر."
                : "Espace Meknès est une plateforme reliant les résidents de Meknès aux commerces locaux, artisans et offres d\u2019emploi. Le site est bilingue (français/arabe). La consultation est gratuite, l\u2019inscription est optionnelle pour publier."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "الحساب" : "Inscription et compte"}
            </h2>
            <p className="text-navy-600 leading-relaxed mb-3">
              {isArabic
                ? "يجب عليك تقديم معلومات دقيقة عند التسجيل. حساب واحد لكل شخص. أنت مسؤول عن بيانات الاتصال الخاصة بك."
                : "Vous devez fournir des informations exactes lors de l\u2019inscription. Un seul compte par personne. Vous êtes responsable de vos identifiants de connexion."}
            </p>
            <div className="flex items-start gap-2 bg-navy-50 rounded-xl p-4">
              <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm text-navy-600">
                {isArabic
                  ? "يحتفظ المسؤولون بالحق في تعليق الحسابات التي تنتهك هذه الشروط."
                  : "L\u2019administration se réserve le droit de suspendre les comptes enfreignant ces conditions."}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "استخدام الموقع" : "Utilisation du site"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-navy-50 rounded-xl p-5">
                <h3 className="font-bold text-navy-800 mb-2">{isArabic ? "المسموح به" : "Autorisé"}</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-navy-600">
                  <li>{isArabic ? "التصفح والبحث" : "Consulter et rechercher"}</li>
                  <li>{isArabic ? "التواصل مع التجار والحرفيين" : "Contacter des commerces et artisans"}</li>
                  <li>{isArabic ? "التقديم على عروض العمل" : "Postuler à des offres d\u2019emploi"}</li>
                  <li>{isArabic ? "نشر مراجعات وآراء حقيقية" : "Laisser des avis sincères"}</li>
                </ul>
              </div>
              <div className="bg-navy-50 rounded-xl p-5">
                <h3 className="font-bold text-navy-800 mb-2">{isArabic ? "الممنوع" : "Interdit"}</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-navy-600">
                  <li>{isArabic ? "الرسائل غير المرغوب فيها" : "Spam et sollicitations"}</li>
                  <li>{isArabic ? "القوائم المزيفة" : "Annonces fictives"}</li>
                  <li>{isArabic ? "المحتوى غير القانوني" : "Contenu illégal"}</li>
                  <li>{isArabic ? "نسخ أو استخراج البيانات" : "Scraping ou extraction de données"}</li>
                  <li>{isArabic ? "انتحال الهوية" : "Usurpation d\u2019identité"}</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "المحتوى المُنشأ من المستخدمين" : "Contenu généré par les utilisateurs"}
            </h2>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "المستخدمون مسؤولون عن المحتوى الذي ينشرونه (مراجعات، إعلانات عمل، مطالبات تجارية). تحتفظ المنصة بالحق في حذف المحتوى غير اللائق."
                : "Les utilisateurs sont responsables du contenu qu\u2019ils publient (avis, offres d\u2019emploi, réclamations de commerces). La plateforme se réserve le droit de supprimer le contenu inapproprié."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "المال الفكرية" : "Propriété intellectuelle"}
            </h2>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "محتوى الموقع (التصميم، الكود، الشعارات) ينتمي إلى سباس مكناس. يحتفظ المستخدمون بحقوق محتواهم الشخصي."
                : "Le contenu du site (design, code, logos) appartient à Espace Meknès. Les utilisateurs conservent les droits sur leur contenu personnel."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "مسؤولية محدودة" : "Limitation de responsabilité"}
            </h2>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "تقع المنصة بمنزلة وسيط. غير مسؤولة عن جودة الخدمات المقدمة من التجار والحرفيين المدرجين. يجب على المستخدمين التحقق من المعلومات بشكل مستقل."
                : "La plateforme agit en qualité d\u2019intermédiaire. Elle n\u2019est pas responsable de la qualité des services des commerces et artisans inscrits. Les utilisateurs doivent vérifier les informations de manière indépendante."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "البيانات الشخصية" : "Données personnelles"}
            </h2>
            <p className="text-navy-600 leading-relaxed mb-3">
              {isArabic
                ? "تخضع البيانات الشخصية للقانون 09-08."
                : "Les données personnelles sont régies par la Loi 09-08."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/confidentialite" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                {isArabic ? "سياسة الخصوصية" : "Politique de confidentialité"}
              </Link>
              <span className="text-navy-300">|</span>
              <Link href="/cookies" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                {isArabic ? "سياسة الكوكيز" : "Politique de cookies"}
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "تعديل الشروط" : "Modification des conditions"}
            </h2>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "قد يتم تعديل هذه الشروط في أي وقت. يُعتبر استمرارك في استخدام الموقع قبولاً للشروط المحدّثة."
                : "Ces conditions peuvent être modifiées à tout moment. La poursuite de votre utilisation du site vaut acceptation des conditions mises à jour."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-800 mb-3">
              {isArabic ? "القانون المطبق" : "Droit applicable"}
            </h2>
            <p className="text-navy-600 leading-relaxed">
              {isArabic
                ? "يخضع الموقع للقانون المغربي. تُحل النزاعات إلى ولاية المحاكم المختصة بمكناس."
                : "Le site est soumis au droit marocain. Les litiges sont soumis à la juridiction compétente de Meknès."}
            </p>
          </section>

          {/* Compliance Banner */}
          <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl p-4">
            <Scale size={24} className="text-primary-600 shrink-0" />
            <p className="font-medium text-primary-700">
              {isArabic
                ? "المنصة متوافقة مع القانون المغربي والقانون 09-08"
                : "Plateforme conforme au droit marocain et à la Loi 09-08"}
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
