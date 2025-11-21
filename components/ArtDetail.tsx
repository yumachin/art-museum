
import React, { useEffect, useState } from 'react';
import { Artwork, ArtworkDetail, Language, Translations } from '../types';
import { fetchArtworkDetails } from '../services/geminiService';
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
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // The 'artwork' prop is already localized by the parent
  const displayTitle = artwork.title;
  const displayArtist = artwork.artist;
  const displayPeriod = artwork.period;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const enriched = await fetchArtworkDetails(artwork, language);
      setDetails(enriched);
      setLoading(false);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artwork.id, language]);

  return (
    <div className="relative min-h-screen bg-museum-950 text-museum-ivory animate-fade-in">
      
      <ImageViewer 
        src={artwork.thumbnailUrl} 
        alt={displayTitle} 
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />

      {/* Header Navigation */}
      <div className="fixed top-0 left-0 w-full p-6 z-40 bg-gradient-to-b from-museum-950 to-transparent pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 text-museum-ivory/60 hover:text-museum-gold transition-colors duration-300 uppercase tracking-widest text-xs font-bold font-sans backdrop-blur-md bg-museum-950/30 px-3 py-1 rounded-full border border-white/5"
        >
          <IconArrowLeft className="w-4 h-4" />
          {texts.returnGallery}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Image Section */}
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
             
             {/* Hint for click */}
             <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20">
               <IconMaximize className="w-5 h-5" />
             </div>
           </div>
        </div>

        {/* Info Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-24 flex flex-col justify-center bg-museum-950">
          <div className="max-w-2xl mx-auto">
            
            {/* Title Block */}
            <div className="mb-12 border-b border-museum-800 pb-8">
              <span className="block font-sans text-museum-gold uppercase tracking-[0.2em] text-sm mb-4">
                {displayPeriod} • {artwork.year}
              </span>
              <h1 className={`font-display text-4xl lg:text-6xl leading-tight mb-4 text-museum-ivory ${language === 'ja' ? 'font-serif' : ''}`}>
                {displayTitle}
              </h1>
              <h2 className="font-serif italic text-2xl text-museum-muted">{displayArtist}</h2>
            </div>

            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-4 bg-museum-800 w-full rounded"></div>
                <div className="h-4 bg-museum-800 w-5/6 rounded"></div>
                <div className="h-4 bg-museum-800 w-4/6 rounded"></div>
                <div className="flex items-center gap-2 text-museum-gold mt-8">
                   <IconSparkles className="w-5 h-5 animate-spin" />
                   <span className="text-sm font-sans tracking-widest">{texts.analyzing}</span>
                </div>
              </div>
            ) : details ? (
              <div className={`space-y-12 font-serif text-lg leading-relaxed text-museum-ivory/90 ${language === 'ja' ? 'tracking-wide' : ''}`}>
                
                <section>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-museum-gold mb-4 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-museum-gold inline-block"></span>
                    {texts.visualDesc}
                  </h3>
                  <p>{details.fullDescription}</p>
                </section>

                <section>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-museum-gold mb-4 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-museum-gold inline-block"></span>
                    {texts.techAnalysis}
                  </h3>
                  <p>{details.technicalAnalysis}</p>
                </section>

                <section>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-museum-gold mb-4 flex items-center gap-2">
                     <span className="w-8 h-[1px] bg-museum-gold inline-block"></span>
                     {texts.histContext}
                  </h3>
                  <p>{details.historicalContext}</p>
                </section>

                <section className="bg-museum-900/50 p-8 border-l-2 border-museum-gold">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-museum-gold mb-2">{texts.symbolism}</h3>
                  <p className="italic text-museum-muted">{details.symbolism}</p>
                </section>

              </div>
            ) : (
               <div className="text-museum-muted">Analysis unavailable.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtDetail;
