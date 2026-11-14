import { createClient } from '@supabase/supabase-js';
import { Profile, Payment, InterestRecord, PremiumRequest, normalizeGender, autoCorrectMistakenGenders } from '../types';

export { normalizeGender, autoCorrectMistakenGenders };

export const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SUPABASE_URL) || "https://fowkuwwfmnzupzbrrxqf.supabase.co";
export const SUPABASE_KEY = 
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SUPABASE_ANON_KEY) || "sb_publishable_fHxx0xpO65_m7WCrMRX6DQ_fShiZpoI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Empty default profiles & mock data for fresh system start
export const DEFAULT_PROFILES: Profile[] = [];
export const DEFAULT_PAYMENTS: Payment[] = [];

// Offline & Hybrid Data Layer
const PROFILES_STORAGE_KEY = "nikah_circle_profiles_v2";
const PAYMENTS_STORAGE_KEY = "nikah_circle_payments_v2";
const BOOKMARKS_STORAGE_KEY = "nikah_circle_bookmarks_v2";
const INTERESTS_MAP_KEY = "nikah_circle_interests_map_v3";

// Strict validation: returns true ONLY if the candidate has actually completed and submitted their full biodata
export function hasCompletedBiodata(p?: Partial<Profile> | null): boolean {
  if (!p) return false;
  // 1. Explicitly attached biodata document file
  if (Boolean(p.biodata_document_name || p.biodata_document_url)) return true;

  // 2. Multi-stage wizard completed:
  // Must have biodata_uploaded === true AND must have filled actual wizard details
  // Wizard-only fields: family background, family members, marriage expectations, or religious education with physical details
  const hasWizardFlag = p.biodata_uploaded === true;
  const hasFamilyOrExpectations = Boolean(p.family_background || p.family_members_details || p.marriage_expectations);
  const hasPhysicalOrEdu = Boolean(p.religious_education || p.complexion || p.physical_build || p.religious_ideation || p.height);

  if (hasWizardFlag && (hasFamilyOrExpectations || hasPhysicalOrEdu)) {
    return true;
  }

  // Also qualify if both family background and marriage expectations (Steps 3 & 4) are explicitly present
  if (Boolean(p.family_background) && Boolean(p.marriage_expectations)) {
    return true;
  }

  return false;
}

// Strict deduplication function to prevent duplicate user cards, tables, or ghost profiles
export function deduplicateProfiles(inputProfiles: Profile[]): Profile[] {
  const result: Profile[] = [];

  for (const prof of inputProfiles) {
    if (!prof) continue;

    const pEmail = (prof.email || '').toLowerCase().trim();
    const pMobile = prof.mobile ? prof.mobile.replace(/\D/g, '').slice(-8) : '';
    const pMemberId = prof.member_id ? prof.member_id.trim().toUpperCase() : '';
    const pId = prof.id || '';
    const pName = (prof.full_name || '').toLowerCase().trim();

    const existingIdx = result.findIndex((existing) => {
      if (pId && existing.id && pId === existing.id) return true;
      if (pEmail && existing.email && pEmail === existing.email.toLowerCase().trim()) return true;
      const exMobile = existing.mobile ? existing.mobile.replace(/\D/g, '').slice(-8) : '';
      if (pMobile && exMobile && pMobile.length >= 7 && pMobile === exMobile) return true;
      if (pName && existing.full_name && pName.length >= 3 && pName === existing.full_name.toLowerCase().trim() && (pMobile === exMobile || (pEmail && pEmail === (existing.email || '').toLowerCase().trim()))) return true;
      // Never match purely by member_id unless name, phone or email also matches
      if (
        pMemberId &&
        existing.member_id &&
        pMemberId === existing.member_id.trim().toUpperCase() &&
        (pName === (existing.full_name || '').toLowerCase().trim() ||
          (pMobile && exMobile && pMobile === exMobile) ||
          (pEmail && pEmail === (existing.email || '').toLowerCase().trim()))
      ) {
        return true;
      }
      return false;
    });

    if (existingIdx === -1) {
      result.push(prof);
    } else {
      const existing = result[existingIdx];

      const nExisting = extractMemberIdNumber(existing.member_id);
      const nProf = extractMemberIdNumber(prof.member_id);
      const bestMemberId = nProf && nProf >= 1003 ? prof.member_id : (nExisting && nExisting >= 1003 ? existing.member_id : (prof.member_id || existing.member_id));

      const isPrem = Boolean(existing.is_premium || prof.is_premium);
      const isApproved = existing.profile_status === 'APPROVED' || prof.profile_status === 'APPROVED';
      const hasBiodata = hasCompletedBiodata(existing) || hasCompletedBiodata(prof);

      result[existingIdx] = {
        ...prof,
        ...existing,
        id: existing.id || prof.id,
        member_id: bestMemberId,
        full_name: (existing.full_name && existing.full_name !== 'Candidate' && existing.full_name !== 'Member') ? existing.full_name : prof.full_name,
        email: existing.email || prof.email,
        mobile: existing.mobile || prof.mobile,
        gender: normalizeGender(existing.gender || prof.gender),
        is_premium: isPrem,
        premium_plan: existing.premium_plan || prof.premium_plan || (isPrem ? 'Premium Plan' : null),
        profile_status: isApproved ? 'APPROVED' : (existing.profile_status || prof.profile_status || 'APPROVED'),
        is_verified: true,
        biodata_uploaded: hasBiodata,
        biodata_document_name: existing.biodata_document_name || prof.biodata_document_name || null,
        biodata_document_url: existing.biodata_document_url || prof.biodata_document_url || null,
        place: existing.place || prof.place,
        district: existing.district || prof.district,
        location: existing.location || prof.location,
        education: existing.education || prof.education,
        profession: existing.profession || prof.profession,
        guardian_name: existing.guardian_name || prof.guardian_name,
        guardian_mobile: existing.guardian_mobile || prof.guardian_mobile,
      };
    }
  }

  return result;
}

// Guaranteed unique, sequential Member ID normalization & collision resolver
export function ensureUniqueSequentialMemberIds(profiles: Profile[]): Profile[] {
  if (!Array.isArray(profiles) || profiles.length === 0) return [];

  const assigned = new Map<string, string>(); // member_id -> unique profile key
  let maxNumber = 1002;

  // Step 1: Retain valid unique IDs >= 1003
  const processed = profiles.map((p) => {
    let currentId = p.member_id || '';
    if (!currentId && p.about) {
      const { meta } = decodeProfileMetadata(p.about);
      if (meta?.member_id) {
        currentId = meta.member_id;
      }
    }

    const num = extractMemberIdNumber(currentId);
    // If it has a valid number >= 1003 that hasn't been claimed yet
    if (num && num >= 1003 && !assigned.has(`NCSM${num}`)) {
      assigned.set(`NCSM${num}`, p.id || p.email || p.mobile || p.full_name);
      if (num > maxNumber) maxNumber = num;
      return { ...p, member_id: `NCSM${num}` };
    }

    // Needs a new or re-assigned unique sequential ID
    return { ...p, member_id: '' };
  });

  // Step 2: Assign sequential unique IDs starting from NCSM1003 to any profiles needing one
  let nextSeq = 1003;
  const finalized = processed.map((p) => {
    if (p.member_id && assigned.has(p.member_id)) {
      return p;
    }
    while (assigned.has(`NCSM${nextSeq}`)) {
      nextSeq++;
    }
    const newId = `NCSM${nextSeq}`;
    assigned.set(newId, p.id || p.email || p.full_name);
    if (nextSeq > maxNumber) maxNumber = nextSeq;
    nextSeq++;
    return { ...p, member_id: newId };
  });

  // Step 3: Persist the highest sequence counter into localStorage
  try {
    localStorage.setItem(MEMBER_ID_SEQ_KEY, Math.max(1002, maxNumber).toString());
  } catch {}

  return finalized;
}

export function getStoredProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = deduplicateProfiles(parsed.map((p) => autoCorrectMistakenGenders(p)));
        return ensureUniqueSequentialMemberIds(cleaned);
      }
    }
  } catch (e) {
    console.warn("Could not read local profiles", e);
  }
  return DEFAULT_PROFILES;
}

export function saveStoredProfiles(profiles: Profile[]) {
  try {
    const deduped = deduplicateProfiles(profiles);
    const uniqueIds = ensureUniqueSequentialMemberIds(deduped);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(uniqueIds));
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
  return [];
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

// Sequential Auto-Increment Member ID System: NCSM1003, NCSM1004, NCSM1005...
export const MEMBER_ID_SEQ_KEY = 'nikah_circle_member_id_seq_v9';

export function extractMemberIdNumber(idStr?: string | null): number | null {
  if (!idStr || typeof idStr !== 'string') return null;
  const match = idStr.match(/NCSM(\d+)/i);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    if (!isNaN(num) && num >= 1003) return num;
  }
  return null;
}

export function getHighestExistingMemberNumber(
  existingProfiles?: Array<{ member_id?: string | null; id?: string | null; about?: string | null }>
): number {
  // Baseline is 1002 so the first newly registered user starts strictly from NCSM1003
  let highest = 1002;

  // 1. Check passed profiles
  if (Array.isArray(existingProfiles)) {
    for (const p of existingProfiles) {
      if (!p) continue;
      const numFromMemberId = extractMemberIdNumber(p.member_id);
      if (numFromMemberId && numFromMemberId > highest) highest = numFromMemberId;
      const numFromId = extractMemberIdNumber(p.id);
      if (numFromId && numFromId > highest) highest = numFromId;
      if (p.about) {
        const { meta } = decodeProfileMetadata(p.about);
        const numFromMeta = extractMemberIdNumber(meta?.member_id);
        if (numFromMeta && numFromMeta > highest) highest = numFromMeta;
      }
    }
  }

  // 2. Check local profiles cache
  try {
    const rawProfiles = localStorage.getItem('nikah_circle_profiles_v2');
    if (rawProfiles) {
      const parsed = JSON.parse(rawProfiles);
      if (Array.isArray(parsed)) {
        for (const p of parsed) {
          if (!p) continue;
          const n1 = extractMemberIdNumber(p.member_id);
          if (n1 && n1 > highest) highest = n1;
          const n2 = extractMemberIdNumber(p.id);
          if (n2 && n2 > highest) highest = n2;
        }
      }
    }
  } catch {}

  // 3. Check current user profile & user object
  try {
    const rawCup = localStorage.getItem('nikah_circle_user_profile');
    if (rawCup) {
      const cup = JSON.parse(rawCup);
      const n = extractMemberIdNumber(cup.member_id) || extractMemberIdNumber(cup.id);
      if (n && n > highest) highest = n;
    }
    const rawUser = localStorage.getItem('nikah_circle_user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      const n = extractMemberIdNumber(u.member_id) || extractMemberIdNumber(u.id);
      if (n && n > highest) highest = n;
    }
  } catch {}

  // 4. Check sequence counter storage key
  try {
    const seqRaw =
      localStorage.getItem(MEMBER_ID_SEQ_KEY) ||
      localStorage.getItem('nikah_circle_member_id_seq_v8') ||
      localStorage.getItem('nikah_circle_member_id_seq_v7') ||
      localStorage.getItem('nikah_circle_member_id_seq_v6') ||
      localStorage.getItem('nikah_circle_member_id_seq_v5') ||
      localStorage.getItem('nikah_circle_member_id_seq_v4');
    if (seqRaw) {
      const num = parseInt(seqRaw, 10);
      if (!isNaN(num) && num > highest) highest = num;
    }
  } catch {}

  return highest;
}

export function getNextMemberId(
  existingProfiles?: Array<{ member_id?: string | null; id?: string | null; about?: string | null }>
): string {
  try {
    const highest = getHighestExistingMemberNumber(existingProfiles);
    const next = Math.max(1003, highest + 1);
    try {
      localStorage.setItem(MEMBER_ID_SEQ_KEY, next.toString());
    } catch {}
    return `NCSM${next}`;
  } catch {
    return 'NCSM1003';
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
    height: profile.height,
    complexion: profile.complexion,
    physical_build: profile.physical_build,
    religious_ideation: profile.religious_ideation,
    children_count: profile.children_count,
    religious_education: profile.religious_education,
    bouthika_education: profile.bouthika_education,
    job_location: profile.job_location,
    financial_status: profile.financial_status,
    preferred_districts: profile.preferred_districts,
    family_members_details: profile.family_members_details,
    family_background: profile.family_background,
    marriage_expectations: profile.marriage_expectations,
    blood_group: profile.blood_group,
    passport_visa_status: profile.passport_visa_status,
    other_interests: profile.other_interests,
  };

  const encodedAbout = encodeProfileMetadata(profile.about, meta);

  const payload: any = {
    full_name: profile.full_name || 'Member',
    email: profile.email || null,
    mobile: profile.mobile || null,
    gender: normalizeGender(profile.gender),
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
  const parsedNum =
    extractMemberIdNumber(meta?.member_id) ||
    extractMemberIdNumber(p.member_id) ||
    extractMemberIdNumber(p.id);

  let memberId = '';
  if (parsedNum && parsedNum >= 1003) {
    memberId = `NCSM${parsedNum}`;
  } else if (typeof defaultIndex === 'number') {
    memberId = `NCSM${1003 + defaultIndex}`;
  } else {
    memberId = '';
  }

  return autoCorrectMistakenGenders({
    ...p,
    id: p.id,
    member_id: memberId,
    full_name: p.full_name || 'Member',
    gender: normalizeGender(p.gender),
    marital_status: p.marital_status || 'Never Married',
    about: about,
    place: meta.place || p.place || (p.location ? p.location.split(',')[0].trim() : null),
    state: meta.state || p.state || 'Kerala',
    biodata_uploaded: meta.biodata_uploaded ?? (p.biodata_uploaded || false),
    biodata_document_name: meta.biodata_document_name || p.biodata_document_name || null,
    biodata_document_url: meta.biodata_document_url || p.biodata_document_url || null,
    hobbies: meta.hobbies || p.hobbies || [],
    interests: meta.interests || p.interests || [],
    height: meta.height || p.height || null,
    complexion: meta.complexion || (p as any).complexion || null,
    physical_build: meta.physical_build || (p as any).physical_build || null,
    religious_ideation: meta.religious_ideation || (p as any).religious_ideation || null,
    children_count: meta.children_count || (p as any).children_count || null,
    religious_education: meta.religious_education || (p as any).religious_education || null,
    bouthika_education: meta.bouthika_education || (p as any).bouthika_education || null,
    job_location: meta.job_location || (p as any).job_location || null,
    financial_status: meta.financial_status || (p as any).financial_status || null,
    preferred_districts: meta.preferred_districts || (p as any).preferred_districts || null,
    family_members_details: meta.family_members_details || (p as any).family_members_details || null,
    family_background: meta.family_background || (p as any).family_background || null,
    marriage_expectations: meta.marriage_expectations || (p as any).marriage_expectations || null,
    blood_group: meta.blood_group || (p as any).blood_group || null,
    passport_visa_status: meta.passport_visa_status || (p as any).passport_visa_status || null,
    other_interests: meta.other_interests || (p as any).other_interests || null,
    registration_type: p.registration_type || 'ONLINE',
    profile_status: p.profile_status || 'APPROVED',
    is_verified: p.is_verified ?? true,
    is_premium: p.is_premium ?? false,
  });
}

// Full Fresh Database and User Reset System
const CLEAN_RESET_KEY = 'nikah_circle_clean_reset_v9000';

export function performInitialResetIfRequired() {
  try {
    if (typeof localStorage === 'undefined') return;
    if (localStorage.getItem(CLEAN_RESET_KEY) !== 'true') {
      // Clear all user sessions and cached data
      localStorage.removeItem('nikah_circle_user_profile');
      localStorage.removeItem('nikah_circle_user');
      localStorage.removeItem('nikah_circle_user_is_premium');
      localStorage.removeItem('nikah_circle_is_admin');
      localStorage.removeItem('nikah_circle_deleted_records_v2');
      localStorage.removeItem('nikah_circle_profiles_v2');
      localStorage.removeItem('nikah_circle_payments_v2');
      localStorage.removeItem('nikah_circle_bookmarks_v2');
      localStorage.removeItem('nikah_circle_incoming_interests_v2');
      localStorage.removeItem('nikah_circle_incoming_interests');
      localStorage.removeItem('nikah_circle_interests_map_v3');
      localStorage.removeItem('nikah_circle_interests_map_v2');
      localStorage.removeItem('nikah_circle_proposals_registry_v3');
      localStorage.removeItem('nikah_circle_proposals_registry_v2');
      localStorage.removeItem('nikah_circle_premium_requests_v1');
      localStorage.removeItem('nikah_circle_used_referral_codes_v1');
      localStorage.removeItem('nikah_circle_premium_admin_status');
      localStorage.removeItem('nikah_circle_premium_expiry');
      localStorage.removeItem('nikah_circle_member_id_seq_v4');
      localStorage.removeItem('nikah_circle_member_id_seq_v5');
      localStorage.removeItem('nikah_circle_member_id_seq_v6');
      localStorage.removeItem('nikah_circle_member_id_seq_v7');
      localStorage.removeItem('nikah_circle_member_id_seq_v8');
      localStorage.removeItem('nikah_circle_member_id_seq_v9');

      // Set baseline sequence counter to 1002 so first newly registered user starts strictly from NCSM1003
      localStorage.setItem(MEMBER_ID_SEQ_KEY, '1002');
      localStorage.setItem(CLEAN_RESET_KEY, 'true');
    }
  } catch (e) {
    console.warn('Initial reset error', e);
  }
}

// Execute immediately when imported
performInitialResetIfRequired();


