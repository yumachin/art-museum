import React, { useEffect, useState } from 'react';
import type { Language } from '../types';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallPromptProps {
  language: Language;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ language }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // 多言語テキスト
  const texts = {
    en: {
      title: 'Install Art Museum',
      description: 'Install our app for a better experience. Access offline and get quick launch from your home screen.',
      install: 'Install',
      notNow: 'Not Now',
      close: 'Close'
    },
    ja: {
      title: 'アートミュージアムをインストール',
      description: 'アプリをインストールすると、オフラインでも閲覧でき、ホーム画面から素早く起動できます。',
      install: 'インストール',
      notNow: '後で',
      close: '閉じる'
    }
  };

  const t = texts[language];

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-museum-900 border border-museum-700 rounded-lg shadow-2xl p-4 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-museum-gold rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-museum-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className={`text-museum-ivory text-sm font-bold mb-1 ${language === 'ja' ? 'font-serif' : 'font-display'}`}>
              {t.title}
            </h3>
            <p className={`text-museum-muted text-xs mb-3 leading-relaxed ${language === 'ja' ? 'font-serif' : 'font-sans'}`}>
              {t.description}
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-museum-gold text-museum-950 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors"
              >
                {t.install}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-museum-muted hover:text-museum-ivory text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {t.notNow}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-museum-muted hover:text-museum-ivory transition-colors flex-shrink-0"
            aria-label={t.close}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
