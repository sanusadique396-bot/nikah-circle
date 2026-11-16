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
  const [downloading, setDownloading] = useState(false);

  // If already running in standalone PWA mode and variant is banner, dismiss banner
  if (isInstalled && variant === 'banner') {
    return null;
  }

  const triggerApkDownload = () => {
    setDownloading(true);
    const link = document.createElement('a');
    link.href = '/NikahCircle.apk';
    link.download = 'NikahCircle.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 3500);
  };

  const handleInstallClick = async (e?: React.MouseEvent) => {
    if (isIOS) {
      if (e) e.preventDefault();
      setShowIOSModal(true);
      return;
    }

    // Direct APK download for Android & desktop devices
    triggerApkDownload();
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
              <a
                href="/NikahCircle.apk"
                download="NikahCircle.apk"
                onClick={(e) => handleInstallClick(e)}
                className="bg-[#c9973e] hover:bg-[#dfb25d] text-[#350016] px-3 py-1 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm cursor-pointer"
              >
                {downloading ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-[#350016] animate-pulse" />
                    <span>Downloading APK...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Install App</span>
                  </>
                )}
              </a>
              <button
                onClick={() => setDismissedBanner(true)}
                className="text-stone-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
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
      <a
        href="/NikahCircle.apk"
        download="NikahCircle.apk"
        onClick={(e) => handleInstallClick(e)}
        title="Download Nikah Circle Android APK (146 KB)"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f7dce8] text-[#4b001f] hover:bg-[#ead0dd] border border-[#eadfe4] transition-all cursor-pointer whitespace-nowrap shadow-sm w-fit"
      >
        {downloading ? (
          <>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
            <span className="text-emerald-950 font-bold">Downloading APK...</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5 text-[#4b001f]" />
            <span>Install App</span>
          </>
        )}
      </a>

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
                    <p className="font-semibold text-stone-900">Download APK</p>
                    <p className="text-stone-500 mt-0.5">Click below to download the official Nikah Circle Android APK (146 KB).</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#4b001f] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Tap to Install</p>
                    <p className="text-stone-500 mt-0.5">Tap the downloaded notification or open your Downloads folder to install.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-500">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Official Nikah Circle Android APK. Safe, verified & fast.</span>
          </div>
        </div>

        <div className="space-y-2">
          <a
            href="/NikahCircle.apk"
            download="NikahCircle.apk"
            onClick={onClose}
            className="w-full rounded-xl bg-[#4b001f] hover:bg-[#350016] text-white py-2.5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-[#dfb25d]" />
            <span>Download Nikah Circle APK (146 KB)</span>
          </a>
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 py-2 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
