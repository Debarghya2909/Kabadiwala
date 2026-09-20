export type Role = 'household' | 'collector' | 'impact';
export type AppView = 'login' | 'household' | 'collector' | 'impact';
export type HouseholdTab = 'schedule' | 'tracking' | 'history' | 'safety' | 'prices';
export type CollectorTab = 'queue' | 'active' | 'lots' | 'prices' | 'recyclers' | 'handover' | 'earnings' | 'safety';

export type Language = 'en' | 'hi' | 'mr';

export type PickupStatus = 'pending' | 'accepted' | 'arrived' | 'completed' | 'cancelled';
export type UrgencyLevel = 'urgent' | 'express' | 'standard';
export type WeightTier = 'all' | 'light' | 'medium' | 'heavy';

export type MaterialKey =
  | 'pcb'
  | 'cables'
  | 'batteries'
  | 'crt'
  | 'lcd'
  | 'motors'
  | 'mixed_plastics'
  | 'iron'
  | 'cardboard'
  | 'newspaper';

export interface MaterialLine {
  key: MaterialKey;
  label: string;
  labelHi: string;
  labelMr: string;
  short: string;
  rate: number; // in INR per kg
  kg: number;
  color: string;
  category: 'ewaste' | 'metal' | 'battery' | 'display' | 'plastic' | 'paper';
  description: string;
  descriptionHi: string;
  descriptionMr: string;
  marketRange: string;
  trend: 'up' | 'down' | 'stable';
  trendPercent: string;
  hazardousNote?: string;
}

export interface ItemizedWeighItem {
  key: MaterialKey;
  label: string;
  rate: number;
  kg: number;
  subtotal: number;
}

export interface PickupTimelineItem {
  status: PickupStatus;
  title: string;
  timestamp: string;
  note: string;
}

export interface CollectorRating {
  stars: number;
  tags: string[];
  comment?: string;
  ratedAt: string;
}

export interface Pickup {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  address: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  distanceKm?: number;
  area?: string;
  urgency?: UrgencyLevel;
  slot: string;
  materials: Array<{ key: MaterialKey; label: string; kg: number; rate: number }>;
  estimatedKg: number;
  finalKg?: number;
  itemizedWeighing?: ItemizedWeighItem[];
  payout: number;
  status: PickupStatus;
  collectorId?: string;
  collectorName?: string;
  collectorPhone?: string;
  collectorVehicle?: string;
  etaMinutes?: number;
  verificationOtp: string;
  notes?: string;
  createdAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  timeline: PickupTimelineItem[];
  rating?: CollectorRating;
}

export interface AuthUser {
  id: string;
  role: 'household' | 'collector';
  name: string;
  phone: string;
  address?: string;
  zone?: string;
  partnerId?: string;
  vehicle?: string;
  rating?: number;
  completedTrips?: number;
  preferredLanguage?: Language;
}

export interface AuthorizedRecycler {
  id: string;
  name: string;
  facilityLocation: string;
  city: string;
  authorizationNumber: string;
  authorizationStatus: 'CPCB Authorized' | 'State PCB Approved' | 'EPR Registered';
  validUntil: string;
  contactPerson: string;
  phone: string;
  acceptedMaterials: MaterialKey[];
  offeredRates: Partial<Record<MaterialKey, number>>;
  pickupAvailability: 'Direct Hub Drop-off' | 'Collector Pickup Available' | 'On-demand Trike';
  serviceArea: string;
  distanceKm: number;
}

export interface DigitalLot {
  id: string;
  collectorId: string;
  collectorName: string;
  title: string;
  category: MaterialKey;
  approxWeightKg: number;
  estimatedValue: number;
  condition: 'Separated' | 'Mixed' | 'Unprocessed' | 'Intact';
  photoUrl: string;
  location: string;
  createdAt: string;
  status: 'available' | 'matched' | 'handed_over';
  matchedRecyclerId?: string;
}

export interface HandoverRecord {
  id: string;
  referenceCode: string;
  collectorId: string;
  collectorName: string;
  recyclerId: string;
  recyclerName: string;
  facilityLocation: string;
  materials: Array<{ key: MaterialKey; label: string; kg: number; rate: number; subtotal: number }>;
  totalKg: number;
  totalPayout: number;
  paymentMode: 'Cash at Hub' | 'Instant Bank Transfer / UPI' | 'Pending Settlement';
  paymentStatus: 'paid' | 'pending';
  timestamp: string;
  gpsLocation: string;
  photoUrl: string;
  recyclerConfirmed: boolean;
  notes?: string;
}

export interface SafetyGuideItem {
  id: string;
  title: string;
  titleHi: string;
  titleMr: string;
  dangerDescription: string;
  dangerDescriptionHi: string;
  dangerDescriptionMr: string;
  safePractice: string;
  safePracticeHi: string;
  safePracticeMr: string;
  economicBenefit: string;
  economicBenefitHi: string;
  economicBenefitMr: string;
  audioSpeechText: string;
  audioSpeechTextHi: string;
  audioSpeechTextMr: string;
  iconName: 'Flame' | 'FlaskConical' | 'BatteryCharging' | 'Tv2' | 'ShieldAlert';
  severity: 'critical' | 'high' | 'warning';
}
