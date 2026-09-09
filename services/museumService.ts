import { ArtworkRow, ArtworkUploadMetadata, TranslationRow } from '../types';
import { getSupabaseClient } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'art-museum-local-artworks';

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getLocalArtworks = (): ArtworkRow[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalArtwork = (row: ArtworkRow): void => {
  const existing = getLocalArtworks();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([row, ...existing]));
};

const mergeArtworks = (...sources: ArtworkRow[][]): ArtworkRow[] => {
  const seen = new Set<string>();
  const merged: ArtworkRow[] = [];

  for (const source of sources) {
    for (const row of source) {
      if (!seen.has(row.id)) {
        seen.add(row.id);
        merged.push(normalizeArtwork(row));
      }
    }
  }

  return merged;
};

const normalizeArtwork = (row: ArtworkRow): ArtworkRow => ({
  ...row,
  level: row.level ?? 3,
});

const createArtworkRow = (
  imageUrl: string,
  metadata: ArtworkUploadMetadata
): ArtworkRow => ({
  id: `local-${Date.now()}`,
  created_at: new Date().toISOString(),
  image_url: imageUrl,
  title_en: metadata.title_en,
  title_ja: metadata.title_ja || metadata.title_en,
  artist_en: metadata.artist_en,
  artist_ja: metadata.artist_ja || metadata.artist_en,
  year_created: metadata.year_created,
  period_en: metadata.period_en,
  period_ja: metadata.period_ja || metadata.period_en,
  level: metadata.level,
  description_en: metadata.description_en || null,
  description_ja: metadata.description_ja || null,
});

// ============================================
// MOCK DATA (Fallback when Supabase not configured)
// ============================================

const MOCK_DB_ARTWORKS: ArtworkRow[] = [
  { 
    id: '1', 
    image_url: "https://picsum.photos/seed/nightwatch/600/400",
    title_en: "The Night Watch", 
    title_ja: "夜警",
    artist_en: "Rembrandt van Rijn", 
    artist_ja: "レンブラント・ファン・レイン",
    year_created: "1642", 
    period_en: "Dutch Golden Age", 
    period_ja: "オランダ黄金時代",
  },
  { 
    id: '2', 
    image_url: "https://picsum.photos/seed/vermeer/600/700",
    title_en: "Girl with a Pearl Earring", 
    title_ja: "真珠の耳飾りの少女",
    artist_en: "Johannes Vermeer", 
    artist_ja: "ヨハネス・フェルメール",
    year_created: "1665", 
    period_en: "Dutch Golden Age", 
    period_ja: "オランダ黄金時代",
  },
  { 
    id: '3', 
    image_url: "https://picsum.photos/seed/starry/800/600",
    title_en: "The Starry Night", 
    title_ja: "星月夜",
    artist_en: "Vincent van Gogh", 
    artist_ja: "フィンセント・ファン・ゴッホ",
    year_created: "1889", 
    period_en: "Post-Impressionism", 
    period_ja: "ポスト印象派",
  },
  { 
    id: '4', 
    image_url: "https://picsum.photos/seed/venus/800/500",
    title_en: "The Birth of Venus", 
    title_ja: "ヴィーナスの誕生",
    artist_en: "Sandro Botticelli", 
    artist_ja: "サンドロ・ボッティチェッリ",
    year_created: "1486", 
    period_en: "Early Renaissance", 
    period_ja: "初期ルネサンス",
  },
  { 
    id: '5', 
    image_url: "https://picsum.photos/seed/guernica/900/400",
    title_en: "Guernica", 
    title_ja: "ゲルニカ",
    artist_en: "Pablo Picasso", 
    artist_ja: "パブロ・ピカソ",
    year_created: "1937", 
    period_en: "Cubism / Surrealism", 
    period_ja: "キュビズム / シュルレアリスム",
  },
  { 
    id: '6', 
    image_url: "https://picsum.photos/seed/klimt/500/500",
    title_en: "The Kiss", 
    title_ja: "接吻",
    artist_en: "Gustav Klimt", 
    artist_ja: "グスタフ・クリムト",
    year_created: "1908", 
    period_en: "Art Nouveau", 
    period_ja: "アール・ヌーヴォー",
  },
  { 
    id: '7', 
    image_url: "https://picsum.photos/seed/fog/500/700",
    title_en: "Wanderer above the Sea of Fog", 
    title_ja: "雲海の上の旅人",
    artist_en: "Caspar David Friedrich", 
    artist_ja: "カスパー・ダーヴィト・フリードリヒ",
    year_created: "1818", 
    period_en: "Romanticism", 
    period_ja: "ロマン主義",
  },
  { 
    id: '8', 
    image_url: "https://picsum.photos/seed/meninas/600/700",
    title_en: "Las Meninas", 
    title_ja: "ラス・メニーナス",
    artist_en: "Diego Velázquez", 
    artist_ja: "ディエゴ・ベラスケス",
    year_created: "1656", 
    period_en: "Baroque", 
    period_ja: "バロック",
  },
];

// ============================================
// MUSEUM SERVICE API
// ============================================
export const museumService = {
  getArtworks: async (): Promise<ArtworkRow[]> => {
    const supabase = getSupabaseClient();
    const localArtworks = getLocalArtworks();

    if (!supabase) {
      console.warn('📦 Supabase not configured — using local collection');
      return mergeArtworks(localArtworks, MOCK_DB_ARTWORKS);
    }

    console.log('🔄 Supabase から収蔵作品をフェッチしています。');

    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase のクエリエラーは次のとおりです。:', error);
        throw error;
      }

      console.log(`✅ ${data?.length || 0} 点の収蔵作品のフェッチに成功！`);
      return mergeArtworks(data || [], localArtworks);
    } catch (error) {
      console.error('❌ Supabase からのデータフェッチに失敗。ローカルデータを使用します：', error);
      return mergeArtworks(localArtworks, MOCK_DB_ARTWORKS);
    }
  },

  /**
   * Fetch UI translations from database.
   * Falls back to empty array (app will use DEFAULT_TEXTS).
   */
  getTranslations: async (): Promise<TranslationRow[]> => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return []; // Use default translations
    }

    try {
      const { data, error } = await supabase
        .from('ui_translations')
        .select('*');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch translations:', error);
      return [];
    }
  },

  /**
   * Upload image to Storage and create artwork record.
   * 
   * Process:
   * 1. Upload file to Supabase Storage bucket 'artworks'
   * 2. Get public URL
   * 3. Insert row into 'artworks' table
   * 4. Return created row
   */
  uploadArtwork: async (
    file: File, 
    metadata: ArtworkUploadMetadata
  ): Promise<ArtworkRow> => {
    const supabase = getSupabaseClient();

    const saveLocally = async (): Promise<ArtworkRow> => {
      const imageUrl = await fileToDataUrl(file);
      const newRow = createArtworkRow(imageUrl, metadata);
      saveLocalArtwork(newRow);
      MOCK_DB_ARTWORKS.unshift(newRow);
      console.log('✅ Saved artwork locally:', newRow.title_en);
      return newRow;
    };

    if (!supabase) {
      console.warn('📦 MOCK upload - Supabase not configured');
      await new Promise(resolve => setTimeout(resolve, 800));
      return saveLocally();
    }

    console.log('🔄 Uploading to Supabase...');

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      console.log(`📤 Uploading file: ${fileName}`);

      const { error: uploadError } = await supabase
        .storage
        .from('artworks')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'image/jpeg',
        });

      if (uploadError) {
        // Storageが利用できない場合（バケット未作成・権限なし等）は
        // ローカル保存にフォールバックし、DBへの登録はdata URLで試みる
        console.warn('⚠️ Storage upload failed, falling back to local:', uploadError.message);
        const imageUrl = await fileToDataUrl(file);
        const localRow = createArtworkRow(imageUrl, metadata);
        saveLocalArtwork(localRow);
        MOCK_DB_ARTWORKS.unshift(localRow);

        // DBへの登録だけ非同期で試みる（data URLは大きいため省略）
        supabase
          .from('artworks')
          .insert({
            image_url: 'pending',
            title_en: metadata.title_en,
            title_ja: metadata.title_ja || null,
            artist_en: metadata.artist_en,
            artist_ja: metadata.artist_ja || null,
            year_created: metadata.year_created,
            period_en: metadata.period_en,
            period_ja: metadata.period_ja || null,
            description_en: metadata.description_en || null,
            description_ja: metadata.description_ja || null,
            level: metadata.level,
            is_public: false,
          })
          .then(({ error }) => {
            if (error) console.warn('DB insert also failed:', error.message);
            else console.log('✅ DB record created (image pending upload)');
          });

        console.log('✅ Fallback: saved locally with ID:', localRow.id);
        return localRow;
      }

      console.log('✅ File uploaded to storage');

      const { data: urlData } = supabase
        .storage
        .from('artworks')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;
      console.log('🔗 Public URL:', imageUrl);

      console.log('💾 Inserting into database...');
      const { data: insertData, error: insertError } = await supabase
        .from('artworks')
        .insert({
          image_url: imageUrl,
          title_en: metadata.title_en,
          title_ja: metadata.title_ja || null,
          artist_en: metadata.artist_en,
          artist_ja: metadata.artist_ja || null,
          year_created: metadata.year_created,
          period_en: metadata.period_en,
          period_ja: metadata.period_ja || null,
          description_en: metadata.description_en || null,
          description_ja: metadata.description_ja || null,
          level: metadata.level,
          is_public: true,
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw insertError;
      }

      console.log('✅ Successfully uploaded artwork:', insertData?.title_en);
      return insertData as ArtworkRow;
    } catch (error) {
      console.error('❌ Supabase upload failed, saving locally instead:', error);
      return saveLocally();
    }
  },

  /**
   * Increment view count for analytics (optional)
   */
  incrementViewCount: async (artworkId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      await (supabase as any).rpc('increment_view_count', { artwork_id: artworkId });
    } catch (error) {
      console.warn('Failed to increment view count:', error);
    }
  }
};
