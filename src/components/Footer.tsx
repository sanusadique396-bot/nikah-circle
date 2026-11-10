import React from 'react';
import { Heart, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';
import { PWAInstallPrompt } from './PWAInstallPrompt';

interface Props {
  onNavigateAdmin: () => void;
  onOpenPremium: () => void;
  onOpenRegister: () => void;
}

export const Footer: React.FC<Props> = ({
  onNavigateAdmin,
  onOpenPremium,
  onOpenRegister,
}) => {
  return (
    <footer className="bg-[#350016] text-white pt-14 pb-8 border-t border-[#4b001f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/LOGO-01_fe7effc7.png"
                alt="Nikah Circle"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="font-serif font-bold text-2xl text-white tracking-tight">
                Nikah Circle
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              A trusted, verified Islamic matrimony platform helping individuals and families find compatible life partners with privacy, mutual respect, and ethical values.
            </p>
            <div className="pt-2">
              <PWAInstallPrompt variant="nav" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#c9973e] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <a href="#profiles" className="hover:text-white transition-colors">
                  Featured Profiles
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenRegister}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Register Profile Free
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPremium}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Premium Packages
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#c9973e] uppercase tracking-wider">
              Modesty & Rules
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>100% Halal Privacy Policy</li>
              <li>Photo Purdah / Blur Feature</li>
              <li>Wali / Guardian Facilitation</li>
              <li>Anti-Harassment Protocols</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#c9973e] uppercase tracking-wider">
              Helpline & Office
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c9973e] shrink-0" />
                <span>nikahcircle01@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c9973e] shrink-0" />
                <span>Kerala, India & GCC</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={onNavigateAdmin}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#c9973e] hover:text-[#dfb25d] transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Management Console</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© 2026 Nikah Circle. All Rights Reserved.</p>
          <p className="font-arabic text-stone-300 text-sm">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      </div>
    </footer>
  );
};
