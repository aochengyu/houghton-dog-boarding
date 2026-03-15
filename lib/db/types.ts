export type Species = "dog" | "cat";
export type ServiceType = "boarding" | "day-care" | "walking" | "drop-in";
export type BookingStatus = "inquiry" | "confirmed" | "active" | "completed" | "cancelled";
export type ReferralStatus = "pending" | "credited";

export interface Client {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  referral_code: string;
  referred_by: string | null;
  referral_credits: number; // cents
  waiver_signed_at: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  created_at: string;
}

export interface Pet {
  id: string;
  client_id: string;
  name: string;
  species: Species;
  breed: string | null;
  dob: string | null;
  weight_lbs: number | null;
  spayed_neutered: boolean;
  microchip_id: string | null;
  vet_name: string | null;
  vet_phone: string | null;
  medical_notes: string | null;
  behavioral_notes: string | null;
  rabies_exp:     string | null;
  bordetella_exp: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  client_id: string;
  pet_id: string;
  service: ServiceType;
  start_date: string;
  end_date: string | null;
  status: BookingStatus;
  price_cents: number;
  credit_applied_cents: number;
  notes: string | null;
  paid_at: string | null;
  payment_method: string | null;
  checked_in_at: string | null;
  checked_out_at: string | null;
  dropoff_time: string | null;
  stripe_session_id: string | null;
  created_at: string;
  // joined
  client?: Client;
  pet?: Pet;
}

export interface StayPhoto {
  id: string;
  booking_id: string;
  photo_url: string;
  caption: string | null;
  uploaded_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  client_id: string;
  rating: number; // 1–5
  body: string | null;
  approved: boolean;
  created_at: string;
  // joined
  client?: Client;
}

export interface WaitlistEntry {
  id: string;
  client_id: string;
  service: ServiceType;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  // joined
  client?: Client;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  status: ReferralStatus;
  credited_at: string | null;
  created_at: string;
  // joined
  referrer?: Client;
  referred?: Client;
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  boarding: "Dog Boarding",
  "day-care": "Day Care",
  walking: "Dog Walking",
  "drop-in": "Drop-In Visit",
};

export const SERVICE_PRICES: Record<ServiceType, number> = {
  boarding: 7000,   // $70/night
  "day-care": 6000, // $60/day
  walking: 3000,    // $30/walk
  "drop-in": 3000,  // $30/visit
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  inquiry: "Inquiry",
  confirmed: "Confirmed",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<BookingStatus, string> = {
  inquiry: "bg-gold/15 text-gold-dark border-gold/20",
  confirmed: "bg-teal/10 text-teal border-teal/20",
  active: "bg-teal text-cream border-teal",
  completed: "bg-forest/10 text-forest border-forest/20",
  cancelled: "bg-rose/10 text-rose-dark border-rose/20",
};

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export interface BlackoutDate {
  id:         string;
  date:       string; // YYYY-MM-DD
  reason:     string | null;
  created_at: string;
}

export interface AppSetting {
  key:        string;
  value:      string;
  updated_at: string;
}
