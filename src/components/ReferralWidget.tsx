import React, { useState } from 'react';
import { Gift, Copy, Check, Share2, Sparkles, UserPlus, Crown, ArrowRight, ShieldCheck } from 'lucide-react';
import { ReferralStatus, getWhatsAppShareUrl } from '../lib/referral';

interface Props {
  referralStatus: ReferralStatus;
  isLoggedIn: boolean;
  onOpenCreateProfile?: () => void;
  onToast?: (msg: string) => void;
}

export const ReferralWidget: React.FC<Props> = ({
  referralStatus,
  isLoggedIn,
  onOpenCreateProfile,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(referralStatus.referralUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = referralStatus.referralUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      onToast?.('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onToast?.('Unable to copy link.');
    }
  };

  const handleWhatsAppShare = () => {
    const url = getWhatsAppShareUrl(referralStatus.referralUrl, referralStatus.referralCode);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const premiumPercent = Math.min(100, Math.round((referralStatus.premiumProgress / 3) * 100));

  return (
    <div className="w-full bg-gradient-to-br from-white via-[#fff8fb] to-[#fff0f6] rounded-3xl p-5 border-2 border-amber-300/80 shadow-md text-left space-y-4 relative overflow-hidden">
      {/* Top Header & Active Status Badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f7dce8] text-[#4b001f] text-[11px] font-bold tracking-wide">
          <Gift className="w-3.5 h-3.5 text-[#4b001f]" />
          <span>REFERRAL REWARDS</span>
        </div>

        {referralStatus.isRewardActive ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 animate-pulse">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Active: {referralStatus.daysRemaining}d left</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>1 Week & 1 Month Free</span>
          </span>
        )}
      </div>

      {/* Main Title & Subtitle */}
      <div>
        <h4 className="font-serif text-lg font-bold text-[#4b001f] leading-snug">
          Share App & Earn Free Premium
        </h4>
        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
          Invite friends & family using your unique referral link to unlock full Premium features at zero cost:
        </p>
      </div>

      {/* Reward Rules Cards */}
      <div className="space-y-2.5">
        {/* RULE 1 CARD: 1 Referral Profile Creation = 1 Week Free */}
        <div className="bg-white/95 p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#4b001f] flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-[#c9973e]" />
              <span>1 Friend Creates Profile</span>
            </span>
            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">
              1 Week Free (7 Days)
            </span>
          </div>

          <p className="text-[11px] text-stone-600 leading-relaxed">
            ഒരാൾക്ക് ഷെയർ ചെയ്താൽ മതി! ഷെയർ ചെയ്യപ്പെട്ട ആൾ ലിങ്കിൽ കയറി പ്രൊഫൈൽ ക്രിയേറ്റ് ചെയ്താൽ ഉടൻ <strong>1 ആഴ്ച ഫ്രീ പ്രീമിയം</strong> ലഭിക്കും.
          </p>

          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
            <span>
              Friends Joined: <strong className="text-[#4b001f] font-mono">{referralStatus.totalReferrals}</strong>
            </span>
            {referralStatus.totalReferrals > 0 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>{referralStatus.totalReferrals * 7} Days Premium Earned!</span>
              </span>
            ) : (
              <span className="text-stone-400">Invite 1 friend to start</span>
            )}
          </div>
        </div>

        {/* RULE 2 CARD: 3 Friends Take Premium = 1 Month Free */}
        <div className="bg-white/95 p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#4b001f] flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#c9973e]" />
              <span>3 Friends Take Premium</span>
            </span>
            <span className="text-[11px] font-extrabold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">
              1 Month Free (30 Days)
            </span>
          </div>

          <p className="text-[11px] text-stone-600 leading-relaxed">
            താങ്കളുടെ ലിങ്ക് വഴി കയറിയ 3 പേർ പ്രീമിയം എടുത്താൽ <strong>ഒരു മാസത്തെ (30 Days) ഫ്രീ പ്രീമിയം</strong> ലഭിക്കും.
          </p>

          {/* Progress Bar for 3 Premium Subscribers */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-stone-600">Premium Referrals Progress</span>
              <span className="text-[#4b001f] font-mono">
                {referralStatus.premiumProgress} / 3
              </span>
            </div>

            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-[#c9973e] to-[#4b001f] rounded-full transition-all duration-500"
                style={{ width: `${Math.max(6, premiumPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-500 pt-0.5">
              <span>
                {referralStatus.premiumProgress === 0 && referralStatus.premiumReferralsCount === 0
                  ? '3 friends taking premium unlocks 1 month'
                  : referralStatus.premiumProgress === 0
                  ? '🎉 1 Month Reward unlocked! Next cycle:'
                  : `Only ${referralStatus.premiumNeeded} more friend${referralStatus.premiumNeeded > 1 ? 's' : ''} to upgrade!`}
              </span>
              <span className="text-stone-400">Total Upgraded: {referralStatus.premiumReferralsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isLoggedIn ? (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border shadow-2xs ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-[#fff6fa] text-[#4b001f] border-[#4b001f]/30'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-[#c9973e]" />}
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>

            {/* Share on WhatsApp Button */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Share2 className="w-4 h-4 text-emerald-100" />
              <span>Share WhatsApp</span>
            </button>
          </div>

          <div className="text-[10px] text-stone-500 text-center font-mono truncate px-1">
            Your Link: <span className="text-stone-700">{referralStatus.referralUrl}</span>
          </div>
        </div>
      ) : (
        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenCreateProfile}
            className="w-full py-2.5 px-4 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Create Profile to Get Referral Link</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
