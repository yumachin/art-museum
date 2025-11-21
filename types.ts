// ============================================
// ENUMS & BASIC TYPES
// ============================================

export enum ViewState {
  GALLERY = 'GALLERY',
  DETAIL = 'DETAIL',
  COLLECTION = 'COLLECTION'
}

export type Language = 'en' | 'ja';

// ============================================
// DATABASE SCHEMA TYPES (Supabase Response)
// ============================================

/**
 * Raw database row from Supabase 'artworks' table.
 * All fields are optional except required ones, to handle partial fetches.
 */
export interface ArtworkRow {
  id: string;
  created_at?: string;
  image_url: string;
  
  // Bilingual Fields (EN required, JA optional)
  title_en: string;
  title_ja: string | null;
  
  artist_en: string;
  artist_ja: string | null;
  
  period_en: string;
  period_ja: string | null;
  
  year_created: string;
  
  // Optional Rich Metadata
  description_en?: string | null;
  description_ja?: string | null;
  
  // Analytics
  is_public?: boolean;
  view_count?: number;
}

/**
 * API response wrapper for fetching artworks
 */
export interface ArtworksResponse {
  data: ArtworkRow[] | null;
  error: Error | null;
  count?: number;
}

/**
 * Upload metadata for new artwork submission
 */
export interface ArtworkUploadMetadata {
  title_en: string;
  title_ja?: string;
  artist_en: string;
  artist_ja?: string;
  year_created: string;
  period_en: string;
  period_ja?: string;
  description_en?: string;
  description_ja?: string;
}

// ============================================
// UI DISPLAY TYPES (Localized & Computed)
// ============================================

/**
 * Localized artwork for UI display.
 * Fields are resolved based on active language with fallbacks.
 */
export interface Artwork {
  id: string;
  title: string;         // Localized (falls back to EN if JA missing)
  artist: string;        // Localized
  period: string;        // Localized
  year: string;
  thumbnailUrl: string;
  description?: string;  // Localized
  
  // Keep raw row for advanced features (editing, filtering)
  raw: ArtworkRow;
}

/**
 * Extended artwork with AI-generated analysis
 */
export interface ArtworkDetail extends Artwork {
  fullDescription: string;
  technicalAnalysis: string;
  historicalContext: string;
  symbolism: string;
}

/**
 * Chat message structure
 */
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp?: number;
}

/**
 * Filter state for gallery
 */
export interface FilterState {
  search: string;
  period: string | null;
  artist: string | null;
}

// ============================================
// LOCALIZATION TYPES
// ============================================

/**
 * UI text translations structure
 */
export interface Translations {
  title: string;
  subtitle: string;
  intro: string;
  searchPlaceholder: string;
  noResults: string;
  returnGallery: string;
  analyzing: string;
  visualDesc: string;
  techAnalysis: string;
  histContext: string;
  symbolism: string;
  chatTitle: string;
  chatSubtitle: string;
  chatInput: string;
  chatSend: string;
  askCurator: string;
  addArtwork: string;
  uploadImage: string;
  formTitle: string;
  formArtist: string;
  formYear: string;
  formPeriod: string;
  formSubmit: string;
  formCancel: string;
  welcomeMessage: string;
  analyzeBtn: string;
  est: string;
  filterTitle: string;
  filterPeriod: string;
  filterArtist: string;
  filterClear: string;
  filterApply: string;
  loading: string;
  uploading: string;
  errorLoading: string;
  errorUploading: string;
}

/**
 * Raw translation row from Supabase 'ui_translations' table
 */
export interface TranslationRow {
  id?: string;
  key: string;
  en: string;
  ja: string;
  created_at?: string;
}

// ============================================
// DEFAULT FALLBACK TRANSLATIONS (Static)
// ============================================

export const DEFAULT_TEXTS: Record<Language, Translations> = {
  en: {
    title: "ART MUSEUM",
    subtitle: "The Grand Archives",
    intro: "Wander through centuries of human expression. Each piece is a window into the soul of its era, curated for the discerning intellect.",
    searchPlaceholder: "Search archives...",
    noResults: "No masterpieces found in the archives.",
    returnGallery: "Return to Gallery",
    analyzing: "THE ARCHIVIST IS ANALYZING...",
    visualDesc: "I. Visual Description",
    techAnalysis: "II. Technical Analysis",
    histContext: "III. Historical Context",
    symbolism: "Symbolism",
    chatTitle: "THE CURATOR",
    chatSubtitle: "AI Powered Guide",
    chatInput: "Ask about art history...",
    chatSend: "Send",
    askCurator: "ASK CURATOR",
    addArtwork: "Add Artwork",
    uploadImage: "Upload Image",
    formTitle: "Artwork Title",
    formArtist: "Artist Name",
    formYear: "Year Created",
    formPeriod: "Art Period",
    formSubmit: "Archive Work",
    formCancel: "Cancel",
    welcomeMessage: "Welcome to Art Museum. I am your curator. How may I assist you in your journey through art history today?",
    analyzeBtn: "Analyze",
    est: "Est. 2025",
    filterTitle: "Refine Collection",
    filterPeriod: "Period / Era",
    filterArtist: "Artist",
    filterClear: "Clear Filters",
    filterApply: "View Results",
    loading: "Retrieving from Archives...",
    uploading: "Archiving new acquisition...",
    errorLoading: "Failed to load collection. Please refresh.",
    errorUploading: "Failed to archive artwork. Please try again."
  },
  ja: {
    title: "アートミュージアム",
    subtitle: "大回廊アーカイブ",
    intro: "数世紀にわたる人類の表現の旅へ。知的好奇心を満たすために厳選された、魂の窓としての名画をご堪能ください。",
    searchPlaceholder: "収蔵品を検索...",
    noResults: "該当する作品は見つかりませんでした。",
    returnGallery: "ギャラリーに戻る",
    analyzing: "AI学芸員が分析中...",
    visualDesc: "I. 視覚的特徴",
    techAnalysis: "II. 技法と素材",
    histContext: "III. 歴史的背景",
    symbolism: "象徴・メタファー",
    chatTitle: "主任学芸員",
    chatSubtitle: "AI ガイド",
    chatInput: "美術史について質問する...",
    chatSend: "送信",
    askCurator: "AI 学芸員に質問",
    addArtwork: "作品を寄贈(追加)",
    uploadImage: "画像をアップロード",
    formTitle: "作品名",
    formArtist: "作者名",
    formYear: "制作年",
    formPeriod: "芸術様式・時代",
    formSubmit: "収蔵する",
    formCancel: "キャンセル",
    welcomeMessage: "ようこそ、アートミュージアムへ。主任学芸員です。本日はどのようなご案内をいたしましょうか？",
    analyzeBtn: "分析する",
    est: "2025年",
    filterTitle: "収蔵品の絞り込み",
    filterPeriod: "時代・様式",
    filterArtist: "作者",
    filterClear: "条件をクリア",
    filterApply: "結果を表示",
    loading: "アーカイブを取得中...",
    uploading: "新規作品を収蔵処理中...",
    errorLoading: "コレクションの読み込みに失敗しました。再読み込みしてください。",
    errorUploading: "作品の収蔵に失敗しました。もう一度お試しください。"
  }
};

// ============================================
// HELPER: Localize Artwork Row
// ============================================

/**
 * Converts a raw DB row into a localized UI Artwork object.
 * Falls back to English if Japanese translation is missing.
 */
export const localizeArtwork = (row: ArtworkRow, language: Language): Artwork => {
  return {
    id: row.id,
    title: (language === 'ja' && row.title_ja) ? row.title_ja : row.title_en,
    artist: (language === 'ja' && row.artist_ja) ? row.artist_ja : row.artist_en,
    period: (language === 'ja' && row.period_ja) ? row.period_ja : row.period_en,
    year: row.year_created,
    thumbnailUrl: row.image_url,
    description: language === 'ja' 
      ? (row.description_ja || row.description_en || undefined)
      : (row.description_en || undefined),
    raw: row
  };
};

/**
 * Build translations object from array of translation rows.
 * Falls back to DEFAULT_TEXTS if data is incomplete.
 */
export const buildTranslations = (rows: TranslationRow[], language: Language): Translations => {
  const defaults = DEFAULT_TEXTS[language];
  const map = new Map(rows.map(r => [r.key, language === 'ja' ? r.ja : r.en]));
  
  return {
    title: map.get('title') || defaults.title,
    subtitle: map.get('subtitle') || defaults.subtitle,
    intro: map.get('intro') || defaults.intro,
    searchPlaceholder: map.get('searchPlaceholder') || defaults.searchPlaceholder,
    noResults: map.get('noResults') || defaults.noResults,
    returnGallery: map.get('returnGallery') || defaults.returnGallery,
    analyzing: map.get('analyzing') || defaults.analyzing,
    visualDesc: map.get('visualDesc') || defaults.visualDesc,
    techAnalysis: map.get('techAnalysis') || defaults.techAnalysis,
    histContext: map.get('histContext') || defaults.histContext,
    symbolism: map.get('symbolism') || defaults.symbolism,
    chatTitle: map.get('chatTitle') || defaults.chatTitle,
    chatSubtitle: map.get('chatSubtitle') || defaults.chatSubtitle,
    chatInput: map.get('chatInput') || defaults.chatInput,
    chatSend: map.get('chatSend') || defaults.chatSend,
    askCurator: map.get('askCurator') || defaults.askCurator,
    addArtwork: map.get('addArtwork') || defaults.addArtwork,
    uploadImage: map.get('uploadImage') || defaults.uploadImage,
    formTitle: map.get('formTitle') || defaults.formTitle,
    formArtist: map.get('formArtist') || defaults.formArtist,
    formYear: map.get('formYear') || defaults.formYear,
    formPeriod: map.get('formPeriod') || defaults.formPeriod,
    formSubmit: map.get('formSubmit') || defaults.formSubmit,
    formCancel: map.get('formCancel') || defaults.formCancel,
    welcomeMessage: map.get('welcomeMessage') || defaults.welcomeMessage,
    analyzeBtn: map.get('analyzeBtn') || defaults.analyzeBtn,
    est: map.get('est') || defaults.est,
    filterTitle: map.get('filterTitle') || defaults.filterTitle,
    filterPeriod: map.get('filterPeriod') || defaults.filterPeriod,
    filterArtist: map.get('filterArtist') || defaults.filterArtist,
    filterClear: map.get('filterClear') || defaults.filterClear,
    filterApply: map.get('filterApply') || defaults.filterApply,
    loading: map.get('loading') || defaults.loading,
    uploading: map.get('uploading') || defaults.uploading,
    errorLoading: map.get('errorLoading') || defaults.errorLoading,
    errorUploading: map.get('errorUploading') || defaults.errorUploading,
  };
};
