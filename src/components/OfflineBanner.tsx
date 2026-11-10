import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-[#4b001f] text-white px-4 py-2.5 text-xs font-medium shadow-2xl border border-[#c9973e]/40 animate-bounce"
    >
      <WifiOff className="w-4 h-4 text-[#c9973e]" />
      <span>Offline Mode — Cached profiles & data are active</span>
    </div>
  );
};
