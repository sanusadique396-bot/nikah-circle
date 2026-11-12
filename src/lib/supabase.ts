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


