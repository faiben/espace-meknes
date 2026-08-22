"use client";

import { useState, useRef } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useBusinessStore } from "@/hooks/useBusinessStore";
import { Business, BusinessCategory, PackageType } from "@/types";
import { areas } from "@/data";
import { Upload, FileText, CheckCircle, AlertCircle, X, ArrowLeft } from "lucide-react";
import clsx from "clsx";

const postalToArea: Record<string, string> = {
  "50000": "hamria",
  "50010": "ismailia",
  "50020": "el_bassatine",
  "50030": "medina",
  "50040": "toulal",
  "50050": "el_mansour",
  "50060": "agdal",
  "50070": "zitoune",
  "50080": "ouislane",
};

const validCategories: BusinessCategory[] = [
  "restaurant", "cafe", "boulangerie", "pharmacie", "coiffeur", "epicerie",
  "artisanat", "dentiste", "clinique", "medecin", "avocat", "immobilier",
  "garage", "electronique", "vetements", "education", "sport", "beaute",
  "hotel", "droguerie", "location_voiture", "autre"
];

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeCategory(val: string): BusinessCategory {
  const lower = val.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const map: Record<string, BusinessCategory> = {
    restaurant: "restaurant", cafe: "cafe", "café": "cafe",
    boulangerie: "boulangerie", pharmacie: "pharmacie",
    coiffeur: "coiffeur", epicerie: "epicerie", "épicerie": "epicerie",
    artisanat: "artisanat", artisan: "artisanat",
    dentiste: "dentiste", clinique: "clinique", medecin: "medecin",
    "médecin": "medecin", avocat: "avocat", immobilier: "immobilier",
    garage: "garage", electronique: "electronique", "électronique": "electronique",
    vetements: "vetements", "vêtements": "vetements",
    education: "education", "éducation": "education",
    sport: "sport", beaute: "beaute", "beauté": "beaute",
    hotel: "hotel", "hôtel": "hotel", droguerie: "droguerie",
    "location de voiture": "location_voiture", autre: "autre",
  };
  return map[lower] || "autre";
}

interface CsvRow {
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  category: BusinessCategory;
  areaId: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  whatsapp?: string;
  lat: string;
  lng: string;
  packageType: PackageType;
  postalCode?: string;
  raw: Record<string, string>;
  errors: string[];
}

interface BusinessCsvImportProps {
  onClose: () => void;
}

export function BusinessCsvImport({ onClose }: BusinessCsvImportProps) {
  const { t, isArabic } = useLang();
  const { addBusiness } = useBusinessStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [imported, setImported] = useState(0);

  const mapRow = (values: string[], headerMap: Record<string, number>): CsvRow => {
    const get = (key: string) => {
      const idx = headerMap[key.toLowerCase().replace(/\s+/g, "_")];
      return idx !== undefined ? (values[idx] || "").trim() : "";
    };
    const getAny = (keys: string[]) => {
      for (const k of keys) {
        const v = get(k);
        if (v) return v;
      }
      return "";
    };

    const postalCode = getAny(["postal_code", "postal", "code_postal", "codepostal", "zip"]);
    const areaFromPostal = postalToArea[postalCode] || "";
    const areaFromField = getAny(["area_id", "area", "areaId", "quartier", "ville"]);
    const areaId = areaFromPostal || areaFromField || "medina";

    const categoryRaw = getAny(["category", "categorie", "type", "secteur"]);
    const category = normalizeCategory(categoryRaw);

    const nameFr = getAny(["name_fr", "nom_fr", "name", "nom", "nom_commerce", "business_name"]);
    const nameAr = getAny(["name_ar", "nom_ar", "nom_arabe"]);
    const descriptionFr = getAny(["description_fr", "description", "desc_fr", "descriptif"]);
    const descriptionAr = getAny(["description_ar", "desc_ar"]);
    const address = getAny(["address", "adresse", "rue"]);
    const phone = getAny(["phone", "telephone", "tel", "gsm", "mobile"]);
    const email = getAny(["email", "mail", "e_mail"]);
    const lat = getAny(["lat", "latitude"]);
    const lng = getAny(["lng", "lon", "longitude", "long"]);
    const website = getAny(["website", "site", "site_web", "url"]);
    const whatsapp = getAny(["whatsapp", "whats", "wa"]);
    const packageRaw = getAny(["package", "package_type", "forfait", "plan", "tier"]);
    const packageType: PackageType =
      packageRaw.toLowerCase().includes("premium") ? "premium" :
      packageRaw.toLowerCase().includes("pro") ? "pro" : "free";

    const raw: Record<string, string> = {};
    headers.forEach((h, i) => { raw[h] = values[i] || ""; });

    const errors: string[] = [];
    if (!nameFr && !nameAr) errors.push(isArabic ? "الاسم مفقود" : "Nom manquant");
    if (!address) errors.push(isArabic ? "العنوان مفقود" : "Adresse manquante");
    if (!phone) errors.push(isArabic ? "الهاتف مفقود" : "Téléphone manquant");

    return { nameFr, nameAr, descriptionFr: descriptionFr || nameFr, descriptionAr: descriptionAr || nameAr, category, areaId, address, phone, email, lat, lng, website, whatsapp, packageType, postalCode, raw, errors };
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) return;
      const hdrs = parseCsvLine(lines[0]);
      setHeaders(hdrs);
      const headerMap: Record<string, number> = {};
      hdrs.forEach((h, i) => { headerMap[h.toLowerCase().replace(/\s+/g, "_")] = i; });
      const parsed = lines.slice(1).map((line) => mapRow(parseCsvLine(line), headerMap));
      setRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const now = new Date().toISOString().split("T")[0];
    let count = 0;
    rows.filter((r) => r.errors.length === 0).forEach((r) => {
      addBusiness({
        id: `b-csv-${Date.now()}-${count}`,
        nameFr: r.nameFr,
        nameAr: r.nameAr || r.nameFr,
        descriptionFr: r.descriptionFr,
        descriptionAr: r.descriptionAr || r.descriptionFr,
        category: r.category,
        areaId: r.areaId,
        address: r.address,
        phone: r.phone,
        email: r.email || "N/A",
        website: r.website || undefined,
        whatsapp: r.whatsapp || undefined,
        lat: parseFloat(r.lat) || 34.0331,
        lng: parseFloat(r.lng) || -5.5473,
        rating: 4.5,
        reviewCount: 0,
        isSponsored: r.packageType === "premium",
        packageType: r.packageType,
        createdAt: now,
      });
      count++;
    });
    setImported(count);
    setStep("done");
  };

  const validRows = rows.filter((r) => r.errors.length === 0);
  const errorRows = rows.filter((r) => r.errors.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-bold text-navy-800 text-lg flex items-center gap-2">
            <FileText size={20} className="text-primary-500" />
            {isArabic ? "استيراد CSV" : "Importer un CSV"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === "upload" && (
            <div className="text-center py-10">
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 rounded-2xl p-10 hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer"
              >
                <Upload size={48} className="mx-auto text-primary-400 mb-4" />
                <p className="text-navy-700 font-medium mb-2">
                  {isArabic ? "اسحب ملف CSV هنا أو انقر للتحميل" : "Glissez un fichier CSV ici ou cliquez pour parcourir"}
                </p>
                <p className="text-sm text-navy-400">
                  {isArabic ? "الحد الأقصى 10 ميغا بايت" : "Max 10 Mo"}
                </p>
              </div>
              <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" onChange={handleFile} className="hidden" />

              <div className="mt-8 text-left max-w-lg mx-auto">
                <h4 className="font-semibold text-navy-700 mb-2 text-sm">
                  {isArabic ? "أعمدة CSV المدعومة:" : "Colonnes CSV supportées:"}
                </h4>
                <div className="grid grid-cols-2 gap-1 text-xs text-navy-500">
                  {["name_fr / name / nom", "name_ar / nom_ar", "description / description_fr", "description_ar", "category / type / secteur", "address / adresse", "phone / telephone / gsm", "email / mail", "postal_code / code_postal / zip", "lat / latitude", "lng / longitude", "website / site", "whatsapp", "package / plan / tier"].map((col) => (
                    <div key={col} className="px-2 py-1 bg-navy-50 rounded">{col}</div>
                  ))}
                </div>
                <p className="text-xs text-navy-400 mt-3">
                  {isArabic
                    ? "سيتم تحويل الرمز البريدي تلقائياً إلى areaId"
                    : "Le code postal est automatiquement converti en areaId"}
                </p>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setStep("upload")} className="p-1.5 rounded-lg text-navy-400 hover:bg-navy-50">
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <p className="font-semibold text-navy-800">
                    {rows.length} {isArabic ? "صف" : "lignes"} — <span className="text-green-600">{validRows.length} {isArabic ? "صالحة" : "valides"}</span>
                    {errorRows.length > 0 && <> · <span className="text-red-500">{errorRows.length} {isArabic ? "أخطاء" : "erreurs"}</span></>}
                  </p>
                  <p className="text-xs text-navy-400">
                    {isArabic ? "العمود البريدي يُحوّل تلقائياً إلى الحي" : "La colonne postal_code est convertie automatiquement en quartier"}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-emerald-100">
                      <th className="text-left py-2 px-2 text-navy-500 font-medium">#</th>
                      <th className="text-left py-2 px-2 text-navy-500 font-medium">{isArabic ? "الاسم" : "Nom"}</th>
                      <th className="text-left py-2 px-2 text-navy-500 font-medium">{isArabic ? "الفئة" : "Catégorie"}</th>
                      <th className="text-left py-2 px-2 text-navy-500 font-medium">{isArabic ? "الحي" : "Quartier"}</th>
                      <th className="text-left py-2 px-2 text-navy-500 font-medium">{isArabic ? "الهاتف" : "Téléphone"}</th>
                      <th className="text-left py-2 px-2 text-navy-500 font-medium">{isArabic ? "الباقة" : "Package"}</th>
                      <th className="text-left py-2 px-2 text-navy-500 font-medium">{isArabic ? "الحالة" : "Statut"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => {
                      const areaObj = areas.find((a) => a.id === r.areaId);
                      return (
                        <tr key={i} className={clsx("border-b border-emerald-50", r.errors.length > 0 && "bg-red-50")}>
                          <td className="py-1.5 px-2 text-navy-400">{i + 1}</td>
                          <td className="py-1.5 px-2 text-navy-700 font-medium">{r.nameFr || r.nameAr || "—"}</td>
                          <td className="py-1.5 px-2 text-navy-500">{t.categories[r.category]}</td>
                          <td className="py-1.5 px-2 text-navy-500">{areaObj ? (isArabic ? areaObj.nameAr : areaObj.nameFr) : r.areaId}</td>
                          <td className="py-1.5 px-2 text-navy-500">{r.phone || "—"}</td>
                          <td className="py-1.5 px-2">
                            <span className={clsx(
                              "px-1.5 py-0.5 rounded text-[10px] font-medium",
                              r.packageType === "premium" ? "bg-yellow-50 text-yellow-700" :
                              r.packageType === "pro" ? "bg-blue-50 text-blue-700" :
                              "bg-navy-50 text-navy-600"
                            )}>
                              {r.packageType === "premium" ? "Premium" : r.packageType === "pro" ? "Pro" : "Free"}
                            </span>
                          </td>
                          <td className="py-1.5 px-2">
                            {r.errors.length > 0 ? (
                              <span className="text-red-500" title={r.errors.join(", ")}>✗ {r.errors.length}</span>
                            ) : (
                              <span className="text-green-600">✓</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {errorRows.length > 0 && (
                <div className="bg-red-50 rounded-xl p-3 mb-4">
                  <p className="text-sm font-medium text-red-700 flex items-center gap-1 mb-1">
                    <AlertCircle size={14} /> {isArabic ? "أخطاء:" : "Erreurs:"}
                  </p>
                  {errorRows.slice(0, 5).map((r, i) => (
                    <p key={i} className="text-xs text-red-600 ml-5">
                      Ligne {rows.indexOf(r) + 1}: {r.errors.join(", ")}
                    </p>
                  ))}
                  {errorRows.length > 5 && (
                    <p className="text-xs text-red-500 ml-5">+ {errorRows.length - 5} autres...</p>
                  )}
                </div>
              )}
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-10">
              <CheckCircle size={56} className="mx-auto text-green-500 mb-4" />
              <h4 className="text-lg font-bold text-navy-800 mb-2">
                {isArabic ? "تم الاستيراد بنجاح!" : "Import terminé!"}
              </h4>
              <p className="text-navy-500">
                {imported} {isArabic ? "تجارة مستوردة" : "commerces importés"}
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-emerald-100 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium text-navy-600 hover:bg-navy-50 transition-colors">
            {t.close}
          </button>
          {step === "preview" && validRows.length > 0 && (
            <button onClick={handleImport} className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors">
              {isArabic ? `استيراد ${validRows.length} صنف` : `Importer ${validRows.length} lignes`}
            </button>
          )}
          {step === "done" && (
            <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors">
              {t.close}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
