// Nikah Circle - Referral-Based Temporary Premium Reward System
// 3 successful new referrals = 1 Week (7 Days) Free Premium Access

export interface ReferralRecord {
  id: string;
  referrerCode: string;
  refereeMemberId: string;
  refereeName: string;
  timestamp: number;
}

export interface ReferralStatus {
  referralCode: string;
  referralUrl: string;
  totalReferrals: number;
  currentProgress: number; // 0, 1, or 2 (out of 3)
  neededForReward: number; // 3 - currentProgress
  claimedCycles: number;
  isRewardActive: boolean;
  rewardExpiresAt: number | null;
  daysRemaining: number;
}

const REFERRALS_LIST_KEY = 'nikah_circle_referrals_list_v1';
const CLAIMED_CYCLES_KEY = 'nikah_circle_claimed_cycles_v1';
const REWARD_STORE_KEY = 'nikah_circle_referral_reward_v1';
const PENDING_REFERRER_KEY = 'nikah_circle_pending_referrer';

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
    const raw = localStorage.getItem(REFERRALS_LIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
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

function getClaimedCyclesMap(): Record<string, number> {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(CLAIMED_CYCLES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveClaimedCyclesMap(map: Record<string, number>): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(CLAIMED_CYCLES_KEY, JSON.stringify(map));
  } catch {}
}

function getRewardsMap(): Record<string, { active: boolean; expiresAt: number }> {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(REWARD_STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveRewardsMap(map: Record<string, { active: boolean; expiresAt: number }>): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(REWARD_STORE_KEY, JSON.stringify(map));
  } catch {}
}

// Record a new sign-up and check if 3 referrals have been reached
export function recordReferralSignup(refereeMemberId: string, refereeName: string): boolean {
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
      (r) => r.refereeMemberId && r.refereeMemberId.trim().toUpperCase() === normalizedReferee
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
      timestamp: Date.now(),
    };

    const updatedList = [...list, newRecord];
    saveStoredReferrals(updatedList);
    clearPendingReferrerCode();

    // Check if this newly earned referral completed a batch of 3!
    const forThisReferrer = updatedList.filter((r) => r.referrerCode === referrerCode);
    const claimedMap = getClaimedCyclesMap();
    const claimed = claimedMap[referrerCode] || 0;
    const progress = forThisReferrer.length - claimed * 3;

    if (progress >= 3) {
      // Award 7 Days (1 Week) Free Premium Access
      claimedMap[referrerCode] = claimed + 1;
      saveClaimedCyclesMap(claimedMap);

      const rewards = getRewardsMap();
      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
      rewards[referrerCode] = {
        active: true,
        expiresAt: Date.now() + SEVEN_DAYS_MS,
      };
      saveRewardsMap(rewards);
    }

    return true;
  } catch (e) {
    console.warn('Could not record referral signup', e);
    return false;
  }
}

// Calculate the full status, progress (0/3), and auto-expiry for a given member
export function getReferralStatus(memberId?: string | null): ReferralStatus {
  const code = (memberId || 'NCSM1003').trim().toUpperCase();
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://nikahcircle.com';
  const referralUrl = `${origin}/?ref=${encodeURIComponent(code)}`;

  const allReferrals = getStoredReferrals();
  const userReferrals = allReferrals.filter((r) => r.referrerCode === code);
  const totalReferrals = userReferrals.length;

  const claimedMap = getClaimedCyclesMap();
  let claimedCycles = claimedMap[code] || 0;

  // Check if unawarded batch of 3 exists
  let currentProgress = totalReferrals - claimedCycles * 3;
  if (currentProgress >= 3) {
    claimedCycles += 1;
    claimedMap[code] = claimedCycles;
    saveClaimedCyclesMap(claimedMap);

    const rewards = getRewardsMap();
    rewards[code] = {
      active: true,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    saveRewardsMap(rewards);
    currentProgress = totalReferrals - claimedCycles * 3;
  }

  // Ensure current progress is capped within 0..2
  currentProgress = Math.max(0, currentProgress);
  const neededForReward = Math.max(1, 3 - currentProgress);

  // Check reward active status and auto-expiry
  const rewards = getRewardsMap();
  const reward = rewards[code];
  let isRewardActive = false;
  let rewardExpiresAt: number | null = null;
  let daysRemaining = 0;

  if (reward && reward.expiresAt) {
    if (Date.now() < reward.expiresAt) {
      isRewardActive = true;
      rewardExpiresAt = reward.expiresAt;
      daysRemaining = Math.max(1, Math.ceil((reward.expiresAt - Date.now()) / (24 * 60 * 60 * 1000)));
    } else {
      // Auto-expired!
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
    currentProgress,
    neededForReward,
    claimedCycles,
    isRewardActive,
    rewardExpiresAt,
    daysRemaining,
  };
}

export function getWhatsAppShareUrl(referralUrl: string, memberId?: string): string {
  const message = `Assalamu Alaikum! Join me on Nikah Circle — Kerala & GCC's trusted Islamic Matrimony platform. Find pious matches with photo modesty & guardian facilitation:\n\n${referralUrl}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}
