import React, { useState, useRef } from 'react';
import { X, UserPlus, CheckCircle2, ShieldCheck, Image as ImageIcon, Camera, Upload, Trash2, Link as LinkIcon, Lock, Sparkles } from 'lucide-react';
import { Profile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profile: Partial<Profile>) => Promise<void>;
  isUserPremium?: boolean;
  onOpenPremium?: () => void;
}

export const RegisterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  isUserPremium = true,
  onOpenPremium,
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    gender: 'Female' as 'Male' | 'Female',
    date_of_birth: '1998-01-01',
    mobile: '',
    guardian_name: '',
    guardian_relation: 'Father (Wali)',
    guardian_mobile: '',
    email: '',
    location: 'Kozhikode, Kerala',
    district: 'Kozhikode',
    education: '',
    profession: '',
    marital_status: 'Never Married' as 'Never Married' | 'Divorced' | 'Widowed',
    height: `5'4"`,
    sect: 'Sunni',
    about: '',
    partner_preferences: '',
    family_details: '',
    profile_photo: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Please choose an image file under 10MB.');
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

  if (!isOpen) return null;

  if (!isUserPremium) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-center p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#fff6fa] border border-[#eadfe4] flex items-center justify-center text-[#4b001f] shadow-xs">
            <Lock className="w-8 h-8 text-[#c9973e]" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#c9973e]">
              Premium Members Only
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#4b001f]">
              പ്രൊഫൈൽ രജിസ്ട്രേഷൻ പ്രീമിയം അംഗങ്ങൾക്ക് മാത്രം
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Nikah Circle-ൽ പ്രൊഫൈൽ രജിസ്റ്റർ ചെയ്യുന്നതിന് പ്രീമിയം മെമ്പർഷിപ്പ് നിർബന്ധമാണ്. UPI സ്കാനർ വഴിയോ, ഓഫീസ് വഴിയോ, അല്ലെങ്കിൽ പെൺകുട്ടികൾക്കും മറ്റുള്ളവർക്കുമുള്ള സൗജന്യ പ്രീമിയം (PREMIUM FREE - GIRLS & OTHER) വഴിയോ ഉടൻ പ്രീമിയം എടുക്കാം.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPremium?.();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white font-bold text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#c9973e]" />
              <span>പ്രീമിയം എടുക്കുക / PREMIUM FREE</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // User registrations are submitted as PENDING Admin Requests
      await onSubmit({
        ...formData,
        religion: 'Islam',
        registration_type: 'ONLINE',
        profile_status: 'PENDING',
        is_verified: false,
        is_premium: false,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error(err);
      alert('Error registering profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#4b001f] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight">
                രജിസ്റ്റർ യുവർ പ്രൊഫൈൽ (Register Profile)
              </h2>
              <p className="text-xs text-stone-300">
                അഡ്മിൻ വെരിഫിക്കേഷനായി പ്രൊഫൈൽ റിക്വസ്റ്റ് സമർപ്പിക്കുക
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {success ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-2xl font-bold text-[#4b001f]">
                അഡ്മിൻ റിക്വസ്റ്റ് സമർപ്പിച്ചു!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                താങ്കളുടെ പ്രൊഫൈൽ വിജയകരമായി അഡ്മിൻ റിക്വസ്റ്റായി സമർപ്പിച്ചു. അഡ്മിൻ ഇത് പരിശോധിച്ച് അക്സെപ്റ്റ് (Approve) ചെയ്ത ശേഷം മാത്രമേ പ്രൊഫൈൽ ലൈവ് ആവുകയുള്ളൂ.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-[#fff6fa] border border-[#eadfe4] text-xs text-[#4b001f] font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c9973e] shrink-0" />
                <span>
                  ശ്രദ്ധിക്കുക: രക്ഷിതാവിന്റെ (Guardian / Wali) നമ്പർ നൽകിയാൽ മറ്റുള്ളവർക്ക് അത് മാത്രമാണ് കാണിക്കുക.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Candidate Full Name (കാൻഡിഡേറ്റിന്റെ പേര്) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Full name"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Gender (ലിംഗം) *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f] bg-white"
                  >
                    <option value="Female">Bride (സ്ത്രീ / പെൺകുട്ടി)</option>
                    <option value="Male">Groom (പുരുഷൻ / ചെറുപ്പക്കാരൻ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Guardian / Wali Name (രക്ഷിതാവിന്റെ പേര്) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardian_name}
                    onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                    placeholder="e.g. Father or Wali name"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Guardian Mobile (രക്ഷിതാവിന്റെ ഫോൺ നമ്പർ) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.guardian_mobile}
                    onChange={(e) => setFormData({ ...formData, guardian_mobile: e.target.value })}
                    placeholder="+91 98470 00000"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Candidate Direct Mobile (കാൻഡിഡേറ്റ് നമ്പർ)
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="+91 98470 11111"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Date of Birth (ജനനത്തീയതി) *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Education (വിദ്യാഭ്യാസം) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="e.g. MBBS, M.Tech, Degree..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Profession (തൊഴിൽ) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="e.g. Doctor, Software Engineer..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    District / Location (ജില്ല / സ്ഥലം) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value, district: e.target.value })}
                    placeholder="e.g. Kozhikode, Malappuram..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Marital Status (വിവാഹാവസ്ഥ)
                  </label>
                  <select
                    value={formData.marital_status}
                    onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f] bg-white"
                  >
                    <option value="Never Married">Never Married (അവിവാഹിതൻ/അവിവാഹിത)</option>
                    <option value="Divorced">Divorced (വിവാഹമോചിതർ)</option>
                    <option value="Widowed">Widowed (വിധവ / വിഭാര്യൻ)</option>
                  </select>
                </div>
              </div>

              {/* Gallery Photo Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700">
                    Profile Photo (പ്രൊഫൈൽ ഫോട്ടോ)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-[#4b001f] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>{showUrlInput ? 'Use Gallery Upload' : 'Enter URL instead'}</span>
                  </button>
                </div>

                {/* Hidden File Input for Device Gallery / Camera */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {showUrlInput ? (
                  <div>
                    <input
                      type="url"
                      value={formData.profile_photo}
                      onChange={(e) => setFormData({ ...formData, profile_photo: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Direct image link or upload using Gallery below
                    </span>
                  </div>
                ) : (
                  <div>
                    {formData.profile_photo ? (
                      /* Live Selected Image Preview */
                      <div className="flex items-center gap-4 p-3 rounded-2xl border border-emerald-200 bg-emerald-50/50">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200 bg-white shrink-0 shadow-xs">
                          <img
                            src={formData.profile_photo}
                            alt="Selected Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>ഫോട്ടോ തിരഞ്ഞെടുത്തു (Photo Selected)</span>
                          </span>
                          <p className="text-[11px] text-stone-600">
                            കാൻഡിഡേറ്റിന്റെ പ്രൊഫൈൽ ഫോട്ടോ സജ്ജമാക്കി.
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2.5 py-1 rounded-lg border border-stone-300 hover:bg-white text-stone-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Camera className="w-3 h-3 text-stone-500" />
                              <span>ഫോട്ടോ മാറ്റുക (Change)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, profile_photo: '' })}
                              className="px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>ഒഴിവാക്കുക</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Empty Gallery Chooser Dropzone */
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-5 rounded-2xl border-2 border-dashed border-[#eadfe4] hover:border-[#4b001f] bg-[#fff6fa]/60 hover:bg-[#fff6fa] transition-all cursor-pointer text-center space-y-2 group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white border border-[#eadfe4] text-[#4b001f] group-hover:scale-105 transition-transform flex items-center justify-center mx-auto shadow-xs">
                          <ImageIcon className="w-6 h-6 text-[#4b001f]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#4b001f]">
                            Choose Photo from Gallery (ഗാലറിയിൽ നിന്ന് ഫോട്ടോ തിരഞ്ഞെടുക്കുക)
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            മൊബൈൽ ഗാലറിയിൽ നിന്നോ കമ്പ്യൂട്ടറിൽ നിന്നോ നേരിട്ട് ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യാം
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4b001f] text-white text-[11px] font-bold shadow-2xs group-hover:bg-[#350016]">
                          <Camera className="w-3.5 h-3.5" />
                          <span>Browse Gallery / Camera</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  About Candidate & Family (വിവരണം)
                </label>
                <textarea
                  rows={2}
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  placeholder="കാൻഡിഡേറ്റിന്റെ സ്വഭാവം, ദീനിയായ കാര്യങ്ങൾ, കുടുംബ പശ്ചാത്തലം..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#4b001f]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  {loading ? 'സമർപ്പിക്കുന്നു...' : 'സമർപ്പിക്കുക (Submit Admin Request)'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
