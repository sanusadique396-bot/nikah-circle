// Nikah Circle - Dual Referral Reward System
// Rule 1: 1 friend joins via link and creates a profile = 1 Week (7 Days) Free Premium Access
// Rule 2: 3 friends who joined via link take/upgrade to Premium = 1 Month (30 Days) Free Premium Access

import { Profile } from '../types';

export interface ReferralRecord {
  id: string;
  referrerCode: string;
  refereeMemberId: string;
  refereeName: string;
  refereePhone?: string;
  timestamp: number;
  hasCreatedProfile: boolean;
  hasTakenPremium: boolean;
  premiumTimestamp?: number;
}

export interface ReferralStatus {
  referralCode: string;
  referralUrl: string;

  // Tier 1: 1 Referral Signup = 1 Week Free Premium (7 Days)
  totalReferrals: number;
  signupRewardsEarned: number;

  // Tier 2: 3 Friends with Premium = 1 Month Free Premium (30 Days)
  premiumReferralsCount: number;
  premiumProgress: number; // 0, 1, or 2 (out of 3 for current cycle)
  premiumNeeded: number; // 3 - premiumProgress
  premiumRewardsEarned: number; // number of 30-day rewards claimed

  // Active status & expiry
  isRewardActive: boolean;
  rewardExpiresAt: number | null;
  daysRemaining: number;
  rewardSource?: 'signup' | 'premium' | 'both';
}

interface StoredReward {
  active: boolean;
  expiresAt: number;
  claimedSignupCount?: number;
  claimedPremiumCycles?: number;
}

const REFERRALS_LIST_KEY = 'nikah_circle_referrals_list_v2';
const REWARD_STORE_KEY = 'nikah_circle_referral_reward_v2';
const PENDING_REFERRER_KEY = 'nikah_circle_pending_referrer';

// Special Promo Campaign: NCSMREF110022
// Validity: 16/11/2026 to 24/11/2026 (Offer period)
// Reward: 2 MONTHS (60 Days) Free Premium Access
export const SPECIAL_PROMO_CODE = 'NCSMREF110022';
export const PROMO_START_DATE = '2026-11-16';
export const PROMO_END_DATE = '2026-11-24';
export const PROMO_DURATION_DAYS = 60; // 2 Months Free Premium

// Referral Widget Display Window (Per user request: 24/11/26 മുതൽ 30/11/26 വരെ മാത്രം open)
export const REFERRAL_WIDGET_START_DATE = '2026-11-24';
export const REFERRAL_WIDGET_END_DATE = '2026-11-30';

/**
 * Checks whether the current date (in IST UTC+5:30) falls between startDate and endDate (inclusive)
 */
export function isDateInRange(startDateStr: string, endDateStr: string): boolean {
  try {
    const now = new Date();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffsetMs);
    const currentDateStr = istDate.toISOString().slice(0, 10);
    return currentDateStr >= startDateStr && currentDateStr <= endDateStr;
  } catch {
    return false;
  }
}

/**
 * Validates promo code NCSMREF110022 during the active offer window (16/11/2026 to 24/11/2026)
 */
export function checkSpecialPromoCode(code?: string | null): {
  isPromoCode: boolean;
  isValid: boolean;
  isExpired: boolean;
  isNotYetActive: boolean;
  message: string;
  durationMonths: number;
  durationDays: number;
} {
  if (!code) {
    return {
      isPromoCode: false,
      isValid: false,
      isExpired: false,
      isNotYetActive: false,
      message: '',
      durationMonths: 0,
      durationDays: 0,
    };
  }

  const clean = code.trim().toUpperCase();
  if (clean !== SPECIAL_PROMO_CODE) {
    return {
      isPromoCode: false,
      isValid: false,
      isExpired: false,
      isNotYetActive: false,
      message: '',
      durationMonths: 0,
      durationDays: 0,
    };
  }

  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffsetMs);
  const istDateStr = istDate.toISOString().slice(0, 10);

  if (istDateStr < PROMO_START_DATE) {
    return {
      isPromoCode: true,
      isValid: false,
      isExpired: false,
      isNotYetActive: true,
      message: `Offer starts on 16/11/2026. (Offer Period: 16/11/2026 to 24/11/2026).`,
      durationMonths: 2,
      durationDays: PROMO_DURATION_DAYS,
    };
  }

  if (istDateStr > PROMO_END_DATE) {
    return {
      isPromoCode: true,
      isValid: false,
      isExpired: true,
      isNotYetActive: false,
      message: `Offer expired on 24/11/2026. Code ${SPECIAL_PROMO_CODE} is no longer active.`,
      durationMonths: 2,
      durationDays: PROMO_DURATION_DAYS,
    };
  }

  return {
    isPromoCode: true,
    isValid: true,
    isExpired: false,
    isNotYetActive: false,
    message: `🎉 Offer Active! 2 MONTHS FREE PREMIUM (Valid: 16/11/2026 to 24/11/2026)`,
    durationMonths: 2,
    durationDays: PROMO_DURATION_DAYS,
  };
}

/**
 * Checks whether the Referral Rewards Widget ("Share App & Earn Free Premium")
 * should be visible to users. Per user requirement:
 * "24/11/26 MUTHAL OPEN CHEITHAAL MATH 30/11/26 VARE MATHRAM OPEN. VIEW EEESAMAYATH MATHI"
 */
export function isReferralWidgetOpen(): boolean {
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('preview_referral') === '1' || params.get('show_referral') === '1') {
        return true;
      }
      if (localStorage.getItem('nikah_circle_is_admin') === 'true') {
        return true;
      }
    }
  } catch {}

  return isDateInRange(REFERRAL_WIDGET_START_DATE, REFERRAL_WIDGET_END_DATE);
}

/**
 * Checks whether the NCSMREF110022 Promo Offer Card should be shown in Hero (16/11/2026 to 24/11/2026)
 */
export function isPromoOfferCardActive(): boolean {
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('preview_promo') === '1') {
        return true;
      }
    }
  } catch {}

  return isDateInRange(PROMO_START_DATE, PROMO_END_DATE);
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Parse and store pending referrer code from URL (?ref=CODE)
export function checkAndCaptureUrlReferral(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('referral');
    if (ref && ref.trim().length >= 3) {
      const cleanRef = ref.trim().toUpperCase();
      localStorage.setItem(PENDING_REFERRER_KEY, cleanRef);
      return cleanRef;
    }
  } catch {}
  return null;
}

export function getPendingReferrerCode(): string | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(PENDING_REFERRER_KEY);
  } catch {
    return null;
  }
}

export function clearPendingReferrerCode(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(PENDING_REFERRER_KEY);
  } catch {}
}

export function getStoredReferrals(): ReferralRecord[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    // Migrate from v1 if present
    const rawV2 = localStorage.getItem(REFERRALS_LIST_KEY);
    if (rawV2) {
      const parsed = JSON.parse(rawV2);
      if (Array.isArray(parsed)) return parsed;
    }
    const rawV1 = localStorage.getItem('nikah_circle_referrals_list_v1');
    if (rawV1) {
      const parsed = JSON.parse(rawV1);
      if (Array.isArray(parsed)) {
        const migrated: ReferralRecord[] = parsed.map((p) => ({
          ...p,
          hasCreatedProfile: true,
          hasTakenPremium: Boolean((p as any).hasTakenPremium),
        }));
        saveStoredReferrals(migrated);
        return migrated;
      }
    }
  } catch {}
  return [];
}

export function saveStoredReferrals(list: ReferralRecord[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(REFERRALS_LIST_KEY, JSON.stringify(list));
  } catch {}
}

function getRewardsMap(): Record<string, StoredReward> {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(REWARD_STORE_KEY);
    if (raw) return JSON.parse(raw);
    const rawV1 = localStorage.getItem('nikah_circle_referral_reward_v1');
    if (rawV1) return JSON.parse(rawV1);
  } catch {}
  return {};
}

function saveRewardsMap(map: Record<string, StoredReward>): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(REWARD_STORE_KEY, JSON.stringify(map));
  } catch {}
}

// Rule 1: Record a new sign-up where the referred friend creates a profile.
// Automatically awards 1 Week (7 Days) Free Premium immediately!
export function recordReferralSignup(
  refereeMemberId: string,
  refereeName: string,
  refereePhone?: string
): boolean {
  try {
    const referrerCode = getPendingReferrerCode();
    if (!referrerCode) return false;

    // A user cannot refer themselves
    const normalizedReferee = (refereeMemberId || '').trim().toUpperCase();
    if (referrerCode === normalizedReferee) {
      clearPendingReferrerCode();
      return false;
    }

    const list = getStoredReferrals();
    // Prevent duplicate referral counting for the same referee
    const alreadyRecorded = list.some(
      (r) =>
        (r.refereeMemberId && r.refereeMemberId.trim().toUpperCase() === normalizedReferee) ||
        (refereePhone && r.refereePhone && r.refereePhone.replace(/\D/g, '').slice(-8) === refereePhone.replace(/\D/g, '').slice(-8))
    );
    if (alreadyRecorded) {
      clearPendingReferrerCode();
      return false;
    }

    const newRecord: ReferralRecord = {
      id: `ref-event-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      referrerCode,
      refereeMemberId: normalizedReferee,
      refereeName: refereeName || 'New Member',
      refereePhone: refereePhone || undefined,
      timestamp: Date.now(),
      hasCreatedProfile: true,
      hasTakenPremium: false,
    };

    const updatedList = [...list, newRecord];
    saveStoredReferrals(updatedList);
    clearPendingReferrerCode();

    // RULE 1: AWARD 1 WEEK (7 DAYS) FREE PREMIUM IMMEDIATELY UPON 1 FRIEND'S SIGNUP!
    const rewards = getRewardsMap();
    const current = rewards[referrerCode] || {
      active: false,
      expiresAt: 0,
      claimedSignupCount: 0,
      claimedPremiumCycles: 0,
    };

    const baseExpiry = current.expiresAt && current.expiresAt > Date.now() ? current.expiresAt : Date.now();
    current.expiresAt = baseExpiry + SEVEN_DAYS_MS;
    current.active = true;
    current.claimedSignupCount = (current.claimedSignupCount || 0) + 1;
    rewards[referrerCode] = current;
    saveRewardsMap(rewards);

    return true;
  } catch (e) {
    console.warn('Could not record referral signup', e);
    return false;
  }
}

// Rule 2: When 3 friends who joined through someone's link take/purchase a Premium Plan,
// automatically awards 1 Month (30 Days) Free Premium!
export function recordReferralPremiumUpgrade(
  refereeMemberIdOrPhone: string,
  refereeName?: string,
  refereePhone?: string,
  explicitReferralCode?: string | null
): boolean {
  try {
    const list = getStoredReferrals();
    const targetNorm = (refereeMemberIdOrPhone || '').trim().toUpperCase();
    const phoneNorm = refereePhone ? refereePhone.replace(/\D/g, '').slice(-8) : (refereeMemberIdOrPhone ? refereeMemberIdOrPhone.replace(/\D/g, '').slice(-8) : '');

    let matchedRecordIndex = list.findIndex(
      (r) =>
        (r.refereeMemberId && r.refereeMemberId.trim().toUpperCase() === targetNorm) ||
        (phoneNorm && r.refereePhone && r.refereePhone.replace(/\D/g, '').slice(-8) === phoneNorm)
    );

    let referrerCode = '';

    if (matchedRecordIndex >= 0) {
      referrerCode = list[matchedRecordIndex].referrerCode;
      if (!list[matchedRecordIndex].hasTakenPremium) {
        list[matchedRecordIndex].hasTakenPremium = true;
        list[matchedRecordIndex].premiumTimestamp = Date.now();
        saveStoredReferrals(list);
      }
    } else if (explicitReferralCode && explicitReferralCode.trim().length >= 3) {
      // Direct referral code entered at checkout
      referrerCode = explicitReferralCode.trim().toUpperCase();
      const newRec: ReferralRecord = {
        id: `ref-prem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        referrerCode,
        refereeMemberId: targetNorm || `MEMBER-${Date.now()}`,
        refereeName: refereeName || 'Premium Subscriber',
        refereePhone: refereePhone || phoneNorm,
        timestamp: Date.now(),
        hasCreatedProfile: true,
        hasTakenPremium: true,
        premiumTimestamp: Date.now(),
      };
      list.push(newRec);
      saveStoredReferrals(list);
    }

    if (!referrerCode) return false;

    // Check how many premium referees this referrer has
    const userReferrals = list.filter((r) => r.referrerCode === referrerCode && r.hasTakenPremium);
    const premiumCount = userReferrals.length;

    const rewards = getRewardsMap();
    const current = rewards[referrerCode] || {
      active: false,
      expiresAt: 0,
      claimedSignupCount: 0,
      claimedPremiumCycles: 0,
    };

    const claimedCycles = current.claimedPremiumCycles || 0;
    const earnedCycles = Math.floor(premiumCount / 3);

    if (earnedCycles > claimedCycles) {
      const newCyclesToAward = earnedCycles - claimedCycles;
      const baseExpiry = current.expiresAt && current.expiresAt > Date.now() ? current.expiresAt : Date.now();
      current.expiresAt = baseExpiry + newCyclesToAward * THIRTY_DAYS_MS;
      current.active = true;
      current.claimedPremiumCycles = earnedCycles;
      rewards[referrerCode] = current;
      saveRewardsMap(rewards);
    }

    return true;
  } catch (e) {
    console.warn('Could not record referral premium upgrade', e);
    return false;
  }
}

// Auto-sync referrals against actual profiles to guarantee consistency
export function syncReferralsWithProfiles(profiles: Profile[]): void {
  try {
    if (!profiles || profiles.length === 0) return;
    const list = getStoredReferrals();
    let hasChanges = false;

    for (const record of list) {
      if (record.hasTakenPremium) continue;

      const normId = record.refereeMemberId?.trim().toUpperCase();
      const normPhone = record.refereePhone ? record.refereePhone.replace(/\D/g, '').slice(-8) : '';

      const matched = profiles.find(
        (p) =>
          (p.member_id && p.member_id.trim().toUpperCase() === normId) ||
          (normPhone && p.mobile && p.mobile.replace(/\D/g, '').slice(-8) === normPhone) ||
          (normPhone && p.guardian_mobile && p.guardian_mobile.replace(/\D/g, '').slice(-8) === normPhone)
      );

      if (matched && (matched.is_premium || matched.premium_plan)) {
        record.hasTakenPremium = true;
        record.premiumTimestamp = Date.now();
        hasChanges = true;
      }
    }

    if (hasChanges) {
      saveStoredReferrals(list);
    }
  } catch {}
}

// Calculate the full status, progress (0/1 signup, 0/3 premium), and auto-expiry for a given member
export function getReferralStatus(memberId?: string | null): ReferralStatus {
  const code = (memberId || 'NCSM1003').trim().toUpperCase();
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://nikah-circle.vercel.app';
  const referralUrl = `${origin}/?ref=${encodeURIComponent(code)}`;

  const allReferrals = getStoredReferrals();
  const userReferrals = allReferrals.filter((r) => r.referrerCode === code);

  // 1. Tier 1: Signups
  const totalReferrals = userReferrals.length;
  const signupRewardsEarned = totalReferrals; // Each 1 signup = 1 week free

  // 2. Tier 2: Premium Upgrades
  const premiumReferrals = userReferrals.filter((r) => r.hasTakenPremium);
  const premiumReferralsCount = premiumReferrals.length;
  const premiumProgress = premiumReferralsCount % 3;
  const premiumNeeded = premiumProgress === 0 && premiumReferralsCount > 0 ? 3 : (3 - premiumProgress);
  const premiumRewardsEarned = Math.floor(premiumReferralsCount / 3);

  // Check reward active status and auto-expiry
  const rewards = getRewardsMap();
  const reward = rewards[code];
  let isRewardActive = false;
  let rewardExpiresAt: number | null = null;
  let daysRemaining = 0;
  let rewardSource: 'signup' | 'premium' | 'both' | undefined;

  if (reward && reward.expiresAt) {
    if (Date.now() < reward.expiresAt) {
      isRewardActive = true;
      rewardExpiresAt = reward.expiresAt;
      daysRemaining = Math.max(1, Math.ceil((reward.expiresAt - Date.now()) / (24 * 60 * 60 * 1000)));

      const hasSignup = (reward.claimedSignupCount || 0) > 0;
      const hasPrem = (reward.claimedPremiumCycles || 0) > 0;
      if (hasSignup && hasPrem) rewardSource = 'both';
      else if (hasPrem) rewardSource = 'premium';
      else if (hasSignup) rewardSource = 'signup';
    } else {
      isRewardActive = false;
      rewardExpiresAt = null;
      daysRemaining = 0;
      if (reward.active) {
        reward.active = false;
        rewards[code] = reward;
        saveRewardsMap(rewards);
      }
    }
  }

  return {
    referralCode: code,
    referralUrl,
    totalReferrals,
    signupRewardsEarned,
    premiumReferralsCount,
    premiumProgress,
    premiumNeeded,
    premiumRewardsEarned,
    isRewardActive,
    rewardExpiresAt,
    daysRemaining,
    rewardSource,
  };
}

export function getWhatsAppShareUrl(referralUrl: string, memberId?: string): string {
  const message = `Assalamu Alaikum! Join me on Nikah Circle — Kerala & GCC's trusted Islamic Matrimony platform. Find pious Sunni brides & grooms with photo modesty & verified biodata.\n\nRegister free here:\n${referralUrl}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}
