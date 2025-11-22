import React, { useMemo } from 'react';
import { FilterState, Translations, Artwork } from '../types';
import { IconX, IconFilter } from './Icons';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  artworks: Artwork[];
  texts: Translations;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ isOpen, onClose, filters, setFilters, artworks, texts }) => {
  const { periods, artists } = useMemo(() => {
    //Set<string>:「文字列の集合」で、同じ period が重複しない
    const periodSet = new Set<string>();
    const artistSet = new Set<string>();

    artworks.forEach(art => {
      if (art.period) periodSet.add(art.period);
      if (art.artist) artistSet.add(art.artist);
    });

    return {
      // Array.from(set): Set を配列に変換
      periods: Array.from(periodSet).sort(),
      artists: Array.from(artistSet).sort()
    };
  }, [artworks]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const togglePeriod = (p: string) => {
    setFilters(prev => ({ ...prev, period: prev.period === p ? null : p }));
  };

  const toggleArtist = (a: string) => {
    setFilters(prev => ({ ...prev, artist: prev.artist === a ? null : a }));
  };

  const clearFilters = () => {
    setFilters({ search: '', period: null, artist: null });
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 w-full bg-museum-950 border-t border-museum-gold/30 rounded-t-2xl z-[60] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] animate-slide-up max-h-[85vh] flex flex-col">
        <div className="p-5 border-b border-museum-800 flex items-center justify-between bg-museum-950/95 backdrop-blur rounded-t-2xl shrink-0 sticky top-0">
          <div className="flex items-center gap-2 text-museum-gold">
            <IconFilter className="w-5 h-5" />
            <h3 className="font-display tracking-wider text-md md:text-lg text-museum-ivory">{texts.filterTitle}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-museum-muted hover:text-museum-ivory">
            <IconX className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-museum-700">
          <div>
            <input 
              type="text" 
              placeholder={texts.searchPlaceholder}
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full text-sm md:text-base bg-museum-900 border border-museum-800 rounded-lg px-4 py-1.5 md:py-3 text-museum-ivory focus:border-museum-gold focus:outline-none font-serif placeholder-museum-700"
            />
          </div>

          <div>
            <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-museum-muted mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-museum-gold block"></span>
              {texts.filterPeriod}
            </h4>
            <div className="flex flex-wrap gap-2">
              {periods.map(period => (
                <button
                  key={period}
                  onClick={() => togglePeriod(period)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all font-serif ${
                    filters.period === period 
                      ? 'bg-museum-gold text-museum-950 border-museum-gold font-bold shadow-lg shadow-amber-900/20' 
                      : 'bg-transparent text-museum-ivory/80 border-museum-800 hover:border-museum-600'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div>
             <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-museum-muted mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-museum-gold block"></span>
              {texts.filterArtist}
            </h4>
            <div className="flex flex-wrap gap-2">
              {artists.map(artist => (
                <button
                  key={artist}
                  onClick={() => toggleArtist(artist)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all font-serif ${
                    filters.artist === artist 
                      ? 'bg-museum-gold text-museum-950 border-museum-gold font-bold shadow-lg shadow-amber-900/20' 
                      : 'bg-transparent text-museum-ivory/80 border-museum-800 hover:border-museum-600'
                  }`}
                >
                  {artist}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 mb-4 border-t border-museum-800 bg-museum-950 shrink-0 flex gap-4 pb-safe-bottom">
           <button 
             onClick={clearFilters}
             className="flex-1 py-3 text-museum-muted hover:text-museum-ivory text-xs uppercase tracking-widest font-bold font-serif transition-colors"
           >
             {texts.filterClear}
           </button>
           <button 
             onClick={onClose}
             className="flex-[2] bg-museum-ivory text-museum-950 hover:bg-white py-3 rounded-sm text-xs uppercase tracking-widest font-bold font-serif shadow-xl transition-transform active:scale-95"
           >
             {texts.filterApply}
           </button>
        </div>

      </div>
    </>
  );
};

export default FilterSheet;
