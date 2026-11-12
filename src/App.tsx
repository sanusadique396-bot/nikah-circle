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
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INCOMING_INTERESTS_STORAGE_KEY = 'nikah_circle_incoming_interests_v2';

function getDefaultIncomingInterests(gender?: 'Male' | 'Female'): IncomingInterest[] {
  if (gender === 'Male') {
    return [
      {
        id: 'inc-001',
        sender_name: 'Dr. Ayesha Fathima',
        sender_age: 25,
        sender_gender: 'Female',
        sender_profession: 'MBBS Resident Doctor',
        sender_education: 'MBBS, Calicut Medical College',
        sender_location: 'Calicut, Kerala',
        guardian_name: 'Dr. Usman K. (Father)',
        guardian_mobile: '+91 98461 11223',
        guardian_relation: 'Father',
        received_at: 'Today, 10:15 AM',
        status: 'pending',
        notes: 'Assalamu Alaikum. We reviewed your profile and found good alignment with our family principles.',
      },
      {
        id: 'inc-002',
        sender_name: 'Shahana Mariyam',
        sender_age: 23,
        sender_gender: 'Female',
        sender_profession: 'Data Science Analyst',
        sender_education: 'M.Sc Computer Science',
        sender_location: 'Malappuram, Kerala',
        guardian_name: 'Abdul Kareem P. (Father)',
        guardian_mobile: '+91 94471 22334',
        guardian_relation: 'Father',
        received_at: 'Yesterday, 4:30 PM',
        status: 'pending',
        notes: 'Seeking a pious, family-oriented partner. Our guardian would be pleased to speak with your family.',
      },
    ];
  } else {
    // Default or Female user: proposals from eligible Grooms
    return [
      {
        id: 'inc-001',
        sender_name: 'Er. Mohammed Nihal',
        sender_age: 29,
        sender_gender: 'Male',
        sender_profession: 'Senior Software Architect',
        sender_education: 'B.Tech Computer Science, NIT Calicut',
        sender_location: 'Kochi, Kerala (Currently in Dubai)',
        guardian_name: 'Haji K. Muhammed (Father)',
        guardian_mobile: '+91 98460 77889',
        guardian_relation: 'Father',
        received_at: 'Today, 09:45 AM',
        status: 'pending',
        notes: 'Assalamu Alaikum. Our family reviewed your profile with great interest and would like to proceed with mutual proposal discussion.',
      },
      {
        id: 'inc-002',
        sender_name: 'Dr. Rashid Ali P.',
        sender_age: 30,
        sender_gender: 'Male',
        sender_profession: 'MD General Medicine',
        sender_education: 'MD Medicine, AIIMS',
        sender_location: 'Perinthalmanna, Malappuram',
        guardian_name: 'Ali Akbar (Father)',
        guardian_mobile: '+91 98472 11223',
        guardian_relation: 'Father',
        received_at: 'Yesterday, 6:20 PM',
        status: 'pending',
        notes: 'Seeking a pious life partner with good family values. Guardian is ready to connect with your family.',
      },
    ];
  }
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
  if (profile.id && deleted.ids.includes(profile.id)) return true;
  const phone = profile.mobile ? profile.mobile.replace(/\D/g, '').slice(-8) : '';
  const gPhone = profile.guardian_mobile ? profile.guardian_mobile.replace(/\D/g, '').slice(-8) : '';
  const name = (profile.full_name || '').toLowerCase().trim();
  if (phone && deleted.phones.some((dp) => phone.includes(dp) || dp.includes(phone))) return true;
  if (gPhone && deleted.phones.some((dp) => gPhone.includes(dp) || dp.includes(gPhone))) return true;
  if (name && deleted.names.includes(name)) return true;
  return false;
}

export default function App() {
  // Navigation: 'home' | 'profiles' | 'shortlist' | 'interests' | 'admin'
  const [activeView, setActiveView] = useState<'home' | 'profiles' | 'shortlist' | 'interests' | 'admin'>('home');

  // Data Store (strictly filtered so deleted profiles are immediately and permanently hidden)
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const loaded = getStoredProfiles();
    const deleted = getDeletedRecords();
    return loaded.filter((p) => !isProfileDeleted(p, deleted));
  });
  const [payments, setPayments] = useState<Payment[]>(() => getStoredPayments());
  const [premiumRequests, setPremiumRequests] = useState<PremiumRequest[]>(() => getStoredPremiumRequests());
  const [bookmarks, setBookmarks] = useState<string[]>(() => getStoredBookmarks());
  const [interestsMap, setInterestsMap] = useState<Record<string, 'pending' | 'accepted' | 'declined'>>(() => {
    const map = getStoredInterestsMap();
    if (map['nc-002']) {
      delete map['nc-002'];
      saveStoredInterestsMap(map);
    }
    return map;
  });

  // Incoming proposal interests that have come to this user's profile
  const [incomingInterests, setIncomingInterests] = useState<IncomingInterest[]>(() => {
    try {
      const raw = localStorage.getItem(INCOMING_INTERESTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return getDefaultIncomingInterests();
  });

  const [interestsActiveTab, setInterestsActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    try {
      localStorage.setItem(INCOMING_INTERESTS_STORAGE_KEY, JSON.stringify(incomingInterests));
    } catch {}
  }, [incomingInterests]);

  // Authentication & User Profile State
  const [currentUser, setCurrentUser] = useState<{ email?: string; id?: string } | null>(() => {
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
    if (!phone && !name) return null;
    return profiles.find(
      (p) =>
        (phone && p.mobile && p.mobile.replace(/\D/g, '').includes(phone)) ||
        (name && p.full_name.toLowerCase().trim() === name)
    );
  }, [currentUserProfile, profiles]);

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

  const isUserApproved = useMemo(() => {
    if (userApprovedRequest) return true;
    if (userMatchedProfile?.profile_status === 'APPROVED') return true;
    if (currentUserProfile?.is_approved) return true;
    return false;
  }, [userApprovedRequest, userMatchedProfile, currentUserProfile]);

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
              is_premium: true,
              premium_plan: req.plan_name || curr.premium_plan || 'Premium Plan',
              profile_status: 'APPROVED',
              is_verified: true,
            };
            hasChanges = true;
          }
        } else {
          // Create approved profile for this premium user so it appears on the page and in Premium Users
          const isFemale = req.plan_name.toLowerCase().includes('girl') || (req.notes && req.notes.toLowerCase().includes('girl'));
          const newProf: Profile = {
            id: `nc-prem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            full_name: req.user_name,
            gender: isFemale ? 'Female' : 'Male',
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
          nextProfiles = [newProf, ...nextProfiles];
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setProfiles(nextProfiles);
      saveStoredProfiles(nextProfiles);
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

  // Sync Supabase on Mount
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

        const { data: dbProfiles, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!profileErr && dbProfiles && dbProfiles.length > 0) {
          const deleted = getDeletedRecords();
          const clean = dbProfiles.filter((p) => !isProfileDeleted(p, deleted));
          setProfiles(clean);
          saveStoredProfiles(clean);
        }

        const { data: dbPayments, error: paymentErr } = await supabase
          .from('payments')
          .select('*')
          .order('payment_date', { ascending: false });

        if (!paymentErr && dbPayments && dbPayments.length > 0) {
          setPayments(dbPayments);
          saveStoredPayments(dbPayments);
        }

        const { data: dbRequests, error: reqErr } = await supabase
          .from('premium_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!reqErr && dbRequests && dbRequests.length > 0) {
          setPremiumRequests(dbRequests);
          saveStoredPremiumRequests(dbRequests);
        }
      } catch (err) {
        console.warn('Offline fallback loaded', err);
      }
    }
    loadData();
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

  const handleSendInterest = async (profileId: string) => {
    // Premium requirement check
    const hasPremium = effectiveIsPremium || localStorage.getItem('nikah_circle_user_is_premium') === 'true';
    if (!hasPremium) {
      setIsPremiumOpen(true);
      return;
    }

    const targetProfile = profiles.find((p) => p.id === profileId);
    if (targetProfile) {
      // Cannot send interest to own profile
      const isSelf =
        (currentUserProfile?.id && targetProfile.id === currentUserProfile.id) ||
        (currentUser?.id && targetProfile.id === currentUser.id) ||
        (currentUserProfile?.mobile &&
          targetProfile.mobile &&
          targetProfile.mobile.replace(/\D/g, '').slice(-8) ===
            currentUserProfile.mobile.replace(/\D/g, '').slice(-8));

      if (isSelf) {
        showToast('You cannot send a proposal interest to your own profile.');
        return;
      }

      // Halal Matrimony Gender rule: Male to Female only, Female to Male only
      const userGender = currentUserProfile?.gender;
      if (userGender && targetProfile.gender === userGender) {
        const needed = userGender === 'Female' ? 'Groom (Male)' : 'Bride (Female)';
        showToast(`Halal Matrimony: You can only send proposals to ${needed} profiles.`);
        return;
      }
    }

    if (interestsMap[profileId]) {
      showToast('Interest has already been sent to this profile.');
      return;
    }

    const updated = { ...interestsMap, [profileId]: 'pending' as const };
    setInterestsMap(updated);
    saveStoredInterestsMap(updated);

    showToast('Interest sent successfully! Biodata will unlock once accepted.');
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  const handleCancelInterest = (profileId: string) => {
    const updated = { ...interestsMap };
    delete updated[profileId];
    setInterestsMap(updated);
    saveStoredInterestsMap(updated);
    showToast('Interest cancelled successfully.');
  };

  const handleAcceptIncomingInterest = (id: string) => {
    const updated = incomingInterests.map((item) =>
      item.id === id ? { ...item, status: 'accepted' as const } : item
    );
    setIncomingInterests(updated);
    showToast('Proposal accepted! Guardian contact details & biodata are unlocked.');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleDeclineIncomingInterest = (id: string) => {
    const updated = incomingInterests.map((item) =>
      item.id === id ? { ...item, status: 'declined' as const } : item
    );
    setIncomingInterests(updated);
    showToast('Proposal politely declined.');
  };

  const handleSaveUserProfile = async (data: UserProfileData) => {
    setCurrentUserProfile(data);
    localStorage.setItem('nikah_circle_user_profile', JSON.stringify(data));

    const userObj = { email: data.email, id: `usr-${data.mobile}` };
    setCurrentUser(userObj);
    localStorage.setItem('nikah_circle_user', JSON.stringify(userObj));

    const existingIndex = profiles.findIndex(
      (p) => (p.mobile && p.mobile === data.mobile) || (p.email && p.email === data.email)
    );

    const calculatedAge = data.date_of_birth
      ? Math.max(18, new Date().getFullYear() - new Date(data.date_of_birth).getFullYear())
      : 24;

    const profilePayload: Profile = {
      id: existingIndex >= 0 ? profiles[existingIndex].id : `usr-${Date.now().toString().slice(-6)}`,
      full_name: data.full_name,
      mobile: data.mobile,
      email: data.email,
      gender: data.gender,
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
      guardian_relation: 'Parent (Guardian)',
      marital_status: 'Never Married',
      hobbies: data.hobbies,
      interests: data.interests,
      profile_photo: data.profile_photo || null,
      registration_type: 'ONLINE',
      profile_status: 'APPROVED',
      is_verified: true,
      is_premium: effectiveIsPremium,
      premium_plan: effectivePlanName,
      created_at: new Date().toISOString(),
    };

    let updatedProfiles: Profile[];
    if (existingIndex >= 0) {
      updatedProfiles = profiles.map((p, idx) => (idx === existingIndex ? { ...p, ...profilePayload } : p));
    } else {
      updatedProfiles = [profilePayload, ...profiles];
    }

    setProfiles(updatedProfiles);
    saveStoredProfiles(updatedProfiles);

    setIsCreateAccountOpen(false);
    setIsEditingProfile(false);
    showToast('Profile account saved successfully!');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
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

  // Submit Premium Request (UPI Scanner, Cash Office, or Free Request)
  const handleSubmitPremiumRequest = async (
    req: Omit<PremiumRequest, 'id' | 'created_at' | 'status'>
  ) => {
    const isUUID = (str?: string) => !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `req-${Date.now()}`;
    const newReq: PremiumRequest = {
      ...req,
      id: newId,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    const updated = [newReq, ...premiumRequests];
    setPremiumRequests(updated);
    saveStoredPremiumRequests(updated);
    showToast('Premium request submitted to admin!');

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
        status: 'PENDING',
        notes: req.notes || null,
      };
      if (isUUID(newId)) {
        payload.id = newId;
      }
      await supabase.from('premium_requests').insert(payload);
    } catch (e) {
      console.warn('Supabase premium request sync:', e);
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
      const isFemale = target.plan_name.toLowerCase().includes('girl') || (target.notes && target.notes.toLowerCase().includes('girl'));
      const newProf: Profile = {
        id: targetProfileId,
        full_name: target.user_name,
        gender: isFemale ? 'Female' : 'Male',
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
      updatedProfiles = [newProf, ...profiles];
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

    if (isEdit) {
      targetProfile = {
        ...profiles.find((p) => p.id === profileData.id)!,
        ...profileData,
        updated_at: new Date().toISOString(),
      } as Profile;

      const updated = profiles.map((p) => (p.id === targetProfile.id ? targetProfile : p));
      setProfiles(updated);
      saveStoredProfiles(updated);

      try {
        await supabase.from('profiles').update(profileData).eq('id', profileData.id);
      } catch (e) {
        console.warn('Saved locally', e);
      }
    } else {
      const isUUID = (str?: string) => !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `nc-${Date.now().toString().slice(-4)}`;
      targetProfile = {
        id: newId,
        full_name: profileData.full_name || 'Candidate',
        gender: profileData.gender || 'Female',
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

      const updated = [targetProfile, ...profiles];
      setProfiles(updated);
      saveStoredProfiles(updated);

      try {
        const insertPayload: any = { ...targetProfile };
        if (!isUUID(insertPayload.id)) {
          delete insertPayload.id;
        }
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

  const handleApproveProfile = async (id: string) => {
    const updated = profiles.map((p) =>
      p.id === id ? { ...p, profile_status: 'APPROVED' as const, is_verified: true } : p
    );
    setProfiles(updated);
    saveStoredProfiles(updated);
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

  // Approved Profiles List: Featured with Premium profiles in front
  const approvedProfiles = useMemo(() => {
    return [...profiles]
      .filter((p) => p.profile_status === 'APPROVED')
      .sort((a, b) => {
        // Premium profiles featured prominently first
        if (a.is_premium && !b.is_premium) return -1;
        if (!a.is_premium && b.is_premium) return 1;
        return (new Date(b.created_at || '').getTime() || 0) - (new Date(a.created_at || '').getTime() || 0);
      });
  }, [profiles]);

  // Filtered Approved Profiles with Advanced Multi-field filtering
  const filteredProfiles = useMemo(() => {
    return approvedProfiles.filter((profile) => {
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

      if (filters.gender && profile.gender !== filters.gender) return false;

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

  // Bookmarked Profiles
  const shortlistedProfiles = useMemo(() => {
    return profiles.filter((p) => bookmarks.includes(p.id));
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
          onApproveProfile={handleApproveProfile}
          onRejectProfile={handleRejectProfile}
          onApprovePremiumRequest={handleApprovePremiumRequest}
          onRejectPremiumRequest={handleRejectPremiumRequest}
          onDeactivatePremium={handleDeactivatePremium}
          onExitAdmin={() => setActiveView('home')}
          adminEmail="nikahcircle01@gmail.com"
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
        onEditProfile={() => setIsEditingProfile(true)}
        isAdmin={isAdmin}
        onOpenLogin={(mode) => {
          setLoginMode(mode || 'member');
          setIsLoginOpen(true);
        }}
        onOpenRegister={handleOpenRegister}
        onOpenPremium={() => setIsPremiumOpen(true)}
        onLogout={handleLogout}
        savedCount={bookmarks.length}
        interestsCount={Object.keys(interestsMap).length}
        receivedInterestsCount={incomingInterests.filter((i) => i.status === 'pending').length}
        isUserPremium={effectiveIsPremium}
        isUserApproved={isUserApproved}
        currentPlanName={effectivePlanName}
      />

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
                  setIsPremiumOpen(true);
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
            onExplorePremium={() => setIsPremiumOpen(true)}
            onRegisterClick={handleOpenRegister}
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
                    onOpenPremium={() => setIsPremiumOpen(true)}
                    currentUserGender={currentUserProfile?.gender}
                    currentUserId={currentUserProfile?.id || currentUser?.id}
                    currentUserMobile={currentUserProfile?.mobile}
                    onOppositeGenderRequired={(genderNeeded) => {
                      showToast(`Proposals can only be exchanged between opposite gender profiles (${genderNeeded}).`);
                    }}
                  />
                ))}
              </div>

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
                Showing all verified candidates. Total: {approvedProfiles.length} active profiles.
              </p>
            </div>

            <button
              onClick={() => setActiveView('home')}
              className="px-4 py-2 rounded-xl border border-[#4b001f] text-[#4b001f] text-xs font-bold hover:bg-[#fff6fa] transition-colors cursor-pointer"
            >
              ← Back to Home
            </button>
          </div>

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
            onOpenPremium={() => setIsPremiumOpen(true)}
          />

          {/* Profiles Grid */}
          {filteredProfiles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#eadfe4] p-12 text-center space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#4b001f]">
                No Profiles Found
              </h3>
              <p className="text-xs text-stone-500">Try changing your search terms or filters.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-[#4b001f] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
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
                  onOpenPremium={() => setIsPremiumOpen(true)}
                  currentUserGender={currentUserProfile?.gender}
                  currentUserId={currentUserProfile?.id || currentUser?.id}
                  currentUserMobile={currentUserProfile?.mobile}
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
                    interestsActiveTab === 'received'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#4b001f] text-white'
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
                                <h3 className="font-serif font-bold text-lg text-[#4b001f]">
                                  {item.sender_name}
                                </h3>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  Admin Approved
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                                <span>{item.sender_age} yrs</span>
                                <span>·</span>
                                <span>{item.sender_gender === 'Male' ? 'Groom' : 'Bride'}</span>
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
                                      gender: item.sender_gender,
                                      age: item.sender_age,
                                      location: item.sender_location,
                                      education: item.sender_education,
                                      profession: item.sender_profession,
                                      guardian_name: item.guardian_name,
                                      guardian_mobile: item.guardian_mobile,
                                      mobile: item.guardian_mobile,
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
                                <h3 className="font-serif font-bold text-lg text-[#4b001f]">
                                  {p.full_name}
                                </h3>
                                {(p.profile_status === 'APPROVED' || p.is_verified) && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                    Admin Approved
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
                                <span>{p.gender === 'Male' ? 'Groom' : 'Bride'}</span>
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
          setIsPremiumOpen(true);
        }}
        isUserPremium={effectiveIsPremium}
        currentUserGender={currentUserProfile?.gender}
        currentUserMobile={currentUserProfile?.mobile}
      />

      {/* Mandatory Profile Account Setup on First Open / Edit Anytime */}
      <UserProfileModal
        isOpen={isCreateAccountOpen || isEditingProfile}
        isMandatory={isCreateAccountOpen && !isEditingProfile}
        isEditing={isEditingProfile}
        initialData={currentUserProfile}
        isApproved={isUserApproved}
        isPremium={effectiveIsPremium}
        planName={effectivePlanName}
        onClose={() => {
          setIsCreateAccountOpen(false);
          setIsEditingProfile(false);
        }}
        onSubmit={handleSaveUserProfile}
        onSwitchToLogin={() => {
          setIsCreateAccountOpen(false);
          setIsEditingProfile(false);
          setLoginMode('member');
          setIsLoginOpen(true);
        }}
      />

      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        onSubmitPremiumRequest={handleSubmitPremiumRequest}
        defaultUserName={currentUser?.email ? currentUser.email.split('@')[0] : ''}
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
          setIsPremiumOpen(true);
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
        onOpenPremium={() => setIsPremiumOpen(true)}
        onOpenRegister={handleOpenRegister}
      />
    </div>
  );
}
