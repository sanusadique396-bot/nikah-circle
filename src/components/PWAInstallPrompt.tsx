import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle } from 'lucide-react';

interface Props {
  variant?: 'nav' | 'banner' | 'card';
}

export const PWAInstallPrompt: React.FC<Props> = ({ variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // If already running in standalone PWA mode, don't show prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General instructions for desktop/Android if beforeinstallprompt not fired yet
      setShowIOSModal(true);
    }
  };

  if (variant === 'banner' && !dismissedBanner) {
    return (
      <>
        <div className="bg-gradient-to-r from-[#4b001f] via-[#350016] to-[#4b001f] text-white py-2.5 px-4 text-xs font-medium border-b border-[#c9973e]/30 shadow-sm relative z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 truncate">
              <span className="p-1 rounded bg-[#c9973e]/20 text-[#c9973e] shrink-0">
                <Smartphone className="w-4 h-4" />
              </span>
              <span className="truncate">
                Install <strong>Nikah Circle</strong> on your phone for instant match alerts & offline access
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="bg-[#c9973e] hover:bg-[#dfb25d] text-[#350016] px-3 py-1 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
              <button
                onClick={() => setDismissedBanner(true)}
                className="text-stone-300 hover:text-white p-1 rounded-md transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Instructions Modal */}
        {showIOSModal && (
          <InstallInstructionsModal
            isIOS={isIOS}
            onClose={() => setShowIOSModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Install Progressive Web App on your device"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f7dce8] text-[#4b001f] hover:bg-[#ead0dd] border border-[#eadfe4] transition-all cursor-pointer whitespace-nowrap shadow-sm"
      >
        <Download className="w-3.5 h-3.5 text-[#4b001f]" />
        <span>Install App</span>
      </button>

      {showIOSModal && (
        <InstallInstructionsModal
          isIOS={isIOS}
          onClose={() => setShowIOSModal(false)}
        />
      )}
    </>
  );
};

interface ModalProps {
  isIOS: boolean;
  onClose: () => void;
}

const InstallInstructionsModal: React.FC<ModalProps> = ({ isIOS, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/LOGO-01_fe7effc7.png"
              alt="Nikah Circle"
              className="w-8 h-8 rounded-lg object-cover shadow-xs"
            />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#4b001f]">
                Install Nikah Circle PWA
              </h3>
              <p className="text-xs text-stone-500">Fast, secure & works offline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-3.5 text-xs text-stone-700">
          {isIOS ? (
            <>
              <div className="p-3 rounded-xl bg-[#fff6fa] border border-[#eadfe4] space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#4b001f] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Tap the Share button</p>
                    <p className="text-stone-500 mt-0.5 flex items-center gap-1">
                      Located at the bottom Safari navigation bar <Share2 className="w-3.5 h-3.5 text-blue-600 inline" />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#4b001f] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Scroll & Select "Add to Home Screen"</p>
                    <p className="text-stone-500 mt-0.5 flex items-center gap-1">
                      Look for <PlusSquare className="w-3.5 h-3.5 text-stone-700 inline" /> in the action menu
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#4b001f] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Tap "Add" at the top right</p>
                    <p className="text-stone-500 mt-0.5">Nikah Circle will appear instantly on your home screen!</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-[#fff6fa] border border-[#eadfe4] space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#4b001f] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Open Browser Menu</p>
                    <p className="text-stone-500 mt-0.5">Tap the three vertical dots (⋮) in Chrome or Edge address bar.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#4b001f] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Select "Install App" or "Add to Home Screen"</p>
                    <p className="text-stone-500 mt-0.5">Confirm to download the lightweight app without an app store account.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-500">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Takes under 2MB of storage and updates automatically in the background.</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white py-2.5 text-xs font-bold transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
