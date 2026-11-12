export interface Profile {
  id: string;
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
  profile_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';
  is_verified: boolean;
  is_premium: boolean;
  premium_plan?: string | null;
  premium_start?: string | null;
  premium_end?: string | null;
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
