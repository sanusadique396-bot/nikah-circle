import React from 'react';
import { Profile } from '../types';
import {
  X,
  MapPin,
  Heart,
  ShieldCheck,
  Sparkles,
  Lock,
  Phone,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Props {
  profile: Profile | null;
  onClose: () => void;
  onSendInterest: (profileId: string) => void;
  onCancelInterest?: (profileId: string) => void;
  interestStatus?: 'pending' | 'accepted' | 'declined' | null;
  isBookmarked: boolean;
  onToggleBookmark: (profileId: string) => void;
  onOpenPremium: () => void;
  isUserPremium: boolean;
  onAcceptInterestTest?: (profileId: string) => void;
}

export const ProfileModal: React.FC<Props> = ({
  profile,
  onClose,
  onSendInterest,
  onCancelInterest,
  interestStatus,
  isBookmarked,
  onToggleBookmark,
  onOpenPremium,
  isUserPremium,
  onAcceptInterestTest,
}) => {
  if (!profile) return null;

  const isUnlocked = interestStatus === 'accepted';
  const age =
    profile.age ||
    (profile.date_of_birth
      ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
      : 26);

  // Phone display rule: If guardian_mobile is provided, show ONLY guardian's number!
  const hasGuardianNumber = !!profile.guardian_mobile && profile.guardian_mobile.trim().length > 0;
  const contactPhoneToDisplay = hasGuardianNumber ? profile.guardian_mobile : profile.mobile;
  const contactLabel = hasGuardianNumber
    ? `Guardian (${profile.guardian_relation || 'Father / Guardian'})`
    : 'Candidate Direct Mobile';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#4b001f] to-[#350016] text-white p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/30 shrink-0 shadow-md bg-[#fff6fa]">
              {profile.profile_photo ? (
                <img
                  src={profile.profile_photo}
                  alt={profile.full_name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover ${
                    !isUnlocked ? 'blur-md scale-105' : 'blur-none'
                  }`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-serif text-[#4b001f]">
                  ♡
                </div>
              )}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
                  {profile.full_name}
                </h2>
                {profile.is_verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
                {profile.is_premium && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#c9973e]/30 text-[#dfb25d] border border-[#c9973e]/50 px-2 py-0.5 rounded-md">
                    <Sparkles className="w-3 h-3" />
                    Premium Member
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-stone-200">
                <MapPin className="w-3.5 h-3.5 text-[#c9973e]" />
                <span>{profile.location || 'Kerala, India'}</span>
                <span>·</span>
                <span>{age} Years</span>
                <span>·</span>
                <span>{profile.gender}</span>
              </div>

              <p className="text-xs text-stone-300">
                {profile.education || 'Graduate'} · {profile.marital_status}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-800 text-xs sm:text-sm">
          {/* PRIVACY LOCK NOTICE: If interest not accepted, hide full biodata! */}
          {!isUnlocked ? (
            <div className="p-6 rounded-2xl bg-[#fff6fa] border border-[#eadfe4] text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4b001f] text-[#c9973e] flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-6 h-6" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="font-serif font-bold text-lg text-[#4b001f]">
                  Biodata Hidden
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  To view the complete biodata and guardian phone number of this profile, you must first send an <strong>Interest</strong>. Full contact details will be unlocked once they accept your interest.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {interestStatus === 'pending' ? (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <div className="px-5 py-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>Interest Sent (Awaiting Acceptance)</span>
                    </div>
                    {onCancelInterest && (
                      <button
                        type="button"
                        onClick={() => onCancelInterest(profile.id)}
                        className="px-4 py-2.5 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel Interest
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!isUserPremium) {
                        onOpenPremium();
                      } else {
                        onSendInterest(profile.id);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 text-[#c9973e]" />
                    <span>Send Interest to Unlock Biodata</span>
                  </button>
                )}

                {/* Instant Test Accept Simulation button for user verification */}
                {onAcceptInterestTest && interestStatus === 'pending' && (
                  <button
                    onClick={() => onAcceptInterestTest(profile.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>(Test) Accept Interest Now</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* UNLOCKED BIODATA SECTION */
            <>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Mutual interest accepted! Full biodata and guardian contact details are now unlocked.
                </span>
              </div>

              {/* About & Religious Outlook */}
              <div>
                <h4 className="font-serif font-bold text-base text-[#4b001f] mb-2">
                  About & Religious Outlook
                </h4>
                <div className="p-4 rounded-2xl bg-[#fff6fa] border border-[#eadfe4] space-y-2">
                  <p className="leading-relaxed text-stone-700">
                    {profile.about || 'Practicing Muslim individual with strong faith and dedication to family harmony.'}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-600 font-medium border-t border-[#eadfe4]/60">
                    <span>Religion: <strong className="text-stone-900">{profile.religion || 'Islam'}</strong></span>
                    <span>Sect: <strong className="text-stone-900">{profile.sect || 'Sunni'}</strong></span>
                    <span>Height: <strong className="text-stone-900">{profile.height || "5'5\""}</strong></span>
                  </div>
                </div>
              </div>

              {/* Detailed Attributes */}
              <div>
                <h4 className="font-serif font-bold text-base text-[#4b001f] mb-2">
                  Education & Career
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="block text-[11px] text-stone-500 font-semibold uppercase">Education</span>
                    <span className="font-bold text-stone-900">{profile.education || 'Graduate'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="block text-[11px] text-stone-500 font-semibold uppercase">Profession</span>
                    <span className="font-bold text-stone-900">{profile.profession || 'Professional'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="block text-[11px] text-stone-500 font-semibold uppercase">Marital Status</span>
                    <span className="font-bold text-stone-900">{profile.marital_status}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="block text-[11px] text-stone-500 font-semibold uppercase">District / City</span>
                    <span className="font-bold text-stone-900">{profile.district || profile.location || 'Kerala'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="block text-[11px] text-stone-500 font-semibold uppercase">Registration</span>
                    <span className="font-bold text-stone-900">{profile.registration_type}</span>
                  </div>
                </div>
              </div>

              {/* Family Background */}
              <div>
                <h4 className="font-serif font-bold text-base text-[#4b001f] mb-2">
                  Family & Guardian Background
                </h4>
                <div className="p-4 rounded-2xl bg-white border border-[#eadfe4]">
                  <p className="leading-relaxed text-stone-700">
                    {profile.family_details || 'Respectable family rooted in traditional Islamic values.'}
                  </p>
                </div>
              </div>

              {/* GUARDIAN PHONE NUMBER RULE */}
              <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/60 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      {contactLabel}
                    </span>
                    <h5 className="font-serif font-bold text-lg text-emerald-950">
                      {contactPhoneToDisplay || 'Available on request'}
                    </h5>
                  </div>
                </div>

                {hasGuardianNumber ? (
                  <p className="text-[11px] text-emerald-800 font-medium pt-1 border-t border-emerald-200/60">
                    ✓ Verified guardian contact number is displayed. Personal number is kept private for modesty.
                  </p>
                ) : (
                  <p className="text-[11px] text-stone-600 font-medium pt-1 border-t border-stone-200">
                    * Showing direct contact number as no separate guardian number was specified.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => onToggleBookmark(profile.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isBookmarked ? 'fill-[#4b001f] text-[#4b001f]' : ''
              }`}
            />
            <span>{isBookmarked ? 'Shortlisted' : 'Shortlist'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
