export enum ViewState {
  GALLERY = 'GALLERY',
  DETAIL = 'DETAIL',
  COLLECTION = 'COLLECTION'
}
export type Language = 'en' | 'ja';

export interface ArtworkRow {
  id: string;
  // insert 時点では存在しないから
  created_at?: string;
  image_url: string;
  title_en: string;
  title_ja: string;
  artist_en: string;
  artist_ja: string;
  period_en: string;
  period_ja: string;
  year_created: string;
  // ? はプロパティ自体がないことを考慮
  description_en?: string | null;
  description_ja?: string | null;
  // is_public?: boolean;
  // view_count?: number;
}

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

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  period: string;
  year: string;
  thumbnailUrl: string;
  description?: string;
  raw: ArtworkRow;
}

export interface ArtworkDetail extends Artwork {
  fullDescription: string;
  technicalAnalysis: string;
  historicalContext: string;
  symbolism: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp?: number;
}

export interface FilterState {
  search: string;
  period: string | null;
  artist: string | null;
}

export interface Translations {
  title: string;
  subtitle: string;
  intro: string;
  searchPlaceholder: string;
  noResults: string;
  returnGallery: string;
  analyzing: string;
  analysisUnavailable: string;
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

// Record<キーの型, 値の型> → 辞書作る！
export const DEFAULT_TEXTS: Record<Language, Translations> = {
  en: {
    title: "ART MUSEUM",
    subtitle: "The Grand Archives",
    intro: "Wander through centuries of human expression. Each piece is a window into the soul of its era, curated for the discerning intellect.",
    searchPlaceholder: "Search archives...",
    noResults: "No masterpieces found in the archives.",
    returnGallery: "Return",
    analyzing: "THE ARCHIVIST IS ANALYZING...",
    analysisUnavailable: "Analysis unavailable.",
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
    title: "ART MUSEUM",
    subtitle: "大回廊アーカイブ",
    intro: "数世紀にわたる人類の表現の旅へ。知的好奇心を満たすために厳選された、魂の窓としての名画をご堪能ください。",
    searchPlaceholder: "収蔵品を検索...",
    noResults: "該当する作品は見つかりませんでした。",
    returnGallery: "戻る",
    analyzing: "AI 学芸員が分析中...",
    analysisUnavailable: "分析に失敗しました。",
    visualDesc: "I. 視覚的特徴",
    techAnalysis: "II. 技法と素材",
    histContext: "III. 歴史的背景",
    symbolism: "象徴・メタファー",
    chatTitle: "主任 AI 学芸員",
    chatSubtitle: "ガイド",
    chatInput: "美術史について質問する...",
    chatSend: "送信",
    askCurator: "AI 学芸員に質問",
    addArtwork: "作品を寄贈",
    uploadImage: "画像をアップロード",
    formTitle: "作品名",
    formArtist: "作者名",
    formYear: "制作年",
    formPeriod: "芸術様式・時代",
    formSubmit: "収蔵する",
    formCancel: "キャンセル",
    welcomeMessage: "ようこそ、アートミュージアムへ。主任学芸員です。本日はどのようなご案内をいたしましょうか？",
    analyzeBtn: "詳細を見る",
    est: "Est. 2025",
    filterTitle: "収蔵品の絞り込み",
    filterPeriod: "時代・様式",
    filterArtist: "作者",
    filterClear: "条件をクリア",
    filterApply: "結果を表示",
    loading: "収蔵作品を取得中...",
    uploading: "新規作品を収蔵処理中...",
    errorLoading: "収蔵作品の読み込みに失敗しました。再読み込みしてください。",
    errorUploading: "作品の収蔵に失敗しました。もう一度お試しください。"
  }
};

export const localizeArtwork = (row: ArtworkRow, language: Language): Artwork => {
  return {
    id: row.id,
    title: (language === 'ja') ? row.title_ja : row.title_en,
    artist: (language === 'ja') ? row.artist_ja : row.artist_en,
    period: (language === 'ja') ? row.period_ja : row.period_en,
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
    analysisUnavailable: map.get('analysisUnavailable') || defaults.analysisUnavailable,
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
