import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Heart,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  FileCheck,
  Trash2,
  Lock,
  Compass,
  AlertCircle,
  Check
} from 'lucide-react';
import { UserProfileData } from './UserProfileModal';
import { normalizeGender } from '../types';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<UserProfileData>) => Promise<void>;
  initialData?: Partial<UserProfileData> | null;
  userMemberId?: string;
  isApproved?: boolean;
  isPremium?: boolean;
  onOpenPremium?: () => void;
}

const KERALA_DISTRICTS = [
  'Kozhikode',
  'Malappuram',
  'Kannur',
  'Ernakulam',
  'Thiruvananthapuram',
  'Thrissur',
  'Palakkad',
  'Kollam',
  'Alappuzha',
  'Kottayam',
  'Kasaragod',
  'Wayanad',
  'Idukki',
  'Pathanamthitta',
];

const HEIGHT_OPTIONS = [
  "5' 0\" (152 cm)",
  "5' 1\" (155 cm)",
  "5' 2\" (157 cm)",
  "5' 3\" (160 cm)",
  "5' 4\" (163 cm)",
  "5' 5\" (165 cm)",
  "5' 6\" (168 cm)",
  "5' 7\" (170 cm)",
  "5' 8\" (173 cm)",
  "5' 9\" (175 cm)",
  "5' 10\" (178 cm)",
  "5' 11\" (180 cm)",
  "6' 0\" (183 cm)",
  "6' 1\" (185 cm)",
  "6' 2\"+ (188 cm+)",
];

const COMPLEXION_OPTIONS = [
  'Very Fair',
  'Fair',
  'Medium',
  'Wheatish',
  'Dusky / Brown',
];

const PHYSICAL_BUILD_OPTIONS = [
  'Slim',
  'Average / Normal',
  'Athletic / Fit',
  'Healthy / Broad',
];

const RELIGIOUS_IDEATION_OPTIONS = [
  'Sunni (EK)',
  'Sunni (AP)',
  'Mujahid',
  'Salafi',
  'Jamaat-e-Islami',
  'General Practicing Muslim',
  'Other / Open Minded',
];

const RELIGIOUS_EDUCATION_OPTIONS = [
  'Madrasa 10th / 12th',
  'Dars Student / Educated',
  'Hafiz-ul-Quran',
  'Moulavi / Alim',
  'Islamic Studies Degree / Graduate',
  'Basic Quran & Fiqh Understanding',
  'None / Basic',
];

const GENERAL_EDUCATION_OPTIONS = [
  "SSLC / 10th",
  "Plus Two / 12th",
  "Bachelor's Degree (BA / B.Com / B.Sc / BCA)",
  "Master's Degree (MA / M.Com / M.Sc / MCA)",
  "B.Tech / Engineering",
  "MBBS / Doctor / MD",
  "Chartered Accountant (CA / CMA / ACCA)",
  "Diploma / Polytechnic",
  "Nursing / Pharmacy / Paramedical",
  "Post Graduate / Ph.D",
  "Other Professional Degree",
];

const JOB_LOCATION_OPTIONS = [
  'Kerala (Native / Home State)',
  'Other Indian States (Bangalore, Chennai, Mumbai, etc.)',
  'Dubai / UAE',
  'Saudi Arabia',
  'Qatar / Kuwait / Oman / Bahrain (GCC)',
  'Europe / UK / USA / Abroad',
  'Remote / Work from Home',
  'Not Working / Home Based',
];

const FINANCIAL_STATUS_OPTIONS = [
  'Middle Class',
  'Upper Middle Class',
  'Affluent / Wealthy',
  'Modest / Simple',
];

const BLOOD_GROUP_OPTIONS = [
  'A+',
  'B+',
  'O+',
  'AB+',
  'A-',
  'B-',
  'O-',
  'AB-',
  'Not Known',
];

const PASSPORT_VISA_OPTIONS = [
  'Valid Indian Passport Available',
  'GCC Resident / Employment Visa Holder',
  'GCC Visit / Family Visa',
  'Planning to Apply Passport',
  'No Passport Currently',
];

const MARRIAGE_EXPECTATIONS_OPTIONS = [
  'Willing to allow Job / Higher studies after marriage',
  'Prefer Homemaker / Family-oriented candidate',
  'Mutual understanding & discussions',
  'Willing to relocate with spouse (GCC/Abroad)',
];

export const BiodataWizardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  userMemberId,
  isApproved = true,
  isPremium = true,
  onOpenPremium,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    full_name: initialData?.full_name || '',
    gender: (initialData?.gender ? normalizeGender(initialData.gender) : 'Male') as 'Male' | 'Female',
    age: initialData?.age || 24,
    date_of_birth: initialData?.date_of_birth || '',
    place: initialData?.place || '',
    district: initialData?.district || 'Kozhikode',
    height: initialData?.height || "5' 5\" (165 cm)",
    complexion: initialData?.complexion || 'Fair',
    physical_build: initialData?.physical_build || 'Average / Normal',
    religious_ideation: initialData?.religious_ideation || 'Sunni (EK)',
    marital_status: (initialData?.marital_status || 'Never Married') as 'Never Married' | 'Divorced' | 'Widowed',
    children_count: initialData?.children_count || 'None',

    // Step 2: Education & Career
    religious_education: initialData?.religious_education || 'Madrasa 10th / 12th',
    bouthika_education: initialData?.bouthika_education || initialData?.education || "Bachelor's Degree (BA / B.Com / B.Sc / BCA)",
    profession: initialData?.profession || '',
    job_location: initialData?.job_location || 'Kerala (Native / Home State)',
    financial_status: initialData?.financial_status || 'Middle Class',
    preferred_districts: initialData?.preferred_districts || 'All Kerala (Malappuram, Kozhikode, Kannur, etc.)',

    // Step 3: Family & Guardian
    family_members_details: initialData?.family_members_details || 'Father, Mother, Siblings',
    guardian_name: initialData?.guardian_name || '',
    guardian_relation: initialData?.guardian_relation || 'Father',
    guardian_mobile: initialData?.guardian_mobile || '',
    family_background: initialData?.family_background || 'Pious Islamic family with religious values',

    // Step 4: Additional Preferences
    marriage_expectations: initialData?.marriage_expectations || 'Mutual understanding & discussions',
    blood_group: initialData?.blood_group || 'O+',
    passport_visa_status: initialData?.passport_visa_status || 'Valid Indian Passport Available',
    other_interests: initialData?.other_interests || initialData?.hobbies || 'Reading Islamic books, family travels',
    biodata_uploaded: initialData?.biodata_uploaded ?? false,
    biodata_document_name: initialData?.biodata_document_name || null,
    biodata_document_url: initialData?.biodata_document_url || null,
  });

  // Sync initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        full_name: initialData.full_name || prev.full_name,
        gender: (initialData.gender ? normalizeGender(initialData.gender) : prev.gender) as 'Male' | 'Female',
        place: initialData.place || prev.place,
        district: initialData.district || prev.district,
        date_of_birth: initialData.date_of_birth || prev.date_of_birth,
        age: initialData.age || prev.age,
        profession: initialData.profession || prev.profession,
        bouthika_education: initialData.bouthika_education || initialData.education || prev.bouthika_education,
        guardian_name: initialData.guardian_name || prev.guardian_name,
        guardian_mobile: initialData.guardian_mobile || prev.guardian_mobile,
        guardian_relation: initialData.guardian_relation || prev.guardian_relation,
        biodata_uploaded: initialData.biodata_uploaded ?? prev.biodata_uploaded,
        biodata_document_name: initialData.biodata_document_name || prev.biodata_document_name,
        biodata_document_url: initialData.biodata_document_url || prev.biodata_document_url,
      }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  // Validation per step
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.full_name.trim()) {
        alert('Please enter your full name.');
        return false;
      }
      if (!formData.place.trim()) {
        alert('Please enter your place / locality.');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!formData.profession.trim()) {
        alert('Please enter your job / occupation (or "Job Search" / "Homemaker").');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!formData.guardian_name.trim()) {
        alert('Please enter the Guardian Name (Father, Mother, Brother, etc.).');
        return false;
      }
      if (!formData.guardian_mobile.trim()) {
        alert('Please enter the Guardian Mobile Number.');
        return false;
      }
      const cleanPhone = formData.guardian_mobile.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        alert('Please enter a valid 10-digit mobile number for your Guardian.');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB limit. Please upload a smaller document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        biodata_uploaded: true,
        biodata_document_name: file.name,
        biodata_document_url: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      biodata_document_name: null,
      biodata_document_url: null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitFinal = async () => {
    if (!isPremium) {
      alert('Biodata writing & publishing is exclusively reserved for Premium members. Please upgrade your plan.');
      return;
    }
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<UserProfileData> = {
        ...formData,
        biodata_uploaded: true, // Marked complete
        education: formData.bouthika_education,
        location: `${formData.place}, ${formData.district}`,
        hobbies: formData.other_interests,
      };

      await onSubmit(payload);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      onClose();
    } catch (err) {
      console.error('Failed to submit biodata wizard', err);
      alert('An error occurred while saving your biodata. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header with Stepper Progress */}
        <div className="bg-gradient-to-r from-[#4b001f] via-[#651031] to-[#4b001f] p-5 sm:p-6 text-white relative shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold bg-[#c9973e] text-[#350016] px-2.5 py-0.5 rounded-md shadow-xs">
                  {userMemberId || 'Member'}
                </span>
                <span className="text-[11px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  Premium Biodata Wizard
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-white">
                Complete Matrimonial Biodata
              </h3>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Step-by-step verified candidate biodata profile. Required before sending proposal interests.
              </p>
            </div>

            {/* Skip / Close Button */}
            <button
              onClick={onClose}
              title="Skip for now / Save and Close"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar (Only when Premium) */}
          {isPremium && (
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-100">
                <span className={currentStep === 1 ? 'text-amber-300 font-extrabold' : ''}>
                  1. Personal
                </span>
                <span className={currentStep === 2 ? 'text-amber-300 font-extrabold' : ''}>
                  2. Career & Edu
                </span>
                <span className={currentStep === 3 ? 'text-amber-300 font-extrabold' : ''}>
                  3. Family & Guardian
                </span>
                <span className={currentStep === 4 ? 'text-amber-300 font-extrabold' : ''}>
                  4. Preferences
                </span>
              </div>

              {/* Track Bar */}
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-400 to-[#c9973e] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {!isPremium ? (
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 text-[#c9973e]" />
            </div>
            <div className="space-y-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Premium-Only Feature
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Candidate Biodata Publishing
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Writing and publishing candidate biodata is exclusively reserved for active <strong>Premium Plan</strong> members.
                Please upgrade to a Premium Plan to upload and publish your biodata and become visible to other members.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
              >
                Close
              </button>
              {onOpenPremium && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPremium();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Upgrade to Premium</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-stone-800 text-xs">
          {/* ========================================================
              STEP 1: BASIC & PERSONAL INFO
             ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-amber-950">
                <User className="w-4 h-4 text-[#c9973e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Step 1: Basic & Personal Information (വ്യക്തിഗത വിവരങ്ങൾ)</h4>
                  <p className="text-[11px] text-amber-900/80 mt-0.5">
                    Please provide accurate personal info. Gender and candidate name form your identity on Nikah Circle.
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Candidate Name (പൂർണ്ണ നാമം) *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Muhammed Faisal / Fathima Zahra"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs font-medium"
                />
              </div>

              {/* Gender Selector: Yuvavu vs Yuvathi */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Gender / Candidate Type (ലിംഗം) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'Male' })}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      formData.gender === 'Male'
                        ? 'bg-[#4b001f] text-white border-[#4b001f] shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Groom / Yuvavu (യുവാവ് - Male)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'Female' })}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      formData.gender === 'Female'
                        ? 'bg-[#4b001f] text-white border-[#4b001f] shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Bride / Yuvathi (യുവതി - Female)</span>
                  </button>
                </div>
              </div>

              {/* Place & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Place / Local Town (സ്ഥലം) *
                  </label>
                  <input
                    type="text"
                    value={formData.place}
                    onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                    placeholder="e.g. Manjeri, Feroke, Vadakara"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    District (ജില്ല) *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  >
                    {KERALA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Age & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Date of Birth (ജനനത്തീയതി)
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => {
                      const dob = e.target.value;
                      const calculatedAge = dob ? Math.max(18, new Date().getFullYear() - new Date(dob).getFullYear()) : formData.age;
                      setFormData({ ...formData, date_of_birth: dob, age: calculatedAge });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Age (പ്രായം)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={80}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 18 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs"
                  />
                </div>
              </div>

              {/* Height, Complexion, Physical Build */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Height (ഉയരം)
                  </label>
                  <select
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  >
                    {HEIGHT_OPTIONS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Color / Complexion (നിറം)
                  </label>
                  <select
                    value={formData.complexion}
                    onChange={(e) => setFormData({ ...formData, complexion: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  >
                    {COMPLEXION_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Physical Build (ശരീരപ്രകൃതി)
                  </label>
                  <select
                    value={formData.physical_build}
                    onChange={(e) => setFormData({ ...formData, physical_build: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  >
                    {PHYSICAL_BUILD_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Religious Ideation & Marital Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Religious Ideation / Maslak (വിശ്വാസ ധാര / മസ്ലക്)
                  </label>
                  <select
                    value={formData.religious_ideation}
                    onChange={(e) => setFormData({ ...formData, religious_ideation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  >
                    {RELIGIOUS_IDEATION_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Marital Status (വൈവാഹിക പദവി)
                  </label>
                  <select
                    value={formData.marital_status}
                    onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  >
                    <option value="Never Married">Never Married (ആദ്യ വിവാഹം)</option>
                    <option value="Divorced">Divorced (പുനർവിവാഹം / വേർപിരിഞ്ഞത്)</option>
                    <option value="Widowed">Widowed (പുനർവിവാഹം / പങ്കാളി മരണപ്പെട്ടത്)</option>
                  </select>
                </div>
              </div>

              {/* Children if Second Marriage */}
              {formData.marital_status !== 'Never Married' && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    Children Details if Second Marriage (കുട്ടികൾ ഉണ്ടെങ്കിൽ)
                  </label>
                  <select
                    value={formData.children_count}
                    onChange={(e) => setFormData({ ...formData, children_count: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-white"
                  >
                    <option value="None">No Children (കുട്ടികളില്ല)</option>
                    <option value="1 Child (Living with candidate)">1 Child (Living with candidate)</option>
                    <option value="1 Child (Living with former spouse)">1 Child (Living with former spouse)</option>
                    <option value="2 Children">2 Children</option>
                    <option value="3+ Children">3 or more Children</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              STEP 2: EDUCATION & PROFESSION
             ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-emerald-950">
                <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Step 2: Education & Profession (വിദ്യാഭ്യാസം & തൊഴിൽ)</h4>
                  <p className="text-[11px] text-emerald-900/80 mt-0.5">
                    Both Religious and Secular educational qualifications, job details, and financial preferences.
                  </p>
                </div>
              </div>

              {/* Religious Education */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Religious Education (മത വിദ്യാഭ്യാസം)
                </label>
                <select
                  value={formData.religious_education}
                  onChange={(e) => setFormData({ ...formData, religious_education: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                >
                  {RELIGIOUS_EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bouthika (Secular) Education */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Bouthika Education / General Qualification (ഭൗതിക വിദ്യാഭ്യാസം) *
                </label>
                <select
                  value={formData.bouthika_education}
                  onChange={(e) => setFormData({ ...formData, bouthika_education: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                >
                  {GENERAL_EDUCATION_OPTIONS.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job / Profession */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Job / Profession (ജോലി / തൊഴിൽ) *
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="e.g. Software Engineer, Doctor, Teacher, Business, Accountant, Homemaker"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs"
                />
              </div>

              {/* Job Location & Financial Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Job Location (ജോലി സ്ഥലം)
                  </label>
                  <select
                    value={formData.job_location}
                    onChange={(e) => setFormData({ ...formData, job_location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  >
                    {JOB_LOCATION_OPTIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Financial Status (സാമ്പത്തിക നിലവാരം)
                  </label>
                  <select
                    value={formData.financial_status}
                    onChange={(e) => setFormData({ ...formData, financial_status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  >
                    {FINANCIAL_STATUS_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Districts */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Preferred Districts for Match (ആഗ്രഹിക്കുന്ന ജില്ലകൾ)
                </label>
                <input
                  type="text"
                  value={formData.preferred_districts}
                  onChange={(e) => setFormData({ ...formData, preferred_districts: e.target.value })}
                  placeholder="e.g. All Kerala, or Malappuram, Kozhikode, Kannur"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs"
                />
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 3: FAMILY & GUARDIAN DETAILS
             ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-sky-950">
                <Users className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Step 3: Family & Guardian Details (കുടുംബം & രക്ഷാകർത്താവ്)</h4>
                  <p className="text-[11px] text-sky-900/80 mt-0.5">
                    Islamic matrimony prioritizes guardian involvement. Contact numbers remain completely private until mutual acceptance.
                  </p>
                </div>
              </div>

              {/* Privacy Shield Banner */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-900 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px] leading-relaxed">
                  <strong>🔒 100% Privacy Protected:</strong> Guardian phone number is strictly locked and will NEVER be publicly shown on listings. It unlocks only when you accept an incoming interest proposal.
                </span>
              </div>

              {/* Family Members Breakdown */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Family Members Details (കുടുംബാംഗങ്ങൾ)
                </label>
                <input
                  type="text"
                  value={formData.family_members_details}
                  onChange={(e) => setFormData({ ...formData, family_members_details: e.target.value })}
                  placeholder="e.g. Father (Business), Mother (Housewife), 1 Brother (Married), 1 Sister (Studying)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs"
                />
              </div>

              {/* Guardian Name & Relation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Guardian Name (രക്ഷാകർത്താവിന്റെ പേര്) *
                  </label>
                  <input
                    type="text"
                    value={formData.guardian_name}
                    onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                    placeholder="e.g. Abdul Kareem / Usman K."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Guardian Relation (ബന്ധം) *
                  </label>
                  <select
                    value={formData.guardian_relation}
                    onChange={(e) => setFormData({ ...formData, guardian_relation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  >
                    <option value="Father">Father (പിതാവ്)</option>
                    <option value="Mother">Mother (മാതാവ്)</option>
                    <option value="Elder Brother">Elder Brother (ജ്യേഷ്ഠൻ)</option>
                    <option value="Paternal Uncle">Paternal Uncle (വല്യുപ്പ / ഇളയപ്പ)</option>
                    <option value="Maternal Uncle">Maternal Uncle (അമ്മാവൻ)</option>
                    <option value="Guardian">Other Legal Guardian</option>
                  </select>
                </div>
              </div>

              {/* Guardian Phone Number */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Guardian Phone Number (രക്ഷാകർത്താവിന്റെ ഫോൺ നമ്പർ) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.guardian_mobile}
                    onChange={(e) => setFormData({ ...formData, guardian_mobile: e.target.value })}
                    placeholder="+91 98460 00000"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs font-medium"
                  />
                </div>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  This contact number is verified by Nikah Circle admin and used strictly for mutual proposal discussions.
                </span>
              </div>

              {/* Family Background / Values */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Family Background & Religious Traditions (കുടുംബ പശ്ചാത്തലം)
                </label>
                <textarea
                  rows={2}
                  value={formData.family_background}
                  onChange={(e) => setFormData({ ...formData, family_background: e.target.value })}
                  placeholder="e.g. Traditional religious family following Sunnath Jama'ath values with high moral standards."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs resize-none"
                />
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 4: ADDITIONAL PREFERENCES & CONDITIONS
             ======================================================== */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-purple-950">
                <Heart className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Step 4: Additional Preferences & Expectations (നിബന്ധനകൾ & താല്പര്യങ്ങൾ)</h4>
                  <p className="text-[11px] text-purple-900/80 mt-0.5">
                    Expectations after marriage, blood group, passport status, and optional biodata document attachment.
                  </p>
                </div>
              </div>

              {/* Job / Studies after marriage expectations */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Job / Studies after Marriage Expectations (വിവാഹശേഷമുള്ള പഠനം / ജോലി)
                </label>
                <select
                  value={formData.marriage_expectations}
                  onChange={(e) => setFormData({ ...formData, marriage_expectations: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                >
                  {MARRIAGE_EXPECTATIONS_OPTIONS.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Blood Group & Passport/Visa Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Blood Group (രക്തഗ്രൂപ്പ്)
                  </label>
                  <select
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  >
                    {BLOOD_GROUP_OPTIONS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Passport / GCC Visa Status (പാസ്പോർട്ട് / വിസ)
                  </label>
                  <select
                    value={formData.passport_visa_status}
                    onChange={(e) => setFormData({ ...formData, passport_visa_status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs bg-white"
                  >
                    {PASSPORT_VISA_OPTIONS.map((pv) => (
                      <option key={pv} value={pv}>
                        {pv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Other Interests & Hobbies */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Other Interests & Hobbies (മറ്റ് താല്പര്യങ്ങൾ)
                </label>
                <input
                  type="text"
                  value={formData.other_interests}
                  onChange={(e) => setFormData({ ...formData, other_interests: e.target.value })}
                  placeholder="e.g. Reading, Travel, Islamic calligraphy, Volunteering"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#4b001f] text-xs"
                />
              </div>

              {/* Optional Document Attachment Upload */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#c9973e]" />
                    <span>Attach Ready Biodata Document (Optional)</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-semibold">PDF, Word, or Image</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  If you already have a typed biodata document (PDF, Word, or Image), you can upload it here for admin verification and candidate review.
                </p>

                {formData.biodata_document_name ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-900">
                    <div className="flex items-center gap-2 truncate">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-xs truncate">{formData.biodata_document_name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Remove attached file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 px-4 rounded-xl border border-dashed border-[#c9973e] bg-amber-50/50 hover:bg-amber-50 text-[#4b001f] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 text-[#c9973e]" />
                      <span>Upload Biodata File (PDF, DOCX, or Image)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer with Navigation Buttons */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
              title="Skip for now. You can complete it anytime before sending proposals."
            >
              Skip for now
            </button>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitFinal}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Saving Biodata...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Complete Biodata & Unlock Interests</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </>
    )}
    </div>
  </div>
);
};
