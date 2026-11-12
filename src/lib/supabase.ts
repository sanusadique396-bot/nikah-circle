import { createClient } from '@supabase/supabase-js';
import { Profile, Payment, InterestRecord, PremiumRequest } from '../types';

export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || "https://fowkuwwfmnzupzbrrxqf.supabase.co";
export const SUPABASE_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_fHxx0xpO65_m7WCrMRX6DQ_fShiZpoI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Empty default profiles & mock data for fresh system start
export const DEFAULT_PROFILES: Profile[] = [];
export const DEFAULT_PAYMENTS: Payment[] = [];

// Offline & Hybrid Data Layer
const PROFILES_STORAGE_KEY = "nikah_circle_profiles_v2";
const PAYMENTS_STORAGE_KEY = "nikah_circle_payments_v2";
const BOOKMARKS_STORAGE_KEY = "nikah_circle_bookmarks_v2";
const INTERESTS_MAP_KEY = "nikah_circle_interests_map_v3";

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
    localStorage.removeItem("nikah_circle_interests_map_v2");
    const raw = localStorage.getItem(INTERESTS_MAP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      delete parsed["nc-002"];
      return parsed;
    }
  } catch {
    // fallback
  }
  return {};
}

export function saveStoredInterestsMap(map: Record<string, 'pending' | 'accepted' | 'declined'>) {
  try {
    localStorage.setItem(INTERESTS_MAP_KEY, JSON.stringify(map));
  } catch {
    // fallback
  }
}

const PREMIUM_REQUESTS_STORAGE_KEY = "nikah_circle_premium_requests_v1";

export const DEFAULT_PREMIUM_REQUESTS: PremiumRequest[] = [];

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

// Sequential Auto-Increment Member ID System: NCSM1001, NCSM1002, NCSM1003...
const MEMBER_ID_SEQ_KEY = 'nikah_circle_member_id_seq_v4';

export function getNextMemberId(): string {
  try {
    const raw = localStorage.getItem(MEMBER_ID_SEQ_KEY);
    let current = raw ? parseInt(raw, 10) : 1000;
    if (isNaN(current) || current < 1000) {
      current = 1000;
    }
    const next = current + 1;
    localStorage.setItem(MEMBER_ID_SEQ_KEY, next.toString());
    return `NCSM${next}`;
  } catch {
    return 'NCSM1001';
  }
}

// Encode extra client fields (place, hobbies, member_id, etc.) safely into `about`
export function encodeProfileMetadata(
  aboutText?: string | null,
  meta?: {
    member_id?: string;
    place?: string | null;
    state?: string | null;
    biodata_uploaded?: boolean;
    biodata_document_name?: string | null;
    biodata_document_url?: string | null;
    hobbies?: string | string[] | null;
    interests?: string | string[] | null;
  }
): string {
  const cleanMeta = meta || {};
  const metaJson = JSON.stringify(cleanMeta);
  const cleanAbout = (aboutText || '').replace(/^<!--NC_META:.*?-->/s, '');
  return `<!--NC_META:${metaJson}-->${cleanAbout}`;
}

// Decode metadata from `about`
export function decodeProfileMetadata(rawAbout?: string | null): {
  about: string;
  meta: Record<string, any>;
} {
  if (!rawAbout) return { about: '', meta: {} };
  const match = rawAbout.match(/^<!--NC_META:(.*?)-->(.*)$/s);
  if (match) {
    try {
      const meta = JSON.parse(match[1]);
      return { about: match[2], meta: meta || {} };
    } catch {
      return { about: rawAbout, meta: {} };
    }
  }
  return { about: rawAbout, meta: {} };
}

// Prepare sanitized payload for Supabase profiles table without triggering PGRST204
export function prepareSupabaseProfilePayload(profile: Partial<Profile>): any {
  const isUUID = (str?: string) => !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  const meta = {
    member_id: profile.member_id,
    place: profile.place,
    state: profile.state,
    biodata_uploaded: profile.biodata_uploaded,
    biodata_document_name: profile.biodata_document_name,
    biodata_document_url: profile.biodata_document_url,
    hobbies: profile.hobbies,
    interests: profile.interests,
  };

  const encodedAbout = encodeProfileMetadata(profile.about, meta);

  const payload: any = {
    full_name: profile.full_name || 'Member',
    email: profile.email || null,
    mobile: profile.mobile || null,
    gender: profile.gender || 'Female',
    date_of_birth: profile.date_of_birth || null,
    age: profile.age || null,
    location:
      profile.location ||
      (profile.place && profile.district ? `${profile.place}, ${profile.district}` : profile.district || profile.place || 'Kerala'),
    district: profile.district || null,
    education: profile.education || null,
    profession: profile.profession || null,
    marital_status: profile.marital_status || 'Never Married',
    religion: profile.religion || 'Islam',
    sect: profile.sect || null,
    height: profile.height || null,
    about: encodedAbout,
    partner_preferences: profile.partner_preferences || null,
    family_details: profile.family_details || null,
    profile_photo: profile.profile_photo || null,
    registration_type: profile.registration_type || 'ONLINE',
    profile_status: profile.profile_status || 'APPROVED',
    is_verified: profile.is_verified ?? true,
    is_premium: profile.is_premium ?? false,
    premium_plan: profile.premium_plan || null,
    premium_start: profile.premium_start || null,
    premium_end: profile.premium_end || null,
    guardian_name: profile.guardian_name || null,
    guardian_relation: profile.guardian_relation || 'Parent (Guardian)',
    guardian_mobile: profile.guardian_mobile || null,
    updated_at: new Date().toISOString(),
  };

  if (isUUID(profile.id)) {
    payload.id = profile.id;
  }
  return payload;
}

// Parse a profile retrieved from Supabase into our full client Profile type
export function parseSupabaseProfile(p: any, defaultIndex?: number): Profile {
  const { about, meta } = decodeProfileMetadata(p.about);
  const fallbackMemberId = typeof defaultIndex === 'number' ? `NCSM${1001 + defaultIndex}` : 'NCSM1001';
  const memberId =
    meta.member_id ||
    p.member_id ||
    (typeof p.id === 'string' && p.id.startsWith('NCSM') ? p.id : fallbackMemberId);

  return {
    ...p,
    id: p.id,
    member_id: memberId,
    full_name: p.full_name || 'Member',
    gender: p.gender || 'Female',
    marital_status: p.marital_status || 'Never Married',
    about: about,
    place: meta.place || p.place || (p.location ? p.location.split(',')[0].trim() : null),
    state: meta.state || p.state || 'Kerala',
    biodata_uploaded: meta.biodata_uploaded ?? (p.biodata_uploaded || false),
    biodata_document_name: meta.biodata_document_name || p.biodata_document_name || null,
    biodata_document_url: meta.biodata_document_url || p.biodata_document_url || null,
    hobbies: meta.hobbies || p.hobbies || [],
    interests: meta.interests || p.interests || [],
    registration_type: p.registration_type || 'ONLINE',
    profile_status: p.profile_status || 'APPROVED',
    is_verified: p.is_verified ?? true,
    is_premium: p.is_premium ?? false,
  };
}

// Full Fresh Database and User Reset System
const CLEAN_RESET_KEY = 'nikah_circle_clean_reset_v1001';

export function performInitialResetIfRequired() {
  try {
    if (localStorage.getItem(CLEAN_RESET_KEY) !== 'true') {
      localStorage.removeItem('nikah_circle_profiles_v2');
      localStorage.removeItem('nikah_circle_payments_v2');
      localStorage.removeItem('nikah_circle_premium_requests_v1');
      localStorage.removeItem('nikah_circle_bookmarks_v2');
      localStorage.removeItem('nikah_circle_proposals_registry_v3');
      localStorage.removeItem('nikah_circle_interests_map_v3');
      localStorage.removeItem('nikah_circle_interests_map_v2');
      localStorage.removeItem('nikah_circle_incoming_interests_v2');
      localStorage.removeItem('nikah_circle_incoming_interests');
      localStorage.removeItem('nikah_circle_user');
      localStorage.removeItem('nikah_circle_user_profile');
      localStorage.removeItem('nikah_circle_user_is_premium');
      localStorage.removeItem('nikah_circle_user_plan_name');
      localStorage.removeItem('nikah_circle_deleted_records_v2');
      localStorage.removeItem('nikah_circle_used_referral_codes_v1');
      // Starts counter at 1000 so the very first member registered is NCSM1001
      localStorage.setItem(MEMBER_ID_SEQ_KEY, '1000');
      localStorage.setItem(CLEAN_RESET_KEY, 'true');
    }
  } catch (e) {
    console.warn('Initial reset error', e);
  }
}

// Execute immediately when imported
performInitialResetIfRequired();


