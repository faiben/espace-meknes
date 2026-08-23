export type Lang = "fr" | "ar";

export type BusinessCategory =
  | "restaurant"
  | "cafe"
  | "boulangerie"
  | "pharmacie"
  | "coiffeur"
  | "epicerie"
  | "artisanat"
  | "dentiste"
  | "clinique"
  | "medecin"
  | "avocat"
  | "immobilier"
  | "garage"
  | "electronique"
  | "vetements"
  | "education"
  | "sport"
  | "beaute"
  | "hotel"
  | "droguerie"
  | "location_voiture"
  | "autre";

export type ArtisanSpecialty =
  | "plomberie"
  | "electricite"
  | "peinture"
  | "menuiserie"
  | "ferronnerie"
  | "maconnerie"
  | "carrelage"
  | "jardinage"
  | "demenagement"
  | "climatisation"
  | "electromenager"
  | "reparation_auto"
  | "couture"
  | "informatique"
  | "nettoyage"
  | "bricolage"
  | "autre";

export type JobType = "CDI" | "CDD" | "freelance" | "stage" | "temps_partiel" | "autre";

export type JobSector =
  | "informatique"
  | "construction"
  | "sante"
  | "education"
  | "commerce"
  | "restauration"
  | "transport"
  | "admin"
  | "autre";

export type PackageType = "free" | "pro" | "premium";

export type PaymentMethod = "cash" | "credit_card" | "bank_transfer";

export type UserRole = "resident" | "merchant" | "artisan" | "jobseeker" | "employer" | "admin";

export type AdStatus = "pending" | "approved" | "rejected" | "expired";

export interface Area {
  id: string;
  nameFr: string;
  nameAr: string;
  postalCode: string;
  lat: number;
  lng: number;
}

export interface Business {
  id: string;
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
  logo?: string;
  coverImage?: string;
  images?: string[];
  video?: string;
  whatsapp?: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  isSponsored: boolean;
  packageType: PackageType;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  userId?: string;
}

export interface ArtisanProfile {
  id: string;
  nameFr: string;
  nameAr: string;
  specialty: ArtisanSpecialty;
  descriptionFr: string;
  descriptionAr: string;
  phone: string;
  email: string;
  addressFr: string;
  addressAr: string;
  areaId: string;
  lat: number;
  lng: number;
  rating: number;
  jobsCompleted: number;
  isVisible: boolean;
  createdAt: string;
  userId?: string;
  avatar?: string;
}

export interface ArtisanMission {
  id: string;
  needDescriptionFr: string;
  needDescriptionAr: string;
  specialty: ArtisanSpecialty;
  areaId: string;
  residentId: string;
  artisanId?: string;
  status: "pending" | "matched" | "accepted" | "completed" | "cancelled";
  createdAt: string;
}

export type ArtisanRequestStatus = "pending" | "contacted" | "assigned" | "completed" | "cancelled";

export interface ArtisanRequest {
  id: string;
  artisanId: string;
  artisanName: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  descriptionFr: string;
  descriptionAr: string;
  specialty: ArtisanSpecialty;
  areaId: string;
  status: ArtisanRequestStatus;
  contactedArtisans: string[];
  notes?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  titleFr: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  company: string;
  sector: JobSector;
  jobType: JobType;
  areaId: string;
  salary?: string;
  requirements?: string;
  lat: number;
  lng: number;
  createdAt: string;
  employerId: string;
  isActive: boolean;
  applications: number;
  sourceUrl?: string;
  sourceName?: string;
}

export interface JobSeekerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  cvUrl?: string;
  skills: string[];
  sectors: JobSector[];
  areaId: string;
  createdAt: string;
  userId?: string;
}

export interface Ad {
  id: string;
  titleFr: string;
  titleAr: string;
  imageUrl: string;
  linkUrl: string;
  advertiserName: string;
  advertiserEmail: string;
  status: AdStatus;
  position: "banner" | "sidebar" | "inline";
  startsAt: string;
  expiresAt: string;
  impressions: number;
  clicks: number;
  paymentMethod?: PaymentMethod;
}

export interface FaqArticle {
  id: string;
  titleFr: string;
  titleAr: string;
  contentFr: string;
  contentAr: string;
  category: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  favorites: string[];
  createdAt: string;
}

export type ClaimStatus = "pending" | "verified" | "approved" | "rejected";

export interface BusinessClaim {
  id: string;
  businessId: string;
  businessName: string;
  userId: string;
  userName: string;
  userEmail: string;
  whatsapp: string;
  requestedPackage: PackageType;
  status: ClaimStatus;
  notes?: string;
  createdAt: string;
}

export interface AppSettings {
  whatsappNumber: string;
  supportEmail: string;
  adsEnabled: boolean;
  bankName: string;
  bankAccountHolder: string;
  bankIban: string;
  bankRib: string;
}
