import { createClient } from '@supabase/supabase-js';
import { Profile, Payment, InterestRecord, PremiumRequest } from '../types';

export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || "https://fowkuwwfmnzupzbrrxqf.supabase.co";
export const SUPABASE_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_fHxx0xpO65_m7WCrMRX6DQ_fShiZpoI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Authentic default profiles with Guardian / Wali contact numbers
export const DEFAULT_PROFILES: Profile[] = [
  {
    id: "nc-001",
    full_name: "Dr. Ayesha Fathima",
    gender: "Female",
    age: 26,
    date_of_birth: "1998-05-14",
    location: "Kozhikode, Kerala",
    district: "Kozhikode",
    education: "MBBS, MD Pediatrics (Final Year)",
    profession: "Resident Doctor",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    height: "5'4\"",
    about: "Practicing Muslimah who values faith, family harmony, and professional dedication. Performs daily prayers and observes hijab. Looking for a deen-conscious, educated life partner.",
    partner_preferences: "Age 27-32, doctor or qualified professional with good Islamic character, from Kerala or working in GCC.",
    family_details: "Father is an educator (retd. Principal), mother homemaker. Two elder brothers both engineers settled in UAE.",
    profile_photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    mobile: "+91 98471 22334",
    guardian_name: "Abdul Majeed (Father)",
    guardian_relation: "Father (Wali)",
    guardian_mobile: "+91 94470 55112",
    registration_type: "ONLINE",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "6 Months",
    premium_start: "2026-01-01",
    premium_end: "2026-12-31",
    created_at: "2026-02-10T10:00:00Z"
  },
  {
    id: "nc-002",
    full_name: "Er. Mohammed Nihal",
    gender: "Male",
    age: 29,
    date_of_birth: "1995-09-22",
    location: "Kochi, Kerala (Currently in Dubai)",
    district: "Ernakulam",
    education: "B.Tech Computer Science, NIT Calicut",
    profession: "Senior Cloud Solutions Architect",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    height: "5'10\"",
    about: "Alhamdulillah balanced in deen and modern life. Passionate about technology, reading Islamic history, and community service. Non-smoker, health-conscious.",
    partner_preferences: "A pious, family-oriented Muslimah with religious values and professional aspirations.",
    family_details: "Reputed family from Aluva. Father is a businessman, mother homemaker. One younger sister married in Doha.",
    profile_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    mobile: "+971 50 1234567",
    guardian_name: "Usman K. (Father)",
    guardian_relation: "Father (Guardian)",
    guardian_mobile: "+91 98460 77889",
    registration_type: "CASH_ADMIN",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "1 Year",
    premium_start: "2026-01-15",
    premium_end: "2027-01-15",
    created_at: "2026-02-12T11:30:00Z"
  },
  {
    id: "nc-003",
    full_name: "Fatima Zehra K.",
    gender: "Female",
    age: 24,
    date_of_birth: "2000-03-18",
    location: "Malappuram, Kerala",
    district: "Malappuram",
    education: "M.Sc Food Science & Nutrition",
    profession: "Clinical Nutritionist & Dietitian",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    height: "5'3\"",
    about: "Enthusiastic about health, culinary arts, and Islamic learning. Seeking a humble, God-fearing companion to walk together in Dunya and Akhirah.",
    partner_preferences: "Educated Muslim groom aged 26-30 with positive mindset and respect for Islamic traditions.",
    family_details: "Nuclear family with strong ethical values. Father is a merchant, mother teacher.",
    profile_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    mobile: "+91 97450 11223",
    guardian_name: "Kunjumuhammed (Father)",
    guardian_relation: "Father (Wali)",
    guardian_mobile: "+91 94460 33445",
    registration_type: "ONLINE",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: false,
    created_at: "2026-02-14T09:15:00Z"
  },
  {
    id: "nc-004",
    full_name: "Rashid Ali P.",
    gender: "Male",
    age: 31,
    date_of_birth: "1993-11-05",
    location: "Kannur, Kerala",
    district: "Kannur",
    education: "Chartered Accountant (CA)",
    profession: "Finance Manager at MNC",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    height: "5'9\"",
    about: "Quiet, grounded, and sincere. Strives to follow the Sunnah in everyday life. Enjoys travel, photography, and mentoring youth.",
    partner_preferences: "Simple, understanding girl who observes hijab and values family bonds.",
    family_details: "Traditional Thalassery family. Father retired government officer, mother homemaker.",
    profile_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    mobile: "+91 98950 44556",
    guardian_name: "Ibrahim Kutty (Father)",
    guardian_relation: "Father (Guardian)",
    guardian_mobile: "+91 94471 88990",
    registration_type: "CASH_ADMIN",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "3 Months",
    premium_start: "2026-02-01",
    premium_end: "2026-05-01",
    created_at: "2026-02-15T14:40:00Z"
  },
  {
    id: "nc-005",
    full_name: "Shahana Mariyam",
    gender: "Female",
    age: 27,
    date_of_birth: "1997-07-29",
    location: "Thiruvananthapuram, Kerala",
    district: "Thiruvananthapuram",
    education: "B.Arch, M.Plan (Urban Planning)",
    profession: "Consultant Architect",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    height: "5'5\"",
    about: "Creative architect with deep respect for Islamic culture, modesty, and family values. Passionate about sustainable living and sketching.",
    partner_preferences: "Professionally settled, polite gentleman with open-minded Islamic outlook.",
    family_details: "Father is an engineer in KSEB, mother high school teacher. One younger brother studying law.",
    profile_photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    mobile: "+91 94960 12345",
    guardian_name: "Najeeb K. (Father)",
    guardian_relation: "Father (Wali)",
    guardian_mobile: "+91 94472 99887",
    registration_type: "ONLINE",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "1 Month",
    premium_start: "2026-02-10",
    premium_end: "2026-03-10",
    created_at: "2026-02-16T16:00:00Z"
  },
  {
    id: "nc-006",
    full_name: "Sulaiman Farhan",
    gender: "Male",
    age: 33,
    date_of_birth: "1991-04-12",
    location: "Kollam, Kerala",
    district: "Kollam",
    education: "MBA in International Business",
    profession: "Logistics Director & Entrepreneur",
    marital_status: "Divorced",
    religion: "Islam",
    sect: "Sunni",
    height: "6'0\"",
    about: "Warm-hearted, straightforward individual with strong work ethic and deep faith. Divorced after brief mutual separation without issues. Looking for a fresh start with mutual understanding.",
    partner_preferences: "Understanding, kind-hearted companion. Divorcee or never married both welcome.",
    family_details: "Respected business family in Kollam. Father exports cashew, mother homemaker.",
    profile_photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
    mobile: "+91 97470 66778",
    guardian_name: "Abdul Latheef (Father)",
    guardian_relation: "Father (Guardian)",
    guardian_mobile: "+91 98472 11443",
    registration_type: "CASH_ADMIN",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "6 Months",
    premium_start: "2026-01-20",
    premium_end: "2026-07-20",
    created_at: "2026-02-18T10:10:00Z"
  },
  {
    id: "nc-007",
    full_name: "Dr. Hiba Noor",
    gender: "Female",
    age: 28,
    date_of_birth: "1996-01-30",
    location: "Thrissur, Kerala",
    district: "Thrissur",
    education: "BDS, Fellowship in Cosmetic Dentistry",
    profession: "Dental Surgeon",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    height: "5'4\"",
    about: "Dedicated dental practitioner who balances professional life with religious commitments. Prays regularly and memorized Juzz Amma. Respectful, calm and cheerful.",
    partner_preferences: "Doctor, Engineer or professionally settled Muslim gentleman with Taqwa and honesty.",
    family_details: "Father is an advocate, mother college professor. Settled in Thrissur town.",
    profile_photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    mobile: "+91 96330 88991",
    guardian_name: "Adv. Basheer (Father)",
    guardian_relation: "Father (Wali)",
    guardian_mobile: "+91 94473 66554",
    registration_type: "ONLINE",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: false,
    created_at: "2026-02-20T12:00:00Z"
  },
  {
    id: "nc-008",
    full_name: "Bilal Abdul Kareem",
    gender: "Male",
    age: 28,
    date_of_birth: "1996-12-08",
    location: "Palakkad, Kerala",
    district: "Palakkad",
    education: "M.Tech Mechanical Engineering",
    profession: "Automotive R&D Engineer",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    height: "5'11\"",
    about: "Humble and down-to-earth person. Believes that a successful marriage is founded on mutual respect, patience and Islamic morals. Active in local masjid activities.",
    partner_preferences: "Humble, religious girl who values simple living and high thinking.",
    family_details: "Agriculturist family with rich cultural heritage in Ottapalam.",
    profile_photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    mobile: "+91 95670 44332",
    guardian_name: "Kareem Haji (Father)",
    guardian_relation: "Father (Guardian)",
    guardian_mobile: "+91 98461 22334",
    registration_type: "ONLINE",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: false,
    created_at: "2026-02-22T15:20:00Z"
  },
  {
    id: "nc-009",
    full_name: "Zainab Mansoor",
    gender: "Female",
    age: 25,
    date_of_birth: "1999-04-10",
    location: "Kasaragod, Kerala",
    district: "Kasaragod",
    education: "B.Ed, MA English Literature",
    profession: "Higher Secondary Teacher",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    height: "5'3\"",
    about: "Dedicated educator with gentle manners. Prays 5 times a day and attends Islamic study circles.",
    partner_preferences: "Pious, humble groom with good moral values.",
    family_details: "Traditional family from Kanhangad.",
    profile_photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
    mobile: "+91 94950 11998",
    guardian_name: "Mansoor Ali (Father)",
    guardian_relation: "Father (Wali)",
    guardian_mobile: "+91 94474 12399",
    registration_type: "ONLINE",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: false,
    created_at: "2026-02-25T11:00:00Z"
  },
  {
    id: "nc-010",
    full_name: "Anas V. M.",
    gender: "Male",
    age: 30,
    date_of_birth: "1994-08-19",
    location: "Wayanad, Kerala",
    district: "Wayanad",
    education: "B.Pharm, MBA Healthcare Management",
    profession: "Hospital Administrator",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    height: "5'8\"",
    about: "Energetic and warm personality with strict adherence to Islamic etiquette. Active in charitable initiatives.",
    partner_preferences: "Religious, graduated girl from Kerala.",
    family_details: "Respected family in Kalpetta.",
    profile_photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    mobile: "+91 97440 22331",
    guardian_name: "Musthafa (Father)",
    guardian_relation: "Father (Guardian)",
    guardian_mobile: "+91 98473 88112",
    registration_type: "CASH_ADMIN",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "3 Months",
    premium_start: "2026-02-15",
    premium_end: "2026-05-15",
    created_at: "2026-02-26T14:10:00Z"
  }
];

export const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: "pay-001",
    profile_id: "nc-002",
    profile_name: "Er. Mohammed Nihal",
    amount: 5999,
    payment_method: "CASH",
    payment_status: "PAID",
    payment_date: "2026-01-15T11:00:00Z",
    transaction_reference: "CASH-ADM-7821",
    notes: "1 Year VIP Concierge Plan"
  },
  {
    id: "pay-002",
    profile_id: "nc-004",
    profile_name: "Rashid Ali P.",
    amount: 1999,
    payment_method: "CASH",
    payment_status: "PAID",
    payment_date: "2026-02-01T14:30:00Z",
    transaction_reference: "CASH-ADM-8902",
    notes: "3 Months Standard Premium"
  },
  {
    id: "pay-003",
    profile_id: "nc-006",
    profile_name: "Sulaiman Farhan",
    amount: 3499,
    payment_method: "CASH",
    payment_status: "PAID",
    payment_date: "2026-01-20T10:15:00Z",
    transaction_reference: "CASH-ADM-6512",
    notes: "6 Months Matchmaker Plan"
  },
  {
    id: "pay-004",
    profile_id: "nc-001",
    profile_name: "Dr. Ayesha Fathima",
    amount: 3499,
    payment_method: "ONLINE",
    payment_status: "PAID",
    payment_date: "2026-01-01T09:00:00Z",
    transaction_reference: "UPI-4029104821",
    notes: "Online UPI via App"
  }
];

// Offline & Hybrid Data Layer
const PROFILES_STORAGE_KEY = "nikah_circle_profiles_v2";
const PAYMENTS_STORAGE_KEY = "nikah_circle_payments_v2";
const BOOKMARKS_STORAGE_KEY = "nikah_circle_bookmarks_v2";
const INTERESTS_MAP_KEY = "nikah_circle_interests_map_v2";

export function getStoredProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Could not read local profiles", e);
  }
  return DEFAULT_PROFILES;
}

export function saveStoredProfiles(profiles: Profile[]) {
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.warn("Could not persist local profiles", e);
  }
}

export function getStoredPayments(): Payment[] {
  try {
    const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Could not read local payments", e);
  }
  return DEFAULT_PAYMENTS;
}

export function saveStoredPayments(payments: Payment[]) {
  try {
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
  } catch (e) {
    console.warn("Could not persist local payments", e);
  }
}

export function getStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
}

export function saveStoredBookmarks(ids: string[]) {
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // fallback
  }
}

// Map of Profile ID -> Interest Status: 'pending' | 'accepted' | 'declined'
export function getStoredInterestsMap(): Record<string, 'pending' | 'accepted' | 'declined'> {
  try {
    const raw = localStorage.getItem(INTERESTS_MAP_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  // Default sample interest: e.g. nc-001 is pending, nc-002 is accepted so user can immediately test!
  return {
    "nc-002": "accepted",
  };
}

export function saveStoredInterestsMap(map: Record<string, 'pending' | 'accepted' | 'declined'>) {
  try {
    localStorage.setItem(INTERESTS_MAP_KEY, JSON.stringify(map));
  } catch {
    // fallback
  }
}

const PREMIUM_REQUESTS_STORAGE_KEY = "nikah_circle_premium_requests_v1";

export const DEFAULT_PREMIUM_REQUESTS: PremiumRequest[] = [
  {
    id: "req-001",
    user_name: "Muhammed Salih",
    phone_number: "+91 98471 99001",
    plan_name: "3 Months Value",
    plan_type: "UPI_QR",
    amount: 1999,
    utr_number: "428901239841",
    payment_screenshot: "/assets/aistudio/WhatsApp_Image_2026-10-06_at_6.11.23_PM_c01376c7.jpeg",
    status: "PENDING",
    created_at: new Date().toISOString(),
    notes: "Paid via Google Pay to jimshadvk6@okaxis"
  },
  {
    id: "req-002",
    user_name: "Shabana K.",
    phone_number: "+91 94460 77123",
    plan_name: "Premium Free (Girls & Other)",
    plan_type: "FREE_REQUEST",
    amount: 0,
    status: "PENDING",
    created_at: new Date().toISOString(),
    notes: "Application for Premium Free (Girls & Other)"
  }
];

export function getStoredPremiumRequests(): PremiumRequest[] {
  try {
    const raw = localStorage.getItem(PREMIUM_REQUESTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_PREMIUM_REQUESTS;
}

export function saveStoredPremiumRequests(reqs: PremiumRequest[]) {
  try {
    localStorage.setItem(PREMIUM_REQUESTS_STORAGE_KEY, JSON.stringify(reqs));
  } catch {
    // fallback
  }
}

const USED_REFERRAL_CODES_KEY = "nikah_circle_used_referral_codes_v1";

export function getStoredUsedReferralCodes(): string[] {
  try {
    const raw = localStorage.getItem(USED_REFERRAL_CODES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return ["WELCOME2025"]; // Sample code already used
}

export function saveStoredUsedReferralCodes(codes: string[]) {
  try {
    localStorage.setItem(USED_REFERRAL_CODES_KEY, JSON.stringify(codes));
  } catch {}
}

export function isReferralCodeUsed(code: string): boolean {
  if (!code) return false;
  const normalized = code.trim().toUpperCase();
  const list = getStoredUsedReferralCodes();
  if (list.includes(normalized)) return true;
  const existingReqs = getStoredPremiumRequests();
  return existingReqs.some(
    (r) => r.referral_code && r.referral_code.trim().toUpperCase() === normalized
  );
}

export function markReferralCodeUsed(code: string) {
  if (!code) return;
  const normalized = code.trim().toUpperCase();
  const list = getStoredUsedReferralCodes();
  if (!list.includes(normalized)) {
    saveStoredUsedReferralCodes([...list, normalized]);
  }
}

