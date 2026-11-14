import { createClient } from '@supabase/supabase-js';
import {
  Profile,
  Payment,
  InterestRecord,
  PremiumRequest,
  normalizeGender,
  autoCorrectMistakenGenders,
  DEFAULT_BRIDE_AVATAR,
  resolveProfilePhoto,
} from '../types';

export { normalizeGender, autoCorrectMistakenGenders, DEFAULT_BRIDE_AVATAR, resolveProfilePhoto };

export const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SUPABASE_URL) || "https://fowkuwwfmnzupzbrrxqf.supabase.co";
export const SUPABASE_KEY = 
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SUPABASE_ANON_KEY) || "sb_publishable_fHxx0xpO65_m7WCrMRX6DQ_fShiZpoI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true },
  global: {
    fetch: (url, options = {}) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      return fetch(url, {
        ...options,
        signal: options.signal || controller.signal,
      }).finally(() => clearTimeout(timeoutId));
    },
  },
});

// Verified candidate groom profiles
export const DEFAULT_PROFILES: Profile[] = [
  {
    id: "8be9cc9a-ff7e-47c7-9767-d44d052ba55a",
    member_id: "NCSM1004",
    full_name: "Muhammed",
    gender: "Male",
    age: 28,
    date_of_birth: "1998-05-15",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "173 cm",
    education: "Plus Two, ITI",
    bouthika_education: "Plus Two, ITI",
    religious_education: "10th Level (മതപഠനം)",
    profession: "AC Mechanic",
    job_location: "Qatar",
    financial_status: "Middle Class",
    place: "Melattur",
    district: "Malappuram",
    state: "Kerala",
    location: "Melattur, Malappuram",
    preferred_districts: "Malappuram, Palakkad, Kozhikode",
    mobile: "9562399019",
    guardian_mobile: "9562399019",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent (Guardian)",
    family_members_details: "Father, Mother, Siblings",
    family_background: "Reputed religious Sunni Muslim family based in Melattur, Malappuram.",
    marriage_expectations: "Looking for a bride from a religious family (ദീനിയായ കുടുംബത്തിൽ നിന്നും ഒരു കുട്ടി).",
    partner_preferences: "Looking for a bride from a religious family (ദീനിയായ കുടുംബത്തിൽ നിന്നും ഒരു കുട്ടി).",
    profile_photo: "/profiles/ncsm1004.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T06:17:17.033Z",
    updated_at: "2026-11-14T06:17:17.033Z",
  },
  {
    id: "02b5b897-46d5-44ee-ba6b-6e8c32dd8086",
    member_id: "NCSM1005",
    full_name: "Muhammed Rafeek",
    gender: "Male",
    age: 26,
    date_of_birth: "2000-06-15",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "165 cm",
    complexion: "Fair to Medium",
    physical_build: "Weight: 60 kg, Normal",
    education: "Plus Two",
    bouthika_education: "Plus Two",
    religious_education: "Plus Two Level (മതപഠനം)",
    profession: "Supervisor, Lulu Hypermarket",
    job_location: "Muscat, Oman",
    financial_status: "Middle Class Family",
    place: "Pattambi",
    district: "Palakkad",
    state: "Kerala",
    location: "Pattambi, Palakkad",
    preferred_districts: "Palakkad, Malappuram, Kozhikode",
    mobile: "9645494921",
    guardian_mobile: "9048808174",
    guardian_name: "Father (Guardian)",
    guardian_relation: "Father (Driver)",
    family_members_details: "Father (Driver), Mother (Housewife), 1 Brother (Married), 2 Sisters (Married)",
    family_background: "Father is a Driver, Mother is a Housewife. One brother and two sisters - all married.",
    marriage_expectations: "Looking for a religious-minded girl (ദീനി ബോധമുള്ള പെൺകുട്ടി). Willingness to allow her to study and work (പഠിക്കാനും ജോലിക്ക് പോകാനും സമ്മതമാണ്).",
    partner_preferences: "Looking for a religious-minded girl (ദീനി ബോധമുള്ള പെൺകുട്ടി). Willingness to allow her to study and work (പഠിക്കാനും ജോലിക്ക് പോകാനും സമ്മതമാണ്).",
    profile_photo: "/profiles/ncsm1005.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T06:19:00.000Z",
    updated_at: "2026-11-14T06:19:00.000Z",
  },
  {
    id: "ncsm1006-mohammed-shabeel",
    member_id: "NCSM1006",
    full_name: "Mohammed Shabeel",
    gender: "Male",
    age: 24,
    date_of_birth: "2002-04-10",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "6 ft (183 cm)",
    complexion: "Fair (വെളുപ്പ്)",
    physical_build: "Average build, Healthy",
    education: "Diploma in Mechanical Engineering",
    bouthika_education: "Diploma in Mechanical Engineering",
    religious_education: "7th Level (മതപഠനം)",
    profession: "Oil & Gas Construction Field",
    job_location: "Abu Dhabi, UAE",
    financial_status: "Middle Class",
    place: "Chattipparamba, Chengottur",
    district: "Malappuram",
    state: "Kerala",
    location: "Chattipparamba, Malappuram",
    preferred_districts: "Malappuram, Kozhikode, Palakkad",
    mobile: "7510259553",
    guardian_mobile: "8075608023",
    guardian_name: "Father (Abroad)",
    guardian_relation: "Father / Guardian",
    family_members_details: "Father (Abroad), Mother (Housewife), 1 Sister (+2), 2 Brothers (8th std & UKG)",
    family_background: "Father works abroad (Mob: 8075608023), Mother is a housewife (Mob: 8075515473). One sister studying in +2, two younger brothers studying in 8th standard and UKG. Residing in Chattipparamba, Chengottur, Malappuram.",
    marriage_expectations: "Looking for a religious, understanding bride from a good Muslim family (ദീനിയായ സുന്നി കുടുംബത്തിൽ നിന്നുള്ള കുട്ടി).",
    partner_preferences: "Looking for a religious, understanding bride from a good Muslim family (ദീനിയായ സുന്നി കുടുംബത്തിൽ നിന്നുള്ള കുട്ടി).",
    other_interests: "No physical disabilities or ailments.",
    profile_photo: "/profiles/ncsm1006.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T06:21:00.000Z",
    updated_at: "2026-11-14T06:21:00.000Z",
  },
  {
    id: "ncsm1007-bride-sharjah-airport",
    member_id: "NCSM1007",
    full_name: "Looking for Groom (Bride Profile)",
    gender: "Female",
    age: 22,
    date_of_birth: "2004-05-10",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Jama'at Islami",
    religious_ideation: "Jama'at Islami (ജമാഅത്തെ ഇസ്‌ലാമി)",
    height: "153 cm",
    physical_build: "Weight: 53 kg, Normal build",
    education: "BBA in Airline and Airport Management",
    bouthika_education: "BBA in Airline and Airport Management",
    religious_education: "Madrasa & Islamic Studies",
    profession: "Working in Sharjah International Airport",
    job_location: "Sharjah, UAE",
    financial_status: "Upper Middle Class / Well Settled",
    place: "Mannarkkad",
    district: "Palakkad",
    state: "Kerala",
    location: "Mannarkkad, Palakkad",
    preferred_districts: "UAE (Sharjah / Abu Dhabi / Dubai), Palakkad, Kerala",
    mobile: "8943549396",
    guardian_mobile: "8943549396",
    guardian_name: "Father / Guardian (Abu Dhabi)",
    guardian_relation: "Father (Business, Abu Dhabi)",
    family_members_details: "Father & Mother (Business in Abu Dhabi), 1 elder sister (Married), 2 younger sisters (studying)",
    family_background: "Parents doing business in Abu Dhabi. Settled in Ruwais, Abu Dhabi with family for 25 years. Native place: Mannarkkad, Palakkad. One elder sister married, two younger sisters studying.",
    marriage_expectations: "Preference for a Jama'at Islami family based in UAE (യു.എ.ഇയിൽ ഉള്ള ജമാഅത്തെ ഇസ്‌ലാമി കുടുംബങ്ങൾക്ക് മുൻഗണന).",
    partner_preferences: "Preference for a Jama'at Islami family based in UAE (യു.എ.ഇയിൽ ഉള്ള ജമാഅത്തെ ഇസ്‌ലാമി കുടുംബങ്ങൾക്ക് മുൻഗണന).",
    passport_visa_status: "UAE Resident Visa (Valid)",
    other_interests: "Reading, Islamic lectures, Family gatherings",
    profile_photo: "/profiles/ncsm1007.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T06:45:00.000Z",
    updated_at: "2026-11-14T06:45:00.000Z",
  },
  {
    id: "ncsm1008-fathima-shahana",
    member_id: "NCSM1008",
    full_name: "Fathima Shahana",
    gender: "Female",
    age: 25,
    date_of_birth: "2000-04-20",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "5'2\" (156 cm)",
    complexion: "Normal (സാധാരണ നിറം)",
    physical_build: "Slim, Weight: 57 kg",
    education: "BA Literature, LLB",
    bouthika_education: "BA Literature (Govt College Pattambi), LLB (Al Ameen College, Shoranur)",
    religious_education: "7th Level (മതപഠനം)",
    profession: "Legal Associate, John Mani Associates",
    job_location: "Ernakulam, Kerala",
    financial_status: "Middle Class",
    place: "Pattambi",
    district: "Palakkad",
    state: "Kerala",
    location: "Pattambi, Palakkad",
    preferred_districts: "Palakkad, Malappuram, Thrissur",
    guardian_name: "Abdulla (Father)",
    guardian_relation: "Father (Saudi Arabia)",
    family_members_details: "Father: Abdulla (Saudi Arabia), Mother: Rahmath (Housewife), Siblings: Younger twin brothers (11th standard)",
    family_background: "Father Abdulla is working in Saudi Arabia. Mother Rahmath is a homemaker. Younger twin brothers studying in 11th class. Residing in Pattambi, Palakkad.",
    marriage_expectations: "Looking for an educated, religious Sunni groom from a respectable family. Preferred age up to 30 years old. Preferred districts: Palakkad, Malappuram, Thrissur.",
    partner_preferences: "Educated, religious Sunni groom up to 30 years old from Palakkad, Malappuram, or Thrissur.",
    other_interests: "No physical disabilities or ailments.",
    profile_photo: "/profiles/ncsm1008.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T06:56:00.000Z",
    updated_at: "2026-11-14T06:56:00.000Z",
  },
  {
    id: "ncsm1009-mubashir-k",
    member_id: "NCSM1009",
    full_name: "Mubashir. K",
    gender: "Male",
    age: 27,
    date_of_birth: "1999-05-10",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "170 cm",
    complexion: "Medium (മാന്യമായ നിറം)",
    physical_build: "Normal build, Healthy",
    education: "+2 (Higher Secondary)",
    bouthika_education: "+2 (Higher Secondary)",
    religious_education: "10th Level (മതപഠനം)",
    profession: "Working in a Rental Car Office",
    job_location: "Saudi Arabia",
    financial_status: "Middle Class",
    place: "Ayikkarappadi, Kaithakkunda",
    district: "Malappuram",
    state: "Kerala",
    location: "Ayikkarappadi, Malappuram",
    preferred_districts: "Malappuram, Kozhikode, Palakkad",
    mobile: "7559015354",
    guardian_mobile: "9605161761",
    guardian_name: "Father (Guardian)",
    guardian_relation: "Father",
    family_members_details: "Father, Mother, Siblings",
    family_background: "Reputed Sunni Muslim family based in Ayikkarappadi, Kaithakkunda, Malappuram. Father contact: +91 9605161761.",
    marriage_expectations: "Looking for an understanding, religious Sunni bride from a good family (ദീനിയായ സുന്നി കുടുംബത്തിൽ നിന്നുള്ള കുട്ടി). No financial liabilities.",
    partner_preferences: "Religious Sunni bride from Malappuram, Kozhikode, or neighboring districts.",
    other_interests: "No physical disabilities or ailments. No liabilities (ബാധ്യതകൾ ഇല്ല).",
    profile_photo: "/profiles/ncsm1009.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T07:04:00.000Z",
    updated_at: "2026-11-14T07:04:00.000Z",
  },
  {
    id: "ncsm1010-amjad-pk",
    member_id: "NCSM1010",
    full_name: "Amjad PK",
    gender: "Male",
    age: 25,
    date_of_birth: "2001-04-12",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "172 cm",
    education: "Bachelor's Degree (Graduate)",
    bouthika_education: "Graduate (Degree)",
    religious_education: "9th Level (മതപഠനം)",
    profession: "Sales Professional",
    job_location: "Saudi Arabia",
    financial_status: "Middle Class",
    place: "Wandoor",
    district: "Malappuram",
    state: "Kerala",
    location: "Wandoor, Malappuram",
    preferred_districts: "Malappuram",
    mobile: "7560912751",
    guardian_mobile: "7560912751",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent / Guardian",
    family_members_details: "Father, Mother, Siblings",
    family_background: "Reputed Sunni Muslim family based in Wandoor, Malappuram.",
    marriage_expectations: "ദീനി മൂല്യങ്ങൾക്ക് പ്രാധാന്യം നൽകുകയും നിഖാബ് ധരിക്കാൻ താൽപര്യമുള്ളവരുമായ യുവതികളിൽ നിന്ന് വിവാഹാലോചനകൾ നോക്കുന്നു.",
    partner_preferences: "ദീനി മൂല്യങ്ങൾക്ക് പ്രാധാന്യം നൽകുകയും നിഖാബ് ധരിക്കാൻ താൽപര്യമുള്ളവരുമായ പെൺകുട്ടി (Wandoor / Malappuram).",
    other_interests: "Islamic values, Halal lifestyle, Family focused",
    profile_photo: "/profiles/ncsm1010.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T09:28:00.000Z",
    updated_at: "2026-11-14T09:28:00.000Z",
  },
  {
    id: "ncsm1011-fathima-insha",
    member_id: "NCSM1011",
    full_name: "Fathima Insha",
    gender: "Female",
    age: 21,
    date_of_birth: "2005-02-18",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "162 cm",
    education: "BBA with LLB",
    bouthika_education: "BBA with LLB",
    religious_education: "8th Level (മതപഠനം)",
    profession: "Student (BBA LLB)",
    financial_status: "Middle Class",
    place: "Parappanangadi, Putharikkal",
    district: "Malappuram",
    state: "Kerala",
    location: "Parappanangadi, Malappuram",
    preferred_districts: "Malappuram, Kozhikode, Ernakulam",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent / Guardian",
    family_members_details: "Father, Mother, Siblings",
    family_background: "Reputed Sunni Muslim family based in Parappanangadi, Putharikkal, Malappuram.",
    marriage_expectations: "ദീനി ബോധവും വിദ്യാസമ്പന്നരുമായ യുവാക്കളിൽ നിന്ന് വിവാഹാലോചന സ്വീകരിക്കുന്നു. താല്പര്യപ്പെടുന്ന പ്രായപരിധി: 24 - 25 വയസ്സ്. താല്പര്യപ്പെടുന്ന ജില്ലകൾ: മലപ്പുറം, കോഴിക്കോട്, എറണാകുളം.",
    partner_preferences: "Religious, educated Sunni groom aged 24-25 from Malappuram, Kozhikode, or Ernakulam.",
    other_interests: "Studies, Islamic learning, Family values",
    profile_photo: "/profiles/ncsm1011.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T09:35:00.000Z",
    updated_at: "2026-11-14T09:35:00.000Z",
  },
  {
    id: "ncsm1012-hishma-ak",
    member_id: "NCSM1012",
    full_name: "Hishma AK",
    gender: "Female",
    age: 25,
    date_of_birth: "2001-05-20",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Salafi / Mujahid",
    religious_ideation: "Salafi (സലഫി / മുജാഹിദ്)",
    height: "152 cm",
    education: "BSc. Optometry (Pursuing MSc. Optometry)",
    bouthika_education: "BSc. Optometry (Currently pursuing MSc. Optometry)",
    profession: "Optometrist / MSc Student",
    financial_status: "Upper Middle Class / Well Settled",
    place: "Kadalundi, Beach Road",
    district: "Kozhikode",
    state: "Kerala",
    location: "Kadalundi, Kozhikode",
    preferred_districts: "GCC (Saudi Arabia / UAE / Qatar), Kozhikode, Malappuram",
    guardian_name: "Anaze Ahammed AK (Father)",
    guardian_relation: "Father (Business, Riyadh)",
    family_members_details: "Father: Anaze Ahammed AK (Business, Riyadh), Mother: Abida E (Homemaker), Siblings: 1 younger brother (Hisham AK, BSc Nursing student)",
    family_background: "Father Anaze Ahammed AK (s/o Mohammed Ali AK) running business in Riyadh. Mother Abida E (d/o Thajudheen E, Padikkal) is a homemaker. Younger brother Hisham AK studying BSc Nursing. Residing at Sea View (H), Beach Road, Kadalundi, Kozhikode.",
    marriage_expectations: "GCC രാജ്യങ്ങളിൽ ജോലിയുള്ള പ്രൊഫഷണൽ വിദ്യാഭ്യാസി ആയ സലഫി വരനെ തേടുന്നു (Looking for a professionally educated groom working in GCC countries with Salafi values).",
    partner_preferences: "Professionally educated Salafi groom working in GCC countries (Saudi Arabia / UAE / Qatar / Oman / Kuwait / Bahrain).",
    other_interests: "Optometry research, Islamic learning, Family values",
    profile_photo: "/profiles/ncsm1012.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T09:44:00.000Z",
    updated_at: "2026-11-14T09:44:00.000Z",
  }
];
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with DEFAULT_PROFILES so default verified candidates are always included
        const combined = [...DEFAULT_PROFILES];
        parsed.forEach((p) => {
          const idx = combined.findIndex(
            (c) => (p.member_id && c.member_id && p.member_id.toUpperCase() === c.member_id.toUpperCase()) ||
                   (c.mobile && p.mobile && c.mobile.replace(/\D/g, '').slice(-8) === p.mobile.replace(/\D/g, '').slice(-8)) ||
                   c.id === p.id
          );
          if (idx >= 0) {
            combined[idx] = {
              ...p,
              ...combined[idx],
              biodata_uploaded: true,
              is_verified: true,
              is_premium: true,
              registration_type: 'CASH_ADMIN',
              source: 'admin',
            };
          } else {
            combined.push(p);
          }
        });
        const cleaned = deduplicateProfiles(combined.map((p) => autoCorrectMistakenGenders(p)));
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
    source: profile.source || (profile.registration_type === 'CASH_ADMIN' ? 'admin' : undefined),
    created_by: profile.created_by || undefined,
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
    profile_photo: resolveProfilePhoto(profile) || null,
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
    profile_photo: resolveProfilePhoto(p),
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
    registration_type: p.registration_type || (meta.source === 'admin' ? 'CASH_ADMIN' : 'ONLINE'),
    source: meta.source || (p.registration_type === 'CASH_ADMIN' ? 'admin' : 'user'),
    created_by: meta.created_by || (p.registration_type === 'CASH_ADMIN' ? 'admin' : null),
    profile_status: p.profile_status || 'APPROVED',
    is_verified: p.is_verified ?? true,
    is_premium: p.is_premium ?? (meta.source === 'admin' || p.registration_type === 'CASH_ADMIN'),
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


