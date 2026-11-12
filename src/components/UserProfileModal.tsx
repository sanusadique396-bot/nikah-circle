import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  UserCheck,
  Sparkles,
  Camera,
  Trash2,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Heart,
  BookOpen,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { Profile } from '../types';

export interface UserProfileData {
  full_name: string;
  mobile: string;
  email: string;
  state: string;
  district: string;
  place: string;
  gender: 'Male' | 'Female';
  date_of_birth: string;
  hobbies: string;
  interests: string;
  profession?: string;
  education?: string;
  guardian_name?: string;
  guardian_mobile?: string;
  profile_photo?: string;
  is_approved?: boolean;
  is_premium?: boolean;
  premium_plan?: string;
}

interface Props {
  isOpen: boolean;
  isMandatory?: boolean; // When true, no close / skip button is shown
  onClose?: () => void;
  onSubmit: (data: UserProfileData) => Promise<void>;
  initialData?: Partial<UserProfileData> | null;
  isEditing?: boolean;
  onSwitchToLogin?: () => void;
  isApproved?: boolean;
  isPremium?: boolean;
  planName?: string;
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
  'Outside Kerala / NRI'
];

const STATES = [
  'Kerala',
  'Karnataka',
  'Tamil Nadu',
  'Maharashtra',
  'Delhi',
  'UAE / Gulf',
  'Saudi Arabia',
  'Qatar',
  'Other'
];

const SUGGESTED_HOBBIES = [
  'Reading',
  'Traveling',
  'Cooking',
  'Photography',
  'Islamic Studies',
  'Gardening',
  'Sports / Fitness',
  'Writing',
  'Volunteering'
];

const SUGGESTED_INTERESTS = [
  'Family & Community',
  'Deen & Morals',
  'Career & Innovation',
  'Art & Architecture',
  'Health & Well-being',
  'Social Service'
];

export const UserProfileModal: React.FC<Props> = ({
  isOpen,
  isMandatory = false,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  onSwitchToLogin,
  isApproved = false,
  isPremium = false,
  planName = 'Free Plan',
}) => {
  const [formData, setFormData] = useState<UserProfileData>({
    full_name: '',
    mobile: '',
    email: '',
    state: 'Kerala',
    district: 'Kozhikode',
    place: '',
    gender: 'Female',
    date_of_birth: '1998-05-15',
    hobbies: '',
    interests: '',
    profession: '',
    education: '',
    guardian_name: '',
    guardian_mobile: '',
    profile_photo: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        state: initialData.state || prev.state,
        district: initialData.district || prev.district,
        gender: initialData.gender || prev.gender,
        date_of_birth: initialData.date_of_birth || prev.date_of_birth,
      }));
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Calculate age based on date of birth
  const calculatedAge = formData.date_of_birth
    ? Math.max(18, new Date().getFullYear() - new Date(formData.date_of_birth).getFullYear())
    : 24;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Please choose an image under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, profile_photo: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleTag = (field: 'hobbies' | 'interests', tag: string) => {
    const current = formData[field] ? formData[field].split(',').map((s) => s.trim()).filter(Boolean) : [];
    const exists = current.includes(tag);
    const updated = exists ? current.filter((t) => t !== tag) : [...current, tag];
    setFormData((prev) => ({ ...prev, [field]: updated.join(', ') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.full_name.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!formData.place.trim()) {
      setErrorMsg('Please enter your place / city');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      if (!isMandatory && onClose) {
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4b001f] via-[#5b0026] to-[#350016] text-white p-5 sm:p-6 relative shrink-0">
          {!isMandatory && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c9973e] to-[#a8782a] flex items-center justify-center text-[#350016] shadow-md font-bold text-xl shrink-0">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#dfb25d]">
                {isEditing ? 'Profile Settings' : 'Mandatory Setup'}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isEditing ? 'Edit Profile' : 'Create Profile Account'}
              </h2>
              <p className="text-xs text-stone-200 mt-0.5">
                {isEditing
                  ? 'You can update your profile details anytime'
                  : 'Please enter your profile details to start using the app'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-stone-800">
          {/* Admin Approval & Package Status Banner */}
          {(isApproved || isPremium) && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-[#fff6fa] border border-emerald-200 text-emerald-950 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-900">
                      Admin Approved Profile
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Package: <strong className="text-[#4b001f] font-bold">{planName}</strong> · Verified by Admin
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
              <X className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Photo Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#fff6fa] border border-[#eadfe4]">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 border-[#4b001f]/20 shrink-0 shadow-xs flex items-center justify-center">
              {formData.profile_photo ? (
                <img
                  src={formData.profile_photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-[#4b001f]">
                  <User className="w-8 h-8 text-stone-400" />
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <span className="font-bold text-stone-900 block text-xs">
                Profile Photo (Optional)
              </span>
              <p className="text-[11px] text-stone-500">
                Please select a modest photo. Your photo will remain blurred until an interest is accepted.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#4b001f] text-white text-xs font-bold hover:bg-[#350016] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
                {formData.profile_photo && (
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, profile_photo: '' }))}
                    className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* SECTION 1: Required Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-stone-200">
              <User className="w-4 h-4 text-[#4b001f]" />
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Required Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Fathima Zahra"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] focus:ring-1 focus:ring-[#4b001f] outline-none"
                  />
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] focus:ring-1 focus:ring-[#4b001f] outline-none"
                  />
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] focus:ring-1 focus:ring-[#4b001f] outline-none"
                  />
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Selective Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-stone-200">
              <MapPin className="w-4 h-4 text-[#4b001f]" />
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Personal & Location Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Gender */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] outline-none bg-white font-medium"
                >
                  <option value="Female">Female (Bride)</option>
                  <option value="Male">Male (Groom)</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full pl-8 pr-2 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] outline-none bg-white"
                  />
                  <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-stone-500 font-semibold mt-0.5 block">
                  Age: {calculatedAge} years
                </span>
              </div>

              {/* State */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] outline-none bg-white"
                >
                  {STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] outline-none bg-white"
                >
                  {KERALA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Place */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Place / City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.place}
                    onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                    placeholder="e.g. Manjeri, Vadakara"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] outline-none"
                  />
                  <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Profession */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Profession (Optional)
                </label>
                <input
                  type="text"
                  value={formData.profession || ''}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  placeholder="e.g. Software Engineer, Teacher"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Guardian Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-stone-200">
              <ShieldCheck className="w-4 h-4 text-[#4b001f]" />
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Guardian Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Guardian Name
                </label>
                <input
                  type="text"
                  value={formData.guardian_name || ''}
                  onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                  placeholder="e.g. Mohammed Ali (Father)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Guardian Mobile
                </label>
                <input
                  type="tel"
                  value={formData.guardian_mobile || ''}
                  onChange={(e) => setFormData({ ...formData, guardian_mobile: e.target.value })}
                  placeholder="Guardian contact for proposals"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Optional (Hobbies & Interests) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-stone-200">
              <Heart className="w-4 h-4 text-[#c9973e]" />
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Hobbies & Interests (Optional)
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                  Hobbies
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SUGGESTED_HOBBIES.map((hobby) => {
                    const isSelected = formData.hobbies.includes(hobby);
                    return (
                      <button
                        type="button"
                        key={hobby}
                        onClick={() => handleToggleTag('hobbies', hobby)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#4b001f] text-white shadow-2xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {hobby}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={formData.hobbies}
                  onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                  placeholder="Add other hobbies (comma separated)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                  Interests
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SUGGESTED_INTERESTS.map((interest) => {
                    const isSelected = formData.interests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => handleToggleTag('interests', interest)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#c9973e] text-[#350016] shadow-2xs font-bold'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {interest}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="Add other interests (comma separated)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-[#4b001f] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#4b001f] hover:bg-[#350016] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block animate-spin mr-2">⏳</span>
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#c9973e]" />
              )}
              <span>
                {isEditing ? 'Save Changes' : 'Create Profile'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
