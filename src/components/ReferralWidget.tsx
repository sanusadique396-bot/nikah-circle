import React, { useState } from 'react';
import { Gift, Copy, Check, Share2, Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
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

  const progressPercent = Math.min(100, Math.round((referralStatus.currentProgress / 3) * 100));

  return (
    <div className="w-full bg-gradient-to-br from-white via-[#fff8fb] to-[#fff0f6] rounded-3xl p-5 border-2 border-amber-300/80 shadow-md text-left space-y-3.5 relative overflow-hidden">
      {/* Decorative ambient badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f7dce8] text-[#4b001f] text-[11px] font-bold tracking-wide">
          <Gift className="w-3.5 h-3.5 text-[#4b001f]" />
          <span>REFERRAL REWARD</span>
        </div>

        {referralStatus.isRewardActive ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 animate-pulse">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Active: {referralStatus.daysRemaining}d left</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>1 Week Free</span>
          </span>
        )}
      </div>

      {/* Headline & Description */}
      <div>
        <h4 className="font-serif text-lg font-bold text-[#4b001f] leading-snug">
          Share App & Get 1 Week Premium
        </h4>
        <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
          Invite 3 friends to join Nikah Circle. Automatically unlocks 7 days of full Premium Access to publish your biodata and send proposal interests!
        </p>
      </div>

      {/* Progress Bar & Counter (3-step cycle) */}
      <div className="bg-white/90 p-3.5 rounded-2xl border border-stone-200/80 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-stone-700 flex items-center gap-1.5">
            <span>Referrals Progress</span>
            {referralStatus.claimedCycles > 0 && (
              <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                Cycle {referralStatus.claimedCycles + 1}
              </span>
            )}
          </span>
          <span className="text-[#4b001f] font-mono text-sm">
            {referralStatus.currentProgress} / 3
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-[#c9973e] to-[#4b001f] rounded-full transition-all duration-500"
            style={{ width: `${Math.max(6, progressPercent)}%` }}
          />
        </div>

        {/* Progress Status Message */}
        <p className="text-[11px] text-stone-500 flex items-center justify-between pt-0.5">
          {referralStatus.isRewardActive ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Reward Active ({referralStatus.daysRemaining} days left)</span>
            </span>
          ) : referralStatus.currentProgress === 0 ? (
            <span>Invite 3 new friends to unlock 1 week premium</span>
          ) : (
            <span className="text-[#4b001f] font-semibold">
              Only {referralStatus.neededForReward} more referral{referralStatus.neededForReward > 1 ? 's' : ''} to unlock!
            </span>
          )}
          <span className="text-stone-400">Total: {referralStatus.totalReferrals}</span>
        </p>
      </div>

      {/* Action Buttons */}
      {isLoggedIn ? (
        <div className="space-y-2 pt-0.5">
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

          <div className="text-[10px] text-stone-500 text-center font-mono truncate">
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
