
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Artwork, ViewState, ChatMessage, Language, DEFAULT_TEXTS, FilterState, ArtworkRow, localizeArtwork } from './types';
import ArtDetail from './components/ArtDetail';
import AddArtworkModal from './components/AddArtworkModal';
import FilterSheet from './components/FilterSheet';
import { chatWithCurator } from './services/geminiService';
import { museumService } from './services/museumService';
import { IconSearch, IconMenu, IconMessageCircle, IconX, IconSparkles, IconGlobe, IconPlus, IconFilter } from './components/Icons';

function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.GALLERY);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  
  // Data State
  const [rawArtworks, setRawArtworks] = useState<ArtworkRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('ja');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    period: null,
    artist: null
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const t = DEFAULT_TEXTS[language];

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatThinking, setIsChatThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch Data on Mount
  useEffect(() => {
    const loadCollection = async () => {
      setIsLoading(true);
      try {
        const rows = await museumService.getArtworks();
        setRawArtworks(rows);
      } catch (e) {
        console.error("Failed to load collection", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadCollection();
  }, []);

  // Derived State: Localized Artworks based on current language
  const localizedArtworks = useMemo(() => {
    return rawArtworks.map(row => localizeArtwork(row, language));
  }, [rawArtworks, language]);

  // Initialize chat message
  useEffect(() => {
     if (chatHistory.length === 0) {
       setChatHistory([{ role: 'model', text: t.welcomeMessage }]);
     }
     else if (chatHistory.length === 1 && chatHistory[0].role === 'model') {
      setChatHistory([{ role: 'model', text: t.welcomeMessage }]);
    }
  }, [language, chatHistory.length, t.welcomeMessage]);

  // Filtering Logic
  const filteredArtworks = useMemo(() => {
    return localizedArtworks.filter(art => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
         art.title.toLowerCase().includes(searchLower) || 
         art.artist.toLowerCase().includes(searchLower);
  
      if (!matchesSearch) return false;
      if (filters.period && art.period !== filters.period) return false;
      if (filters.artist && art.artist !== filters.artist) return false;
  
      return true;
    });
  }, [localizedArtworks, filters]);

  const activeFilterCount = (filters.period ? 1 : 0) + (filters.artist ? 1 : 0) + (filters.search ? 1 : 0);

  const handleArtClick = (art: Artwork) => {
    setSelectedArtwork(art);
    setViewState(ViewState.DETAIL);
    window.scrollTo(0, 0);
  };

  const handleBackToGallery = () => {
    setSelectedArtwork(null);
    setViewState(ViewState.GALLERY);
  };

  const handleAddArtwork = (newRow: ArtworkRow) => {
    // Optimistically update raw array
    setRawArtworks(prev => [newRow, ...prev]);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ja' : 'en');
    // Note: We keep filters, but they might not match new localized values perfectly if not cleared.
    // For better UX, we often clear specific text filters on language switch.
    setFilters({ search: '', period: null, artist: null });
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatThinking) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatThinking(true);

    try {
      const apiHistory = chatHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await chatWithCurator(apiHistory, userMsg, selectedArtwork || undefined, language);
      
      if (response) {
        setChatHistory(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (error) {
        console.error(error);
        setChatHistory(prev => [...prev, { role: 'model', text: language === 'ja' ? "申し訳ありません。アーカイブへの接続に一時的な問題が発生しています。" : "Apologies, I am momentarily unable to access the archives. Please try again." }]);
    } finally {
      setIsChatThinking(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatOpen]);

  return (
    <div className="min-h-screen bg-museum-950 font-sans selection:bg-museum-gold selection:text-museum-ivory">
      
      {/* Navigation (Only visible in Gallery) */}
      {viewState === ViewState.GALLERY && (
        <nav className="fixed top-0 w-full z-40 bg-museum-950/90 backdrop-blur-md border-b border-museum-800 transition-all duration-500">
          <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-8 h-8 bg-museum-gold rounded-sm flex items-center justify-center text-museum-950 font-display font-bold text-xl">A</div>
               <span className="font-display text-xl tracking-[0.15em] text-museum-ivory hidden sm:block">{t.title}</span>
             </div>
             
             <div className="flex items-center gap-3 md:gap-6">
                {/* Desktop Search */}
                <div className="relative hidden md:block group">
                   <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-museum-muted group-focus-within:text-museum-gold transition-colors" />
                   <input 
                     type="text" 
                     placeholder={t.searchPlaceholder}
                     value={filters.search}
                     onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
                     className="bg-museum-900 border border-museum-800 rounded-full py-2 pl-10 pr-4 text-sm text-museum-ivory placeholder-museum-700 focus:outline-none focus:border-museum-gold transition-all w-64"
                   />
                </div>
                
                {/* Mobile Search/Filter Trigger */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="md:hidden text-museum-ivory hover:text-museum-gold transition-colors relative"
                >
                  <IconSearch className="w-6 h-6" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-museum-gold rounded-full border-2 border-museum-950"></span>
                  )}
                </button>

                {/* Language Toggle */}
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 text-museum-ivory hover:text-museum-gold transition-colors border border-museum-800 rounded px-3 py-1"
                >
                   <IconGlobe className="w-4 h-4" />
                   <span className="text-xs font-bold font-display">{language === 'en' ? 'JP' : 'EN'}</span>
                </button>

                {/* Add Art Mobile/Desktop */}
                <button 
                   onClick={() => setIsAddModalOpen(true)}
                   className="text-museum-ivory hover:text-museum-gold transition-colors"
                   aria-label={t.addArtwork}
                >
                   <IconPlus className="w-6 h-6" />
                </button>
             </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="relative">
        {viewState === ViewState.GALLERY ? (
          <div className="pt-24 md:pt-32 px-6 pb-20 max-w-7xl mx-auto animate-fade-in">
            {/* Hero / Header */}
            <header className="mb-20 text-center">
               <span className="block font-serif italic text-museum-gold mb-4 text-lg">{t.est}</span>
               <h1 className="font-display text-3xl md:text-6xl text-museum-ivory mb-4 md:mb-6 tracking-wide leading-tight">{t.subtitle}</h1>
               <p className="max-w-xl mx-auto text-museum-muted font-serif text-sm md:text-xl leading-relaxed">
                 {t.intro}
               </p>
            </header>

            {/* Active Filters Display (Desktop mostly) */}
            {activeFilterCount > 0 && (
              <div className="mb-8 flex flex-wrap gap-2 justify-center animate-fade-in">
                 {filters.search && (
                   <span className="px-3 py-1 bg-museum-900 border border-museum-700 rounded-full text-xs text-museum-ivory flex items-center gap-2">
                     "{filters.search}" <button onClick={() => setFilters(f => ({...f, search: ''}))}><IconX className="w-3 h-3"/></button>
                   </span>
                 )}
                 {filters.period && (
                   <span className="px-3 py-1 bg-museum-900 border border-museum-700 rounded-full text-xs text-museum-ivory flex items-center gap-2">
                     {filters.period} <button onClick={() => setFilters(f => ({...f, period: null}))}><IconX className="w-3 h-3"/></button>
                   </span>
                 )}
                 {filters.artist && (
                   <span className="px-3 py-1 bg-museum-900 border border-museum-700 rounded-full text-xs text-museum-ivory flex items-center gap-2">
                     {filters.artist} <button onClick={() => setFilters(f => ({...f, artist: null}))}><IconX className="w-3 h-3"/></button>
                   </span>
                 )}
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <IconSparkles className="w-8 h-8 text-museum-gold animate-spin" />
                <p className="text-museum-muted font-serif tracking-widest text-sm uppercase">{t.loading}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filteredArtworks.map((art) => (
                  <div 
                    key={art.id} 
                    onClick={() => handleArtClick(art)}
                    className="group cursor-pointer flex flex-col gap-4"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-museum-900 border border-museum-800 shadow-2xl transition-all duration-500 group-hover:border-museum-gold/50">
                        <img 
                          src={art.thumbnailUrl} 
                          alt={art.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-museum-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                          <span className="text-museum-gold text-xs tracking-widest uppercase font-bold flex items-center gap-2">
                            <IconSparkles className="w-4 h-4" />
                            {t.analyzeBtn}
                          </span>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className={`font-display text-xl text-museum-ivory group-hover:text-museum-gold transition-colors duration-300 ${language === 'ja' ? 'font-serif font-bold' : ''}`}>
                          {art.title}
                        </h3>
                        <p className="font-serif text-museum-muted italic">{art.artist}, {art.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && filteredArtworks.length === 0 && (
              <div className="text-center py-20 text-museum-700 font-serif italic text-xl">
                {t.noResults}
              </div>
            )}
          </div>
        ) : (
           selectedArtwork && <ArtDetail artwork={selectedArtwork} onBack={handleBackToGallery} language={language} texts={t} />
        )}
      </main>

      {/* Mobile Filter Sheet */}
      <FilterSheet 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        artworks={localizedArtworks}
        texts={t}
      />

      {/* Modals */}
      <AddArtworkModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddArtwork}
        texts={t}
      />

      {/* Curator Chat Widget */}
      <div className={`fixed z-[45] transition-all duration-300 ${isChatOpen ? 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96' : 'bottom-6 right-6 w-auto'}`}>
        
        {/* Chat Window */}
        {isChatOpen && (
           <div className="w-full h-[100dvh] sm:h-[600px] bg-museum-950 sm:bg-museum-900/95 sm:backdrop-blur-xl sm:border border-museum-700 shadow-2xl sm:rounded-sm flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
              {/* Header */}
              <div className="bg-museum-950 p-4 border-b border-museum-800 flex items-center justify-between pt-safe-top sm:pt-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <div>
                     <h4 className="font-display text-museum-ivory text-sm tracking-wider">{t.chatTitle}</h4>
                     <p className="text-[10px] text-museum-muted uppercase tracking-widest">{t.chatSubtitle}</p>
                   </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-museum-muted hover:text-museum-ivory p-2">
                  <IconX className="w-6 h-6 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-museum-700 scrollbar-track-transparent bg-museum-950/50">
                 {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[85%] p-3 text-sm leading-relaxed font-serif ${
                         msg.role === 'user' 
                           ? 'bg-museum-800 text-museum-ivory rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                           : 'bg-museum-950 border border-museum-800 text-museum-muted rounded-tr-lg rounded-br-lg rounded-bl-lg'
                       }`}>
                         {msg.text}
                       </div>
                    </div>
                 ))}
                 {isChatThinking && (
                   <div className="flex justify-start">
                     <div className="bg-museum-950 border border-museum-800 p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg flex gap-1 items-center">
                        <span className="w-1 h-1 bg-museum-gold rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-museum-gold rounded-full animate-bounce delay-100"></span>
                        <span className="w-1 h-1 bg-museum-gold rounded-full animate-bounce delay-200"></span>
                     </div>
                   </div>
                 )}
                 <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleChatSubmit} className="p-3 bg-museum-950 border-t border-museum-800 flex gap-2 pb-safe-bottom sm:pb-3">
                 <input 
                   type="text" 
                   value={chatInput}
                   onChange={(e) => setChatInput(e.target.value)}
                   placeholder={t.chatInput}
                   className="flex-1 bg-museum-900 border border-museum-800 rounded px-3 py-3 sm:py-2 text-base sm:text-sm text-museum-ivory focus:border-museum-gold focus:outline-none font-sans placeholder-museum-700 appearance-none"
                 />
                 <button 
                   type="submit" 
                   disabled={isChatThinking || !chatInput.trim()}
                   className="bg-museum-gold text-museum-950 px-4 sm:px-3 py-2 rounded hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider whitespace-nowrap"
                 >
                   {t.chatSend}
                 </button>
              </form>
           </div>
        )}

        {/* Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`group flex items-center gap-3 bg-museum-ivory text-museum-950 pl-4 pr-2 py-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 absolute right-0 bottom-0 whitespace-nowrap ${isChatOpen ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100 translate-y-0'}`}
        >
           <span className="font-display font-bold tracking-wider text-xs">{t.askCurator}</span>
           <div className="bg-museum-950 text-museum-ivory p-1.5 rounded-full group-hover:rotate-12 transition-transform">
             <IconMessageCircle className="w-3 h-3" />
           </div>
        </button>
      </div>

    </div>
  );
}

export default App;
