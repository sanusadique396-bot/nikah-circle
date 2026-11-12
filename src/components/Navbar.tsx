import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Download,
  LogIn,
  LogOut,
  Sparkles,
  Heart,
  Inbox,
  Menu,
  X
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  activeView: 'home' | 'profiles' | 'shortlist' | 'interests' | 'admin';
  onNavigate: (view: 'home' | 'profiles' | 'shortlist' | 'interests' | 'admin', tab?: 'received' | 'sent') => void;
  interestsActiveTab?: 'received' | 'sent';
  currentUser: { email?: string; id?: string } | null;
  userProfile?: { full_name?: string; profile_photo?: string | null; mobile?: string | null; email?: string | null } | null;
  onEditProfile?: () => void;
  isAdmin: boolean;
  onOpenLogin: (mode?: 'member' | 'admin') => void;
  onOpenRegister: () => void;
  onOpenPremium: () => void;
  onLogout: () => void;
  savedCount: number;
  interestsCount: number;
  receivedInterestsCount?: number;
  isUserPremium?: boolean;
  isUserApproved?: boolean;
  currentPlanName?: string | null;
  onOpenBiodataWizard?: () => void;
  hasBiodataUploaded?: boolean;
}

export const Navbar: React.FC<Props> = ({
  activeView,
  onNavigate,
  interestsActiveTab = 'sent',
  currentUser,
  userProfile,
  onEditProfile,
  isAdmin,
  onOpenLogin,
  onOpenRegister,
  onOpenPremium,
  onLogout,
  savedCount,
  interestsCount,
  receivedInterestsCount = 0,
  isUserPremium = false,
  isUserApproved = false,
  currentPlanName,
  onOpenBiodataWizard,
  hasBiodataUploaded = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isInstallable, isIOS, install } = usePWAInstall();

  // Show count if there is data in either sent or receive
  const totalProposalsCount = (interestsCount || 0) + (receivedInterestsCount || 0);

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      alert('To install on iPhone/iPad:\n1. Tap the Share button in Safari\n2. Select "Add to Home Screen"');
    } else {
      alert('To install on Android/PC:\nTap the three dots (⋮) in your browser menu and select "Install App" or "Add to Home screen".');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#eadfe4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-6">
          {/* Zone 1: Logo & Brand Wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
          >
            <img
              src="/assets/aistudio/LOGO-01_fe7effc7.png"
              alt="Nikah Circle"
              className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-[#4b001f] tracking-tight leading-none group-hover:text-[#350016] transition-colors whitespace-nowrap">
                Nikah Circle
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#c9973e] mt-0.5">
                Islamic Matrimony
              </span>
            </div>
          </button>

          {/* Zone 2: Primary Navigation Tabs (Separated: Home, Profiles, Shortlist, Interests, Premium) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[#4b001f] transition-colors whitespace-nowrap cursor-pointer py-1 ${
                activeView === 'home'
                  ? 'text-[#4b001f] font-bold border-b-2 border-[#4b001f]'
                  : ''
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('profiles')}
              className={`hover:text-[#4b001f] transition-colors whitespace-nowrap cursor-pointer py-1 ${
                activeView === 'profiles'
                  ? 'text-[#4b001f] font-bold border-b-2 border-[#4b001f]'
                  : ''
              }`}
            >
              Profiles
            </button>

            <button
              onClick={() => onNavigate('shortlist')}
              className={`hover:text-[#4b001f] transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 ${
                activeView === 'shortlist'
                  ? 'text-[#4b001f] font-bold border-b-2 border-[#4b001f]'
                  : ''
              }`}
            >
              <Heart className="w-4 h-4 text-[#c9973e]" />
              <span>Shortlist ({savedCount})</span>
            </button>

            {/* Single Proposals Item in Menu Bar */}
            <button
              onClick={() => onNavigate('interests')}
              className={`hover:text-[#4b001f] transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 ${
                activeView === 'interests'
                  ? 'text-[#4b001f] font-bold border-b-2 border-[#4b001f]'
                  : ''
              }`}
              title="View sent and received proposals"
            >
              <Inbox className="w-4 h-4 text-[#c9973e]" />
              <span>Proposals</span>
              {totalProposalsCount > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-2xs ${
                  receivedInterestsCount > 0
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-[#4b001f] text-white'
                }`}>
                  {totalProposalsCount}
                </span>
              )}
            </button>

            {/* Static Non-Clickable Plan Display Badge: Strictly Premium Plan for premium users, Free Plan for free users */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold select-none pointer-events-none shadow-2xs ${
                isUserPremium
                  ? 'bg-gradient-to-r from-amber-500 via-[#c9973e] to-amber-600 text-white border border-amber-300'
                  : 'bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {isUserPremium ? (
                <Sparkles className="w-3.5 h-3.5 text-white" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-stone-400" />
              )}
              <span>{isUserPremium ? 'Premium Plan' : 'Free Plan'}</span>
            </div>
          </nav>

          {/* Zone 3: Profile Avatar & Quick Actions */}
          <div className="flex items-center gap-2 relative shrink-0">
            {/* Top Right Profile Avatar / Icon for Quick Edit */}
            {userProfile ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-[#eadfe4] bg-white hover:bg-[#fff6fa] transition-all cursor-pointer shadow-2xs group"
                  title="Click to view & edit your profile"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#4b001f] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-[#c9973e]/40 shadow-xs">
                    {userProfile.profile_photo ? (
                      <img
                        src={userProfile.profile_photo}
                        alt={userProfile.full_name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{(userProfile.full_name || 'U').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="block text-xs font-bold text-stone-800 leading-none group-hover:text-[#4b001f] truncate max-w-[100px]">
                      {userProfile.full_name?.split(' ')[0] || 'User'}
                    </span>
                    <span className={`text-[10px] font-bold block leading-tight mt-0.5 ${isUserPremium ? 'text-amber-700' : 'text-stone-500'}`}>
                      {isUserPremium ? 'Premium Member' : 'Free Plan'}
                    </span>
                  </div>
                </button>

                {/* Subtle Quick Logout Button */}
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onEditProfile}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fff6fa] border border-[#4b001f]/30 text-[#4b001f] text-xs font-bold hover:bg-[#f7dce8] transition-all cursor-pointer shadow-2xs"
                title="Create profile"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Profile</span>
              </button>
            )}

            {/* Admin Badge Shortcut if Super Admin is logged in */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#4b001f] text-white text-[11px] font-bold shadow-2xs cursor-pointer hover:bg-[#350016]"
                title="Open Admin Console"
              >
                <ShieldCheck className="w-3 h-3 text-[#c9973e]" />
                <span>Admin</span>
              </button>
            )}

            {/* Mobile / Tablet Static Plan Badge (Non-clickable) */}
            <div
              className={`md:hidden flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold select-none pointer-events-none ${
                isUserPremium
                  ? 'bg-gradient-to-r from-amber-500 to-[#c9973e] text-white'
                  : 'bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#c9973e]" />
              <span>{isUserPremium ? 'Premium Plan' : 'Free Plan'}</span>
            </div>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#eadfe4] px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-[#fff6fa] rounded-lg"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('profiles');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-[#fff6fa] rounded-lg"
          >
            Profiles
          </button>
          <button
            onClick={() => {
              onNavigate('shortlist');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-[#fff6fa] rounded-lg flex items-center justify-between"
          >
            <span>Shortlist</span>
            <span className="px-2 py-0.5 text-xs bg-[#f7dce8] text-[#4b001f] rounded-full font-bold">
              {savedCount}
            </span>
          </button>
          <button
            onClick={() => {
              onNavigate('interests');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-[#fff6fa] rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#c9973e]" />
              <span>Proposals</span>
            </div>
            {totalProposalsCount > 0 && (
              <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                receivedInterestsCount > 0 ? 'bg-emerald-600 text-white animate-pulse' : 'bg-[#4b001f] text-white'
              }`}>
                {totalProposalsCount}
              </span>
            )}
          </button>
          <div
            className={`w-full px-3 py-2 text-sm font-bold rounded-lg flex items-center justify-between select-none ${
              isUserPremium
                ? 'bg-[#fff6fa] text-[#946b17] border border-[#eadfe4]'
                : 'bg-stone-50 text-stone-700 border border-stone-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {isUserPremium ? (
                <Sparkles className="w-4 h-4 text-[#c9973e]" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-stone-400" />
              )}
              <span>Plan: {isUserPremium ? 'Premium Plan' : 'Free Plan'}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
