import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchFilter } from './components/SearchFilter';
import { ProfileCard } from './components/ProfileCard';
import { ProfileModal } from './components/ProfileModal';
import { PremiumModal } from './components/PremiumModal';
import { RegisterModal } from './components/RegisterModal';
import { LoginModal } from './components/LoginModal';
import { AdminPortal } from './components/AdminPortal';
import { UserProfileModal, UserProfileData } from './components/UserProfileModal';
import { BiodataWizardModal } from './components/BiodataWizardModal';
import { Footer } from './components/Footer';
import { OfflineBanner } from './components/OfflineBanner';
import { Profile, Payment, SearchFilters, PremiumRequest, IncomingInterest } from './types';
import {
  supabase,
  getStoredProfiles,
  saveStoredProfiles,
  getStoredPayments,
  saveStoredPayments,
  getStoredBookmarks,
  saveStoredBookmarks,
  getStoredInterestsMap,
  saveStoredInterestsMap,
  getStoredPremiumRequests,
  saveStoredPremiumRequests,
  getNextMemberId,
  extractMemberIdNumber,
  getHighestExistingMemberNumber,
  MEMBER_ID_SEQ_KEY,
  prepareSupabaseProfilePayload,
  parseSupabaseProfile,
  normalizeGender,
  autoCorrectMistakenGenders,
  deduplicateProfiles,
  ensureUniqueSequentialMemberIds,
  decodeProfileMetadata,
  hasCompletedBiodata,
} from './lib/supabase';
import {
  Heart,
  ArrowRight,
  UserCheck,
  Clock,
  Sparkles,
  Lock,
  CheckCircle2,
  Users,
  Inbox,
  Phone,
  MessageCircle,
  Check,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  ShieldCheck,
  X as XIcon,
  Send,
  HeartHandshake,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PROPOSALS_REGISTRY_STORAGE_KEY = 'nikah_circle_proposals_registry_v3';

export const DUMMY_SENDER_NAMES = [
  'Er. Mohammed Nihal',
  'Dr. Rashid Ali P.',
  'Dr. Ayesha Fathima',
  'Shahana Mariyam',
];

// Clear legacy dummy proposal keys on startup so they never contaminate new accounts
try {
  localStorage.removeItem('nikah_circle_incoming_interests_v2');
  localStorage.removeItem('nikah_circle_incoming_interests');
  localStorage.removeItem('nikah_circle_interests_map_v2');
} catch {}

export function getStoredProposals(): IncomingInterest[] {
  try {
    const raw = localStorage.getItem(PROPOSALS_REGISTRY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (p) =>
            p &&
            p.id !== 'inc-001' &&
            p.id !== 'inc-002' &&
            !DUMMY_SENDER_NAMES.includes(p.sender_name)
        );
      }
    }
  } catch {}
  return [];
}

export function saveStoredProposals(proposals: IncomingInterest[]) {
  try {
    localStorage.setItem(PROPOSALS_REGISTRY_STORAGE_KEY, JSON.stringify(proposals));
  } catch {}
}

export function getUserSentInterestsKey(userKey: string) {
  return `nikah_circle_sent_interests_v3_${userKey}`;
}

export function getStoredUserSentInterests(userKey: string): Record<string, 'pending' | 'accepted' | 'declined'> {
  try {
    const raw = localStorage.getItem(getUserSentInterestsKey(userKey));
    if (raw) {
      const parsed = JSON.parse(raw);
      delete parsed['nc-002'];
      return parsed;
    }
  } catch {}
  return {};
}

export function saveStoredUserSentInterests(userKey: string, map: Record<string, 'pending' | 'accepted' | 'declined'>) {
  try {
    localStorage.setItem(getUserSentInterestsKey(userKey), JSON.stringify(map));
  } catch {}
}

const DELETED_RECORDS_STORAGE_KEY = 'nikah_circle_deleted_records_v2';

export function getDeletedRecords(): { ids: string[]; phones: string[]; names: string[] } {
  try {
    const raw = localStorage.getItem(DELETED_RECORDS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { ids: [], phones: [], names: [] };
}

export function saveDeletedRecords(rec: { ids: string[]; phones: string[]; names: string[] }) {
  try {
    localStorage.setItem(DELETED_RECORDS_STORAGE_KEY, JSON.stringify(rec));
  } catch {}
}

export function isProfileDeleted(
  profile: Partial<Profile>,
  deleted = getDeletedRecords()
): boolean {
  // NEVER delete established permanent accounts!
  const email = (profile.email || '').toLowerCase().trim();
  const phone = profile.mobile ? profile.mobile.replace(/\D/g, '').slice(-8) : '';
  const memberId = (profile.member_id || '').toUpperCase();
  if (
    email === 'nikahcircle01@gmail.com' ||
    email === 'sanusadique396@gmail.com' ||
    memberId === 'NCSM1001' ||
    memberId === 'NCSM1002' ||
    phone.endsWith('44905093') ||
    phone.endsWith('43549396')
  ) {
    return false;
  }

  if (profile.id && deleted.ids.includes(profile.id)) return true;
  const gPhone = profile.guardian_mobile ? profile.guardian_mobile.replace(/\D/g, '').slice(-8) : '';
  const name = (profile.full_name || '').toLowerCase().trim();
  if (phone && deleted.phones.some((dp) => dp && dp.length >= 6 && (phone.includes(dp) || dp.includes(phone)))) return true;
  if (gPhone && deleted.phones.some((dp) => dp && dp.length >= 6 && (gPhone.includes(dp) || dp.includes(gPhone)))) return true;
  if (name && deleted.names.some((dn) => dn && dn.length >= 3 && name === dn)) return true;
  return false;
}

export default function App() {
  // Navigation: 'home' | 'profiles' | 'shortlist' | 'interests' | 'admin'
  const [activeView, setActiveView] = useState<'home' | 'profiles' | 'shortlist' | 'interests' | 'admin'>('home');

  // Data Store (strictly filtered and deduplicated)
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const loaded = getStoredProfiles();
    const deleted = getDeletedRecords();
    const filtered = loaded.filter((p) => !isProfileDeleted(p, deleted));
    return deduplicateProfiles(filtered);
  });
  const [payments, setPayments] = useState<Payment[]>(() => getStoredPayments());
  const [premiumRequests, setPremiumRequests] = useState<PremiumRequest[]>(() => getStoredPremiumRequests());
  const [bookmarks, setBookmarks] = useState<string[]>(() => getStoredBookmarks());
  // Authentication & User Profile State
  const [currentUser, setCurrentUser] = useState<{ email?: string; id?: string; member_id?: string } | null>(() => {
    try {
      const stored = localStorage.getItem('nikah_circle_user');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfileData | null>(() => {
    try {
      const stored = localStorage.getItem('nikah_circle_user_profile');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  // Unique identifier for the logged-in member to scope sent interests
  const currentUserKey = useMemo(() => {
    if (currentUserProfile?.mobile) return `phone_${currentUserProfile.mobile.replace(/\D/g, '').slice(-8)}`;
    if (currentUserProfile?.id) return `id_${currentUserProfile.id}`;
    if (currentUser?.id) return `id_${currentUser.id}`;
    if (currentUser?.email) return `email_${currentUser.email.replace(/\W/g, '_')}`;
    return 'guest';
  }, [currentUserProfile, currentUser]);

  // Sent interests map scoped to current user (Starts 100% BLANK {} on every new account)
  const [interestsMap, setInterestsMap] = useState<Record<string, 'pending' | 'accepted' | 'declined'>>(() => {
    const userPhone = currentUserProfile?.mobile ? `phone_${currentUserProfile.mobile.replace(/\D/g, '').slice(-8)}` : null;
    const initialKey = userPhone || (currentUserProfile?.id ? `id_${currentUserProfile.id}` : (currentUser?.id ? `id_${currentUser.id}` : 'guest'));
    return getStoredUserSentInterests(initialKey);
  });

  // Re-sync sent interests whenever the logged-in user changes or registers
  useEffect(() => {
    setInterestsMap(getStoredUserSentInterests(currentUserKey));
  }, [currentUserKey]);

  // Persistent Proposal Registry (Holds all sent proposals across all members)
  const [allProposals, setAllProposals] = useState<IncomingInterest[]>(() => getStoredProposals());

  useEffect(() => {
    saveStoredProposals(allProposals);
  }, [allProposals]);

  // Incoming proposals received strictly for this user (Starts 100% BLANK [] on every new account)
  const incomingInterests = useMemo(() => {
    // If not logged in, or user has no registered profile yet, received tab is strictly blank []
    if (!currentUserProfile && !currentUser) return [];

    const userMemberId = currentUserProfile?.member_id || currentUser?.member_id;
    const userId = currentUserProfile?.id || currentUser?.id;
    const userPhoneNorm = currentUserProfile?.mobile ? currentUserProfile.mobile.replace(/\D/g, '').slice(-8) : '';
    const userNameNorm = (currentUserProfile?.full_name || '').toLowerCase().trim();

    return allProposals.filter((p) => {
      if (!p) return false;
      // Filter out any obsolete dummy records
      if (p.id === 'inc-001' || p.id === 'inc-002') return false;
      if (DUMMY_SENDER_NAMES.includes(p.sender_name)) return false;

      // Do not deliver self-sent proposals to own received inbox
      if (userId && p.sender_profile_id && p.sender_profile_id === userId) return false;
      if (userMemberId && p.sender_member_id && p.sender_member_id.toUpperCase() === userMemberId.toUpperCase()) return false;

      // 0. Member ID match (e.g. NCSM1001, NCSM1003) - primary exact link
      if (userMemberId && p.recipient_member_id && p.recipient_member_id.toUpperCase() === userMemberId.toUpperCase()) {
        return true;
      }

      // 1. Direct recipient profile ID match
      if (userId && p.recipient_profile_id && p.recipient_profile_id === userId) return true;

      // 2. Mobile number match (strictly at least 8 clean digits)
      if (userPhoneNorm && userPhoneNorm.length >= 8 && p.recipient_mobile) {
        const pPhoneNorm = p.recipient_mobile.replace(/\D/g, '').slice(-8);
        if (pPhoneNorm && pPhoneNorm.length >= 8 && pPhoneNorm === userPhoneNorm) {
          return true;
        }
      }

      return false;
    });
  }, [allProposals, currentUserProfile, currentUser]);

  const [interestsActiveTab, setInterestsActiveTab] = useState<'received' | 'sent'>('received');

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nikah_circle_is_admin') === 'true';
    } catch {}
    return false;
  });

  const [isUserPremium, setIsUserPremium] = useState<boolean>(() => {
    try {
      const adminStatus = localStorage.getItem('nikah_circle_premium_admin_status');
      if (adminStatus === 'ADMIN_OFF' || adminStatus === 'EXPIRED') return false;
      const stored = localStorage.getItem('nikah_circle_user_is_premium');
      if (stored !== null) return stored === 'true';
    } catch {}
    return false;
  });

  const [userPlanName, setUserPlanName] = useState<string>(() => {
    try {
      return localStorage.getItem('nikah_circle_user_plan_name') || 'Free Plan';
    } catch {}
    return 'Free Plan';
  });

  // Check if current user has an approved premium request (by phone or name)
  const userApprovedRequest = useMemo(() => {
    const phone = currentUserProfile?.mobile ? currentUserProfile.mobile.replace(/\D/g, '').slice(-8) : '';
    const name = (currentUserProfile?.full_name || '').toLowerCase().trim();
    if (!phone && !name) return null;
    return premiumRequests.find(
      (r) =>
        r.status === 'APPROVED' &&
        ((phone && r.phone_number && r.phone_number.replace(/\D/g, '').includes(phone)) ||
         (name && r.user_name.toLowerCase().trim() === name))
    );
  }, [currentUserProfile, premiumRequests]);

  // Check if current user's profile is in profiles and approved / premium
  const userMatchedProfile = useMemo(() => {
    const phone = currentUserProfile?.mobile ? currentUserProfile.mobile.replace(/\D/g, '').slice(-8) : '';
    const name = (currentUserProfile?.full_name || '').toLowerCase().trim();
    const email = (currentUserProfile?.email || currentUser?.email || '').toLowerCase().trim();
    const id = currentUserProfile?.id || currentUser?.id;

    if (!phone && !name && !email && !id) return null;
    return profiles.find(
      (p) =>
        (id && p.id === id) ||
        (phone && p.mobile && p.mobile.replace(/\D/g, '').includes(phone)) ||
        (email && p.email && p.email.toLowerCase().trim() === email) ||
        (name && p.full_name && p.full_name.toLowerCase().trim() === name)
    );
  }, [currentUserProfile, currentUser, profiles]);

  const effectiveIsPremium = useMemo(() => {
    try {
      const adminStatus = localStorage.getItem('nikah_circle_premium_admin_status');
      if (adminStatus === 'ADMIN_OFF' || adminStatus === 'EXPIRED') return false;
    } catch {}
    return (
      isUserPremium ||
      Boolean(currentUserProfile?.is_premium) ||
      Boolean(userApprovedRequest) ||
      Boolean(userMatchedProfile?.is_premium) ||
      localStorage.getItem('nikah_circle_user_is_premium') === 'true'
    );
  }, [isUserPremium, currentUserProfile, userApprovedRequest, userMatchedProfile]);

  const effectivePlanName = useMemo(() => {
    if (userApprovedRequest?.plan_name) return userApprovedRequest.plan_name;
    if (userMatchedProfile?.premium_plan) return userMatchedProfile.premium_plan;
    if (userPlanName && userPlanName !== 'Free Plan') return userPlanName;
    return effectiveIsPremium ? 'Premium Plan' : 'Free Plan';
  }, [userApprovedRequest, userMatchedProfile, userPlanName, effectiveIsPremium]);

  // Admin approval workflow removed: accounts are immediately active upon setup
  const isAdminApproved = useMemo(() => {
    if (userMatchedProfile) {
      return userMatchedProfile.profile_status !== 'REJECTED';
    }
    return Boolean(currentUserProfile || currentUser);
  }, [userMatchedProfile, currentUserProfile, currentUser]);

  const isUserApproved = isAdminApproved;

  // Track if user has completed candidate biodata details
  const hasUserBiodata = useMemo(() => {
    return hasCompletedBiodata(currentUserProfile) || hasCompletedBiodata(userMatchedProfile);
  }, [currentUserProfile, userMatchedProfile]);

  const effectiveMemberId = useMemo(() => {
    const uEmail = (currentUser?.email || currentUserProfile?.email || '').toLowerCase().trim();
    const uPhone = (currentUserProfile?.mobile || '').replace(/\D/g, '').slice(-8);

    if (uEmail === 'nikahcircle01@gmail.com' || (uPhone.length >= 7 && uPhone.endsWith('44905093'))) {
      return 'NCSM1002';
    }
    if (uEmail === 'sanusadique396@gmail.com' || (uPhone.length >= 7 && uPhone.endsWith('43549396'))) {
      return 'NCSM1001';
    }

    const checkValid = (id?: string | null) => {
      if (!id) return null;
      if (id === 'NCSM1001' || id === 'NCSM1002') return null; // reserved for canonical users
      const num = extractMemberIdNumber(id);
      return num && num >= 1003 ? `NCSM${num}` : null;
    };

    if (checkValid(currentUserProfile?.member_id)) return checkValid(currentUserProfile?.member_id)!;
    if (checkValid(currentUser?.member_id)) return checkValid(currentUser?.member_id)!;
    if (checkValid(userMatchedProfile?.member_id)) return checkValid(userMatchedProfile?.member_id)!;
    if (currentUser?.email) {
      const match = profiles.find((p) => p.email && p.email.toLowerCase() === currentUser.email?.toLowerCase());
      if (checkValid(match?.member_id)) return checkValid(match?.member_id)!;
    }
    try {
      const stored = localStorage.getItem('nikah_circle_user_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (checkValid(parsed.member_id)) return checkValid(parsed.member_id)!;
      }
    } catch {}

    return '';
  }, [currentUserProfile, currentUser, userMatchedProfile, profiles]);

  useEffect(() => {
    localStorage.setItem('nikah_circle_user_is_premium', String(effectiveIsPremium));
  }, [effectiveIsPremium]);

  // Auto-sync approved premium requests into profiles so they always appear in public listings & Premium Users
  useEffect(() => {
    let hasChanges = false;
    let nextProfiles = [...profiles];
    const deleted = getDeletedRecords();

    premiumRequests.forEach((req) => {
      if (req.status === 'APPROVED') {
        const phone = req.phone_number ? req.phone_number.replace(/\D/g, '').slice(-8) : '';
        const name = req.user_name.toLowerCase().trim();

        // STRICT GUARD: If this profile was deleted by Admin, DO NOT auto-recreate!
        if (
          deleted.ids.includes(req.id) ||
          (phone && deleted.phones.some((dp) => phone.includes(dp) || dp.includes(phone))) ||
          (name && deleted.names.includes(name))
        ) {
          return;
        }

        const existingIdx = nextProfiles.findIndex(
          (p) =>
            (phone && p.mobile && p.mobile.replace(/\D/g, '').includes(phone)) ||
            (phone && p.guardian_mobile && p.guardian_mobile.replace(/\D/g, '').includes(phone)) ||
            (name && p.full_name.toLowerCase().trim() === name)
        );

        if (existingIdx >= 0) {
          const curr = nextProfiles[existingIdx];
          if (!curr.is_premium || curr.profile_status !== 'APPROVED') {
            nextProfiles[existingIdx] = {
              ...curr,
              // Strictly preserve existing user's gender!
              gender: normalizeGender(curr.gender),
              is_premium: true,
              premium_plan: req.plan_name || curr.premium_plan || 'Premium Plan',
              profile_status: 'APPROVED',
              is_verified: true,
            };
            hasChanges = true;
          }
        } else {
          // If candidate profile does not exist yet:
          // NEVER assume Female just because plan includes 'girl' (as "Girls & Other" includes both).
          let resolvedGender: 'Male' | 'Female' = 'Male';
          if (req.gender) {
            resolvedGender = normalizeGender(req.gender);
          } else if (currentUserProfile && (
            (phone && currentUserProfile.mobile?.includes(phone)) ||
            (name && currentUserProfile.full_name?.toLowerCase().trim() === name)
          )) {
            resolvedGender = normalizeGender(currentUserProfile.gender);
          } else if (req.notes) {
            const n = req.notes.toLowerCase();
            if (n.includes('female') || n.includes('bride') || n.includes('sister') || n.includes('daughter') || n.includes('girl')) {
              resolvedGender = 'Female';
            }
          }
          const isFemale = resolvedGender === 'Female';
          const newProf: Profile = {
            id: `nc-prem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            member_id: getNextMemberId(),
            full_name: req.user_name,
            gender: resolvedGender,
            age: isFemale ? 22 : 26,
            date_of_birth: isFemale ? '2004-05-15' : '2000-01-01',
            location: 'Kerala',
            district: 'Malappuram',
            place: 'Kerala',
            education: 'Graduate',
            profession: 'Professional',
            guardian_name: `${req.user_name}'s Guardian`,
            guardian_mobile: req.phone_number,
            guardian_relation: 'Parent (Guardian)',
            mobile: req.phone_number,
            marital_status: 'Never Married',
            registration_type: 'ONLINE',
            profile_status: 'APPROVED',
            is_verified: true,
            is_premium: true,
            premium_plan: req.plan_name,
            premium_start: req.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            premium_end: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
            created_at: req.created_at || new Date().toISOString(),
            about: req.notes ? `Approved Member (${req.plan_name}). Reason/Notes: ${req.notes}` : 'Verified Muslim individual seeking life partner with family harmony.',
          };
          nextProfiles = [autoCorrectMistakenGenders(newProf), ...nextProfiles];
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      const deduped = deduplicateProfiles(nextProfiles);
      setProfiles(deduped);
      saveStoredProfiles(deduped);
    }
  }, [premiumRequests]);

  // Mandatory Account / Profile Setup: Opens on first app launch if profile is not created (No skip button!)
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState<boolean>(() => {
    try {
      const profile = localStorage.getItem('nikah_circle_user_profile');
      const user = localStorage.getItem('nikah_circle_user');
      return !profile && !user;
    } catch {
      return true;
    }
  });
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isPostPremiumBiodataUpload, setIsPostPremiumBiodataUpload] = useState<boolean>(false);
  const [isBiodataWizardOpen, setIsBiodataWizardOpen] = useState<boolean>(false);

  // Login Modal (for returning members or admin login)
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [loginMode, setLoginMode] = useState<'member' | 'admin'>('member');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    gender: '',
    ageRange: '',
    state: '',
    district: '',
    place: '',
    location: '',
    profession: '',
    education: '',
    maritalStatus: '',
    verifiedOnly: false,
    premiumOnly: false,
  });

  // Notification Toast & Screen Status Banners
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [adminApprovedBanner, setAdminApprovedBanner] = useState<{
    status: string;
    message: string;
    planName?: string;
  } | null>(() => {
    try {
      const status = localStorage.getItem('nikah_circle_premium_admin_status');
      if (status === 'APPROVED') {
        return {
          status: 'Admin Approved',
          message: 'Premium plan successfully activated',
        };
      }
    } catch {}
    return null;
  });
  const [planAlertBanner, setPlanAlertBanner] = useState<{
    status: string;
    message: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Comprehensive data refresh that loads ALL registered profiles from Supabase and merges with local
  const refreshAllData = async () => {
    try {
      // 1. Fetch payments and premium requests first to ensure subscription statuses can be linked
      const { data: dbPayments } = await supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (dbPayments && dbPayments.length > 0) {
        setPayments(dbPayments);
        saveStoredPayments(dbPayments);
      }

      const { data: dbRequests } = await supabase
        .from('premium_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbRequests && dbRequests.length > 0) {
        setPremiumRequests(dbRequests);
        saveStoredPremiumRequests(dbRequests);
      }

      const activeRequests = (dbRequests && dbRequests.length > 0 ? dbRequests : premiumRequests) || [];
      const activePayments = (dbPayments && dbPayments.length > 0 ? dbPayments : payments) || [];

      // 2. Fetch all profiles from Supabase profiles table in ascending order (chronological, oldest first for sequential NCSM numbering)
      const { data: dbProfiles, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });

      const localProfiles = getStoredProfiles();
      const deleted = getDeletedRecords();

      let merged: Profile[] = [];
      if (!profileErr && dbProfiles) {
        const parsedDb: Profile[] = dbProfiles.map((p: any, idx: number) => parseSupabaseProfile(p, idx));

        // Create fast lookup map for localProfiles to preserve newly updated biodata & subscription fields
        const localMap = new Map<string, Profile>();
        localProfiles.forEach((lp) => {
          if (lp.id) localMap.set(lp.id, lp);
          if (lp.email) localMap.set(lp.email.toLowerCase(), lp);
          if (lp.mobile) localMap.set(lp.mobile.replace(/\D/g, '').slice(-8), lp);
        });

        const mergedDb = parsedDb.map((dp) => {
          const phoneKey = dp.mobile ? dp.mobile.replace(/\D/g, '').slice(-8) : '';
          const emailKey = dp.email ? dp.email.toLowerCase() : '';
          const localMatch = localMap.get(dp.id) || (emailKey && localMap.get(emailKey)) || (phoneKey && localMap.get(phoneKey));
          if (localMatch) {
            return {
              ...dp,
              member_id: localMatch.member_id || dp.member_id,
              biodata_uploaded: localMatch.biodata_uploaded || dp.biodata_uploaded,
              biodata_document_name: localMatch.biodata_document_name || dp.biodata_document_name,
              biodata_document_url: localMatch.biodata_document_url || dp.biodata_document_url,
              is_premium: localMatch.is_premium || dp.is_premium,
              premium_plan: localMatch.premium_plan || dp.premium_plan,
              premium_start: localMatch.premium_start || dp.premium_start,
              premium_end: localMatch.premium_end || dp.premium_end,
              place: localMatch.place || dp.place,
              district: localMatch.district || dp.district,
              gender: normalizeGender(localMatch.gender || dp.gender),
              hobbies: localMatch.hobbies || dp.hobbies,
              interests: localMatch.interests || dp.interests,
            };
          }
          return dp;
        });

        // Only keep profiles that exist and are not deleted
        merged = mergedDb.filter((p) => !isProfileDeleted(p, deleted));
      } else {
        merged = localProfiles.filter((p) => !isProfileDeleted(p, deleted));
      }

      // First deduplication pass on raw merged profiles
      merged = deduplicateProfiles(merged);

      // 3. Ensure currentUserProfile is also unified into merged so freshly registered / updated candidates are never missing
      try {
        const storedCup = localStorage.getItem('nikah_circle_user_profile');
        if (storedCup) {
          const cup: UserProfileData = JSON.parse(storedCup);
          const cupPhone = cup.mobile ? cup.mobile.replace(/\D/g, '').slice(-8) : '';
          const cupEmail = cup.email ? cup.email.toLowerCase().trim() : '';
          const foundIdx = merged.findIndex(
            (p) =>
              (p.id && cup.id && p.id === cup.id) ||
              (cupPhone && p.mobile && p.mobile.replace(/\D/g, '').includes(cupPhone)) ||
              (cupEmail && p.email && p.email.toLowerCase().trim() === cupEmail)
          );
          if (foundIdx >= 0) {
            if (isProfileDeleted(cup, deleted)) {
              merged.splice(foundIdx, 1);
            } else {
              merged[foundIdx] = {
                ...merged[foundIdx],
                member_id: cup.member_id || merged[foundIdx].member_id,
                biodata_uploaded: cup.biodata_uploaded || merged[foundIdx].biodata_uploaded,
                biodata_document_name: cup.biodata_document_name || merged[foundIdx].biodata_document_name,
                biodata_document_url: cup.biodata_document_url || merged[foundIdx].biodata_document_url,
                is_premium: cup.is_premium ?? merged[foundIdx].is_premium,
                premium_plan: cup.premium_plan || merged[foundIdx].premium_plan,
                place: cup.place || merged[foundIdx].place,
                district: cup.district || merged[foundIdx].district,
                gender: normalizeGender(cup.gender || merged[foundIdx].gender),
              };
            }
          } else if (cup.full_name && !isProfileDeleted(cup, deleted)) {
            const cupProfile: Profile = {
              id: cup.id || `usr-${Date.now()}`,
              member_id: cup.member_id || getNextMemberId(merged),
              full_name: cup.full_name,
              mobile: cup.mobile,
              email: cup.email,
              gender: normalizeGender(cup.gender),
              date_of_birth: cup.date_of_birth,
              location: `${cup.place || ''}, ${cup.district || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Kerala',
              district: cup.district || 'Kozhikode',
              place: cup.place || 'Kerala',
              education: cup.education || 'Graduate',
              profession: cup.profession || 'Professional',
              guardian_name: cup.guardian_name || 'Guardian',
              guardian_mobile: cup.guardian_mobile || cup.mobile,
              guardian_relation: 'Parent (Guardian)',
              marital_status: 'Never Married',
              biodata_uploaded: cup.biodata_uploaded ?? false,
              biodata_document_name: cup.biodata_document_name || null,
              biodata_document_url: cup.biodata_document_url || null,
              registration_type: 'ONLINE',
              is_verified: true,
              profile_status: 'APPROVED',
              is_premium: Boolean(cup.is_premium),
              premium_plan: cup.premium_plan || null,
              created_at: new Date().toISOString(),
            };
            merged = [cupProfile, ...merged];
          }
        }
      } catch {}

      // Second deduplication pass & ensure unique sequential member IDs
      merged = ensureUniqueSequentialMemberIds(deduplicateProfiles(merged));

      // Link & automatically synchronize subscription statuses from approved requests and paid payments
      const finalized = merged.map((p) => {
        const phone = p.mobile ? p.mobile.replace(/\D/g, '').slice(-8) : '';
        const name = (p.full_name || '').toLowerCase().trim();
        const email = (p.email || '').toLowerCase().trim();

        // Check if there is an approved request
        const matchedReq = activeRequests.find(
          (r) =>
            r.status === 'APPROVED' &&
            ((phone && r.phone_number && r.phone_number.replace(/\D/g, '').includes(phone)) ||
              (name && r.user_name.toLowerCase().trim() === name))
        );

        // Check if there is a paid payment
        const matchedPay = activePayments.find(
          (pay) =>
            pay.payment_status === 'PAID' &&
            (pay.profile_id === p.id || (name && (pay.profile_name || '').toLowerCase().trim() === name))
        );

        const isPrem = p.is_premium || Boolean(matchedReq) || Boolean(matchedPay);
        const premPlan = p.premium_plan || matchedReq?.plan_name || (matchedPay ? 'Premium Plan' : null);

        return {
          ...p,
          gender: normalizeGender(p.gender),
          is_premium: isPrem,
          premium_plan: isPrem ? (premPlan || 'Premium Plan') : null,
        };
      });

      // Deduplicate finalized list and guarantee unique sequential member IDs
      const finalDeduplicated = ensureUniqueSequentialMemberIds(deduplicateProfiles(finalized));
      finalDeduplicated.sort((a, b) => (new Date(b.created_at || '').getTime() || 0) - (new Date(a.created_at || '').getTime() || 0));

      setProfiles(finalDeduplicated);
      saveStoredProfiles(finalDeduplicated);

      // Persist any corrected/re-assigned unique member IDs back to Supabase
      if (dbProfiles && dbProfiles.length > 0) {
        for (const p of finalDeduplicated) {
          const orig = dbProfiles.find((dp: any) => dp.id === p.id);
          if (orig) {
            const { meta: origMeta } = decodeProfileMetadata(orig.about);
            const origMemberId = origMeta?.member_id || orig.member_id;
            if (origMemberId !== p.member_id) {
              try {
                const payload = prepareSupabaseProfilePayload(p);
                await supabase.from('profiles').update(payload).eq('id', p.id);
              } catch (e) {
                console.warn('Could not sync re-assigned member_id to Supabase for', p.id, e);
              }
            }
          }
        }
      }

      // If currentUserProfile had a duplicate/mistaken member_id, correct it immediately
      if (currentUserProfile) {
        const uPhone = currentUserProfile.mobile ? currentUserProfile.mobile.replace(/\D/g, '').slice(-8) : '';
        const uEmail = (currentUserProfile.email || '').toLowerCase().trim();
        const matched = finalDeduplicated.find((p) =>
          (currentUserProfile.id && p.id === currentUserProfile.id) ||
          (uEmail && p.email && p.email.toLowerCase().trim() === uEmail) ||
          (uPhone && p.mobile && p.mobile.replace(/\D/g, '').includes(uPhone))
        );
        if (matched && matched.member_id && matched.member_id !== currentUserProfile.member_id) {
          const fixedCup: UserProfileData = {
            ...currentUserProfile,
            member_id: matched.member_id,
          };
          setCurrentUserProfile(fixedCup);
          localStorage.setItem('nikah_circle_user_profile', JSON.stringify(fixedCup));
          if (currentUser) {
            const fixedUser = { ...currentUser, member_id: matched.member_id };
            setCurrentUser(fixedUser);
            localStorage.setItem('nikah_circle_user', JSON.stringify(fixedUser));
          }
        }
      }
    } catch (err) {
      console.warn('Data sync offline fallback', err);
    }
  };

  // Sync Supabase on Mount & Realtime updates
  useEffect(() => {
    async function loadData() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const user = sessionData.session.user;
          setCurrentUser({ email: user.email, id: user.id });
          if (user.email?.toLowerCase() === 'nikahcircle01@gmail.com') {
            setIsAdmin(true);
          }
        }
        await refreshAllData();
      } catch (err) {
        console.warn('Offline fallback loaded', err);
      }
    }
    loadData();

    // Supabase Real-time Channel Listener
    const channel = supabase
      .channel('nikah-admin-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        refreshAllData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'premium_requests' }, () => {
        refreshAllData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, () => {
        refreshAllData();
      })
      .subscribe();

    // Cross-tab storage change listener
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'nikah_circle_profiles_v2' ||
        e.key === 'nikah_circle_user_profile' ||
        e.key === 'nikah_circle_premium_requests_v1' ||
        e.key === 'nikah_circle_payments_v2' ||
        e.key === 'nikah_circle_user_is_premium'
      ) {
        refreshAllData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Background periodic refresh every 10 seconds
    const interval = setInterval(() => {
      refreshAllData();
    }, 10000);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Sync changes to local storage
  useEffect(() => {
    saveStoredBookmarks(bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    saveStoredInterestsMap(interestsMap);
  }, [interestsMap]);

  useEffect(() => {
    saveStoredPremiumRequests(premiumRequests);
  }, [premiumRequests]);

  // Handlers
  const handleToggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Removed from shortlist' : 'Added to shortlist ❤️');
      return updated;
    });
  };

  const handleOpenEditProfile = () => {
    if (!isAdminApproved) {
      showToast('Your profile is waiting for Admin Approval. Profile editing and uploads will be enabled once approved.');
      return;
    }
    setIsEditingProfile(true);
  };

  const handleOpenPremium = () => {
    setIsPremiumOpen(true);
  };

  const handleOpenBiodataWizard = () => {
    const hasPremium = effectiveIsPremium || localStorage.getItem('nikah_circle_user_is_premium') === 'true';
    if (!hasPremium) {
      showToast('Matrimonial biodata writing and publishing is exclusively reserved for Premium members. Please activate a Premium plan.');
      handleOpenPremium();
      return;
    }
    setIsBiodataWizardOpen(true);
  };

  const handleSendInterest = async (profileId: string) => {
    // Condition 1: Must have active Premium Plan
    const hasPremium = effectiveIsPremium || localStorage.getItem('nikah_circle_user_is_premium') === 'true';
    if (!hasPremium) {
      showToast('Sending interest proposals requires an active Premium Plan. Please upgrade.');
      handleOpenPremium();
      return;
    }

    // Condition 2: Must have completed biodata (Multi-Step Wizard or document)
    if (!hasUserBiodata) {
      showToast('Please complete your candidate biodata before sending interest proposals.');
      handleOpenBiodataWizard();
      return;
    }

    const targetProfile = profiles.find((p) => p.id === profileId);
    if (!targetProfile) {
      showToast('Profile not found.');
      return;
    }

    // Cannot send interest to own profile
    const isSelf =
      (currentUserProfile?.id && targetProfile.id === currentUserProfile.id) ||
      (currentUser?.id && targetProfile.id === currentUser.id) ||
      (currentUserProfile?.member_id && targetProfile.member_id && currentUserProfile.member_id === targetProfile.member_id) ||
      (currentUserProfile?.mobile &&
        targetProfile.mobile &&
        targetProfile.mobile.replace(/\D/g, '').slice(-8) ===
          currentUserProfile.mobile.replace(/\D/g, '').slice(-8));

    if (isSelf) {
      showToast('You cannot send a proposal interest to your own profile.');
      return;
    }

    // Halal Matrimony Gender rule: Male to Female only, Female to Male only
    const userGender = currentUserProfile?.gender ? normalizeGender(currentUserProfile.gender) : null;
    const targetGender = normalizeGender(targetProfile.gender);
    if (userGender && targetGender === userGender) {
      const needed = userGender === 'Female' ? 'Groom (Male)' : 'Bride (Female)';
      showToast(`Halal Matrimony: You can only send proposals to ${needed} profiles.`);
      return;
    }

    if (interestsMap[profileId]) {
      showToast('Interest has already been sent to this profile.');
      return;
    }

    // 1. Update sender's sent interestsMap
    const updatedMap = { ...interestsMap, [profileId]: 'pending' as const };
    setInterestsMap(updatedMap);
    saveStoredUserSentInterests(currentUserKey, updatedMap);

    // 2. Deliver proposal into persistent proposals registry targeting the recipient
    const senderName = currentUserProfile?.full_name || currentUser?.email?.split('@')[0] || 'Premium Member';
    const senderAge = currentUserProfile?.age || (currentUserProfile?.date_of_birth ? Math.max(18, new Date().getFullYear() - new Date(currentUserProfile.date_of_birth).getFullYear()) : 25);
    const senderGender: 'Male' | 'Female' = userGender || (targetGender === 'Female' ? 'Male' : 'Female');
    const senderLocation = currentUserProfile?.location || (currentUserProfile?.place ? `${currentUserProfile.place}, ${currentUserProfile.district}` : 'Kerala');
    const senderEducation = currentUserProfile?.education || 'Graduate';
    const senderProfession = currentUserProfile?.profession || 'Professional';
    const senderGuardianName = currentUserProfile?.guardian_name || `${senderName}'s Guardian`;
    const senderGuardianPhone = currentUserProfile?.guardian_mobile || currentUserProfile?.mobile || '+91 90000 00000';
    const senderMemberId = currentUserProfile?.member_id || effectiveMemberId || 'Member';
    const recipientMemberId = targetProfile.member_id || (targetProfile.id?.startsWith('NCSM') ? targetProfile.id : targetProfile.id);

    const newProposal: IncomingInterest = {
      id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      sender_profile_id: currentUserProfile?.id || currentUser?.id || `usr-${Date.now()}`,
      sender_member_id: senderMemberId,
      sender_name: senderName,
      sender_age: senderAge,
      sender_gender: senderGender,
      sender_profession: senderProfession,
      sender_education: senderEducation,
      sender_location: senderLocation,
      guardian_name: senderGuardianName,
      guardian_mobile: senderGuardianPhone,
      guardian_relation: 'Parent (Guardian)',
      received_at: 'Today, Just now',
      status: 'pending',
      notes: `Assalamu Alaikum. ${senderName} (${senderMemberId}) expressed matrimonial proposal interest with ${targetProfile.full_name} (${recipientMemberId}).`,
      recipient_profile_id: targetProfile.id,
      recipient_member_id: recipientMemberId,
      recipient_name: targetProfile.full_name,
      recipient_mobile: targetProfile.mobile || targetProfile.guardian_mobile || undefined,
    };

    const updatedAllProposals = [
      newProposal,
      ...allProposals.filter(
        (p) =>
          !(
            p.recipient_profile_id === targetProfile.id &&
            p.sender_profile_id === (currentUserProfile?.id || currentUser?.id)
          )
      ),
    ];
    setAllProposals(updatedAllProposals);
    saveStoredProposals(updatedAllProposals);

    showToast(`Interest sent successfully to ${targetProfile.full_name}!`);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  const handleCancelInterest = (profileId: string) => {
    // 1. Remove from sender's interestsMap
    const updatedMap = { ...interestsMap };
    delete updatedMap[profileId];
    setInterestsMap(updatedMap);
    saveStoredUserSentInterests(currentUserKey, updatedMap);

    // 2. Remove proposal from allProposals
    const userId = currentUserProfile?.id || currentUser?.id;
    const userPhoneNorm = currentUserProfile?.mobile ? currentUserProfile.mobile.replace(/\D/g, '').slice(-8) : '';
    const updatedProposals = allProposals.filter((p) => {
      const matchRecipient = p.recipient_profile_id === profileId;
      const matchSender =
        (userId && p.sender_profile_id === userId) ||
        (userPhoneNorm && p.guardian_mobile && p.guardian_mobile.replace(/\D/g, '').slice(-8) === userPhoneNorm);
      return !(matchRecipient && matchSender);
    });
    setAllProposals(updatedProposals);
    saveStoredProposals(updatedProposals);

    showToast('Interest cancelled successfully.');
  };

  const handleAcceptIncomingInterest = (id: string) => {
    let acceptedRecipientId = '';

    const updatedAll = allProposals.map((item) => {
      if (item.id === id) {
        acceptedRecipientId = item.recipient_profile_id || '';
        return { ...item, status: 'accepted' as const };
      }
      return item;
    });

    setAllProposals(updatedAll);
    saveStoredProposals(updatedAll);

    // Also update sender's sent interest in all user storage keys to accepted
    if (acceptedRecipientId) {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('nikah_circle_sent_interests_')) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed[acceptedRecipientId]) {
                parsed[acceptedRecipientId] = 'accepted';
                localStorage.setItem(key, JSON.stringify(parsed));
              }
            }
          }
        }
      } catch {}
    }

    showToast('Proposal accepted! Guardian contact details & biodata are unlocked.');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleDeclineIncomingInterest = (id: string) => {
    const updatedAll = allProposals.map((item) =>
      item.id === id ? { ...item, status: 'declined' as const } : item
    );
    setAllProposals(updatedAll);
    saveStoredProposals(updatedAll);
    showToast('Proposal politely declined.');
  };

  const handleSaveUserProfile = async (data: UserProfileData) => {
    const existingIndex = profiles.findIndex(
      (p) => (p.mobile && p.mobile === data.mobile) || (p.email && p.email === data.email)
    );

    // Canonical binding for established accounts & auto-generate sequential Member ID
    const emailNorm = (data.email || '').toLowerCase().trim();
    const phoneNorm = data.mobile ? data.mobile.replace(/\D/g, '').slice(-8) : '';
    let memberId: string;
    if (emailNorm === 'nikahcircle01@gmail.com' || phoneNorm.endsWith('44905093')) {
      memberId = 'NCSM1002';
    } else if (emailNorm === 'sanusadique396@gmail.com' || phoneNorm.endsWith('43549396')) {
      memberId = 'NCSM1001';
    } else {
      const getValidCandidateId = (rawId?: string | null) => {
        if (!rawId || rawId === 'NCSM1001' || rawId === 'NCSM1002') return null;
        const num = extractMemberIdNumber(rawId);
        if (!num || num < 1003) return null;
        const isConflict = profiles.some((p, idx) => {
          if (idx === existingIndex) return false;
          if (p.member_id !== `NCSM${num}`) return false;
          const pEmail = (p.email || '').toLowerCase().trim();
          const pPhone = p.mobile ? p.mobile.replace(/\D/g, '').slice(-8) : '';
          return pEmail !== emailNorm && (!phoneNorm || !pPhone || pPhone !== phoneNorm);
        });
        return isConflict ? null : `NCSM${num}`;
      };

      memberId =
        getValidCandidateId(data.member_id) ||
        getValidCandidateId(currentUserProfile?.member_id) ||
        (existingIndex >= 0 ? getValidCandidateId(profiles[existingIndex].member_id) : null) ||
        getNextMemberId(profiles);
    }

    const normalizedGender = normalizeGender(data.gender);

    const isApprovedStatus = true;
    const profileStatus = 'APPROVED';
    const isVerifiedStatus = true;

    const updatedData: UserProfileData = {
      ...data,
      gender: normalizedGender,
      member_id: memberId,
      is_approved: isApprovedStatus,
      profile_status: profileStatus,
    };
    setCurrentUserProfile(updatedData);
    localStorage.setItem('nikah_circle_user_profile', JSON.stringify(updatedData));

    const userObj = { email: data.email, id: `usr-${data.mobile}`, member_id: memberId };
    setCurrentUser(userObj);
    localStorage.setItem('nikah_circle_user', JSON.stringify(userObj));

    const calculatedAge = data.date_of_birth
      ? Math.max(18, new Date().getFullYear() - new Date(data.date_of_birth).getFullYear())
      : 24;

    const profilePayload: Profile = {
      id: existingIndex >= 0 ? profiles[existingIndex].id : `usr-${Date.now().toString().slice(-6)}`,
      member_id: memberId,
      full_name: data.full_name,
      mobile: data.mobile,
      email: data.email,
      gender: normalizedGender,
      date_of_birth: data.date_of_birth,
      age: calculatedAge,
      state: data.state,
      district: data.district,
      place: data.place,
      location: `${data.place}, ${data.district}`,
      education: data.education || 'Graduate',
      profession: data.profession || 'Professional',
      guardian_name: data.guardian_name || 'Family Guardian',
      guardian_mobile: data.guardian_mobile || data.mobile,
      marital_status: data.marital_status || 'Never Married',
      hobbies: data.hobbies,
      interests: data.interests,
      profile_photo: data.profile_photo || null,
      biodata_uploaded: data.biodata_uploaded ?? false,
      biodata_document_name: data.biodata_document_name ?? null,
      biodata_document_url: data.biodata_document_url ?? null,
      height: data.height || (existingIndex >= 0 ? profiles[existingIndex].height : undefined),
      complexion: data.complexion || (existingIndex >= 0 ? profiles[existingIndex].complexion : undefined),
      physical_build: data.physical_build || (existingIndex >= 0 ? profiles[existingIndex].physical_build : undefined),
      religious_ideation: data.religious_ideation || (existingIndex >= 0 ? profiles[existingIndex].religious_ideation : undefined),
      children_count: data.children_count || (existingIndex >= 0 ? profiles[existingIndex].children_count : undefined),
      religious_education: data.religious_education || (existingIndex >= 0 ? profiles[existingIndex].religious_education : undefined),
      bouthika_education: data.bouthika_education || (existingIndex >= 0 ? profiles[existingIndex].bouthika_education : undefined),
      job_location: data.job_location || (existingIndex >= 0 ? profiles[existingIndex].job_location : undefined),
      financial_status: data.financial_status || (existingIndex >= 0 ? profiles[existingIndex].financial_status : undefined),
      preferred_districts: data.preferred_districts || (existingIndex >= 0 ? profiles[existingIndex].preferred_districts : undefined),
      family_members_details: data.family_members_details || (existingIndex >= 0 ? profiles[existingIndex].family_members_details : undefined),
      family_background: data.family_background || (existingIndex >= 0 ? profiles[existingIndex].family_background : undefined),
      marriage_expectations: data.marriage_expectations || (existingIndex >= 0 ? profiles[existingIndex].marriage_expectations : undefined),
      blood_group: data.blood_group || (existingIndex >= 0 ? profiles[existingIndex].blood_group : undefined),
      passport_visa_status: data.passport_visa_status || (existingIndex >= 0 ? profiles[existingIndex].passport_visa_status : undefined),
      other_interests: data.other_interests || (existingIndex >= 0 ? profiles[existingIndex].other_interests : undefined),
      guardian_relation: data.guardian_relation || (existingIndex >= 0 ? profiles[existingIndex].guardian_relation : 'Parent (Guardian)'),
      registration_type: 'ONLINE',
      profile_status: profileStatus,
      is_verified: isVerifiedStatus,
      is_premium: existingIndex >= 0 ? profiles[existingIndex].is_premium : effectiveIsPremium,
      premium_plan: existingIndex >= 0 ? profiles[existingIndex].premium_plan : effectivePlanName,
      created_at: existingIndex >= 0 ? profiles[existingIndex].created_at : new Date().toISOString(),
    };

    let updatedProfiles: Profile[];
    if (existingIndex >= 0) {
      updatedProfiles = profiles.map((p, idx) => (idx === existingIndex ? { ...p, ...profilePayload } : p));
    } else {
      updatedProfiles = [profilePayload, ...profiles];
    }

    updatedProfiles = deduplicateProfiles(updatedProfiles);
    setProfiles(updatedProfiles);
    saveStoredProfiles(updatedProfiles);

    // Sync directly to Supabase profiles database table
    try {
      const payload = prepareSupabaseProfilePayload(profilePayload);
      const isUUID = (str?: string) => !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

      if (profilePayload.id && isUUID(profilePayload.id)) {
        await supabase.from('profiles').upsert(payload);
      } else {
        const { data: existingDb } = await supabase
          .from('profiles')
          .select('id')
          .or(`email.eq.${profilePayload.email},mobile.eq.${profilePayload.mobile}`)
          .limit(1);

        if (existingDb && existingDb.length > 0) {
          await supabase.from('profiles').update(payload).eq('id', existingDb[0].id);
          profilePayload.id = existingDb[0].id;
        } else {
          delete payload.id;
          const { data: dbCreated } = await supabase.from('profiles').insert(payload).select().single();
          if (dbCreated?.id) {
            profilePayload.id = dbCreated.id;
          }
        }
      }
    } catch (dbErr) {
      console.warn('Syncing user profile to Supabase', dbErr);
    }

    setIsCreateAccountOpen(false);
    setIsEditingProfile(false);
    showToast('Profile account saved successfully!');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleSaveBiodataWizard = async (wizardData: Partial<UserProfileData>) => {
    const baseData: UserProfileData = currentUserProfile || {
      full_name: currentUser?.email?.split('@')[0] || 'Member',
      email: currentUser?.email || '',
      mobile: '',
      gender: 'Male',
      state: 'Kerala',
      district: 'Kozhikode',
      place: 'Kerala',
      date_of_birth: '2000-01-01',
      hobbies: '',
      interests: '',
      biodata_uploaded: true,
    };

    const combined: UserProfileData = {
      ...baseData,
      ...wizardData,
      biodata_uploaded: true,
      education: wizardData.bouthika_education || wizardData.education || baseData.education,
      location: `${wizardData.place || baseData.place}, ${wizardData.district || baseData.district}`,
    };

    await handleSaveUserProfile(combined);
    showToast('Alhamdulillah! Your matrimonial biodata has been saved. You can now send interest proposals.');
  };

  const handleAcceptInterest = (profileId: string) => {
    const updated = { ...interestsMap, [profileId]: 'accepted' as const };
    setInterestsMap(updated);
    saveStoredInterestsMap(updated);
    showToast('Mutual interest accepted! Complete biodata & guardian contact unlocked.');
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  // Submit Premium Request (UPI Scanner, Cash Office, or Free Request) - Automatic Payment Upgradation Sync
  const handleSubmitPremiumRequest = async (
    req: Omit<PremiumRequest, 'id' | 'created_at' | 'status'>
  ) => {
    const isUUID = (str?: string) => !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `req-${Date.now()}`;
    
    // Automatic Payment Upgradation: Immediately mark request as APPROVED
    const newReq: PremiumRequest = {
      ...req,
      id: newId,
      status: 'APPROVED',
      created_at: new Date().toISOString(),
    };
    const updatedRequests = [newReq, ...premiumRequests];
    setPremiumRequests(updatedRequests);
    saveStoredPremiumRequests(updatedRequests);

    // 1. Instantly activate session premium state
    setIsUserPremium(true);
    setUserPlanName(req.plan_name);
    localStorage.setItem('nikah_circle_user_is_premium', 'true');
    localStorage.setItem('nikah_circle_user_plan_name', req.plan_name);

    // 2. Identify and instantly upgrade the user's profile in state & localStorage
    const phoneClean = req.phone_number ? req.phone_number.replace(/\D/g, '').slice(-8) : '';
    const nameClean = (req.user_name || '').toLowerCase().trim();
    const emailClean = (currentUser?.email || '').toLowerCase().trim();

    const existingIdx = profiles.findIndex(
      (p) =>
        (phoneClean && p.mobile && p.mobile.replace(/\D/g, '').includes(phoneClean)) ||
        (phoneClean && p.guardian_mobile && p.guardian_mobile.replace(/\D/g, '').includes(phoneClean)) ||
        (nameClean && p.full_name.toLowerCase().trim() === nameClean) ||
        (emailClean && p.email && p.email.toLowerCase().trim() === emailClean)
    );

    let targetProf: Profile;
    let nextProfiles: Profile[];

    const todayDate = new Date().toISOString().slice(0, 10);
    const expiryDate = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);

    if (existingIdx >= 0) {
      targetProf = {
        ...profiles[existingIdx],
        is_premium: true,
        premium_plan: req.plan_name,
        premium_start: todayDate,
        premium_end: expiryDate,
        profile_status: 'APPROVED',
        is_verified: true,
        gender: req.gender ? normalizeGender(req.gender) : normalizeGender(profiles[existingIdx].gender),
        updated_at: new Date().toISOString(),
      };
      nextProfiles = profiles.map((p, idx) => (idx === existingIdx ? targetProf : p));
    } else {
      const memberId = currentUserProfile?.member_id || getNextMemberId();
      targetProf = {
        id: `nc-prem-${Date.now()}`,
        member_id: memberId,
        full_name: req.user_name,
        gender: normalizeGender(req.gender || currentUserProfile?.gender || 'Male'),
        mobile: req.phone_number,
        email: currentUser?.email || null,
        location: 'Kerala',
        district: 'Malappuram',
        place: 'Kerala',
        marital_status: 'Never Married',
        education: 'Graduate',
        profession: 'Professional',
        guardian_name: `${req.user_name}'s Guardian`,
        guardian_mobile: req.phone_number,
        guardian_relation: 'Parent (Guardian)',
        registration_type: 'ONLINE',
        profile_status: 'APPROVED',
        is_verified: true,
        is_premium: true,
        premium_plan: req.plan_name,
        premium_start: todayDate,
        premium_end: expiryDate,
        created_at: new Date().toISOString(),
      };
      nextProfiles = [targetProf, ...profiles];
    }

    setProfiles(nextProfiles);
    saveStoredProfiles(nextProfiles);

    // 3. Update currentUserProfile in state and localStorage
    if (currentUserProfile) {
      const updatedCup: UserProfileData = {
        ...currentUserProfile,
        is_premium: true,
        premium_plan: req.plan_name,
        is_approved: isAdminApproved,
      };
      setCurrentUserProfile(updatedCup);
      localStorage.setItem('nikah_circle_user_profile', JSON.stringify(updatedCup));
    }

    // 4. Automatically record completed payment in payments list
    const payPayload: Payment = {
      id: `pay-${Date.now()}`,
      profile_id: targetProf.id,
      profile_name: targetProf.full_name,
      amount: req.amount,
      payment_method: req.plan_type === 'UPI_QR' ? 'UPI' : (req.plan_type === 'CASH_OFFICE' ? 'CASH' : 'ONLINE'),
      payment_status: 'PAID',
      payment_date: new Date().toISOString(),
      transaction_reference: req.utr_number || req.referral_code || undefined,
      notes: req.notes ? `${req.plan_name} - ${req.notes}` : req.plan_name,
    };
    const nextPayments = [payPayload, ...payments];
    setPayments(nextPayments);
    saveStoredPayments(nextPayments);

    showToast('Alhamdulillah! Premium plan payment recorded!');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Requirement: Multi-Step Biodata Upload Wizard trigger (user can complete or skip anytime)
    if (isAdminApproved) {
      setTimeout(() => {
        setIsPremiumOpen(false);
        setIsBiodataWizardOpen(true);
      }, 400);
    } else {
      setTimeout(() => {
        setIsPremiumOpen(false);
      }, 400);
      showToast('Payment recorded! Profile is waiting for Admin Approval before biodata upload & proposals activate.');
    }

    // 5. Sync directly to Supabase profiles, payments, and premium_requests tables
    try {
      const payload: any = {
        user_name: req.user_name,
        phone_number: req.phone_number,
        plan_name: req.plan_name,
        plan_type: req.plan_type,
        amount: req.amount,
        utr_number: req.utr_number || null,
        payment_screenshot: req.payment_screenshot || null,
        referral_code: req.referral_code || null,
        status: 'APPROVED',
        notes: req.notes || null,
      };
      if (isUUID(newId)) {
        payload.id = newId;
      }
      await supabase.from('premium_requests').insert(payload);

      // Sync updated profile to Supabase
      const profPayload = prepareSupabaseProfilePayload(targetProf);
      if (targetProf.id && isUUID(targetProf.id)) {
        await supabase.from('profiles').upsert(profPayload);
      } else {
        const { data: existingDb } = await supabase
          .from('profiles')
          .select('id')
          .or(`email.eq.${targetProf.email},mobile.eq.${targetProf.mobile}`)
          .maybeSingle();

        if (existingDb?.id) {
          await supabase.from('profiles').update(profPayload).eq('id', existingDb.id);
          targetProf.id = existingDb.id;
        } else {
          delete profPayload.id;
          const { data: dbCreated } = await supabase.from('profiles').insert(profPayload).select().single();
          if (dbCreated?.id) {
            targetProf.id = dbCreated.id;
          }
        }
      }

      // Sync payment to Supabase payments table
      await supabase.from('payments').insert({
        profile_id: targetProf.id && isUUID(targetProf.id) ? targetProf.id : null,
        profile_name: targetProf.full_name,
        amount: req.amount,
        payment_method: payPayload.payment_method,
        payment_status: 'PAID',
        transaction_reference: req.utr_number || req.referral_code || null,
        notes: req.notes || req.plan_name,
      });
    } catch (e) {
      console.warn('Supabase premium request auto-upgradation sync:', e);
    }
  };

  // Admin approves premium request: activates premium and records payment
  const handleApprovePremiumRequest = async (id: string) => {
    const target = premiumRequests.find((r) => r.id === id);
    if (!target) return;

    const updatedRequests = premiumRequests.map((r) =>
      r.id === id ? { ...r, status: 'APPROVED' as const } : r
    );
    setPremiumRequests(updatedRequests);
    saveStoredPremiumRequests(updatedRequests);

    try {
      await supabase.from('premium_requests').update({ status: 'APPROVED' }).eq('id', id);
    } catch {}

    // Activate premium for current user session
    setIsUserPremium(true);
    setUserPlanName(target.plan_name);
    localStorage.setItem('nikah_circle_user_is_premium', 'true');
    localStorage.setItem('nikah_circle_user_plan_name', target.plan_name);

    // If candidate has a registered profile, mark it premium & approved; otherwise create it!
    const phoneNorm = target.phone_number ? target.phone_number.replace(/\D/g, '').slice(-8) : '';
    const nameNorm = target.user_name.toLowerCase().trim();

    const existingIdx = profiles.findIndex(
      (p) =>
        (phoneNorm && p.mobile && p.mobile.replace(/\D/g, '').includes(phoneNorm)) ||
        (phoneNorm && p.guardian_mobile && p.guardian_mobile.replace(/\D/g, '').includes(phoneNorm)) ||
        (nameNorm && p.full_name.toLowerCase().trim() === nameNorm)
    );

    let updatedProfiles: Profile[];
    let targetProfileId = '';

    if (existingIdx >= 0) {
      targetProfileId = profiles[existingIdx].id;
      updatedProfiles = profiles.map((p, idx) =>
        idx === existingIdx
          ? {
              ...p,
              gender: normalizeGender(p.gender),
              is_premium: true,
              premium_plan: target.plan_name,
              profile_status: 'APPROVED' as const,
              is_verified: true,
              premium_start: new Date().toISOString().slice(0, 10),
              premium_end: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
            }
          : p
      );
    } else {
      targetProfileId = `nc-prem-${Date.now()}`;
      let resolvedGender: 'Male' | 'Female' = 'Male';
      if (target.gender) {
        resolvedGender = normalizeGender(target.gender);
      } else if (
        currentUserProfile &&
        ((phoneNorm && currentUserProfile.mobile?.includes(phoneNorm)) ||
          (nameNorm && currentUserProfile.full_name?.toLowerCase().trim() === nameNorm))
      ) {
        resolvedGender = normalizeGender(currentUserProfile.gender);
      } else if (target.notes) {
        const n = target.notes.toLowerCase();
        if (
          n.includes('female') ||
          n.includes('bride') ||
          n.includes('sister') ||
          n.includes('daughter') ||
          n.includes('girl')
        ) {
          resolvedGender = 'Female';
        }
      }
      const isFemale = resolvedGender === 'Female';
      const newProf: Profile = {
        id: targetProfileId,
        member_id: getNextMemberId(),
        full_name: target.user_name,
        gender: resolvedGender,
        age: isFemale ? 22 : 26,
        date_of_birth: isFemale ? '2004-05-15' : '2000-01-01',
        location: 'Kerala',
        district: 'Malappuram',
        place: 'Kerala',
        education: 'Graduate',
        profession: 'Professional',
        guardian_name: `${target.user_name}'s Guardian`,
        guardian_mobile: target.phone_number,
        guardian_relation: 'Parent (Guardian)',
        mobile: target.phone_number,
        marital_status: 'Never Married',
        registration_type: 'ONLINE',
        profile_status: 'APPROVED',
        is_verified: true,
        is_premium: true,
        premium_plan: target.plan_name,
        premium_start: new Date().toISOString().slice(0, 10),
        premium_end: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
        created_at: new Date().toISOString(),
        about: target.notes ? `Approved Member (${target.plan_name}). Reason/Notes: ${target.notes}` : 'Verified Muslim individual seeking life partner.',
      };
      updatedProfiles = [autoCorrectMistakenGenders(newProf), ...profiles];
    }

    setProfiles(updatedProfiles);
    saveStoredProfiles(updatedProfiles);

    // Update current user profile in localStorage if matching
    if (currentUserProfile) {
      const uPhone = (currentUserProfile.mobile || '').replace(/\D/g, '').slice(-8);
      const uName = (currentUserProfile.full_name || '').toLowerCase().trim();
      if ((phoneNorm && uPhone && (phoneNorm.includes(uPhone) || uPhone.includes(phoneNorm))) || (nameNorm && nameNorm === uName)) {
        const updatedUserProf: UserProfileData = {
          ...currentUserProfile,
          is_premium: true,
          is_approved: true,
          premium_plan: target.plan_name,
        };
        setCurrentUserProfile(updatedUserProf);
        localStorage.setItem('nikah_circle_user_profile', JSON.stringify(updatedUserProf));
      }
    }

    // Insert into Payments ledger
    const payId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `pay-${Date.now()}`;
    const newPay: Payment = {
      id: payId,
      profile_id: targetProfileId || 'approved-user',
      profile_name: target.user_name,
      amount: target.amount,
      payment_method:
        target.plan_type === 'UPI_QR'
          ? 'UPI'
          : target.plan_type === 'CASH_OFFICE'
          ? 'CASH'
          : 'ONLINE',
      payment_status: 'PAID',
      payment_date: new Date().toISOString(),
      transaction_reference: target.utr_number || (target.referral_code ? `REF-${target.referral_code}` : `REQ-${Date.now().toString().slice(-6)}`),
      notes: `${target.plan_name}${target.referral_code ? ` [Code: ${target.referral_code}]` : ''} Approved by Admin (${target.phone_number})`,
    };
    const updatedPayments = [newPay, ...payments];
    setPayments(updatedPayments);
    saveStoredPayments(updatedPayments);

    try {
      const isUUID = (str?: string) => !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      const payPayload: any = {
        profile_name: target.user_name,
        amount: target.amount,
        payment_method: newPay.payment_method,
        payment_status: 'PAID',
        transaction_reference: newPay.transaction_reference,
        notes: newPay.notes,
      };
      if (isUUID(newPay.id)) payPayload.id = newPay.id;
      if (targetProfileId && isUUID(targetProfileId)) payPayload.profile_id = targetProfileId;
      await supabase.from('payments').insert(payPayload);
    } catch {}

    // Store approval status and trigger notification
    localStorage.setItem('nikah_circle_user_is_premium', 'true');
    localStorage.setItem('nikah_circle_premium_admin_status', 'APPROVED');
    localStorage.setItem('nikah_circle_premium_expiry', new Date(Date.now() + 90 * 86400000).toISOString());

    // Show 'Admin Approved' on screen and trigger required notification
    showToast('Premium plan successfully activated');
    setAdminApprovedBanner({
      status: 'Admin Approved',
      message: 'Premium plan successfully activated',
      planName: target.plan_name,
    });
    setPlanAlertBanner(null);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Admin turns off premium plan (Admin Off) or plan expires
  const handleDeactivatePremium = async (profileIdOrIdentifier?: string) => {
    setIsUserPremium(false);
    localStorage.setItem('nikah_circle_user_is_premium', 'false');
    localStorage.setItem('nikah_circle_premium_admin_status', 'ADMIN_OFF');
    setAdminApprovedBanner(null);

    if (profileIdOrIdentifier) {
      const updated = profiles.map((p) =>
        p.id === profileIdOrIdentifier || p.mobile === profileIdOrIdentifier || p.guardian_mobile === profileIdOrIdentifier
          ? {
              ...p,
              is_premium: false,
              premium_end: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
            }
          : p
      );
      setProfiles(updated);
      saveStoredProfiles(updated);
    }

    // Trigger required notification and on-screen banner: 'Replan or update your premium plan'
    showToast('Replan or update your premium plan');
    setPlanAlertBanner({
      status: 'Admin Off',
      message: 'Replan or update your premium plan',
    });
  };

  // Plan Expiry & Admin Off Monitoring
  useEffect(() => {
    const checkPlanStatus = () => {
      const adminStatus = localStorage.getItem('nikah_circle_premium_admin_status');
      const expiryStr = localStorage.getItem('nikah_circle_premium_expiry');

      if (adminStatus === 'ADMIN_OFF') {
        if (isUserPremium) {
          setIsUserPremium(false);
          localStorage.setItem('nikah_circle_user_is_premium', 'false');
          showToast('Replan or update your premium plan');
          setPlanAlertBanner({
            status: 'Admin Off',
            message: 'Replan or update your premium plan',
          });
        }
        return;
      }

      if (expiryStr) {
        const expiryTime = new Date(expiryStr).getTime();
        if (!isNaN(expiryTime) && Date.now() > expiryTime) {
          if (isUserPremium) {
            setIsUserPremium(false);
            localStorage.setItem('nikah_circle_user_is_premium', 'false');
            localStorage.setItem('nikah_circle_premium_admin_status', 'EXPIRED');
            showToast('Replan or update your premium plan');
            setPlanAlertBanner({
              status: 'Expired',
              message: 'Replan or update your premium plan',
            });
          }
        }
      }
    };

    checkPlanStatus();
  }, [isUserPremium]);

  // Admin rejects premium request
  const handleRejectPremiumRequest = async (id: string) => {
    const updatedRequests = premiumRequests.map((r) =>
      r.id === id ? { ...r, status: 'REJECTED' as const } : r
    );
    setPremiumRequests(updatedRequests);
    saveStoredPremiumRequests(updatedRequests);
    try {
      await supabase.from('premium_requests').update({ status: 'REJECTED' }).eq('id', id);
    } catch {}
    showToast('Request rejected.');
  };

  // Profile Registration Gating: Only Premium members can register, others are directed to Premium plans
  const handleOpenRegister = () => {
    if (!effectiveIsPremium && !isAdmin) {
      showToast('Profile registration requires premium membership. Please choose a plan.');
      setIsPremiumOpen(true);
    } else {
      setIsRegisterOpen(true);
    }
  };

  const handleSaveProfile = async (
    profileData: Partial<Profile>,
    paymentAmount?: number,
    paymentMethod?: string
  ) => {
    const isEdit = !!profileData.id;
    let targetProfile: Profile;
    const existing = isEdit ? profiles.find((p) => p.id === profileData.id) : undefined;
    const resolvedGender = normalizeGender(profileData.gender || existing?.gender || 'Male');

    if (isEdit) {
      targetProfile = {
        ...existing!,
        ...profileData,
        gender: resolvedGender,
        updated_at: new Date().toISOString(),
      } as Profile;

      const updated = profiles.map((p) => (p.id === targetProfile.id ? targetProfile : p));
      setProfiles(updated);
      saveStoredProfiles(updated);

      try {
        const updatePayload = prepareSupabaseProfilePayload(targetProfile);
        await supabase.from('profiles').update(updatePayload).eq('id', targetProfile.id);
      } catch (e) {
        console.warn('Saved locally', e);
      }
    } else {
      const isUUID = (str?: string) => !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `nc-${Date.now().toString().slice(-4)}`;
      const emailNorm = (profileData.email || '').toLowerCase().trim();
      const phoneNorm = profileData.mobile ? profileData.mobile.replace(/\D/g, '').slice(-8) : '';
      let memberId: string;
      if (emailNorm === 'nikahcircle01@gmail.com' || phoneNorm.endsWith('44905093')) {
        memberId = 'NCSM1002';
      } else if (emailNorm === 'sanusadique396@gmail.com' || phoneNorm.endsWith('43549396')) {
        memberId = 'NCSM1001';
      } else {
        const num = extractMemberIdNumber(profileData.member_id);
        if (num && num >= 1003 && !profiles.some((p) => p.member_id === `NCSM${num}`)) {
          memberId = `NCSM${num}`;
        } else {
          memberId = getNextMemberId(profiles);
        }
      }
      targetProfile = {
        id: newId,
        member_id: memberId,
        full_name: profileData.full_name || 'Candidate',
        gender: resolvedGender,
        location: profileData.location || 'Kerala',
        district: profileData.district || 'Kozhikode',
        marital_status: profileData.marital_status || 'Never Married',
        education: profileData.education || 'Graduate',
        profession: profileData.profession || 'Professional',
        guardian_name: profileData.guardian_name || 'Father (Guardian)',
        guardian_mobile: profileData.guardian_mobile || '',
        registration_type: profileData.registration_type || 'ONLINE',
        profile_status: profileData.profile_status || 'APPROVED',
        is_verified: profileData.is_verified ?? true,
        is_premium: profileData.is_premium ?? false,
        created_at: new Date().toISOString(),
        ...profileData,
      } as Profile;

      const updated = ensureUniqueSequentialMemberIds(deduplicateProfiles([targetProfile, ...profiles]));
      setProfiles(updated);
      saveStoredProfiles(updated);

      try {
        const insertPayload: any = prepareSupabaseProfilePayload(targetProfile);
        const { data: dbCreated } = await supabase.from('profiles').insert(insertPayload).select().single();
        if (dbCreated && dbCreated.id) {
          targetProfile.id = dbCreated.id;
        }
      } catch (err) {
        console.warn('Supabase profile insert error', err);
      }

      if (paymentAmount && paymentAmount > 0) {
        const payId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `pay-${Date.now()}`;
        const newPay: Payment = {
          id: payId,
          profile_id: targetProfile.id,
          profile_name: targetProfile.full_name,
          amount: paymentAmount,
          payment_method: (paymentMethod as any) || 'CASH',
          payment_status: 'PAID',
          payment_date: new Date().toISOString(),
          transaction_reference: `ADM-${Date.now().toString().slice(-5)}`,
        };
        const updatedPays = [newPay, ...payments];
        setPayments(updatedPays);
        saveStoredPayments(updatedPays);

        try {
          const payPayload: any = {
            profile_name: targetProfile.full_name,
            amount: paymentAmount,
            payment_method: (paymentMethod as any) || 'CASH',
            payment_status: 'PAID',
            transaction_reference: newPay.transaction_reference,
          };
          if (isUUID(newPay.id)) payPayload.id = newPay.id;
          if (isUUID(targetProfile.id)) payPayload.profile_id = targetProfile.id;
          await supabase.from('payments').insert(payPayload);
        } catch {}
      }
    }
  };

  const handleDeleteProfile = async (id: string) => {
    const target = profiles.find((p) => p.id === id);
    const targetPhone = target?.mobile ? target.mobile.replace(/\D/g, '').slice(-8) : '';
    const targetGPhone = target?.guardian_mobile ? target.guardian_mobile.replace(/\D/g, '').slice(-8) : '';
    const targetName = (target?.full_name || '').toLowerCase().trim();

    // 1. Blacklist permanently in deleted records
    const deleted = getDeletedRecords();
    deleted.ids = Array.from(new Set([...deleted.ids, id]));
    if (targetPhone) deleted.phones = Array.from(new Set([...deleted.phones, targetPhone]));
    if (targetGPhone) deleted.phones = Array.from(new Set([...deleted.phones, targetGPhone]));
    if (targetName) deleted.names = Array.from(new Set([...deleted.names, targetName]));
    saveDeletedRecords(deleted);

    // 2. Remove from profiles state & storage
    const updatedProfiles = profiles.filter((p) => p.id !== id && !isProfileDeleted(p, deleted));
    setProfiles(updatedProfiles);
    saveStoredProfiles(updatedProfiles);

    // 3. Mark matching premium requests as rejected so auto-sync never regenerates them
    const updatedRequests = premiumRequests.map((r) => {
      const rPhone = r.phone_number ? r.phone_number.replace(/\D/g, '').slice(-8) : '';
      const rName = r.user_name.toLowerCase().trim();
      const matchesPhone = targetPhone && rPhone && (targetPhone.includes(rPhone) || rPhone.includes(targetPhone));
      const matchesName = targetName && rName === targetName;
      if (matchesPhone || matchesName) {
        return { ...r, status: 'REJECTED' as const, notes: 'Profile deleted by Admin' };
      }
      return r;
    });
    setPremiumRequests(updatedRequests);
    saveStoredPremiumRequests(updatedRequests);

    // 4. Remove from shortlist / bookmarks and interestsMap
    setBookmarks((prev) => prev.filter((bId) => bId !== id));
    if (interestsMap[id]) {
      const updatedMap = { ...interestsMap };
      delete updatedMap[id];
      setInterestsMap(updatedMap);
      saveStoredInterestsMap(updatedMap);
    }

    // 5. If deleted profile matches the current logged in user profile, clear local profile
    if (currentUserProfile) {
      const uPhone = currentUserProfile.mobile ? currentUserProfile.mobile.replace(/\D/g, '').slice(-8) : '';
      const uName = (currentUserProfile.full_name || '').toLowerCase().trim();
      if (
        id === currentUser?.id ||
        (targetPhone && uPhone && (targetPhone.includes(uPhone) || uPhone.includes(targetPhone))) ||
        (targetName && uName === targetName)
      ) {
        setCurrentUserProfile(null);
        localStorage.removeItem('nikah_circle_user_profile');
        localStorage.removeItem('nikah_circle_user');
        setCurrentUser(null);
      }
    }

    // 6. Delete from remote Supabase table
    try {
      await supabase.from('profiles').delete().eq('id', id);
    } catch {}

    showToast(`Profile "${target?.full_name || 'User'}" deleted and removed from all lists.`);
  };

  const handleResetAllData = async () => {
    // 1. Established canonical accounts (NCSM1001: Noushida, NCSM1002: Sadiq / Admin)
    const baseSadiq: Profile = {
      id: '177a3731-5de2-4bbf-82d4-e4ea33cb25ed',
      member_id: 'NCSM1002',
      full_name: 'Sadiq',
      email: 'nikahcircle01@gmail.com',
      mobile: '9744905093',
      gender: 'Female',
      date_of_birth: '2002-03-13',
      location: 'majeri, Malappuram',
      district: 'Malappuram',
      place: 'majeri',
      education: 'Graduate',
      profession: 'dm',
      guardian_name: 'Guardian',
      guardian_mobile: '9744905093',
      guardian_relation: 'Parent (Guardian)',
      marital_status: 'Never Married',
      biodata_uploaded: true,
      registration_type: 'ONLINE',
      profile_status: 'APPROVED',
      is_verified: true,
      is_premium: true,
      premium_plan: 'Premium Free (Girls & Other)',
      premium_start: '2026-11-12',
      premium_end: '2027-02-10',
      created_at: '2026-11-12T13:37:23.773Z',
      about: '<!--NC_META:{"member_id":"NCSM1002","place":"majeri","state":"Kerala","biodata_uploaded":true,"biodata_document_name":null,"biodata_document_url":null,"hobbies":[],"interests":[]}-->',
    };

    const baseNoushida: Profile = {
      id: 'e2b7b16b-9545-4eda-bef7-17069eeffdaa',
      member_id: 'NCSM1001',
      full_name: 'NOUSHIDA',
      email: 'sanusadique396@gmail.com',
      mobile: '8943549396',
      gender: 'Female',
      date_of_birth: '1998-05-15',
      location: 'Malappuram, Malappuram',
      district: 'Malappuram',
      place: 'Malappuram',
      education: 'Graduate',
      profession: 'Professional',
      guardian_name: 'Family Guardian',
      guardian_mobile: '8943549396',
      guardian_relation: 'Parent (Guardian)',
      marital_status: 'Never Married',
      biodata_uploaded: false,
      registration_type: 'ONLINE',
      profile_status: 'APPROVED',
      is_verified: true,
      is_premium: false,
      premium_plan: null,
      created_at: '2026-11-12T13:37:37.211Z',
      about: '<!--NC_META:{"member_id":"NCSM1001","place":"Malappuram","state":"Kerala","biodata_uploaded":false,"biodata_document_name":null,"biodata_document_url":null,"hobbies":[],"interests":[]}-->',
    };

    const cleanProfiles = [baseSadiq, baseNoushida];

    // 2. Set clean state
    setProfiles(cleanProfiles);
    saveStoredProfiles(cleanProfiles);
    setPayments([]);
    setPremiumRequests([]);
    setBookmarks([]);
    setInterestsMap({});

    // 3. Clear storage keys
    localStorage.removeItem('nikah_circle_payments_v2');
    localStorage.removeItem('nikah_circle_bookmarks_v2');
    localStorage.removeItem('nikah_circle_premium_requests_v1');
    localStorage.removeItem('nikah_circle_incoming_interests_v2');
    localStorage.removeItem('nikah_circle_incoming_interests');
    localStorage.removeItem('nikah_circle_interests_map_v3');
    localStorage.removeItem('nikah_circle_interests_map_v2');
    localStorage.removeItem('nikah_circle_proposals_registry_v2');
    localStorage.removeItem('nikah_circle_proposals_registry_v3');
    localStorage.removeItem('nikah_circle_deleted_records_v2');

    // 4. Reset sequence counter to 1002 so the next newly registered user starts strictly from NCSM1003
    localStorage.setItem(MEMBER_ID_SEQ_KEY, '1002');

    // 5. Delete test candidate records from Supabase (preserving Sadiq and Noushida)
    try {
      const { data: allDbProfiles } = await supabase.from('profiles').select('id, email, mobile');
      if (allDbProfiles && allDbProfiles.length > 0) {
        const idsToDelete = allDbProfiles
          .filter((p: any) => {
            const email = (p.email || '').toLowerCase().trim();
            const mobile = (p.mobile || '').replace(/\D/g, '');
            const isSadiq = email === 'nikahcircle01@gmail.com' || mobile.endsWith('44905093');
            const isNoushida = email === 'sanusadique396@gmail.com' || mobile.endsWith('43549396');
            return !isSadiq && !isNoushida;
          })
          .map((p: any) => p.id);

        for (let i = 0; i < idsToDelete.length; i += 50) {
          const chunk = idsToDelete.slice(i, i + 50);
          await supabase.from('profiles').delete().in('id', chunk);
        }
      }
      await supabase.from('payments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('premium_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) {
      console.warn('Supabase wipe error', e);
    }

    showToast('Reset completed! Preserved NCSM1001 & NCSM1002. Next registration starts at NCSM1003.');
  };

  const handleApproveProfile = async (id: string) => {
    const updated = profiles.map((p) =>
      p.id === id ? { ...p, profile_status: 'APPROVED' as const, is_verified: true } : p
    );
    setProfiles(updated);
    saveStoredProfiles(updated);

    if (currentUserProfile) {
      const uPhone = currentUserProfile.mobile ? currentUserProfile.mobile.replace(/\D/g, '').slice(-8) : '';
      const uName = (currentUserProfile.full_name || '').toLowerCase().trim();
      const approvedProf = updated.find((p) => p.id === id);
      const aPhone = approvedProf?.mobile ? approvedProf.mobile.replace(/\D/g, '').slice(-8) : '';
      const aName = (approvedProf?.full_name || '').toLowerCase().trim();

      if (
        id === currentUserProfile.id ||
        (uPhone && aPhone && (uPhone.includes(aPhone) || aPhone.includes(uPhone))) ||
        (uName && aName && uName === aName)
      ) {
        const updatedCup: UserProfileData = {
          ...currentUserProfile,
          is_approved: true,
          profile_status: 'APPROVED',
        };
        setCurrentUserProfile(updatedCup);
        localStorage.setItem('nikah_circle_user_profile', JSON.stringify(updatedCup));
      }
    }

    try {
      await supabase.from('profiles').update({ profile_status: 'APPROVED', is_verified: true }).eq('id', id);
    } catch {}
    showToast('Profile accepted and published live!');
  };

  const handleRejectProfile = async (id: string) => {
    const updated = profiles.map((p) =>
      p.id === id ? { ...p, profile_status: 'REJECTED' as const } : p
    );
    setProfiles(updated);
    saveStoredProfiles(updated);

    if (currentUserProfile) {
      const uPhone = currentUserProfile.mobile ? currentUserProfile.mobile.replace(/\D/g, '').slice(-8) : '';
      const uName = (currentUserProfile.full_name || '').toLowerCase().trim();
      const rejectedProf = updated.find((p) => p.id === id);
      const rPhone = rejectedProf?.mobile ? rejectedProf.mobile.replace(/\D/g, '').slice(-8) : '';
      const rName = (rejectedProf?.full_name || '').toLowerCase().trim();

      if (
        id === currentUserProfile.id ||
        (uPhone && rPhone && (uPhone.includes(rPhone) || rPhone.includes(uPhone))) ||
        (uName && rName && uName === rName)
      ) {
        const updatedCup: UserProfileData = {
          ...currentUserProfile,
          is_approved: false,
          profile_status: 'REJECTED',
        };
        setCurrentUserProfile(updatedCup);
        localStorage.setItem('nikah_circle_user_profile', JSON.stringify(updatedCup));
      }
    }

    try {
      await supabase.from('profiles').update({ profile_status: 'REJECTED' }).eq('id', id);
    } catch {}
    showToast('Request rejected.');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setCurrentUser(null);
    setCurrentUserProfile(null);
    setIsAdmin(false);
    setInterestsMap({});
    localStorage.removeItem('nikah_circle_user');
    localStorage.removeItem('nikah_circle_user_profile');
    localStorage.removeItem('nikah_circle_is_admin');
    showToast('Logged out successfully.');
    // Show account creation modal
    setIsCreateAccountOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      gender: '',
      ageRange: '',
      state: '',
      district: '',
      place: '',
      location: '',
      profession: '',
      education: '',
      maritalStatus: '',
      verifiedOnly: false,
      premiumOnly: false,
    });
  };

  // Public Profiles List: Strict Premium + Completed Biodata Visibility
  // A profile must be completely hidden from other members UNLESS they have an active Premium Plan
  // AND have successfully uploaded/published their candidate biodata. Free plan or incomplete profiles are completely hidden.
  const approvedProfiles = useMemo(() => {
    return [...profiles]
      .filter((p) => {
        // Exclude current user from public candidate listings & featured matches
        if (
          (currentUserProfile?.id && p.id === currentUserProfile.id) ||
          (currentUser?.id && p.id === currentUser.id) ||
          (currentUserProfile?.member_id && p.member_id && currentUserProfile.member_id === p.member_id) ||
          (currentUserProfile?.mobile && p.mobile && p.mobile.replace(/\D/g, '').slice(-8) === currentUserProfile.mobile.replace(/\D/g, '').slice(-8)) ||
          (currentUser?.email && p.email && p.email.toLowerCase() === currentUser.email.toLowerCase())
        ) {
          return false;
        }

        if (p.profile_status !== 'APPROVED') return false;
        if (!p.is_premium) return false;
        return hasCompletedBiodata(p);
      })
      .sort((a, b) => {
        return (new Date(b.created_at || '').getTime() || 0) - (new Date(a.created_at || '').getTime() || 0);
      });
  }, [profiles, currentUserProfile, currentUser]);

  // Filtered Approved Profiles with Advanced Multi-field filtering
  const filteredProfiles = useMemo(() => {
    return approvedProfiles.filter((profile) => {
      // Exclude current user's own profile from browse/search matches
      if (
        (currentUserProfile?.id && profile.id === currentUserProfile.id) ||
        (currentUser?.id && profile.id === currentUser.id) ||
        (currentUserProfile?.member_id && profile.member_id && currentUserProfile.member_id === profile.member_id) ||
        (currentUserProfile?.mobile && profile.mobile && profile.mobile.replace(/\D/g, '').slice(-8) === currentUserProfile.mobile.replace(/\D/g, '').slice(-8)) ||
        (currentUser?.email && profile.email && profile.email.toLowerCase() === currentUser.email.toLowerCase())
      ) {
        return false;
      }

      if (searchQuery) {
        const match = [
          profile.full_name,
          profile.place,
          profile.location,
          profile.education,
          profile.profession,
          profile.district,
          profile.state,
          profile.about,
          Array.isArray(profile.hobbies) ? profile.hobbies.join(' ') : profile.hobbies,
          Array.isArray(profile.interests) ? profile.interests.join(' ') : profile.interests,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        if (!match) return false;
      }

      if (filters.gender && normalizeGender(profile.gender) !== filters.gender) return false;

      if (filters.district && !(profile.district || '').toLowerCase().includes(filters.district.toLowerCase())) {
        return false;
      }

      if (filters.place) {
        const placeMatches =
          (profile.place || '').toLowerCase().includes(filters.place.toLowerCase()) ||
          (profile.location || '').toLowerCase().includes(filters.place.toLowerCase());
        if (!placeMatches) return false;
      }

      if (filters.profession && !(profile.profession || '').toLowerCase().includes(filters.profession.toLowerCase())) {
        return false;
      }

      if (filters.education && !(profile.education || '').toLowerCase().includes(filters.education.toLowerCase())) {
        return false;
      }

      if (filters.maritalStatus && profile.marital_status !== filters.maritalStatus) return false;
      if (filters.verifiedOnly && !profile.is_verified) return false;
      if (filters.premiumOnly && !profile.is_premium) return false;

      if (filters.ageRange) {
        const age =
          profile.age ||
          (profile.date_of_birth
            ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
            : 26);
        if (filters.ageRange === '18-24' && (age < 18 || age > 24)) return false;
        if (filters.ageRange === '25-29' && (age < 25 || age > 29)) return false;
        if (filters.ageRange === '30-34' && (age < 30 || age > 34)) return false;
        if (filters.ageRange === '35-42' && (age < 35 || age > 42)) return false;
        if (filters.ageRange === '43+' && age < 43) return false;
      }

      return true;
    });
  }, [approvedProfiles, searchQuery, filters]);

  // Bookmarked Profiles: Only visible if active premium AND completed biodata
  const shortlistedProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (!bookmarks.includes(p.id)) return false;
      if (p.profile_status !== 'APPROVED') return false;
      if (!p.is_premium) return false;
      return hasCompletedBiodata(p);
    });
  }, [profiles, bookmarks]);

  // Active Interests List
  const interestedProfiles = useMemo(() => {
    return profiles.filter((p) => !!interestsMap[p.id]);
  }, [profiles, interestsMap]);

  // If in Admin Mode, render Admin Portal
  if (activeView === 'admin') {
    if (!isAdmin) {
      // Prompt for Admin login
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
          <LoginModal
            isOpen={true}
            onClose={() => setActiveView('home')}
            onSuccess={(user, isAdminUser) => {
              setCurrentUser(user);
              setIsAdmin(isAdminUser);
              if (isAdminUser) {
                showToast('Welcome, Super Admin!');
              } else {
                showToast('This account is not an admin.');
                setActiveView('home');
              }
            }}
            initialMode="admin"
          />
        </div>
      );
    }

    return (
      <>
        <OfflineBanner />
        <AdminPortal
          profiles={profiles}
          payments={payments}
          premiumRequests={premiumRequests}
          onSaveProfile={handleSaveProfile}
          onDeleteProfile={handleDeleteProfile}
          onResetAllData={handleResetAllData}
          onApproveProfile={handleApproveProfile}
          onRejectProfile={handleRejectProfile}
          onApprovePremiumRequest={handleApprovePremiumRequest}
          onRejectPremiumRequest={handleRejectPremiumRequest}
          onDeactivatePremium={handleDeactivatePremium}
          onExitAdmin={() => setActiveView('home')}
          adminEmail="nikahcircle01@gmail.com"
          onRefreshData={refreshAllData}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-[#f7dce8] selection:text-[#4b001f]">
      {/* Offline Toast */}
      <OfflineBanner />

      {/* Navigation Bar with Clean 3-Dot Dropdown, Separated Tabs, and Plan Button */}
      <Navbar
        activeView={activeView}
        onNavigate={(view, tab) => {
          if (view === 'admin' && !isAdmin) {
            setLoginMode('admin');
            setIsLoginOpen(true);
          } else {
            setActiveView(view);
            if (tab) {
              setInterestsActiveTab(tab);
            } else if (view === 'interests') {
              const pendingCount = incomingInterests.filter((i) => i.status === 'pending').length;
              if (pendingCount > 0) {
                setInterestsActiveTab('received');
              }
            }
          }
        }}
        interestsActiveTab={interestsActiveTab}
        currentUser={currentUser}
        userProfile={currentUserProfile}
        onEditProfile={handleOpenEditProfile}
        isAdmin={isAdmin}
        onOpenLogin={(mode) => {
          setLoginMode(mode || 'member');
          setIsLoginOpen(true);
        }}
        onOpenRegister={handleOpenRegister}
        onOpenPremium={handleOpenPremium}
        onLogout={handleLogout}
        savedCount={bookmarks.length}
        interestsCount={Object.keys(interestsMap).length}
        receivedInterestsCount={incomingInterests.filter((i) => i.status === 'pending').length}
        isUserPremium={effectiveIsPremium}
        isUserApproved={isAdminApproved}
        currentPlanName={effectivePlanName}
        onOpenBiodataWizard={handleOpenBiodataWizard}
        hasBiodataUploaded={hasUserBiodata}
      />

      {/* Re-prompt Banner for Premium Users who skipped Biodata */}
      {isAdminApproved && effectiveIsPremium && !currentUserProfile?.biodata_uploaded && (
        <div className="bg-gradient-to-r from-amber-500/15 via-[#c9973e]/10 to-amber-500/15 border-b border-amber-300/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="p-3.5 rounded-2xl bg-white/95 border border-amber-300/80 text-amber-950 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4b001f] to-[#7a183b] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs border border-[#c9973e]/50">
                  <FileText className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-bold text-xs sm:text-sm text-[#4b001f]">
                      Complete Your Matrimonial Biodata
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      Required for Proposals
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Your Premium plan is active! Complete your 4-step verified biodata to immediately unlock sending proposal interests to profiles.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenBiodataWizard}
                className="px-4 py-2 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 self-end sm:self-center animate-pulse"
              >
                <span>Upload Biodata</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#c9973e]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* On-Screen Status Banner: Admin Approved & Premium Activated */}
      {adminApprovedBanner && (
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white px-4 py-2.5 shadow-md border-b border-emerald-500/40 text-xs sm:text-sm animate-in slide-in-from-top-2 duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 font-bold">
              <span className="px-2.5 py-0.5 rounded-full bg-white text-emerald-900 text-[11px] font-black uppercase tracking-wider shadow-2xs">
                Admin Approved
              </span>
              <span>Premium plan successfully activated</span>
            </div>
            <button
              onClick={() => setAdminApprovedBanner(null)}
              className="p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* On-Screen Status Banner: Expiry / Admin Off Notification */}
      {planAlertBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white px-4 py-2.5 shadow-md border-b border-amber-400/40 text-xs sm:text-sm animate-in slide-in-from-top-2 duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 font-bold">
              <span className="px-2.5 py-0.5 rounded-full bg-white text-amber-950 text-[11px] font-black uppercase tracking-wider shadow-2xs">
                {planAlertBanner.status}
              </span>
              <span>Replan or update your premium plan</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPlanAlertBanner(null);
                  handleOpenPremium();
                }}
                className="px-3 py-1 rounded-lg bg-white text-[#4b001f] text-xs font-bold hover:bg-stone-100 cursor-pointer shadow-xs"
              >
                Replan / Upgrade
              </button>
              <button
                onClick={() => setPlanAlertBanner(null)}
                className="p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#4b001f] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#c9973e]/40 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* =========================================
          VIEW 1: HOME PAGE (Only 6 Featured Profiles + View More Button)
         ========================================= */}
      {activeView === 'home' && (
        <>
          <Hero
            onBrowseClick={() => {
              const el = document.getElementById('featured-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onExplorePremium={handleOpenPremium}
            onRegisterClick={handleOpenRegister}
            memberId={effectiveMemberId}
            isUserPremium={effectiveIsPremium}
          />

          <main id="featured-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 flex-1">
            {/* FEATURED PROFILES SECTION: Limited strictly to 6 */}
            <div className="space-y-6">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#c9973e]">
                  Selected Matches
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4b001f]">
                  Featured Profiles
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Verified profiles from Nikah Circle. Full biodata requires mutual interest.
                </p>
              </div>

              {/* Grid with ONLY 6 Profiles */}
              {approvedProfiles.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#eadfe4] p-10 text-center space-y-3 max-w-xl mx-auto shadow-xs">
                  <Sparkles className="w-10 h-10 text-[#c9973e] mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-[#4b001f]">
                    Premium Profiles Sanctuary
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Only verified candidates with active Premium Plans are publicly featured and discoverable. Free plan accounts remain hidden from public listings until upgraded.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenPremium}
                    className="px-6 py-2.5 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#c9973e]" />
                    <span>Explore Premium Packages</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedProfiles.slice(0, 6).map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onView={setSelectedProfile}
                      onSendInterest={handleSendInterest}
                      onCancelInterest={handleCancelInterest}
                      isBookmarked={bookmarks.includes(profile.id)}
                      onToggleBookmark={handleToggleBookmark}
                      interestStatus={interestsMap[profile.id]}
                      isUserPremium={effectiveIsPremium}
                      onOpenPremium={handleOpenPremium}
                      currentUserGender={currentUserProfile?.gender}
                      currentUserId={currentUserProfile?.id || currentUser?.id}
                      currentUserMobile={currentUserProfile?.mobile}
                      hasUserBiodata={hasUserBiodata}
                      onOpenBiodataWizard={handleOpenBiodataWizard}
                      onOppositeGenderRequired={(genderNeeded) => {
                        showToast(`Proposals can only be exchanged between opposite gender profiles (${genderNeeded}).`);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* PROMINENT "VIEW MORE" BUTTON NAVIGATING TO PROFILES PAGE */}
              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setActiveView('profiles');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-[#4b001f] hover:bg-[#350016] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>View More Profiles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* How It Works Section */}
            <section className="pt-8 pb-4 border-t border-[#eadfe4]">
              <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#c9973e]">
                  Dignified Process
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#4b001f]">
                  How Nikah Circle Works
                </h3>
                <p className="text-xs text-stone-500">
                  Privacy and family involvement in every single step.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-[#eadfe4] text-center space-y-2.5 shadow-xs">
                  <div className="w-11 h-11 rounded-xl bg-[#4b001f] text-white font-serif font-bold text-base flex items-center justify-center mx-auto">
                    1
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#4b001f]">
                    Explore Matches
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Browse verified candidates with photo modesty. Full biodata is guarded.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#eadfe4] text-center space-y-2.5 shadow-xs">
                  <div className="w-11 h-11 rounded-xl bg-[#c9973e] text-[#350016] font-serif font-bold text-base flex items-center justify-center mx-auto">
                    2
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#4b001f]">
                    Send Formal Interest
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Express interest. When the other side accepts, full biodata is unlocked!
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#eadfe4] text-center space-y-2.5 shadow-xs">
                  <div className="w-11 h-11 rounded-xl bg-[#4b001f] text-white font-serif font-bold text-base flex items-center justify-center mx-auto">
                    3
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#4b001f]">
                    Guardian Contact & Nikah
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Receive verified Guardian phone number for respectful family discussions.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </>
      )}

      {/* =========================================
          VIEW 2: ALL PROFILES PAGE (With Premium Search Gating & Full List)
         ========================================= */}
      {activeView === 'profiles' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1">
          <div className="flex items-center justify-between pb-3 border-b border-[#eadfe4]">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#4b001f]">
                All Profiles
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Showing verified active Premium candidates. Total: {approvedProfiles.length} active profiles.
              </p>
            </div>

            <button
              onClick={() => setActiveView('home')}
              className="px-4 py-2 rounded-xl border border-[#4b001f] text-[#4b001f] text-xs font-bold hover:bg-[#fff6fa] transition-colors cursor-pointer"
            >
              ← Back to Home
            </button>
          </div>

          {/* Free Plan Visibility Gating Notice */}
          {!effectiveIsPremium && (
            <div className="bg-gradient-to-r from-[#fff9fa] via-amber-50/50 to-[#fff2f7] border border-[#f3d3df] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#4b001f]">
                    Free Plan Account — Public Visibility Gated
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    You can freely browse verified premium profiles. To feature and publish your own profile in search & listings, upgrade to a Premium Plan.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleOpenPremium}
                className="px-4 py-2 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-colors shrink-0 shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c9973e]" />
                <span>Upgrade to Premium</span>
              </button>
            </div>
          )}

          {/* Premium Search Filter Strip */}
          <SearchFilter
            filters={filters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
            totalCount={approvedProfiles.length}
            filteredCount={filteredProfiles.length}
            isUserPremium={effectiveIsPremium}
            onOpenPremium={handleOpenPremium}
          />

          {/* Profiles Grid */}
          {filteredProfiles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#eadfe4] p-12 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-[#c9973e] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#4b001f]">
                No Premium Profiles Found
              </h3>
              <p className="text-xs text-stone-500">
                {searchQuery || Object.values(filters).some(Boolean)
                  ? 'Try changing your search terms or resetting filters.'
                  : 'Only profiles with an active Premium subscription are publicly listed. Upgrade your account to feature your profile.'}
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  onClick={handleOpenPremium}
                  className="px-4 py-2 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Explore Premium Plans
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onView={setSelectedProfile}
                  onSendInterest={handleSendInterest}
                  onCancelInterest={handleCancelInterest}
                  isBookmarked={bookmarks.includes(profile.id)}
                  onToggleBookmark={handleToggleBookmark}
                  interestStatus={interestsMap[profile.id]}
                  isUserPremium={effectiveIsPremium}
                  onOpenPremium={handleOpenPremium}
                  currentUserGender={currentUserProfile?.gender}
                  currentUserId={currentUserProfile?.id || currentUser?.id}
                  currentUserMobile={currentUserProfile?.mobile}
                  hasUserBiodata={hasUserBiodata}
                  onOpenBiodataWizard={handleOpenBiodataWizard}
                  onOppositeGenderRequired={(genderNeeded) => {
                    showToast(`Proposals can only be exchanged between opposite gender profiles (${genderNeeded}).`);
                  }}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* =========================================
          VIEW 3: SHORTLISTED PROFILES
         ========================================= */}
      {activeView === 'shortlist' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 flex-1">
          <div className="flex items-center justify-between pb-4 border-b border-[#eadfe4]">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#4b001f] flex items-center gap-2">
                <Heart className="w-6 h-6 text-[#c9973e] fill-[#c9973e]" />
                <span>Shortlist ({shortlistedProfiles.length})</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Saved profiles for detailed review with your family.
              </p>
            </div>

            <button
              onClick={() => setActiveView('profiles')}
              className="px-4 py-2 rounded-xl border border-[#4b001f] text-[#4b001f] text-xs font-bold hover:bg-[#fff6fa] transition-colors cursor-pointer"
            >
              Browse Profiles
            </button>
          </div>

          {shortlistedProfiles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#eadfe4] p-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#4b001f]">
                No Shortlisted Profiles
              </h3>
              <p className="text-xs text-stone-500">
                Click the heart icon on any profile to save candidates here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shortlistedProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onView={setSelectedProfile}
                  onSendInterest={handleSendInterest}
                  onCancelInterest={handleCancelInterest}
                  isBookmarked={bookmarks.includes(profile.id)}
                  onToggleBookmark={handleToggleBookmark}
                  interestStatus={interestsMap[profile.id]}
                  isUserPremium={effectiveIsPremium}
                  onOpenPremium={() => setIsPremiumOpen(true)}
                  currentUserGender={currentUserProfile?.gender}
                  currentUserId={currentUserProfile?.id || currentUser?.id}
                  currentUserMobile={currentUserProfile?.mobile}
                  hasUserBiodata={hasUserBiodata}
                  onOpenBiodataWizard={handleOpenBiodataWizard}
                  onOppositeGenderRequired={(genderNeeded) => {
                    showToast(`Proposals can only be exchanged between opposite gender profiles (${genderNeeded}).`);
                  }}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* =========================================
          VIEW 4: INTERESTS & PROPOSALS HUB
          - Toggle Button: Send vs Receive
          - Send Section: Outgoing proposals you sent to candidates
          - Receive Section: Incoming proposals received for your profile
          - Accept Interest is strictly and exclusively on Received profiles
         ========================================= */}
      {activeView === 'interests' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eadfe4]">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4b001f] flex items-center gap-2.5">
                <HeartHandshake className="w-7 h-7 text-[#c9973e]" />
                <span>Interests & Proposals Hub</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Toggle between sent proposals and incoming proposals received for your profile.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveView('profiles')}
                className="px-4 py-2.5 rounded-xl border border-[#4b001f] text-[#4b001f] text-xs font-bold hover:bg-[#fff6fa] transition-colors cursor-pointer"
              >
                Browse Profiles
              </button>
            </div>
          </div>

          {/* Segmented Toggle Control: Send vs Receive */}
          <div className="flex justify-center sm:justify-start">
            <div className="inline-flex p-1.5 rounded-2xl bg-stone-200/80 border border-stone-300 shadow-inner w-full sm:w-auto min-w-[320px]">
              {/* Send / Sent Button */}
              <button
                type="button"
                onClick={() => setInterestsActiveTab('sent')}
                className={`flex-1 py-3 px-6 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  interestsActiveTab === 'sent'
                    ? 'bg-[#4b001f] text-white shadow-md'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Sent</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    interestsActiveTab === 'sent'
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-300 text-stone-800'
                  }`}
                >
                  {interestedProfiles.length}
                </span>
              </button>

              {/* Receive / Received Button */}
              <button
                type="button"
                onClick={() => setInterestsActiveTab('received')}
                className={`flex-1 py-3 px-6 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  interestsActiveTab === 'received'
                    ? 'bg-[#4b001f] text-white shadow-md'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                <Inbox className="w-4 h-4 text-[#c9973e]" />
                <span>Received</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    incomingInterests.filter((i) => i.status === 'pending').length > 0
                      ? 'bg-emerald-500 text-white animate-pulse'
                      : incomingInterests.length > 0
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-200/50 text-stone-400 font-normal'
                  }`}
                >
                  {incomingInterests.filter((i) => i.status === 'pending').length > 0
                    ? `${incomingInterests.filter((i) => i.status === 'pending').length} New`
                    : incomingInterests.length}
                </span>
              </button>
            </div>
          </div>

          {/* SECTION 1: RECEIVED PROPOSALS (Incoming Interests to this Profile) */}
          {interestsActiveTab === 'received' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#4b001f]">
                    Received Proposals ({incomingInterests.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Proposals sent to your profile by candidates and families. Accept an interest to unlock mutual contact details.
                  </p>
                </div>
              </div>

              {incomingInterests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#eadfe4] p-12 text-center space-y-3">
                  <Inbox className="w-12 h-12 text-stone-300 mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-[#4b001f]">
                    No Proposals Received Yet
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    When other candidates and their families view your profile and send proposal interest, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {incomingInterests.map((item) => {
                    const isAccepted = item.status === 'accepted';
                    const isDeclined = item.status === 'declined';
                    const cleanPhone = item.guardian_mobile.replace(/\D/g, '');

                    return (
                      <div
                        key={item.id}
                        className={`p-6 rounded-2xl bg-white border shadow-xs transition-all space-y-4 ${
                          isAccepted
                            ? 'border-emerald-300 ring-1 ring-emerald-200'
                            : isDeclined
                            ? 'border-stone-200 opacity-70'
                            : 'border-[#eadfe4] hover:shadow-md'
                        }`}
                      >
                        {/* Candidate Top Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4b001f] to-[#7a183b] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 border border-[#c9973e]/40">
                              {item.sender_name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-bold bg-[#4b001f] text-white px-2 py-0.5 rounded-md tracking-wider">
                                  {item.sender_member_id || (item.sender_profile_id?.startsWith('NCSM') ? item.sender_profile_id : 'Member')}
                                </span>
                                <h3 className="font-serif font-bold text-lg text-[#4b001f]">
                                  {item.sender_name}
                                </h3>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  Admin Verified
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                                <span>{item.sender_age} yrs</span>
                                <span>·</span>
                                <span>{normalizeGender(item.sender_gender) === 'Male' ? 'Groom' : 'Bride'}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#c9973e]" />
                                  {item.sender_location}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Proposal Status Badge */}
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-2xs ${
                              isAccepted
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isDeclined
                                ? 'bg-stone-100 text-stone-600 border border-stone-200'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {isAccepted
                              ? '✓ Proposal Accepted'
                              : isDeclined
                              ? 'Declined'
                              : '⏳ Proposal Received'}
                          </span>
                        </div>

                        {/* Candidate Profession & Education Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-[#c9973e] shrink-0" />
                            <span className="truncate">{item.sender_profession}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-[#c9973e] shrink-0" />
                            <span className="truncate">{item.sender_education}</span>
                          </div>
                        </div>

                        {/* Proposal Note from Family */}
                        {item.notes && (
                          <div className="text-xs text-stone-600 bg-[#fff9fa] border-l-2 border-[#4b001f] p-3 rounded-r-xl italic">
                            "{item.notes}"
                          </div>
                        )}

                        <div className="text-[11px] text-stone-400 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            Received {item.received_at}
                          </span>
                        </div>

                        {/* UNLOCKED GUARDIAN CONTACT SECTION (Once Accepted) */}
                        {isAccepted ? (
                          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Mutual Consent Established! Guardian Details Unlocked:</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-stone-500 block text-[10px]">Family Guardian:</span>
                                <span className="font-bold text-stone-900">{item.guardian_name}</span>
                              </div>
                              <div>
                                <span className="text-stone-500 block text-[10px]">Guardian Contact:</span>
                                <span className="font-bold text-stone-900">{item.guardian_mobile}</span>
                              </div>
                            </div>

                            <div className="pt-2 flex flex-wrap items-center gap-2">
                              <a
                                href={`tel:${item.guardian_mobile}`}
                                className="flex-1 min-w-[120px] py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Call Guardian</span>
                              </a>

                              <a
                                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                  `Assalamu Alaikum. This is regarding the matrimonial proposal on Nikah Circle for ${item.sender_name}. We have accepted the proposal and would like to connect families.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-[120px] py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Chat on WhatsApp</span>
                              </a>

                              <button
                                type="button"
                                onClick={() => {
                                  const match = profiles.find(
                                    (p) => p.full_name?.toLowerCase().trim() === item.sender_name.toLowerCase().trim()
                                  );
                                  if (match) {
                                    setSelectedProfile(match);
                                  } else {
                                    setSelectedProfile({
                                      id: item.id,
                                      full_name: item.sender_name,
                                      gender: normalizeGender(item.sender_gender),
                                      age: item.sender_age,
                                      location: item.sender_location,
                                      education: item.sender_education,
                                      profession: item.sender_profession,
                                      guardian_name: item.guardian_name,
                                      guardian_mobile: item.guardian_mobile,
                                      mobile: item.guardian_mobile,
                                      marital_status: 'Never Married',
                                      registration_type: 'ONLINE',
                                      is_premium: false,
                                      about: item.notes || 'Matrimonial proposal on Nikah Circle.',
                                      is_verified: true,
                                      profile_status: 'APPROVED',
                                    });
                                  }
                                }}
                                className="flex-1 min-w-[130px] px-4 py-2 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold cursor-pointer transition-colors text-center"
                              >
                                View Complete Biodata
                              </button>
                            </div>
                          </div>
                        ) : !isDeclined ? (
                          /* ACCEPT PROPOSAL ACTION - EXCLUSIVELY ON RECEIVED PROFILES */
                          <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleDeclineIncomingInterest(item.id)}
                              className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                            >
                              <XIcon className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleAcceptIncomingInterest(item.id)}
                              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>Accept Interest & Unlock Contact</span>
                            </button>
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-stone-100 text-right">
                            <button
                              type="button"
                              onClick={() => handleAcceptIncomingInterest(item.id)}
                              className="text-xs text-[#4b001f] hover:underline font-semibold cursor-pointer"
                            >
                              Reconsider & Accept Proposal
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: SENT INTERESTS (Outbox - Profiles you sent an interest to) */}
          {interestsActiveTab === 'sent' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#4b001f]">
                    Proposals You Sent ({interestedProfiles.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Proposals you sent to prospective candidates. Biodata is locked until candidate accepts.
                  </p>
                </div>
              </div>

              {interestedProfiles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#eadfe4] p-12 text-center space-y-3">
                  <Send className="w-12 h-12 text-stone-300 mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-[#4b001f]">
                    No Sent Interests Yet
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    You have not sent an interest to any profile yet. Explore verified profiles and click "Send Interest" to begin.
                  </p>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveView('profiles')}
                      className="px-5 py-2.5 rounded-xl bg-[#4b001f] text-white text-xs font-bold hover:bg-[#350016] transition-colors cursor-pointer shadow-xs"
                    >
                      Explore Profiles Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {interestedProfiles.map((p) => {
                    const status = interestsMap[p.id];
                    const isAccepted = status === 'accepted';
                    const cleanPhone = (p.guardian_mobile || p.mobile || '').replace(/\D/g, '');

                    return (
                      <div
                        key={p.id}
                        className={`p-6 rounded-2xl bg-white border shadow-xs transition-all space-y-4 ${
                          isAccepted
                            ? 'border-emerald-300 ring-1 ring-emerald-200'
                            : 'border-[#eadfe4] hover:shadow-md'
                        }`}
                      >
                        {/* Candidate Top Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4b001f] to-[#7a183b] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 border border-[#c9973e]/40">
                              {p.full_name?.charAt(0) || '♡'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-bold bg-[#4b001f] text-white px-2 py-0.5 rounded-md tracking-wider">
                                  {p.member_id || (p.id?.startsWith('NCSM') ? p.id : 'Member')}
                                </span>
                                <h3 className="font-serif font-bold text-lg text-[#4b001f]">
                                  {p.full_name}
                                </h3>
                                {(p.profile_status === 'APPROVED' || p.is_verified) && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                    Admin Verified
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                                <span>
                                  {p.age ||
                                    (p.date_of_birth
                                      ? Math.max(18, new Date().getFullYear() - new Date(p.date_of_birth).getFullYear())
                                      : 24)}{' '}
                                  yrs
                                </span>
                                <span>·</span>
                                <span>{normalizeGender(p.gender) === 'Male' ? 'Groom' : 'Bride'}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#c9973e]" />
                                  {p.location || p.place || 'Kerala'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Proposal Status Badge */}
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-2xs ${
                              isAccepted
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {isAccepted ? '✓ Proposal Accepted' : '⏳ Awaiting Acceptance'}
                          </span>
                        </div>

                        {/* Candidate Profession & Education Highlights (Identical to Received Cards) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-[#c9973e] shrink-0" />
                            <span className="truncate">{p.profession || 'Professional'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-[#c9973e] shrink-0" />
                            <span className="truncate">{p.education || 'Graduate'}</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-stone-400 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>{isAccepted ? 'Mutual proposal established' : 'Proposal sent · Waiting for candidate response'}</span>
                          </span>
                        </div>

                        {/* Bottom Actions: Fixed layout matching Received Cards exactly */}
                        {isAccepted ? (
                          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Mutual Consent Established! Guardian Details Unlocked:</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-stone-500 block text-[10px]">Family Guardian:</span>
                                <span className="font-bold text-stone-900">{p.guardian_name || 'Family Guardian'}</span>
                              </div>
                              <div>
                                <span className="text-stone-500 block text-[10px]">Guardian Contact:</span>
                                <span className="font-bold text-stone-900">{p.guardian_mobile || p.mobile}</span>
                              </div>
                            </div>

                            <div className="pt-2 flex flex-wrap items-center gap-2">
                              <a
                                href={`tel:${p.guardian_mobile || p.mobile}`}
                                className="flex-1 min-w-[120px] py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Call Guardian</span>
                              </a>

                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                    `Assalamu Alaikum. This is regarding the matrimonial proposal on Nikah Circle for ${p.full_name}. We would like to connect families.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 min-w-[120px] py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Chat on WhatsApp</span>
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedProfile(p)}
                                className="flex-1 min-w-[130px] px-4 py-2 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold cursor-pointer transition-colors text-center"
                              >
                                View Complete Biodata
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCancelInterest(p.id)}
                                className="px-3.5 py-2 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold cursor-pointer transition-colors"
                                title="Cancel and remove this sent proposal"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-600 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>Proposal sent. Biodata is locked until candidate accepts.</span>
                            </div>

                            <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2.5">
                              <button
                                type="button"
                                onClick={() => handleCancelInterest(p.id)}
                                className="px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                              >
                                <XIcon className="w-3.5 h-3.5" />
                                <span>Cancel Interest</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedProfile(p)}
                                className="px-5 py-2.5 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1.5"
                              >
                                <span>View Profile Details</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Global Modals */}
      <ProfileModal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onSendInterest={handleSendInterest}
        onCancelInterest={handleCancelInterest}
        interestStatus={selectedProfile ? interestsMap[selectedProfile.id] : null}
        isBookmarked={selectedProfile ? bookmarks.includes(selectedProfile.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onOpenPremium={() => {
          setSelectedProfile(null);
          handleOpenPremium();
        }}
        isUserPremium={effectiveIsPremium}
        currentUserGender={currentUserProfile?.gender}
        currentUserMobile={currentUserProfile?.mobile}
        hasUserBiodata={hasUserBiodata}
        onOpenBiodataWizard={handleOpenBiodataWizard}
      />

      {/* Mandatory Profile Account Setup on First Open / Edit Anytime */}
      <UserProfileModal
        isOpen={isCreateAccountOpen || isEditingProfile}
        isMandatory={isCreateAccountOpen && !isEditingProfile}
        isEditing={isEditingProfile}
        initialData={currentUserProfile}
        isApproved={isAdminApproved}
        isAdminApproved={isAdminApproved}
        isPremium={effectiveIsPremium}
        planName={effectivePlanName}
        isPostPremium={isPostPremiumBiodataUpload && isAdminApproved}
        onOpenPremium={() => {
          setIsCreateAccountOpen(false);
          setIsEditingProfile(false);
          handleOpenPremium();
        }}
        onClose={() => {
          setIsCreateAccountOpen(false);
          setIsEditingProfile(false);
          setIsPostPremiumBiodataUpload(false);
        }}
        onSubmit={async (data) => {
          await handleSaveUserProfile(data);
          setIsPostPremiumBiodataUpload(false);
        }}
        onSwitchToLogin={() => {
          setIsCreateAccountOpen(false);
          setIsEditingProfile(false);
          setIsPostPremiumBiodataUpload(false);
          setLoginMode('member');
          setIsLoginOpen(true);
        }}
      />

      {/* Step-by-Step Multi-Stage Biodata Wizard Modal */}
      <BiodataWizardModal
        isOpen={isBiodataWizardOpen}
        onClose={() => setIsBiodataWizardOpen(false)}
        onSubmit={handleSaveBiodataWizard}
        initialData={currentUserProfile}
        userMemberId={effectiveMemberId}
        isApproved={isAdminApproved}
        isPremium={effectiveIsPremium}
        onOpenPremium={() => {
          setIsBiodataWizardOpen(false);
          handleOpenPremium();
        }}
      />

      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        onSubmitPremiumRequest={handleSubmitPremiumRequest}
        defaultUserName={currentUserProfile?.full_name || (currentUser?.email ? currentUser.email.split('@')[0] : '')}
        defaultUserPhone={currentUserProfile?.mobile || ''}
        defaultUserGender={currentUserProfile?.gender}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={async (newProfile) => {
          await handleSaveProfile(newProfile);
          showToast('Profile submitted for admin approval!');
        }}
        isUserPremium={effectiveIsPremium || isAdmin}
        onOpenPremium={() => {
          setIsRegisterOpen(false);
          handleOpenPremium();
        }}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setLoginMode('member');
          setIsLoginOpen(true);
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={(user, isAdminUser) => {
          setCurrentUser(user);
          setIsAdmin(isAdminUser);
          localStorage.setItem('nikah_circle_user', JSON.stringify(user));
          localStorage.setItem('nikah_circle_is_admin', String(isAdminUser));
          setIsLoginOpen(false);

          // If a new regular user logs in and does not have a profile, register base account
          if (!isAdminUser && user.email && user.email.toLowerCase() !== 'nikahcircle01@gmail.com') {
            const hasExisting = profiles.some(
              (p) => p.email && p.email.toLowerCase() === user.email.toLowerCase()
            );
            if (!hasExisting) {
              const newMemberId = getNextMemberId(profiles);
              const updatedUser = { ...user, member_id: newMemberId };
              setCurrentUser(updatedUser);
              localStorage.setItem('nikah_circle_user', JSON.stringify(updatedUser));
              const autoProfile: Profile = {
                id: `usr-${Date.now().toString().slice(-6)}`,
                member_id: newMemberId,
                full_name: user.email.split('@')[0],
                email: user.email,
                mobile: '',
                gender: normalizeGender(currentUserProfile?.gender || 'Male'),
                marital_status: 'Never Married',
                location: 'Kerala',
                registration_type: 'ONLINE',
                profile_status: 'PENDING',
                is_verified: false,
                is_premium: false,
                created_at: new Date().toISOString(),
              };
              const updated = deduplicateProfiles([autoProfile, ...profiles]);
              setProfiles(updated);
              saveStoredProfiles(updated);

              try {
                const payload = prepareSupabaseProfilePayload(autoProfile);
                supabase
                  .from('profiles')
                  .insert(payload)
                  .select()
                  .single()
                  .then(({ data: createdDb }) => {
                    if (createdDb?.id) {
                      autoProfile.id = createdDb.id;
                    }
                  });
              } catch (e) {
                console.warn('Auto profile register error', e);
              }
            }
          }

          if (isAdminUser) {
            showToast('Admin login successful!');
            setActiveView('admin');
          } else {
            showToast(`Welcome, ${user.email}!`);
          }
        }}
        initialMode={loginMode}
      />

      <Footer
        onNavigateAdmin={() => {
          if (isAdmin) {
            setActiveView('admin');
          } else {
            setLoginMode('admin');
            setIsLoginOpen(true);
          }
        }}
        onOpenPremium={handleOpenPremium}
        onOpenRegister={handleOpenRegister}
      />
    </div>
  );
}
