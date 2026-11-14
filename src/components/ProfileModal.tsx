import React from 'react';
import { Profile, normalizeGender } from '../types';
import {
  X,
  MapPin,
  Heart,
  ShieldCheck,
  Lock,
  Phone,
  UserCheck,
  Clock,
  FileText
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
  currentUserGender?: 'Male' | 'Female' | null;
  currentUserMobile?: string | null;
  currentUserId?: string | null;
  hasUserBiodata?: boolean;
  onOpenBiodataWizard?: () => void;
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
  currentUserGender,
  currentUserMobile,
  currentUserId,
  hasUserBiodata = false,
  onOpenBiodataWizard,
}) => {
  if (!profile) return null;

  // Strict Contact Privacy Rule: Contact details are UNLOCKED ONLY if interest was sent and ACCEPTED
  const isUnlocked = interestStatus === 'accepted';
  const normUserGender = currentUserGender ? normalizeGender(currentUserGender) : null;
  const normProfileGender = normalizeGender(profile.gender);
  const isSameGender = Boolean(normUserGender && normProfileGender === normUserGender);
  const isOwnProfile = Boolean(
    (currentUserId && profile.id === currentUserId) ||
    (currentUserMobile && profile.mobile && profile.mobile.replace(/\D/g, '').slice(-8) === currentUserMobile.replace(/\D/g, '').slice(-8))
  );

  const age =
    profile.age ||
    (profile.date_of_birth
      ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
      : 26);

  // Phone display rule: Guardian contact is prioritized
  const hasGuardianNumber = !!profile.guardian_mobile && profile.guardian_mobile.trim().length > 0;
  const contactPhoneToDisplay = hasGuardianNumber ? profile.guardian_mobile : profile.mobile;
  const contactLabel = hasGuardianNumber
    ? `Guardian (${profile.guardian_relation || 'Parent / Guardian'})`
    : 'Guardian / Direct Contact';

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
                  style={{ objectFit: 'cover', objectPosition: '50% 15%' }}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-serif text-[#4b001f]">
                  ♡
                </div>
              )}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-mono text-xs font-bold bg-[#c9973e]/30 text-amber-200 border border-[#c9973e]/50 px-2.5 py-0.5 rounded-md tracking-wider">
                  {profile.member_id || (profile.id?.startsWith('NCSM') ? profile.id : `NCSM${profile.id?.replace(/\D/g, '').slice(-4) || '1001'}`)}
                </span>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
                  {profile.full_name}
                </h2>
                {(profile.profile_status === 'APPROVED' || profile.is_verified) && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 px-2.5 py-1 rounded-md shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    Admin Verified
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-stone-200">
                <MapPin className="w-3.5 h-3.5 text-[#c9973e]" />
                <span>{profile.location || 'Kerala, India'}</span>
                <span>·</span>
                <span>{age} Years</span>
                <span>·</span>
                <span>{normProfileGender}</span>
              </div>

              <p className="text-xs text-stone-300">
                {profile.education || 'Graduate'} · {profile.marital_status}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body: Complete Biodata Details are ALWAYS visible to members */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-800 text-xs sm:text-sm">
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
                <span>Maslak: <strong className="text-stone-900">{profile.religious_ideation || profile.sect || 'Sunni'}</strong></span>
                <span>Height: <strong className="text-stone-900">{profile.height || "5'5\""}</strong></span>
                {profile.complexion && <span>Color: <strong className="text-stone-900">{profile.complexion}</strong></span>}
                {profile.physical_build && <span>Build: <strong className="text-stone-900">{profile.physical_build}</strong></span>}
              </div>
            </div>
          </div>

          {/* Detailed Attributes: Education & Career */}
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
              {profile.job_location && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="block text-[11px] text-stone-500 font-semibold uppercase">Job Location</span>
                  <span className="font-bold text-stone-900">{profile.job_location}</span>
                </div>
              )}
              {profile.religious_education && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="block text-[11px] text-stone-500 font-semibold uppercase">Religious Edu</span>
                  <span className="font-bold text-stone-900">{profile.religious_education}</span>
                </div>
              )}
              {profile.financial_status && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="block text-[11px] text-stone-500 font-semibold uppercase">Financial Status</span>
                  <span className="font-bold text-stone-900">{profile.financial_status}</span>
                </div>
              )}
              {profile.preferred_districts && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="block text-[11px] text-stone-500 font-semibold uppercase">Preferred Places</span>
                  <span className="font-bold text-stone-900">{profile.preferred_districts}</span>
                </div>
              )}
            </div>
          </div>

          {/* Family & Guardian Background */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#4b001f] mb-2">
              Family & Guardian Background
            </h4>
            <div className="p-4 rounded-2xl bg-white border border-[#eadfe4] space-y-2">
              <p className="leading-relaxed text-stone-700">
                {profile.family_background || profile.family_details || 'Respectable family rooted in traditional Islamic values.'}
              </p>
              {profile.family_members_details && (
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-600">
                  <span className="font-semibold text-stone-700">Family Members: </span>
                  <span>{profile.family_members_details}</span>
                </div>
              )}
              {profile.marriage_expectations && (
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-600">
                  <span className="font-semibold text-stone-700">Partner Expectations: </span>
                  <span>{profile.marriage_expectations}</span>
                </div>
              )}
            </div>
          </div>

          {/* GUARDIAN CONTACT DETAILS & PRIVACY LOCK SECTION */}
          {isUnlocked ? (
            /* UNLOCKED: Mutual Interest Accepted -> Guardian Contact details revealed */
            <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/70 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                      {contactLabel} (Unlocked)
                    </span>
                    <h5 className="font-serif font-bold text-xl text-emerald-950">
                      {contactPhoneToDisplay || 'Available on request'}
                    </h5>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-2xs flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Interest Accepted · Contact Unlocked</span>
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium border-t border-emerald-200/70 pt-2 leading-relaxed">
                ✓ Proposal accepted by candidate. Guardian details ({profile.guardian_name || 'Family Guardian'} - {profile.guardian_relation || 'Parent (Guardian)'}) are unlocked for direct marriage discussion.
              </p>
            </div>
          ) : (
            /* STRICTLY HIDDEN BY DEFAULT: Contact is locked until interest is accepted */
            <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-stone-200 text-stone-600">
                    <Lock className="w-5 h-5 text-[#4b001f]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      Guardian Contact Number
                    </span>
                    <h5 className="font-mono font-bold text-lg text-stone-700 tracking-wider">
                      +91 ••••• •••••
                    </h5>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-stone-200 text-stone-700 flex items-center gap-1 shadow-2xs">
                  <Lock className="w-3 h-3 text-stone-500" />
                  <span>Hidden by Default</span>
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed border-t border-stone-200/70 pt-2">
                Guardian phone numbers are strictly protected for modesty. Guardian contact details will be automatically unlocked once your sent Interest is accepted by this candidate.
              </p>

              {/* Action Buttons to send interest or fill biodata */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                {interestStatus === 'pending' ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="px-4 py-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>Interest Sent (Awaiting Acceptance)</span>
                    </div>
                    {onCancelInterest && (
                      <button
                        type="button"
                        onClick={() => onCancelInterest(profile.id)}
                        className="px-3.5 py-2 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel Interest
                      </button>
                    )}
                  </div>
                ) : isOwnProfile ? (
                  <div className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 border border-stone-200 text-xs font-semibold">
                    This is your own profile
                  </div>
                ) : isSameGender ? (
                  <div className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 border border-stone-200 text-xs font-semibold text-center">
                    Proposals can only be exchanged between Groom and Bride profiles
                  </div>
                ) : (isUserPremium || localStorage.getItem('nikah_circle_user_is_premium') === 'true') && !hasUserBiodata ? (
                  <button
                    type="button"
                    onClick={onOpenBiodataWizard}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-white" />
                    <span>Fill Your Biodata</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const hasPrem = isUserPremium || localStorage.getItem('nikah_circle_user_is_premium') === 'true';
                      if (!hasPrem) {
                        onOpenPremium();
                      } else if (!hasUserBiodata) {
                        if (onOpenBiodataWizard) {
                          onOpenBiodataWizard();
                        } else {
                          onSendInterest(profile.id);
                        }
                      } else {
                        onSendInterest(profile.id);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#4b001f] text-white text-xs font-bold flex items-center gap-2 shadow-xs hover:bg-[#350016] transition-colors cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>Send Interest to Request Contact</span>
                  </button>
                )}
              </div>
            </div>
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
