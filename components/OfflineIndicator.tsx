import React, { useEffect, useState } from 'react';
import type { Language } from '../types';

interface OfflineIndicatorProps {
  language: Language;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const texts = {
    en: {
      offline: "You're offline. Viewing cached content."
    },
    ja: {
      offline: 'オフラインです。キャッシュを使用します。'
    }
  };

  const t = texts[language];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-900/95 backdrop-blur-sm border-b border-amber-700 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8 flex items-center justify-center gap-4">
        <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
        </svg>
        <span className="text-xs md:text-sm text-amber-100 font-medium font-serif">
          {t.offline}
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
