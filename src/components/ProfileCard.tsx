import React, { useState } from 'react';
import { Profile, normalizeGender } from '../types';
import { MapPin, Heart, ShieldCheck, Eye, EyeOff, UserCheck, Lock, Clock, FileText } from 'lucide-react';

interface Props {
  profile: Profile;
  onView: (profile: Profile) => void;
  onSendInterest: (profileId: string) => void;
  onCancelInterest?: (profileId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (profileId: string) => void;
  interestStatus?: 'pending' | 'accepted' | 'declined' | null;
  isUserPremium: boolean;
  onOpenPremium: () => void;
  currentUserGender?: 'Male' | 'Female' | null;
  currentUserId?: string | null;
  currentUserMobile?: string | null;
  onOppositeGenderRequired?: (genderNeeded: string) => void;
  hasUserBiodata?: boolean;
  onOpenBiodataWizard?: () => void;
}

export const ProfileCard: React.FC<Props> = ({
  profile,
  onView,
  onSendInterest,
  onCancelInterest,
  isBookmarked,
  onToggleBookmark,
  interestStatus,
  isUserPremium,
  onOpenPremium,
  currentUserGender,
  currentUserId,
  currentUserMobile,
  onOppositeGenderRequired,
  hasUserBiodata = false,
  onOpenBiodataWizard,
}) => {
  // Strict Privacy Rule: Guardian contact is revealed ONLY when interest is accepted
  const isUnlocked = interestStatus === 'accepted';
  const [photoBlurred, setPhotoBlurred] = useState(false);

  const age = profile.age || (profile.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : 26);

  // Check if own profile or same gender
  const isOwnProfile = Boolean(
    (currentUserId && profile.id === currentUserId) ||
    (currentUserMobile && profile.mobile && profile.mobile.replace(/\D/g, '').slice(-8) === currentUserMobile.replace(/\D/g, '').slice(-8))
  );

  const normUserGender = currentUserGender ? normalizeGender(currentUserGender) : null;
  const normProfileGender = normalizeGender(profile.gender);

  const isSameGender = Boolean(
    normUserGender && normProfileGender === normUserGender
  );

  const handleInterestClick = () => {
    const hasPremium = isUserPremium || localStorage.getItem('nikah_circle_user_is_premium') === 'true';
    if (!hasPremium) {
      onOpenPremium();
      return;
    }
    if (isSameGender) {
      const needed = normUserGender === 'Female' ? 'Groom (Male)' : 'Bride (Female)';
      onOppositeGenderRequired?.(needed);
      return;
    }
    if (!hasUserBiodata) {
      if (onOpenBiodataWizard) {
        onOpenBiodataWizard();
      }
      return;
    }
    onSendInterest(profile.id);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#eadfe4] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Photo Header */}
      <div className="relative h-64 bg-[#fff6fa] overflow-hidden select-none">
        {profile.profile_photo ? (
          <img
            src={profile.profile_photo}
            alt={profile.full_name}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-all duration-300 ${
              photoBlurred ? 'blur-md scale-105' : 'blur-none'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#4b001f] bg-gradient-to-tr from-[#f7dce8] to-[#fff6fa]">
            <span className="text-4xl font-serif">♡</span>
            <span className="text-xs font-semibold text-stone-500 mt-2">
              Modest Profile
            </span>
          </div>
        )}

        {/* Top-Left: Unique Member ID Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="font-mono text-[11px] font-bold bg-[#4b001f]/95 backdrop-blur-xs text-amber-200 border border-amber-400/40 px-2.5 py-1 rounded-lg shadow-xs tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{profile.member_id || (profile.id?.startsWith('NCSM') ? profile.id : `NCSM${profile.id?.replace(/\D/g, '').slice(-4) || '1001'}`)}</span>
          </span>
        </div>

        {/* Top Right: Admin Verified Badge & Photo Privacy / Shortlist */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {(profile.profile_status === 'APPROVED' || profile.is_verified) && (
            <span className="flex items-center gap-1 bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Admin Verified</span>
            </span>
          )}

          {profile.profile_photo && (
            <button
              onClick={() => setPhotoBlurred(!photoBlurred)}
              title={photoBlurred ? "Unblur photo" : "Blur photo for modesty"}
              className="p-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-stone-700 hover:text-[#4b001f] shadow-xs transition-colors cursor-pointer"
            >
              {photoBlurred ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={() => onToggleBookmark(profile.id)}
            title={isBookmarked ? "Remove from shortlist" : "Add to shortlist"}
            className="p-1.5 rounded-lg bg-white/90 backdrop-blur-xs text-stone-700 hover:text-[#4b001f] shadow-xs transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isBookmarked ? 'fill-[#4b001f] text-[#4b001f]' : 'text-stone-600'
              }`}
            />
          </button>
        </div>

        {/* Gradient Scrim */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        <div className="absolute bottom-2.5 left-3 text-white text-xs font-semibold drop-shadow-sm flex items-center gap-2">
          <span>{age} yrs</span>
          <span>·</span>
          <span>{normProfileGender}</span>
          {isUnlocked ? (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/80 text-[10px] text-white font-bold ml-1">
              Contact Unlocked
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-stone-200 flex items-center gap-1 ml-1">
              <Lock className="w-2.5 h-2.5" />
              <span>Contact Hidden</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#4b001f] tracking-tight truncate">
            {profile.full_name}
          </h3>

          <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{profile.location || 'Kerala, India'}</span>
          </div>

          {/* Unboxed metadata */}
          <div className="mt-3 text-xs text-stone-600 space-y-1">
            <div className="truncate font-medium text-stone-800">
              {profile.profession || 'Professional'}
            </div>
            <div className="text-[11px] text-stone-500 truncate">
              <span>{profile.education || 'Graduate'}</span>
              <span className="mx-1.5 text-stone-300">·</span>
              <span>{profile.marital_status}</span>
            </div>
          </div>

          {/* Status Note on Guardian Contact Privacy */}
          <div className="mt-2.5 pt-2 border-t border-stone-100 text-[11px]">
            {isUnlocked ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Interest Accepted · Guardian Contact Unlocked</span>
              </span>
            ) : interestStatus === 'pending' ? (
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Interest Sent · Waiting for acceptance</span>
              </span>
            ) : (
              <span className="text-stone-500 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>Guardian contact hidden until interest accepted</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
          <button
            onClick={() => onView(profile)}
            className="flex-1 py-2 px-2.5 rounded-xl border border-[#4b001f] text-[#4b001f] hover:bg-[#fff6fa] text-xs font-bold transition-colors cursor-pointer text-center"
          >
            View Profile & Bio
          </button>

          {isUnlocked ? (
            <button
              onClick={() => onView(profile)}
              className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Contact Guardian</span>
            </button>
          ) : isOwnProfile ? (
            <div className="flex-1 py-2 px-2 rounded-xl bg-stone-100 text-stone-600 border border-stone-200 text-xs font-semibold text-center select-none">
              Your Profile
            </div>
          ) : isSameGender ? (
            <button
              type="button"
              onClick={() => {
                const needed = normUserGender === 'Female' ? 'Groom (Male)' : 'Bride (Female)';
                onOppositeGenderRequired?.(needed);
              }}
              className="flex-1 py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 text-xs font-semibold text-center cursor-pointer transition-colors"
              title={`Proposals are exchanged between opposite gender only (${normUserGender === 'Female' ? 'Male' : 'Female'})`}
            >
              {normProfileGender === 'Female' ? 'Bride Profile' : 'Groom Profile'}
            </button>
          ) : interestStatus === 'pending' ? (
            <div className="flex-1 flex items-center gap-1.5">
              <div className="flex-1 py-2 px-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold text-center truncate">
                Sent ⏳
              </div>
              <button
                type="button"
                onClick={() => onCancelInterest?.(profile.id)}
                className="py-2 px-2.5 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer shrink-0"
                title="Cancel Interest"
              >
                Cancel
              </button>
            </div>
          ) : (isUserPremium || localStorage.getItem('nikah_circle_user_is_premium') === 'true') && !hasUserBiodata ? (
            <button
              type="button"
              onClick={onOpenBiodataWizard}
              className="flex-1 py-2 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              title="You must complete your biodata before sending interests"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>Fill Your Biodata</span>
            </button>
          ) : (
            <button
              onClick={handleInterestClick}
              className="flex-1 py-2 px-2.5 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 text-[#c9973e]" />
              <span>Send Interest</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
