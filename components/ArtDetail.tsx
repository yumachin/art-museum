import React, { useEffect, useState } from 'react';
import { Artwork, ArtworkDetail, Language, Translations } from '../types';
import { fetchArtworkDetails, isGeminiRateLimitError } from '../services/geminiService';
import { IconArrowLeft, IconSparkles, IconMaximize } from './Icons';
import ImageViewer from './ImageViewer';

interface ArtDetailProps {
  artwork: Artwork;
  onBack: () => void;
  language: Language;
  texts: Translations;
}

const ArtDetail: React.FC<ArtDetailProps> = ({ artwork, onBack, language, texts }) => {
  const [details, setDetails] = useState<ArtworkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<'none' | 'rate_limit' | 'unknown'>('none');
  const [retryKey, setRetryKey] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const displayTitle = artwork.title;
  const displayArtist = artwork.artist;
  const displayPeriod = artwork.period;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setLoadError('none');
      try {
        const enriched = await fetchArtworkDetails(artwork, language);
        setDetails(enriched);
        if (!enriched) setLoadError('unknown');
      } catch (error) {
        setDetails(null);
        setLoadError(isGeminiRateLimitError(error) ? 'rate_limit' : 'unknown');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [artwork.id, language, retryKey]);

  return (
    <div className="relative min-h-screen bg-museum-950 text-museum-ivory animate-fade-in">
      
      <ImageViewer 
        src={artwork.thumbnailUrl} 
        alt={displayTitle} 
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />

      <div className="fixed top-0 left-0 w-full z-50 pt-safe-top px-safe-x pb-4 md:pb-6 bg-gradient-to-b from-museum-950/90 via-museum-950/60 to-transparent pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 text-museum-ivory/60 hover:text-museum-gold transition-colors duration-300 uppercase tracking-widest text-xs font-bold font-serif backdrop-blur-md bg-museum-950/50 px-3 py-2 rounded-full border border-white/10 touch-manipulation"
        >
          <IconArrowLeft className="w-4 h-4" />
          {texts.returnGallery}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen sticky top-0 bg-museum-900 flex items-center justify-center overflow-hidden border-r border-museum-800 group">
           <div 
             className="relative w-full h-full cursor-zoom-in"
             onClick={() => setIsViewerOpen(true)}
           >
             <img 
               src={artwork.thumbnailUrl} 
               alt={displayTitle}
               className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
             />
             <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none"></div>
             
             <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20">
               <IconMaximize className="w-5 h-5" />
             </div>
           </div>
        </div>

        <div className="w-full lg:w-1/2 p-8 lg:p-24 flex flex-col justify-center bg-museum-950">
          <div className="max-w-2xl mr-auto">
            <div className="mb-2 md:mb-12 border-b border-museum-800 pb-6 md:pb-8">
              <span className="block font-serif text-museum-gold uppercase tracking-[0.2em] text-sm mb-4">
                {displayPeriod} • {artwork.year} • {texts.fameLevel} Lv.{artwork.level}
              </span>
              <h1 className={`${displayTitle.length >= 24 ? "text-xs" : displayTitle.length >= 21 ? "text-sm" : displayTitle.length >= 19 ? "text-md" : displayTitle.length >= 14 ? "text-xl" : displayTitle.length >= 11 ? "text-2xl" : displayTitle.length >= 8 ? "text-3xl" : "text-4xl"} lg:text-6xl leading-tight mb-4 text-museum-ivory ${language === 'ja' ? 'font-serif' : 'font-display'}`}>
                {displayTitle}
              </h1>
              <h2 className={`${displayArtist.length >= 19 ? "text-xs" : displayArtist.length >= 14 ? "text-sm" : displayArtist.length >= 11 ? "text-md" : displayArtist.length >= 8 ? "text-lg" : "text-xl"} font-serif italic text-museum-muted`}>{displayArtist}</h2>
            </div>

            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="flex items-center gap-2 text-museum-gold mt-4 md:mt-8">
                   <IconSparkles className="w-5 h-5 animate-spin" />
                   <span className="text-sm font-sans tracking-widest">{texts.analyzing}</span>
                </div>
                <div className="h-4 bg-museum-800 w-full rounded"></div>
                <div className="h-4 bg-museum-800 w-5/6 rounded"></div>
                <div className="h-4 bg-museum-800 w-4/6 rounded"></div>
              </div>
            ) : details ? (
              <div className={`space-y-12 mb-12 md:mb-8 font-serif text-lg leading-relaxed text-museum-ivory/90 ${language === 'ja' ? 'tracking-wide' : ''}`}>
                
                <section>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-museum-gold my-4 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-museum-gold inline-block"></span>
                    {texts.visualDesc}
                  </h3>
                  <p className='text-sm md:text-base'>{details.fullDescription}</p>
                </section>

                <section>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-museum-gold mb-4 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-museum-gold inline-block"></span>
                    {texts.techAnalysis}
                  </h3>
                  <p className='text-sm md:text-base'>{details.technicalAnalysis}</p>
                </section>

                <section>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-museum-gold mb-4 flex items-center gap-2">
                     <span className="w-8 h-[1px] bg-museum-gold inline-block"></span>
                     {texts.histContext}
                  </h3>
                  <p className='text-sm md:text-base'>{details.historicalContext}</p>
                </section>

                <section className="bg-museum-900/50 p-8 border-l-2 border-museum-gold">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-museum-gold mb-2">{texts.symbolism}</h3>
                  <p className="italic text-museum-muted text-sm md:text-base">{details.symbolism}</p>
                </section>

              </div>
            ) : (
               <div className="space-y-4">
                 <p className="text-museum-muted font-serif text-sm md:text-base">
                   {loadError === 'rate_limit' ? texts.rateLimitAnalysis : texts.analysisUnavailable}
                 </p>
                 {(loadError === 'rate_limit' || loadError === 'unknown') && (
                   <button
                     onClick={() => setRetryKey((k) => k + 1)}
                     className="text-xs uppercase tracking-widest font-bold text-museum-gold border border-museum-gold/40 px-4 py-2 rounded hover:bg-museum-gold/10 transition-colors"
                   >
                     {texts.retryBtn}
                   </button>
                 )}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtDetail;
