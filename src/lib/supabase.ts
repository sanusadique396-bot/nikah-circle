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
  },
  {
    id: "ncsm1013-muhammed-shafeeq",
    member_id: "NCSM1013",
    full_name: "Muhammed Shafeeq",
    gender: "Male",
    age: 26,
    date_of_birth: "2000-02-15",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Mujahid",
    religious_ideation: "Mujahid (മുജാഹിദ് / സലഫി)",
    height: "175 cm",
    complexion: "Fair / Medium",
    physical_build: "Slim & Fit (69 kg)",
    education: "B.Com",
    bouthika_education: "B.Com (Bachelor of Commerce)",
    profession: "Logistics Executive, UAE",
    job_location: "UAE (United Arab Emirates)",
    financial_status: "Upper Middle Class",
    place: "Kodiyamkunnu, Edathanattukara",
    district: "Palakkad",
    state: "Kerala",
    location: "Edathanattukara, Palakkad",
    preferred_districts: "Palakkad, Malappuram",
    mobile: "9656535138",
    guardian_mobile: "7907788124",
    guardian_name: "Siddeeq Ongallur (Father)",
    guardian_relation: "Father (Ex-Gulf, Saudi Arabia)",
    family_members_details: "Father: Siddeeq Ongallur (Ex-Gulf, Saudi Arabia), Mother: Homemaker, Siblings: Two Younger Brothers",
    family_background: "Father Siddeeq Ongallur (Ex-Saudi Arabia Gulf returnee), Mother homemaker, two younger brothers. Residing at Ongallur House, Kodiyamkunnu, Edathanattukara (PO), Palakkad. Well-reputed Upper Middle Class family.",
    marriage_expectations: "Preferred Age: 21 Years. Preferred Education: Degree. Preferred Location: Palakkad or Malappuram District. Religious Preference: Mujahid (മുജാഹിദ് ആദർശമുള്ള, ബിരുദധാരിയായ, പാലക്കാട് അല്ലെങ്കിൽ മലപ്പുറം സ്വദേശിയായ യുവതികളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു).",
    partner_preferences: "Preferred Age: 21 Years. Preferred Education: Degree graduate. Preferred Location: Palakkad or Malappuram District. Religious Ideology: Mujahid.",
    other_interests: "Logistics management, International supply chain, Islamic family values",
    profile_photo: "/profiles/ncsm1013.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T10:00:00.000Z",
    updated_at: "2026-11-14T10:00:00.000Z",
  },
  {
    id: "ncsm1014-ashik-t",
    member_id: "NCSM1014",
    full_name: "Ashik T",
    gender: "Male",
    age: 30,
    date_of_birth: "1996-04-10",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "160 cm",
    complexion: "Medium / Fair",
    physical_build: "Normal",
    education: "10th (SSLC)",
    bouthika_education: "10th Standard (SSLC)",
    religious_education: "8th Level (8-ാം ക്ലാസ് മദ്രസ)",
    profession: "Employed in Saudi Arabia",
    job_location: "Saudi Arabia (സൗദി അറേബ്യ)",
    financial_status: "Upper Middle Class",
    place: "Pallikkal Bazar",
    district: "Malappuram",
    state: "Kerala",
    location: "Pallikkal Bazar, Malappuram",
    preferred_districts: "Malappuram, Kozhikode, Thrissur, Palakkad",
    mobile: "9947517273",
    guardian_mobile: "9072501142",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent / Guardian",
    family_members_details: "Family residing at Pallikkal Bazar, Malappuram District. Upper middle class family background.",
    family_background: "Well-settled Upper Middle Class Muslim family from Pallikkal Bazar, Malappuram. Candidate working in Saudi Arabia.",
    marriage_expectations: "സാമ്പത്തികം പ്രശ്നമല്ല, പഠിക്കാൻ ആഗ്രഹമുള്ള പെൺകുട്ടിയാണെങ്കിൽ പഠനത്തിന് പൂർണ്ണ പിന്തുണ നൽകും. മലപ്പുറം, കോഴിക്കോട്, തൃശ്ശൂർ, പാലക്കാട് ജില്ലകളിൽ നിന്നുള്ള സുന്നി യുവതികളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു.",
    partner_preferences: "Sunni religious values. Financial background is not a barrier; will fully encourage and support higher studies for bride. Preferred Districts: Malappuram, Kozhikode, Thrissur, Palakkad.",
    other_interests: "Supporting higher education, Career in Gulf, Community values",
    profile_photo: "/profiles/ncsm1014.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T10:05:00.000Z",
    updated_at: "2026-11-14T10:05:00.000Z",
  },
  {
    id: "ncsm1015-shifla",
    member_id: "NCSM1015",
    full_name: "Shifla",
    gender: "Female",
    age: 23,
    date_of_birth: "2003-05-18",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "160 cm",
    complexion: "Fair",
    physical_build: "Slim / Normal",
    education: "MSc Geology",
    bouthika_education: "MSc Geology (Master of Science)",
    religious_education: "8th Level (8-ാം ക്ലാസ് മദ്രസ)",
    profession: "Postgraduate / MSc Geology",
    job_location: "Kerala",
    financial_status: "Middle Class",
    place: "Ponnani",
    district: "Malappuram",
    state: "Kerala",
    location: "Ponnani, Malappuram",
    preferred_districts: "Malappuram, Kozhikode, Palakkad, Thrissur",
    guardian_name: "Gafoor M. T (Father)",
    guardian_relation: "Father (Retired Office Staff, MES College Ponnani)",
    family_members_details: "Father: Gafoor M. T (Retired office staff, MES College Ponnani), Mother: Sulaikha (Housewife), Siblings: One elder brother",
    family_background: "Respected middle class Muslim family settled in Ponnani, Malappuram. Father Gafoor M. T retired from MES College Ponnani. Mother Sulaikha homemaker. One elder brother.",
    marriage_expectations: "ദീനി ബോധമുള്ളതും ഉന്നത വിദ്യാഭ്യാസമുള്ളതുമായ അനുയോജ്യരായ സുന്നി യുവാക്കളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു (Looking for religiously educated & well-mannered Sunni partner).",
    partner_preferences: "Religious, well-educated Sunni groom with good moral character and family values.",
    other_interests: "Geological sciences, academic research, Islamic values",
    profile_photo: "/profiles/ncsm1015.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T10:10:00.000Z",
    updated_at: "2026-11-14T10:10:00.000Z",
  },
  {
    id: "ncsm1016-mohammed-shakeeq",
    member_id: "NCSM1016",
    full_name: "Mohammed Shakeeq",
    gender: "Male",
    age: 29,
    date_of_birth: "1997-03-12",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "175 cm",
    complexion: "Fair",
    physical_build: "Normal / Fit",
    education: "+2, ITI",
    bouthika_education: "+2 (Plus Two), ITI",
    religious_education: "8th Level (8-ാം ക്ലാസ് മദ്രസ)",
    profession: "Employed in UAE (Power Tool Company)",
    job_location: "UAE (യു.എ.ഇ)",
    financial_status: "Middle Class",
    place: "Ezhur, Tirur",
    district: "Malappuram",
    state: "Kerala",
    location: "Ezhur, Tirur, Malappuram",
    preferred_districts: "Malappuram",
    mobile: "8714486246",
    guardian_mobile: "8714486246",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent / Guardian",
    family_members_details: "Family residing at Ezhur, Tirur, Malappuram. Well-reputed middle class Muslim family.",
    family_background: "Middle class Sunni Muslim family from Ezhur, Tirur, Malappuram. Candidate working in a reputed power tool company in UAE.",
    marriage_expectations: "ദീനി ബോധമുള്ള രക്ഷിതാക്കളിൽ നിന്നും സുന്നി കുടുംബങ്ങളിൽ നിന്നും വിവാഹാലോചന ക്ഷണിക്കുന്നു. മലപ്പുറം ജില്ലയിലുള്ള യുവതികൾക്ക് മുൻഗണന നൽകുന്നു.",
    partner_preferences: "Practicing Sunni bride from a religious and values-oriented family. Preferred District: Malappuram.",
    other_interests: "Automotive, Technical engineering, Islamic religious values",
    profile_photo: "/profiles/ncsm1016.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T10:15:00.000Z",
    updated_at: "2026-11-14T10:15:00.000Z",
  },
  {
    id: "ncsm1017-afra-yousef",
    member_id: "NCSM1017",
    full_name: "Afra Yousef",
    gender: "Female",
    age: 28,
    date_of_birth: "1998-06-20",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "164 cm",
    complexion: "Warm Undertone / Medium Fair",
    physical_build: "Slim",
    education: "B.Voc Tourism & Hospitality Management",
    bouthika_education: "B.Voc – Tourism & Hospitality Management (LF College, Mammiyur)",
    religious_education: "10th Standard (10-ാം ക്ലാസ് മദ്രസ)",
    profession: "Graduate in Tourism & Hospitality Management",
    job_location: "Kerala / India",
    financial_status: "Middle Class",
    place: "Vattekkad, Near Orumanayur",
    district: "Thrissur",
    state: "Kerala",
    location: "Orumanayur, Thrissur",
    preferred_districts: "Thrissur, Malappuram, Ernakulam, Palakkad",
    guardian_name: "Yousef (Father)",
    guardian_relation: "Father (Driver, Qatar)",
    family_members_details: "Father: Yousef (Driver in Qatar), Mother: Thahira (Homemaker), Siblings: 2 Sisters (Married), 1 Brother (Studying)",
    family_background: "Respectable middle class Sunni family from Vattekkad, near Orumanayur, Thrissur. Father working as a driver in Qatar. Mother homemaker. Two elder sisters married and well settled, younger brother currently studying.",
    marriage_expectations: "ഉന്നത വിദ്യാസമ്പന്നനും ദീനി ചിന്താഗതിയുള്ളതുമായ വരനെ തേടുന്നു. ഇന്ത്യയിൽ ജോലി ചെയ്യുന്നവർക്ക് പ്രത്യേക മുൻഗണന (Looking for a well-educated Sunni groom, preferably working in India).",
    partner_preferences: "Well-educated Sunni groom with religious values, preferably employed and working in India.",
    other_interests: "Tourism & hospitality, culinary arts, Islamic values",
    profile_photo: "/profiles/ncsm1017.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T10:20:00.000Z",
    updated_at: "2026-11-14T10:20:00.000Z",
  },
  {
    id: "ncsm1018-jijina-kt",
    member_id: "NCSM1018",
    full_name: "Jijina K.T.",
    gender: "Female",
    age: 25,
    date_of_birth: "2000-11-29",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "158 cm",
    complexion: "Fair",
    physical_build: "Normal",
    education: "B.Sc. Radiography",
    bouthika_education: "B.Sc. Radiography",
    profession: "Radiography Lecturer (Nadakkavil Academy of Paramedical Science)",
    job_location: "Valanchery, Malappuram",
    financial_status: "Upper Middle Class",
    place: "Kattipparuthi, Valanchery P.O.",
    district: "Malappuram",
    state: "Kerala",
    location: "Valanchery, Malappuram",
    preferred_districts: "Malappuram, Kozhikode, Palakkad",
    guardian_name: "Abdul Nahas K.T. (Father)",
    guardian_relation: "Father (Abroad)",
    family_members_details: "Father: Abdul Nahas K.T. (Abroad), Mother: Raina T.P. (Homemaker), Siblings: 2 Younger Sisters (Jinsha K.T. – Plus Two, Jizwa K.T. – 7th Std)",
    family_background: "Upper Middle Class well-respected Muslim family from Kattipparuthi, Valanchery, Malappuram. Granddaughter of late Karimbi Bavahaji. Father Abdul Nahas K.T. employed abroad. Mother Raina T.P. Two younger sisters studying.",
    marriage_expectations: "ഉന്നത വിദ്യാഭ്യാസവും മികച്ച ജോലിയുമുള്ള, ദീനി ബോധമുള്ള സുന്നി യുവാക്കളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു (Seeking professionally qualified and religiously grounded Sunni groom).",
    partner_preferences: "Well-educated, professionally employed Sunni groom with good family values and Islamic character.",
    other_interests: "Paramedical education, health sciences, family values",
    profile_photo: "/profiles/ncsm1018.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T10:25:00.000Z",
    updated_at: "2026-11-14T10:25:00.000Z",
  },
  {
    id: "ncsm1019-fathima-shifna-t",
    member_id: "NCSM1019",
    full_name: "Fathima Shifna T",
    gender: "Female",
    age: 22,
    date_of_birth: "2004-03-14",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Jama'at-e-Islami",
    religious_ideation: "Jama'at-e-Islami (ജമാഅത്തെ ഇസ്‌ലാമി)",
    height: "162 cm",
    complexion: "Fair",
    physical_build: "Slim (54 kg)",
    education: "MA English",
    bouthika_education: "MA English (Master of Arts in English)",
    profession: "Postgraduate Student / MA English",
    job_location: "Kerala",
    financial_status: "Middle Class",
    place: "Ongallur, Pattambi",
    district: "Palakkad",
    state: "Kerala",
    location: "Ongallur, Pattambi, Palakkad",
    preferred_districts: "Palakkad, Malappuram (Within 30 km radius)",
    guardian_name: "Father (Business)",
    guardian_relation: "Father (Business)",
    family_members_details: "Father: Business, Mother: Homemaker, Siblings: Two brothers (One elder married brother, one younger brother studying in +1)",
    family_background: "Respectable middle class Jama'at-e-Islami family settled in Ongallur, Pattambi, Palakkad. Father in business, mother homemaker. Two brothers, one married and one studying in Plus One.",
    marriage_expectations: "പട്ടാമ്പി - ഒങ്ങല്ലൂർ ഭാഗത്തുനിന്നും 30 കിലോമീറ്റർ പരിധിക്കുള്ളിലുള്ള, ജമാഅത്തെ ഇസ്‌ലാമി അനുഭാവമുള്ള ദീനി ബോധമുള്ള വിദ്യാസമ്പന്നരായ യുവാക്കളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു (Looking for educated groom from Jama'at-e-Islami background within 30 km radius).",
    partner_preferences: "Educated groom with Jama'at-e-Islami values, residing within 30 km radius of Ongallur/Pattambi (Palakkad/Malappuram borders).",
    other_interests: "English literature, teaching, Islamic organizational activities",
    profile_photo: "/profiles/ncsm1019.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T10:30:00.000Z",
    updated_at: "2026-11-14T10:30:00.000Z",
  },
  {
    id: "ncsm1020-adeeba-p",
    member_id: "NCSM1020",
    full_name: "Adeeba P",
    gender: "Female",
    age: 27,
    date_of_birth: "1999-07-15",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Salafi / Jamaat-e-Islami",
    religious_ideation: "Salafi / Jama'at-e-Islami (സലഫി / ജമാഅത്തെ ഇസ്‌ലാമി)",
    height: "162 cm",
    complexion: "White Brown / Medium Fair",
    physical_build: "Average",
    education: "Diploma in Pharmacy (D.Pharm)",
    bouthika_education: "Diploma in Pharmacy (D.Pharm)",
    profession: "Pharmacist",
    job_location: "Kerala",
    financial_status: "Middle Class",
    place: "Wandoor",
    district: "Malappuram",
    state: "Kerala",
    location: "Wandoor, Malappuram",
    preferred_districts: "Malappuram",
    guardian_name: "Father (Ex-Gulf)",
    guardian_relation: "Father (Ex-Gulf)",
    family_members_details: "Father: Ex-Gulf, Mother: Homemaker, Siblings: 2 Elder Brothers",
    family_background: "Well-respected middle class Muslim family residing at Wandoor, Malappuram. Father is an Ex-Gulf returnee, mother homemaker. Two elder brothers.",
    marriage_expectations: "ദീനി ബോധമുള്ള, ഉന്നത വിദ്യാസമ്പന്നനായ, മെഡിക്കൽ മേഖലയിൽ ജോലി ചെയ്യുന്ന മലപ്പുറം സ്വദേശിയായ സലഫി / ജമാഅത്തെ ഇസ്‌ലാമി അനുഭാവമുള്ള യുവാക്കളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു.",
    partner_preferences: "Age: 27 – 32 Years. Height: 160 – 173 cm. Preferred District: Malappuram. Deeni, well-educated, well-settled and preferably working in the medical field.",
    other_interests: "Pharmaceutical care, medical healthcare, Islamic values",
    profile_photo: "/profiles/ncsm1020.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T10:35:00.000Z",
    updated_at: "2026-11-14T10:35:00.000Z",
  },
  {
    id: "ncsm1021-mufeeda",
    member_id: "NCSM1021",
    full_name: "Mufeeda",
    gender: "Female",
    age: 24,
    date_of_birth: "2002-08-05",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "EK Sunni",
    religious_ideation: "EK Sunni / Jama'at-e-Islami (ഇ.കെ. സുന്നി / ജമാഅത്തെ ഇസ്‌ലാമി)",
    height: "160 cm",
    complexion: "Fair",
    physical_build: "Slim (54 kg)",
    education: "MA Applied Psychology",
    bouthika_education: "MA Applied Psychology",
    profession: "Postgraduate / Preparing for Competitive Exams",
    job_location: "Kerala",
    financial_status: "Middle Class",
    place: "Cheekode, Edavannappara",
    district: "Malappuram",
    state: "Kerala",
    location: "Edavannappara, Malappuram",
    preferred_districts: "Malappuram (Kondotty, Tirurangadi & Eranad Taluk areas)",
    guardian_name: "Family Guardian",
    guardian_relation: "Guardian / Family",
    family_members_details: "Father: (Late) Ali (Retired Teacher), Mother: (Late) Asmabi, Siblings: 3 Elder Sisters (All Married)",
    family_background: "Respectable middle class Islamic family from Cheekode, Edavannappara, Malappuram. Late father Ali was a respected retired school teacher. Late mother Asmabi. 3 elder sisters are married and settled.",
    marriage_expectations: "ദീനി ബോധമുള്ള, ഉത്തരവാദിത്തമുള്ള, കുടുംബസ്നേഹമുള്ള വിദ്യാസമ്പന്നനായ വരനെ തേടുന്നു (ബിരുദാനന്തര ബിരുദം അല്ലെങ്കിൽ ബിരുദം). പെൺകുട്ടിയുടെ തുടർപഠനത്തിനും കരിയറിനും പിന്തുണ നൽകുന്ന, മലപ്പുറം ജില്ലയിലെ (കൊണ്ടോട്ടി, തിരൂരങ്ങാടി, ഏറനാട് ഭാഗങ്ങൾ) ഇ.കെ. സുന്നി അല്ലെങ്കിൽ ജമാഅത്ത് കുടുംബങ്ങളിൽ നിന്നുള്ള യുവാക്കൾക്ക് മുൻഗണന.",
    partner_preferences: "Age: 26-29. Location: Malappuram (Kondotty, Tirurangadi, Eranad Taluk). Well-educated groom (Postgraduate/Graduate), Deeni, caring, respectful, supporting career aspirations. EK Sunni or Jamaat-e-Islami.",
    other_interests: "Psychological counseling, mental healthcare, civil service preparation, Islamic values",
    profile_photo: "/profiles/ncsm1021.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T10:40:00.000Z",
    updated_at: "2026-11-14T10:40:00.000Z",
  },
  {
    id: "ncsm1022-mubashira",
    member_id: "NCSM1022",
    full_name: "Mubashira",
    gender: "Female",
    age: 26,
    date_of_birth: "2000-04-18",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "160 cm",
    complexion: "Wheatish / Dusky (ഇരുനിറം)",
    physical_build: "Slim (മെലിഞ്ഞത്)",
    education: "MSW (Master of Social Work)",
    bouthika_education: "MSW (Master of Social Work)",
    profession: "High Court Assistant, Kochi (ഹൈക്കോടതി അസിസ്റ്റന്റ്)",
    job_location: "Kochi, Ernakulam",
    financial_status: "Middle Class",
    place: "Vengara",
    district: "Malappuram",
    state: "Kerala",
    location: "Vengara, Malappuram",
    preferred_districts: "Malappuram, Ernakulam, Kozhikode, Wayanad",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent / Guardian",
    family_members_details: "Residing at Vengara, Malappuram. Middle class respected Sunni Muslim family.",
    family_background: "Middle class Sunni family from Vengara, Malappuram. Candidate holds an MSW and is employed as High Court Assistant in Kochi. She has partial visual impairment (visually impaired).",
    marriage_expectations: "വിദ്യാസമ്പന്നനും ദീനി ബോധമുള്ളതുമായ സുന്നി യുവാക്കളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു. കാഴ്ച പരിമിതിയെ (visually impaired) ഉൾക്കൊള്ളാൻ മനസ്സുള്ള, കെയറിങ് ആയ ജീവിതപങ്കാളിയെ തേടുന്നു. പരിഗണിക്കാവുന്ന ജില്ലകൾ: മലപ്പുറം, എറണാകുളം, കോഴിക്കോട്, വയനാട്. വരന്റെ പ്രായപരിധി: 31 വയസ്സ് വരെ.",
    partner_preferences: "Age up to 31 years old. Sunni values. Districts: Malappuram, Ernakulam, Kozhikode, Wayanad. Understanding, caring partner who embraces and respects candidate's visual impairment and professional career.",
    other_interests: "Judicial administration, social work, literature, Islamic values",
    profile_photo: "/profiles/ncsm1022.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-14T10:45:00.000Z",
    updated_at: "2026-11-14T10:45:00.000Z",
  },
  {
    id: "ncsm1023-maha",
    member_id: "NCSM1023",
    full_name: "Maha",
    gender: "Female",
    age: 24,
    date_of_birth: "2002-02-01",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Salafi",
    religious_ideation: "Salafi (സലഫി / മുജാഹിദ്)",
    height: "156 cm",
    complexion: "Fair",
    physical_build: "Slim / Normal",
    education: "BSc Psychology",
    bouthika_education: "BSc Psychology (Graduated July 2025, Schooling at M.E.S. Thirunavaya)",
    religious_education: "6th Level Madrasa (ലെവൽ 6)",
    profession: "Graduate (BSc Psychology) / Seeking Employment",
    job_location: "United Kingdom (UK)",
    financial_status: "Upper Middle Class / UK Settled",
    place: "Thirunavaya (Settled in United Kingdom)",
    district: "Malappuram",
    state: "Kerala / UK",
    location: "United Kingdom (Native: Thirunavaya, Malappuram)",
    preferred_districts: "United Kingdom (UK), Malappuram, Kozhikode",
    guardian_name: "Father (Settled in UK)",
    guardian_relation: "Father (Settled in UK)",
    family_members_details: "Father & Mother settled in the UK. Siblings: One younger brother, one elder sister, and one twin sister.",
    family_background: "Practicing Muslim family originally from Thirunavaya, Malappuram, currently settled in the United Kingdom. Observes pillars of Islam and Sunnah. One younger brother, one elder sister, and one twin sister.",
    marriage_expectations: "യുകെയിൽ (United Kingdom) ജോലി ചെയ്യുന്ന, ദീനി ബോധമുള്ള സലഫി / മുസ്ലിം യുവാക്കളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു (Looking for a suitable Muslim groom currently working in the UK).",
    partner_preferences: "Practicing Muslim groom with good religious values, currently working/settled in the United Kingdom (UK).",
    other_interests: "Psychology, Islamic learning, Sunnah practices, literature",
    profile_photo: "/profiles/ncsm1023.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-15T15:45:00.000Z",
    updated_at: "2026-11-15T15:45:00.000Z",
  },
  {
    id: "ncsm1024-yasin",
    member_id: "NCSM1024",
    full_name: "Yasin",
    gender: "Male",
    age: 28,
    date_of_birth: "1998-05-10",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "163 cm",
    complexion: "Fair",
    physical_build: "Normal / Fit",
    education: "Degree",
    bouthika_education: "Degree Graduate",
    religious_education: "10th Level (10-ാം ക്ലാസ് മദ്രസ)",
    profession: "Accountant (Muscat, Oman)",
    job_location: "Muscat, Oman (മസ്കറ്റ്, ഒമാൻ)",
    financial_status: "Middle Class",
    place: "Kuttoor North",
    district: "Malappuram",
    state: "Kerala",
    location: "Kuttoor North, Malappuram",
    preferred_districts: "Malappuram",
    mobile: "9048617510",
    guardian_mobile: "9048617510",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent / Guardian",
    family_members_details: "Family residing at Kuttoor North, Malappuram. Middle class respected Sunni Muslim family.",
    family_background: "Middle class Sunni family from Kuttoor North, Malappuram. Candidate is a degree graduate working as an Accountant in Muscat, Oman.",
    marriage_expectations: "ദീനി ബോധമുള്ള, മലപ്പുറം ജില്ലയിൽ നിന്നുള്ള സുന്നി യുവതികളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു.",
    partner_preferences: "Religious, practicing Sunni bride with good moral values. Preferred District: Malappuram.",
    other_interests: "Accounting, finance, automobiles, Islamic family values",
    profile_photo: "/profiles/ncsm1024.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-15T15:50:00.000Z",
    updated_at: "2026-11-15T15:50:00.000Z",
  },
  {
    id: "ncsm1025-asna",
    member_id: "NCSM1025",
    full_name: "Asna",
    gender: "Female",
    age: 40,
    date_of_birth: "1985-07-16",
    marital_status: "Divorced",
    children_count: "2 പെൺകുട്ടികൾ (18 വയസ്സ്, 14 വയസ്സ്)",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "160 cm",
    complexion: "Fair (വെളുപ്പ്)",
    physical_build: "Normal (72 kg)",
    education: "+2",
    bouthika_education: "+2 (Higher Secondary)",
    religious_education: "6th Level (6-ാം ക്ലാസ് മദ്രസ)",
    profession: "Homemaker",
    job_location: "Kerala",
    financial_status: "Middle Class",
    place: "Nedumangad",
    district: "Thiruvananthapuram",
    state: "Kerala",
    location: "Nedumangad, Thiruvananthapuram",
    preferred_districts: "Thiruvananthapuram, Kollam",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent / Guardian",
    family_members_details: "Residing at Nedumangad, Thiruvananthapuram. Mother of 2 daughters (Aged 18 and 14). Middle class respected Sunni Muslim family.",
    family_background: "Respected middle class Sunni family from Nedumangad, Thiruvananthapuram. Candidate is looking for remarriage (പുനർ വിവാഹം) and has two daughters aged 18 and 14.",
    marriage_expectations: "ദീനി ബോധമുള്ള സുന്നി വരനെ തേടുന്നു (പ്രായപരിധി: 48 വയസ്സ് വരെ). നിലവിൽ ഭാര്യയുള്ളവരെ പരിഗണിക്കില്ല (ഏകഭാര്യത്വം മാത്രം). രണ്ട് പെൺമക്കളെ സ്നേഹത്തോടെ ഉൾക്കൊള്ളുന്നവരായിരിക്കണം. തിരുവനന്തപുരം, കൊല്ലം ജില്ലകളിൽ നിന്നുള്ളവർക്ക് മുൻഗണന.",
    partner_preferences: "Age up to 48. Strictly single / divorced / widower (no polygyny / current wife). Deeni practicing Sunni who will genuinely accept and care for her two daughters (18 & 14 yrs). Preferred Districts: Thiruvananthapuram, Kollam.",
    other_interests: "Childcare, homemaking, Islamic family values",
    profile_photo: "/profiles/ncsm1025.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-15T15:55:00.000Z",
    updated_at: "2026-11-15T15:55:00.000Z",
  },
  {
    id: "ncsm1026-nafia-o",
    member_id: "NCSM1026",
    full_name: "Nafia O",
    gender: "Female",
    age: 26,
    date_of_birth: "2000-01-01",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "158 cm",
    complexion: "Light Fair (ഇളം വെളുപ്പ്)",
    physical_build: "Normal (50 kg)",
    education: "TTC Completed, Pursuing CMA",
    bouthika_education: "TTC Completed, currently pursuing CMA (Cost & Management Accounting)",
    religious_education: "10th Level (10-ാം ക്ലാസ് മദ്രസ)",
    profession: "Pursuing CMA / Teacher Trained (TTC)",
    job_location: "Kerala",
    financial_status: "Upper Middle Class",
    place: "Moloor, Cherpulassery",
    district: "Palakkad",
    state: "Kerala",
    location: "Cherpulassery, Palakkad",
    preferred_districts: "Malappuram, Palakkad, Kozhikode",
    guardian_name: "Father (Retired LP School Teacher)",
    guardian_relation: "Father (Retired LP School Teacher)",
    family_members_details: "Father: Retired LP School Teacher, Mother: Retired LP School Teacher. Residing at Moloor, Cherpulassery, Palakkad.",
    family_background: "Upper Middle Class highly respected educated Sunni Muslim family from Moloor, Cherpulassery, Palakkad. Both parents are retired LP school teachers.",
    marriage_expectations: "ഗൾഫിൽ (GCC) ജോലി ചെയ്യുന്ന, ഉന്നത വിദ്യാസമ്പന്നനും ദീനി ബോധമുള്ളതുമായ സുന്നി വരനെ തേടുന്നു (പ്രായപരിധി: 31 വയസ്സ് വരെ). വിവാഹശേഷമുള്ള തുടർപഠനത്തിനും ജോലിക്ക് പോകുന്നതിനും പിന്തുണ നൽകുന്ന കുടുംബങ്ങളിൽ നിന്നുള്ള വിവാഹാലോചന ക്ഷണിക്കുന്നു. പരിഗണിക്കുന്ന ജില്ലകൾ: മലപ്പുറം, പാലക്കാട്, കോഴിക്കോട്.",
    partner_preferences: "Age up to 31. Practicing Sunni working in Gulf (GCC) with good career/job. Must support bride's higher studies (CMA) and career/employment. Preferred Districts: Malappuram, Palakkad, Kozhikode.",
    other_interests: "Cost & management accounting, teaching, Islamic religious values",
    profile_photo: "/profiles/ncsm1026.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-15T16:00:00.000Z",
    updated_at: "2026-11-15T16:00:00.000Z",
  },
  {
    id: "ncsm1027-sajeena",
    member_id: "NCSM1027",
    full_name: "Sajeena",
    gender: "Female",
    age: 42,
    date_of_birth: "1984-05-15",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "146 cm",
    complexion: "Fair (വെളുപ്പ്)",
    physical_build: "Normal",
    education: "4th Standard",
    bouthika_education: "4th Standard (4-ാം ക്ലാസ്)",
    religious_education: "4th Level (4-ാം ക്ലാസ് മദ്രസ)",
    profession: "Homemaker",
    job_location: "Kerala",
    financial_status: "Middle Class",
    place: "Muttipalam",
    district: "Malappuram",
    state: "Kerala",
    location: "Muttipalam, Malappuram",
    preferred_districts: "Malappuram",
    mobile: "7356674107",
    guardian_mobile: "7356674107",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent / Guardian",
    family_members_details: "Residing at Muttipalam, Malappuram District. Middle class respected Sunni Muslim family.",
    family_background: "Middle class Sunni Muslim family from Muttipalam, Malappuram. Candidate is seeking first marriage (ആദ്യ വിവാഹം). Has speech disability (സംസാരശേഷി ഇല്ല - unable to speak).",
    marriage_expectations: "സുന്നി ആദർശമുള്ള, ജോലിയുള്ള വരനെ തേടുന്നു (പ്രായപരിധി: 50 വയസ്സ് വരെ). സംസാരശേഷി ഇല്ലായ്മയെ (Speech impairment) സ്നേഹത്തോടെ ഉൾക്കൊള്ളാൻ കഴിയുന്ന കുടുംബസ്ഥനായ വരനെ തേടുന്നു. മലപ്പുറം ജില്ലയിലുള്ളവർക്ക് മുൻഗണന. (ഈ പ്രൊഫൈലിലേക്ക് അയക്കുന്ന താല്പര്യങ്ങൾ ഓട്ടോമാറ്റിക്കായി സ്വീകരിക്കപ്പെടും / Auto-Accept Enabled).",
    partner_preferences: "Age up to 50 years. Practicing Sunni with steady employment/job. Caring and kind partner who lovingly accepts candidate's speech disability. Preferred District: Malappuram.",
    other_interests: "Homemaking, Islamic religious values, family care",
    profile_photo: "/profiles/ncsm1027.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    auto_accept_interests: true,
    created_at: "2026-11-15T16:05:00.000Z",
    updated_at: "2026-11-15T16:05:00.000Z",
  },
  {
    id: "ncsm1028-ahammedashraf",
    member_id: "NCSM1028",
    full_name: "Ahammedashraf",
    gender: "Male",
    age: 55,
    date_of_birth: "1971-08-20",
    marital_status: "Widowed",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "162 cm",
    complexion: "Medium",
    physical_build: "Average (Good health)",
    education: "SSLC",
    bouthika_education: "SSLC (10th Standard)",
    profession: "Self Employed / Business",
    job_location: "Ponnani, Malappuram",
    financial_status: "Middle Class",
    place: "Ponnani",
    district: "Malappuram",
    state: "Kerala",
    location: "Ponnani, Malappuram",
    preferred_districts: "Malappuram, Thrissur, Palakkad",
    mobile: "9847560906",
    guardian_mobile: "9946683968",
    guardian_name: "Family Contact",
    guardian_relation: "Family / Self",
    family_members_details: "Father: Late Kunhibava Kutty Makhdoom, Mother: Late Kadeeja. No brothers or sisters (Only son). Residing at Ponnani.",
    family_background: "Respected traditional Makhdoom lineage Sunni Muslim family from Ponnani, Malappuram. Father late Kunhibava Kutty Makhdoom, Mother late Kadeeja. Candidate is a widower looking for remarriage.",
    marriage_expectations: "വിധവകളെയോ പുനർവിവാഹം അന്വേഷിക്കുന്നവരെയോ ദീനി ബോധമുള്ള സുന്നി സ്ത്രീകളെയോ വിവാഹത്തിനായി പരിഗണിക്കുന്നു (പ്രായപരിധി: 45 മുതൽ 50 വയസ്സ് വരെ).",
    partner_preferences: "Age 45 to 50 years. Sunni religious values. Widow, divorced, or any suitable partner looking for a settled and peaceful life. Malappuram or nearby districts.",
    other_interests: "Spiritual learning, community harmony, family values",
    profile_photo: "/profiles/ncsm1028.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-15T16:10:00.000Z",
    updated_at: "2026-11-15T16:10:00.000Z",
  },
  {
    id: "ncsm1029-nada-mariyam",
    member_id: "NCSM1029",
    full_name: "Nada Mariyam",
    gender: "Female",
    age: 23,
    date_of_birth: "2003-06-15",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "165 cm",
    complexion: "Fair",
    physical_build: "Slim / Normal",
    education: "B.Sc Medical Microbiology",
    bouthika_education: "B.Sc Medical Microbiology (Co-operative Institute of Health Science, Thalassery; Schooling at The Indian School, Bahrain)",
    profession: "Medical Microbiologist Trainee (Baby Memorial Hospital, Kannur)",
    job_location: "Kannur, Kerala",
    financial_status: "Upper Middle Class",
    place: "Pandakkal, Hassan Mukku (Near Thalassery / Mahe)",
    district: "Kannur",
    state: "Kerala",
    location: "Pandakkal, Kannur",
    preferred_districts: "Kannur, Kozhikode, Kasaragod, GCC",
    guardian_name: "Rasheed Meethal Koroth (Father)",
    guardian_relation: "Father (Mahe)",
    family_members_details: "Father: Rasheed Meethal Koroth (Mahe), Mother: Shameena C.P (Cheriyaparambath, Thalassery), Siblings: 1 Brother. Residing at 'Zain', Hassan Mukku, Pandakkal.",
    family_background: "Well-respected Upper Middle Class Muslim family from Pandakkal (Thalassery/Mahe, Kannur). Father Rasheed Meethal Koroth (Mahe), mother Shameena C.P (Cheriyaparambath, Thalassery). Candidate schooled in Bahrain and graduated in Medical Microbiology.",
    marriage_expectations: "വിദ്യാസമ്പന്നനും നല്ല ജോലിയുള്ളതുമായ ദീനി ബോധമുള്ള മുസ്ലിം യുവാക്കളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു. കണ്ണൂർ, കോഴിക്കോട്, അല്ലെങ്കിൽ ഗൾഫ് നാടുകളിൽ ജോലി ചെയ്യുന്നവർക്ക് മുൻഗണന.",
    partner_preferences: "Well-educated, professionally qualified Muslim groom with good Islamic character. Preferred Districts: Kannur, Kozhikode or GCC.",
    other_interests: "Medical microbiology, healthcare diagnostics, travel, Islamic family values",
    profile_photo: "/profiles/ncsm1029.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-15T16:15:00.000Z",
    updated_at: "2026-11-15T16:15:00.000Z",
  },
  {
    id: "ncsm1030-dr-hazna-jahan",
    member_id: "NCSM1030",
    full_name: "Dr. Hazna Jahan",
    gender: "Female",
    age: 30,
    date_of_birth: "1995-03-06",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "157 cm",
    complexion: "Fair (White)",
    physical_build: "Normal (56 kg)",
    education: "MBBS",
    bouthika_education: "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
    profession: "Doctor (MBBS)",
    job_location: "Thrissur / Kerala",
    financial_status: "Middle Class",
    place: "Kodungallur",
    district: "Thrissur",
    state: "Kerala",
    location: "Kodungallur, Thrissur",
    preferred_districts: "Thrissur, Ernakulam, Malappuram, Alappuzha, UAE",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent / Guardian",
    family_members_details: "Residing at Kodungallur, Thrissur. Respected middle class Sunni Muslim family.",
    family_background: "Middle class Sunni Muslim family from Kodungallur, Thrissur. Candidate is an MBBS Doctor looking for first marriage.",
    marriage_expectations: "ദീനി ബോധമുള്ള, സുമുഖനായ വരനെ തേടുന്നു (പ്രായപരിധി: 31 മുതൽ 36 വയസ്സ് വരെ). വിദ്യാഭ്യാസം: MBBS, MD, MDS, M.Tech, CA അല്ലെങ്കിൽ സമാനമായ പ്രൊഫഷണൽ യോഗ്യതയുള്ളവർ. ജോലി: നാട്ടിലോ യു.എ.ഇയിലോ ആവാം. പരിഗണിക്കുന്ന ജില്ലകൾ: തൃശൂർ, എറണാകുളം, മലപ്പുറം, ആലപ്പുഴ.",
    partner_preferences: "Age: 31 to 36 Years. Deeni, good looking Sunni professional. Qualifications: MBBS, MD, MDS, M.Tech, CA. Employed in Kerala or UAE. Preferred Districts: Thrissur, Ernakulam, Malappuram, Alappuzha.",
    other_interests: "Medical sciences, healthcare service, Islamic values, family harmony",
    profile_photo: "/profiles/ncsm1030.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-15T16:20:00.000Z",
    updated_at: "2026-11-15T16:20:00.000Z",
  },
  {
    id: "ncsm1031-neshwa-noushad",
    member_id: "NCSM1031",
    full_name: "Neshwa Noushad",
    gender: "Female",
    age: 25,
    date_of_birth: "2001-03-21",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "154 cm",
    complexion: "Fair",
    physical_build: "Slim / Normal",
    education: "M.Com Graduate, CPA (Pursuing)",
    bouthika_education: "M.Com Graduate, currently pursuing CPA (Certified Public Accountant)",
    profession: "Finance Professional / CPA Candidate",
    job_location: "Kerala / Gulf",
    financial_status: "Upper Middle Class",
    place: "Palloor, Mahe",
    district: "Kannur",
    state: "Kerala",
    location: "Palloor, Mahe, Kannur",
    preferred_districts: "Kannur, Kozhikode, Kasaragod, GCC",
    guardian_name: "Noushad VK (Father)",
    guardian_relation: "Father",
    family_members_details: "Father: Noushad VK, Mother: Asma MB, Siblings: None (Only Daughter). Residing at 'Aysha Manzil', Palloor, Mahe.",
    family_background: "Well-respected Upper Middle Class Sunni Muslim family from 'Aysha Manzil', Palloor, Mahe (Kannur district). Candidate is an only child, M.Com graduate currently preparing for CPA.",
    marriage_expectations: "ദീനിന് മുൻഗണന നൽകുന്ന, ഉന്നത വിദ്യാസമ്പന്നനും സത്യസന്ധതയും പ്രതിബദ്ധതയും കാത്തുസൂക്ഷിക്കുന്നതുമായ വരനെ തേടുന്നു (Looking for someone who prioritizes deen, is well-educated, and values honesty and commitment).",
    partner_preferences: "Well-educated Sunni Muslim groom with strong religious values, honesty, and family commitment. Preferred Districts: Kannur, Kozhikode, Kasaragod, GCC.",
    other_interests: "Commerce, accounting, financial analytics, Islamic values",
    profile_photo: "/profiles/ncsm1031.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-15T16:25:00.000Z",
    updated_at: "2026-11-15T16:25:00.000Z",
  },
  {
    id: "ncsm1032-sunni-groom-chemmad",
    member_id: "NCSM1032",
    full_name: "Sunni Groom (Chemmad)",
    gender: "Male",
    age: 30,
    date_of_birth: "1996-05-15",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "176 cm",
    complexion: "Normal (Medium)",
    physical_build: "Slightly Plump / Chubby (കുറച്ചു തടിച്ചത്)",
    education: "Cisco Certified System Administrator",
    bouthika_education: "Cisco Certified System Administrator (CCNA / System & Network Administration)",
    religious_education: "10th Level (10-ാം ക്ലാസ് മദ്രസ)",
    profession: "System and Network Administrator (Ali International Trade, Qatar)",
    job_location: "Qatar (ഖത്തർ)",
    financial_status: "Middle Class",
    place: "Pathinarungal, Near Chemmad",
    district: "Malappuram",
    state: "Kerala",
    location: "Chemmad, Malappuram",
    preferred_districts: "Malappuram, Kozhikode, Palakkad",
    mobile: "9995756985",
    guardian_mobile: "9995756985",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent / Guardian",
    family_members_details: "Residing at Pathinarungal, near Chemmad, Malappuram. Middle class respected Sunni Muslim family.",
    family_background: "Middle class Sunni family from Pathinarungal, near Chemmad, Malappuram. Candidate is a Cisco certified IT professional working in Qatar as System & Network Administrator.",
    marriage_expectations: "ദീനി ബോധമുള്ള സുന്നി യുവതികളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു. മലപ്പുറം, കോഴിക്കോട്, പാലക്കാട് ജില്ലകളിൽ നിന്നുള്ളവർക്ക് മുൻഗണന.",
    partner_preferences: "Religious, practicing Sunni bride with good moral values. Preferred Districts: Malappuram, Kozhikode, Palakkad.",
    other_interests: "Network architecture, IT systems, technology, Islamic family values",
    profile_photo: "/profiles/ncsm1032.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-15T16:30:00.000Z",
    updated_at: "2026-11-15T16:30:00.000Z",
  },
  {
    id: "ncsm1033-muhammed-shakir",
    member_id: "NCSM1033",
    full_name: "Muhammed Shakir",
    gender: "Male",
    age: 29,
    date_of_birth: "1997-03-22",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "170 cm",
    complexion: "Fair",
    physical_build: "Normal / Fit",
    education: "BA Psychology",
    bouthika_education: "BA Psychology (Bachelor of Arts in Psychology)",
    profession: "Accountant (Saudi Arabia)",
    job_location: "Saudi Arabia (സൗദി അറേബ്യ)",
    financial_status: "Middle Class",
    place: "Irumbuzhi, Valaparambe",
    district: "Malappuram",
    state: "Kerala",
    location: "Irumbuzhi, Malappuram",
    preferred_districts: "Malappuram, Kozhikode, Palakkad",
    mobile: "9567542242",
    guardian_mobile: "9567431269",
    guardian_name: "Usman (Father)",
    guardian_relation: "Father",
    family_members_details: "Father: Usman. Residing at Avunjippuram (H), Irumbuzhi, Valaparambe, Malappuram. 3 members in family, 2 sisters (both married).",
    family_background: "Middle class respected Sunni Muslim family from Avunjippuram (H), Irumbuzhi, Valaparambe, Malappuram. Candidate is a BA Psychology graduate working as an Accountant in Saudi Arabia.",
    marriage_expectations: "ദീനി ബോധമുള്ള സുന്നി യുവതികളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു. മലപ്പുറം, കോഴിക്കോട്, പാലക്കാട് ജില്ലകളിൽ നിന്നുള്ളവർക്ക് മുൻഗണന.",
    partner_preferences: "Religious, practicing Sunni Muslim bride with good family values. Preferred Districts: Malappuram, Kozhikode, Palakkad.",
    other_interests: "Psychology, accounting, finance, family life, Islamic values",
    profile_photo: "/profiles/ncsm1033.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-15T17:05:00.000Z",
    updated_at: "2026-11-15T17:05:00.000Z",
  },
  {
    id: "ncsm1034-muhammed-fasil-tp",
    member_id: "NCSM1034",
    full_name: "Muhammed Fasil T.P",
    gender: "Male",
    age: 27,
    date_of_birth: "1999-05-15",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "170 cm",
    complexion: "Fair",
    physical_build: "Average",
    education: "+2 (Higher Secondary)",
    bouthika_education: "+2 (Higher Secondary Education)",
    religious_education: "9th Standard (9-ാം ക്ലാസ്സ് മതപഠനം)",
    profession: "Electrician (ഇലക്ട്രീഷ്യൻ)",
    job_location: "Malappuram, Kerala",
    financial_status: "Middle Class",
    place: "Karingappara, Kavappura",
    district: "Malappuram",
    state: "Kerala",
    location: "Karingappara, Kavappura, Malappuram",
    preferred_districts: "Malappuram, Kozhikode",
    mobile: "9072454555",
    guardian_mobile: "9072454555",
    guardian_name: "Family Guardian",
    guardian_relation: "Family",
    family_members_details: "മിഡിൽ ക്ലാസ്സ് കുടുംബം. 1 സഹോദരൻ, 2 സഹോദരിമാർ (വിവാഹിതർ). സ്ഥലം: കരിങ്ങപ്പാറ, കാവപ്പുര, മലപ്പുറം.",
    family_background: "Middle class respected Sunni Muslim family from Karingappara, Kavappura, Malappuram. Candidate is an electrician. 1 brother, 2 sisters (both married).",
    marriage_expectations: "ദീനി ബോധമുള്ള സുന്നി പെൺകുട്ടികളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു. ഡിമാൻഡ് ഒന്നുമില്ല (No Demands). പ്രായം 20 മുതൽ 23 വരെ പരിഗണിക്കുന്നു. മലപ്പുറം, കോഴിക്കോട് ജില്ലക്കാർക്ക് മുൻഗണന.",
    partner_preferences: "Age 20 to 23. Preferred districts: Malappuram, Kozhikode. No demands. Pious, respectful Sunni Muslim bride.",
    other_interests: "Electrical services, family life, Islamic values",
    profile_photo: "/profiles/ncsm1034.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-16T15:55:00.000Z",
    updated_at: "2026-11-16T15:55:00.000Z",
  },
  {
    id: "ncsm1035-dr-swaliha-silu",
    member_id: "NCSM1035",
    full_name: "Dr. Swaliha (Silu)",
    gender: "Female",
    age: 27,
    date_of_birth: "1998-04-03",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "158 cm",
    complexion: "Normal (Medium)",
    physical_build: "Slim",
    education: "MBBS (Doctor)",
    bouthika_education: "MBBS (Azeezia Medical College, Kollam) - House Surgency completed 2024",
    religious_education: "6th Standard (6-ാം ക്ലാസ്സ് മതപഠനം)",
    profession: "Doctor (MBBS)",
    job_location: "Malappuram, Kerala",
    financial_status: "Middle Class",
    place: "Achanambalam, Vengara",
    district: "Malappuram",
    state: "Kerala",
    location: "Achanambalam, Vengara, Malappuram",
    preferred_districts: "Malappuram",
    guardian_name: "Abdul Salam (Father)",
    guardian_relation: "Father",
    family_members_details: "Father: Abdul Salam, Mother: Soudabi PVP, Younger Brother: BCA, Younger Brother: Plus Two. Residing at Achanambalam, Vengara, Malappuram.",
    family_background: "Middle class respected Sunni Muslim family from Achanambalam, Vengara, Malappuram. Candidate completed MBBS from Azeezia Medical College, Kollam (House Surgency completed in 2024).",
    marriage_expectations: "ദീനി ബോധമുള്ള സുന്നി വരന്മാരിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു. മലപ്പുറം ജില്ലയിലുള്ളവർക്ക് മുൻഗണന. 34 വയസ്സ് വരെ പരിഗണിക്കുന്നു. ശാരീരികമായ കുറവുകൾ ഒന്നുമില്ല.",
    partner_preferences: "Educated Sunni Muslim groom with good religious values, age up to 34. Preferred District: Malappuram.",
    other_interests: "Medicine, healthcare, patient care, Islamic values, reading",
    profile_photo: "/profiles/ncsm1035.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-16T16:01:00.000Z",
    updated_at: "2026-11-16T16:01:00.000Z",
  },
  {
    id: "ncsm1036-jamal-kasaragod",
    member_id: "NCSM1036",
    full_name: "Jamal",
    gender: "Male",
    age: 26,
    date_of_birth: "1999-08-10",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "160 cm",
    complexion: "Medium (Wheatish / ഇരുനിറം)",
    physical_build: "Medium",
    education: "Plus Two, Diploma Course",
    bouthika_education: "Plus Two & Diploma Course",
    religious_education: "8th Standard (8-ാം ക്ലാസ്സ് മതപഠനം)",
    profession: "Milma Shop Sales (Own Business Planning)",
    job_location: "Kozhikode, Kerala",
    financial_status: "Middle Class",
    place: "Uliyathadukka",
    district: "Kasaragod",
    state: "Kerala",
    location: "Uliyathadukka, Kasaragod",
    preferred_districts: "All Districts (എല്ലാ ജില്ലകളും)",
    mobile: "9744255054",
    guardian_mobile: "9744255054",
    guardian_name: "Family Guardian",
    guardian_relation: "Family",
    family_members_details: "Middle class respected Sunni Muslim family residing at Uliyathadukka, Kasaragod.",
    family_background: "Middle class Sunni Muslim family from Uliyathadukka, Kasaragod. Candidate works in Milma Shop sales in Kozhikode and is preparing to start his own business insha Allah.",
    marriage_expectations: "നല്ല ദീനിയുള്ള സുന്നി യുവതികളിൽ നിന്ന് വിവാഹാലോചന ക്ഷണിക്കുന്നു. 20 മുതൽ 25 വയസ്സ് വരെ. പഠിക്കാനും ജോലിക്ക് പോകാനും താല്പര്യമുണ്ടെങ്കിൽ പൂർണ്ണ പിന്തുണ നൽകുന്നതാണ്. എല്ലാ ജില്ലകളിൽ നിന്നുമുള്ളവരെയും പരിഗണിക്കുന്നു.",
    partner_preferences: "Age 20 - 25. All districts considered. Deeni Sunni Muslim bride. Full support for higher education or job.",
    other_interests: "Business initiatives, retail sales, family values, Islamic life",
    profile_photo: "/profiles/ncsm1036.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-16T16:03:00.000Z",
    updated_at: "2026-11-16T16:03:00.000Z",
  },
  {
    id: "ncsm1037-hana-iqbal",
    member_id: "NCSM1037",
    full_name: "Hana Iqbal",
    gender: "Female",
    age: 26,
    date_of_birth: "1999-06-15",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "167 cm",
    complexion: "Fair",
    physical_build: "Slim / Normal",
    education: "MBA, BA Psychology",
    bouthika_education: "MBA (School of Management Studies, CUSAT) & BA Psychology (Christ College, Irinjalakuda) - Schooling in Abu Dhabi",
    religious_education: "Madrasa Education / Islamic Values",
    profession: "HR Specialist (French Company, Abu Dhabi, UAE)",
    job_location: "Abu Dhabi, UAE (യു.എ.ഇ)",
    financial_status: "Upper Middle Class",
    place: "Mathilakam, Kodungallur",
    district: "Thrissur",
    state: "Kerala",
    location: "Mathilakam, Kodungallur, Thrissur (Abu Dhabi, UAE)",
    preferred_districts: "Thrissur, Ernakulam, UAE",
    guardian_name: "Mohamed Iqbal (Father)",
    guardian_relation: "Father",
    family_members_details: "Father: Mohamed Iqbal (SEHA, Abu Dhabi), Mother: Shemy Iqbal, Two younger sisters (studying in Kerala). Residing at Punnilath House, Kathikode, Koolimuttam, Mathilakam, Kodungallur, Thrissur District.",
    family_background: "Respected Sunni Muslim family from Punnilath House, Kathikode, Koolimuttam, Mathilakam, Kodungallur, Thrissur. Father working at SEHA Abu Dhabi. Candidate holds an MBA from CUSAT and BA Psychology, working as HR Specialist at a French company in Abu Dhabi.",
    marriage_expectations: "Looking for a suitable Sunni groom who is religious and practicing, Height 177 cm or above, currently working in the UAE, and from Thrissur or Ernakulam District. Serious and suitable proposals are welcome.",
    partner_preferences: "Religious, practicing Sunni Muslim groom. Height 177 cm or above. Working in the UAE. From Thrissur or Ernakulam District.",
    other_interests: "Human resource management, psychology, travel, family values, Islamic ethics",
    profile_photo: "/profiles/ncsm1037.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-16T16:57:00.000Z",
    updated_at: "2026-11-16T16:57:00.000Z",
  },
  {
    id: "ncsm1038-faiha-perimbalam-qatar",
    member_id: "NCSM1038",
    full_name: "Faiha",
    gender: "Female",
    age: 24,
    date_of_birth: "2001-04-12",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "152 cm",
    complexion: "Fair",
    physical_build: "Slim / Normal (53 kg)",
    education: "BSc Food Technology",
    bouthika_education: "B.Sc in Food Technology",
    religious_education: "7th Standard (7-ാം ക്ലാസ്സ് മതപഠനം)",
    profession: "Food Quality Officer (Qatar)",
    job_location: "Qatar (ഖത്തർ)",
    financial_status: "Upper Middle Class",
    place: "Perimbalam P.O",
    district: "Malappuram",
    state: "Kerala",
    location: "Perimbalam, Malappuram (Settled in Qatar)",
    preferred_districts: "Qatar, Malappuram",
    guardian_name: "Kunhi Muhammed (Father)",
    guardian_relation: "Father",
    family_members_details: "D/o Kunhi Muhammed, Thurayan Pulakkal House, Perimbalam P.O, Malappuram. Family is settled in Qatar.",
    family_background: "Respected Sunni Muslim family from Thurayan Pulakkal House, Perimbalam P.O, Malappuram. Family is well-settled in Qatar. Candidate is a BSc Food Technology graduate working as Food Quality Officer in Qatar.",
    marriage_expectations: "Seeking a well-educated, family-oriented Sunni groom. Preference for professionals currently residing in Qatar. കുറിപ്പ്: കുടുംബം ഖത്തറിൽ ഉള്ളവർ മാത്രം ബന്ധപ്പെടുക (Families residing in Qatar only).",
    partner_preferences: "Well-educated, family-oriented Sunni groom residing and working in Qatar. Family must be based in Qatar.",
    other_interests: "Food quality control, nutrition, Islamic values, family life",
    profile_photo: "/profiles/ncsm1038.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-16T16:58:00.000Z",
    updated_at: "2026-11-16T16:58:00.000Z",
  },
  {
    id: "ncsm1039-dr-aysha-fidha-ap",
    member_id: "NCSM1039",
    full_name: "Dr. Aysha Fidha A.P",
    gender: "Female",
    age: 24,
    date_of_birth: "2001-05-18",
    marital_status: "Divorced",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "153 cm",
    complexion: "Fair",
    physical_build: "Normal / Slim",
    education: "MBBS (Doctor)",
    bouthika_education: "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
    religious_education: "Madrasa Education / Islamic Values",
    profession: "Doctor (MBBS)",
    job_location: "Malappuram, Kerala",
    financial_status: "Affluent / Well to do (Doctors Family)",
    place: "Munduparamba P.O",
    district: "Malappuram",
    state: "Kerala",
    location: "Munduparamba, Malappuram",
    preferred_districts: "Malappuram, Kozhikode, Palakkad",
    guardian_name: "Dr. Mohammed Hassan (Father - Physician)",
    guardian_relation: "Father",
    family_members_details: "Father: Dr. Mohammed Hassan (Physician), Mother: Government Doctor, 2 Brothers (one 2nd year MBBS student, one Plus One student). Residing at Aynthoor Pokkat, Aynthoor Villa, Munduparamba P.O, Malappuram.",
    family_background: "Reputed, highly educated and well-to-do Sunni Muslim doctor family from Aynthoor Villa, Munduparamba, Malappuram. Father is a physician, mother is a government doctor, elder brother studying MBBS.",
    marriage_expectations: "Seeking alliance from religious, financially sound, and reputed Sunni Muslim families. Preferably Doctors who finished MBBS or pursuing PG (MS/MD) from Malappuram and nearby districts. Marital status: Nikah divorce (Mahr returned).",
    partner_preferences: "Sunni Muslim Doctor (MBBS / PG MS/MD), religious, financially sound and reputed family. Preferred Districts: Malappuram and nearby districts.",
    other_interests: "Medical science, patient care, healthcare ethics, family values",
    profile_photo: "/profiles/ncsm1039.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-16T17:13:00.000Z",
    updated_at: "2026-11-16T17:13:00.000Z",
  },
  {
    id: "ncsm1040-dr-hazna-jahan-kodungallur",
    member_id: "NCSM1040",
    full_name: "Dr. Hazna Jahan",
    gender: "Female",
    age: 30,
    date_of_birth: "1995-03-06",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "157 cm (5'2\")",
    complexion: "White (Fair)",
    physical_build: "Normal / Fit (56 kg)",
    education: "MBBS (Doctor)",
    bouthika_education: "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
    religious_education: "Madrasa Education / Islamic Values",
    profession: "Doctor (MBBS)",
    job_location: "Kerala, India",
    financial_status: "Middle Class",
    place: "Kodungallur",
    district: "Thrissur",
    state: "Kerala",
    location: "Kodungallur, Thrissur",
    preferred_districts: "Thrissur, Ernakulam, Malappuram, Alappuzha, UAE",
    guardian_name: "Family Guardian",
    guardian_relation: "Family",
    family_members_details: "Middle class respected Sunni Muslim family residing at Kodungallur, Thrissur.",
    family_background: "Respected Sunni Muslim family from Kodungallur, Thrissur. Candidate is an MBBS Doctor.",
    marriage_expectations: "വരനിൽ നിന്നും പ്രതീക്ഷിക്കുന്നത്: ദീനിബോധം, ഗുഡ് ലുക്കിംഗ്. പ്രായം 31 മുതൽ 36 വരെ. യോഗ്യത: MBBS, MD, MDS, M.Tech, CA. ജോലി നാട്ടിലോ UAE-യിലോ ആവാം. പരിഗണിക്കുന്ന ജില്ലകൾ: തൃശൂർ, എറണാകുളം, മലപ്പുറം, ആലപ്പുഴ.",
    partner_preferences: "Age 31 - 36. Deeni, good looking Sunni groom. Qualification: MBBS / MD / MDS / M.Tech / CA. Working in Kerala or UAE. Districts: Thrissur, Ernakulam, Malappuram, Alappuzha.",
    other_interests: "Medical healthcare, clinical practice, Islamic values, family life",
    profile_photo: "/profiles/ncsm1040.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-16T17:16:00.000Z",
    updated_at: "2026-11-16T17:16:00.000Z",
  },
  {
    id: "ncsm1041-yusra-moidutty",
    member_id: "NCSM1041",
    full_name: "Yusra Moidutty",
    gender: "Female",
    age: 24,
    date_of_birth: "2002-04-15",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "160 cm",
    complexion: "Fair",
    physical_build: "Normal",
    education: "B.Tech & MS (Master of Science)",
    bouthika_education: "B.Tech & MS (Master of Science)",
    religious_education: "7th Standard (7-ാം ക്ലാസ്സ് മതപഠനം)",
    profession: "Research Staff at IIT Palakkad (Govt. of India)",
    job_location: "IIT Palakkad, Kerala",
    financial_status: "Upper Middle Class",
    place: "Ayyotichira, Veliyamcode, Ponnani (Currently Palakkad)",
    district: "Malappuram",
    state: "Kerala",
    location: "Ayyotichira, Veliyamcode, Ponnani, Malappuram",
    preferred_districts: "Malappuram",
    mobile: "+91 98470 00000",
    guardian_mobile: "+91 98470 00000",
    guardian_name: "NP Moidutty Haji (Father)",
    guardian_relation: "Father",
    family_members_details: "Father: NP Moidutty Haji (Building Business, Ex Gulf - Abu Dhabi, Retired). Mother: Remla Beegam (Ex Arabic Teacher, Abu Dhabi & Kerala). 3 Brothers: 1 in Dubai (Married), 1 pursuing PhD at IIT Palakkad, 1 working at Bangalore Airport (Married). 1 Sister (Married).",
    family_background: "Upper Middle Class respected Sunni Muslim family originally from Ayyotichira, Veliyamcode, Ponnani, Malappuram (currently residing in Palakkad). Father retired businessman from Abu Dhabi, mother former Arabic teacher. Candidate holds B.Tech and MS, working as Research Staff at IIT Palakkad under Government of India.",
    marriage_expectations: "Sunni Muslim groom up to 31 years old. Qualification strictly required: BTech / MTech / PhD. Preferred district: Malappuram. Should be religious, well-mannered, and family-oriented.",
    partner_preferences: "Age up to 31 years. Qualification: BTech / MTech / PhD. Preferred district: Malappuram. Practicing Sunni Muslim groom.",
    other_interests: "Scientific research, academic reading, Islamic values, family life",
    profile_photo: "/profiles/ncsm1041.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-17T14:18:00.000Z",
    updated_at: "2026-11-17T14:18:00.000Z",
  },
  {
    id: "ncsm1042-aysha-rosna-an",
    member_id: "NCSM1042",
    full_name: "Aysha Rosna A N",
    gender: "Female",
    age: 26,
    date_of_birth: "1999-07-09",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "173 cm",
    complexion: "Fair",
    physical_build: "Normal",
    education: "PhD Scholar / MSc Agricultural Economics / BSc (Hons) Agriculture",
    bouthika_education: "PhD Scholar (College of Agriculture Vellayani, TVM) / MSc Agricultural Economics (OUAT) / BSc (Hons) Agriculture",
    religious_education: "6th Standard (6-ാം ക്ലാസ്സ് മതപഠനം)",
    profession: "PhD Scholar (Agriculture) & Former Senior Research Fellow ICAR",
    job_location: "Thiruvananthapuram / Kozhikode, Kerala",
    financial_status: "Middle Class",
    place: "Karuvannur, Naduvannur",
    district: "Kozhikode",
    state: "Kerala",
    location: "Karuvannur, Naduvannur, Kozhikode",
    preferred_districts: "Kozhikode",
    mobile: "+91 98470 00000",
    guardian_mobile: "+91 98470 00000",
    guardian_name: "Muhammed Shanid A N (Brother)",
    guardian_relation: "Brother",
    family_members_details: "Father: Dr Abu KV (Late, Teacher). Mother: Nuzrath MK (Housewife). Brother: Muhammed Shanid A N (Married, Engineer in KSEB Thottilpalam). Sister: Anshida Rouna A N (Student at IISER Thiruvananthapuram).",
    family_background: "Middle Class respected Sunni Muslim family originally from Karuvannur, Naduvannur, Kozhikode. Late father was an educator and teacher. Brother is a KSEB Engineer at Thottilpalam, sister pursuing studies at IISER Thiruvananthapuram. Candidate holds BSc (Hons) Agriculture, MSc in Agricultural Economics, formerly worked as Senior Research Fellow under ICAR CRIDA, currently pursuing PhD at College of Agriculture, Vellayani, Thiruvananthapuram.",
    marriage_expectations: "Seeking a religious, well-mannered Sunni Muslim groom up to 33 years from Kozhikode district. Well-educated professional preferred.",
    partner_preferences: "Age up to 33 years. Preferred district: Kozhikode. Well-educated Sunni groom with good character and family values.",
    other_interests: "Agricultural economics, environmental research, reading, Islamic ethics, family life",
    profile_photo: "/profiles/ncsm1042.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-17T14:19:00.000Z",
    updated_at: "2026-11-17T14:19:00.000Z",
  },
  {
    id: "ncsm1043-mubashira-vengara",
    member_id: "NCSM1043",
    full_name: "Mubashira",
    gender: "Female",
    age: 26,
    date_of_birth: "2000-06-15",
    marital_status: "Never Married",
    religion: "Islam",
    sect: "Sunni",
    religious_ideation: "Sunni (സുന്നി)",
    height: "5'3\" (160 cm)",
    complexion: "Wheatish / Dusky",
    physical_build: "Slim",
    education: "MSW (Master of Social Work)",
    bouthika_education: "MSW (Master of Social Work)",
    profession: "High Court Assistant, High Court of Kerala, Kochi",
    job_location: "Kochi, Kerala",
    financial_status: "Middle Class",
    place: "Vengara",
    district: "Malappuram",
    state: "Kerala",
    location: "Vengara, Malappuram",
    preferred_districts: "Malappuram, Ernakulam, Kozhikode, Wayanad",
    mobile: "+91 98470 00000",
    guardian_mobile: "+91 98470 00000",
    guardian_name: "Family Guardian",
    guardian_relation: "Parent (Guardian)",
    family_members_details: "Middle class respected Sunni Muslim family residing at Vengara, Malappuram.",
    family_background: "Middle class respected Sunni Muslim family from Vengara, Malappuram. Candidate is an MSW graduate and permanently employed as High Court Assistant at High Court of Kerala, Kochi.",
    marriage_expectations: "31 വയസ്സ് വരെയുള്ള ദീനിബോധമുള്ള സുന്നി യുവാക്കളിൽ നിന്നും വിവാഹാലോചന ക്ഷണിക്കുന്നു. കാഴ്ചാ പരിമിതിയുള്ള പെൺകുട്ടിയാണ് (Visually Impaired), എന്നാൽ സ്വന്തം കാലിൽ നിൽക്കുന്ന കേരള ഹൈക്കോടതി അസിസ്റ്റന്റായി ജോലി ചെയ്യുന്ന മിടുക്കിയാണ്. പരിഗണിക്കുന്ന ജില്ലകൾ: മലപ്പുറം, എറണാകുളം, കോഴിക്കോട്, വയനാട്.",
    partner_preferences: "Age up to 31 years. Preferred districts: Malappuram, Ernakulam, Kozhikode, Wayanad. Understanding, caring, and religious Sunni Muslim groom.",
    other_interests: "Social work, judiciary administration, reading, Islamic values, family life. Note: Visually impaired (കാഴ്ചാ പരിമിതിയുണ്ട്).",
    profile_photo: "/profiles/ncsm1043.jpg",
    registration_type: "CASH_ADMIN",
    source: "admin",
    profile_status: "APPROVED",
    is_verified: true,
    is_premium: true,
    premium_plan: "Active Premium",
    biodata_uploaded: true,
    created_at: "2026-11-17T14:20:00.000Z",
    updated_at: "2026-11-17T14:20:00.000Z",
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

/**
 * Helper to identify whether a profile was added by the admin
 * (pre-seeded verified profile, manual admin entry, CASH_ADMIN, or admin source).
 */
export function isAdminAddedProfile(p?: Partial<Profile> | null): boolean {
  if (!p) return false;
  // 1. Explicit admin flags or cash registration
  if (p.registration_type === 'CASH_ADMIN') return true;
  if ((p as any).source === 'admin' || (p as any).created_by === 'admin') return true;
  // 2. Default verified profiles seeded in the system
  if (DEFAULT_PROFILES.some((dp) => dp.id === p.id || (dp.member_id && p.member_id && dp.member_id.toUpperCase() === p.member_id.toUpperCase()))) return true;
  // 3. Known sequential admin-added profile IDs
  if (p.member_id && ['NCSM1004', 'NCSM1005', 'NCSM1006', 'NCSM1007', 'NCSM1008', 'NCSM1009', 'NCSM1010', 'NCSM1011', 'NCSM1012'].includes(p.member_id.toUpperCase())) return true;
  // 4. Missing auth_user_id and no independent user email (or admin email)
  if (!p.auth_user_id && (!p.email || p.email.toLowerCase().trim() === 'nikahcircle01@gmail.com')) return true;
  // 5. Sequential NCSM profiles without independent auth user
  if (p.member_id && p.member_id.toUpperCase().startsWith('NCSM') && !p.auth_user_id) return true;
  return false;
}

/**
 * Checks if a profile is an admin-added Groom (Male) profile with a valid contact number (mobile or guardian_mobile).
 * Any proposal interest sent to these profiles is automatically approved so the contacting family
 * can immediately view contact details and reach out on WhatsApp/Call.
 */
export function isAdminAddedGroomWithPhone(p?: Partial<Profile> | null): boolean {
  if (!p) return false;
  const isGroom = normalizeGender(p.gender) === 'Male';
  if (!isGroom) return false;
  if (!isAdminAddedProfile(p)) return false;
  const rawPhone = p.mobile || p.guardian_mobile;
  const cleanPhone = (rawPhone || '').replace(/\D/g, '');
  return cleanPhone.length >= 7;
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
  // Special promo campaign code NCSMREF110022 (16/11/2026 - 24/11/2026) can be used by all incoming users
  if (normalized === 'NCSMREF110022') return false;
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
  // Special promo code is a multi-user campaign, don't mark as exhausted
  if (normalized === 'NCSMREF110022') return;
  const list = getStoredUsedReferralCodes();
  if (!list.includes(normalized)) {
    saveStoredUsedReferralCodes([...list, normalized]);
  }
}

// Sequential Auto-Increment Member ID System: NCSM1003, NCSM1004, NCSM1005...
export const MEMBER_ID_SEQ_KEY = 'nikah_circle_member_id_seq_v12';

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


