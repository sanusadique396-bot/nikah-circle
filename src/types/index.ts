export interface Profile {
  id: string;
  member_id?: string;
  auth_user_id?: string | null;
  full_name: string;
  email?: string | null;
  mobile?: string | null;
  guardian_name?: string | null;
  guardian_relation?: string | null;
  guardian_mobile?: string | null;
  gender: 'Male' | 'Female';
  date_of_birth?: string | null;
  age?: number;
  state?: string | null;
  district?: string | null;
  place?: string | null;
  location?: string | null;
  education?: string | null;
  profession?: string | null;
  marital_status: 'Never Married' | 'Divorced' | 'Widowed';
  religion?: string;
  sect?: string;
  height?: string;
  hobbies?: string | string[] | null;
  interests?: string | string[] | null;
  about?: string | null;
  partner_preferences?: string | null;
  family_details?: string | null;
  profile_photo?: string | null;
  registration_type: 'ONLINE' | 'CASH_ADMIN';
  source?: 'admin' | 'user' | string | null;
  created_by?: string | null;
  profile_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';
  is_verified: boolean;
  is_premium: boolean;
  premium_plan?: string | null;
  premium_start?: string | null;
  premium_end?: string | null;
  biodata_uploaded?: boolean;
  biodata_document_name?: string | null;
  biodata_document_url?: string | null;
  complexion?: string | null;
  physical_build?: string | null;
  religious_ideation?: string | null;
  children_count?: string | null;
  religious_education?: string | null;
  bouthika_education?: string | null;
  job_location?: string | null;
  financial_status?: string | null;
  preferred_districts?: string | null;
  family_members_details?: string | null;
  family_background?: string | null;
  marriage_expectations?: string | null;
  blood_group?: string | null;
  passport_visa_status?: string | null;
  other_interests?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  profile_id: string;
  profile_name?: string;
  amount: number;
  payment_method: 'CASH' | 'ONLINE' | 'UPI';
  payment_status: 'PAID' | 'PENDING' | 'FAILED';
  payment_date: string;
  transaction_reference?: string;
  created_by?: string | null;
  notes?: string | null;
}

export interface PremiumRequest {
  id: string;
  user_name: string;
  phone_number: string;
  gender?: 'Male' | 'Female';
  plan_name: string;
  plan_type: 'UPI_QR' | 'CASH_OFFICE' | 'FREE_REQUEST';
  amount: number;
  utr_number?: string;
  payment_screenshot?: string;
  referral_code?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  notes?: string;
}

export interface InterestRecord {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface IncomingInterest {
  id: string;
  sender_profile_id?: string;
  sender_name: string;
  sender_photo?: string | null;
  sender_age: number;
  sender_gender: 'Male' | 'Female';
  sender_profession: string;
  sender_location: string;
  sender_education: string;
  guardian_name: string;
  guardian_mobile: string;
  guardian_relation?: string;
  received_at: string;
  status: 'pending' | 'accepted' | 'declined';
  notes?: string;
  recipient_profile_id?: string;
  recipient_mobile?: string;
  recipient_name?: string;
  sender_member_id?: string;
  sender_email?: string;
  recipient_member_id?: string;
  recipient_email?: string;
}

export interface SearchFilters {
  gender: string;
  ageRange: string;
  state: string;
  district: string;
  place: string;
  location: string;
  profession: string;
  education: string;
  maritalStatus: string;
  verifiedOnly: boolean;
  premiumOnly: boolean;
}

/**
 * Normalizes any gender input string to strictly 'Male' or 'Female'.
 * Handles strings like 'Male (Groom)', 'Female (Bride)', 'groom', 'bride', 'male', 'female'.
 */
export function normalizeGender(val?: string | null): 'Male' | 'Female' {
  if (!val) return 'Male';
  const s = String(val).trim().toLowerCase();
  if (
    s.startsWith('f') ||
    s.includes('female') ||
    s.includes('bride') ||
    s.includes('girl') ||
    s.includes('woman')
  ) {
    return 'Female';
  }
  return 'Male';
}

const KNOWN_MALE_FIRST_NAMES = new Set([
  'irshad', 'mohammed', 'muhammed', 'rashid', 'nihal', 'sadique', 'faizal', 'faisal',
  'niyas', 'musthafa', 'mustafa', 'shameer', 'rameez', 'shafi', 'salman', 'anas', 'bilal',
  'hamza', 'umar', 'usman', 'farhan', 'adil', 'ameen', 'ashraf', 'hassan', 'hussain',
  'jaseel', 'jasim', 'mansoor', 'nasir', 'nadeem', 'noufal', 'rayyan', 'rizwan', 'suhail',
  'shahid', 'shakil', 'sameer', 'tahir', 'zayan', 'zaid', 'zubair', 'ali', 'ahmed', 'ahammed'
]);

/**
 * Auto-corrects legacy or misassigned profiles where a male candidate was mistakenly
 * saved as 'Female' due to free package defaults ("Girls & Other").
 */
export function autoCorrectMistakenGenders(p: Profile): Profile {
  const normGender = normalizeGender(p.gender);
  const nameParts = (p.full_name || '').toLowerCase().trim().split(/\s+/);
  const cleanFirst = nameParts
    .map((part) => part.replace(/[^a-z]/g, ''))
    .find((part) => !['mr', 'dr', 'er'].includes(part));

  if (cleanFirst && KNOWN_MALE_FIRST_NAMES.has(cleanFirst) && normGender === 'Female') {
    return { ...p, gender: 'Male' };
  }
  return { ...p, gender: normGender };
}

