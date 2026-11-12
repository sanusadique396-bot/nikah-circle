import React from 'react';
import { ShieldCheck, Lock, Heart, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  onBrowseClick: () => void;
  onExplorePremium: () => void;
  onRegisterClick: () => void;
  memberId?: string;
}

export const Hero: React.FC<Props> = ({
  onBrowseClick,
  onExplorePremium,
  onRegisterClick,
  memberId,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff6fa] via-white to-stone-50 pt-12 pb-20 border-b border-[#eadfe4]">
      {/* Decorative Islamic Geometric Pattern / Ambient Radial Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f7dce8]/50 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c9973e]/10 rounded-full blur-3xl pointer-events-none -ml-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Proposition and Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f7dce8] text-[#4b001f] text-xs font-bold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4b001f]" />
              <span>TRUSTED ISLAMIC MATRIMONY PLATFORM</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#4b001f] leading-[1.1] tracking-tight">
              Find Your Life Partner <br />
              <span className="text-[#c9973e] italic">with Trust & Modesty.</span>
            </h1>

            <p className="text-stone-600 text-base sm:text-lg max-w-2xl leading-relaxed">
              A dignified matrimonial sanctuary built on Islamic values, verified biodata,
              and strict privacy controls. Designed for families and prospective brides and grooms
              in Kerala and the worldwide community.
            </p>

            {/* Arabic Quranic Verse Callout */}
            <div className="py-3 px-4 rounded-xl bg-white/80 border border-[#eadfe4] shadow-xs max-w-xl mx-auto lg:mx-0">
              <p className="font-arabic text-right text-lg text-[#4b001f] leading-loose">
                وَخَلَقْنَاكُمْ أَزْوَاجًا
              </p>
              <p className="text-xs text-stone-500 italic mt-0.5">
                "And We created you in pairs" — Surah An-Naba (78:8)
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onBrowseClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Find Your Match</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-[#fff6fa] text-[#4b001f] border border-[#4b001f] font-bold text-sm transition-all cursor-pointer shadow-xs"
              >
                Register Your Profile
              </button>

              <button
                onClick={onExplorePremium}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#f7dce8] hover:bg-[#ead0dd] text-[#4b001f] font-semibold text-sm transition-all cursor-pointer"
              >
                Explore Premium
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-600 font-medium border-t border-[#eadfe4]/60">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Verified Profiles</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#4b001f]" />
                <span>Modest Photo Privacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#c9973e]" />
                <span>Family & Guardian Facilitated</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Official Logo Asset */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background Halo */}
            <div className="w-72 h-72 sm:w-84 sm:h-84 rounded-full bg-gradient-to-tr from-[#f7dce8] to-[#fff6fa] border border-[#eadfe4] absolute -z-0 shadow-inner" />

            {/* Main Showcase Card Container with Prominent Top-Left Member ID and Top-Right Admin Verified */}
            <div className="relative z-10 w-full max-w-sm">
              {/* Top-Left: Unique Member ID Badge */}
              <div className="absolute -top-3.5 left-3 sm:left-4 bg-[#4b001f] text-white py-1.5 px-3.5 rounded-xl border border-amber-400/50 shadow-md text-xs font-mono font-bold flex items-center gap-2 z-20 animate-fade-in tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{memberId || 'NCSM1001'}</span>
              </div>

              {/* Top-Right: Admin Verified Badge */}
              <div className="absolute -top-3.5 right-3 sm:right-4 bg-white/95 backdrop-blur-xs py-1.5 px-3.5 rounded-xl border border-[#eadfe4] shadow-md text-xs font-bold text-[#4b001f] flex items-center gap-1.5 z-20 animate-fade-in">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Admin Verified</span>
              </div>

              {/* Bottom: 100% Privacy & Halal Trust Pill */}
              <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs py-1.5 px-4 rounded-xl border border-[#eadfe4] shadow-md text-xs font-bold text-[#4b001f] flex items-center gap-1.5 z-20 animate-fade-in whitespace-nowrap">
                <Lock className="w-4 h-4 text-[#c9973e]" />
                <span>100% Privacy & Halal</span>
              </div>

              {/* Main Showcase Card Box */}
              <div className="w-full bg-white rounded-3xl p-6 pt-7 shadow-xl border border-[#eadfe4] text-center space-y-4">
                <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-[#f7dce8] p-1 bg-[#4b001f]">
                  <img
                    src="/assets/aistudio/LOGO-01_fe7effc7.png"
                    alt="Nikah Circle Symbol"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#4b001f]">
                    Nikah Circle
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Connecting pious hearts across Kerala & GCC
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-left">
                  <div className="p-3 rounded-xl bg-[#fff6fa] border border-[#eadfe4]">
                    <span className="block text-xl font-bold text-[#4b001f] tabular-nums font-serif">
                      12,500+
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Verified Members
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fff6fa] border border-[#eadfe4]">
                    <span className="block text-xl font-bold text-[#c9973e] tabular-nums font-serif">
                      3,800+
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Happy Marriages
                    </span>
                  </div>
                </div>

                <button
                  onClick={onBrowseClick}
                  className="w-full py-2.5 rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Browse Active Profiles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
