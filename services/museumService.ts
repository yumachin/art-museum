// ============================================
// MUSEUM SERVICE - Dynamic Data Fetching
// ============================================

import { ArtworkRow, ArtworkUploadMetadata, TranslationRow } from '../types';
import { getSupabaseClient } from './supabaseClient';

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

      return data;
    } catch (error) {
      console.error('❌ Supabase からのデータフェッチに失敗。：', error);
      throw error;
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

    // Mock Mode
    if (!supabase) {
      console.warn('📦 MOCK upload - Supabase not configured');
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newId = Date.now().toString();
      const fakeUrl = URL.createObjectURL(file);

      const newRow: ArtworkRow = {
        id: newId,
        created_at: new Date().toISOString(),
        image_url: fakeUrl,
        title_en: metadata.title_en,
        title_ja: metadata.title_ja || null,
        artist_en: metadata.artist_en,
        artist_ja: metadata.artist_ja || null,
        year_created: metadata.year_created,
        period_en: metadata.period_en,
        period_ja: metadata.period_ja || null,
        description_en: metadata.description_en || null,
        description_ja: metadata.description_ja || null,
      };

      MOCK_DB_ARTWORKS.unshift(newRow);
      console.log('✅ Added to MOCK database:', newRow.title_en);
      return newRow;
    }

    // Real Supabase Upload
    console.log('🔄 Uploading to Supabase...');
    
    try {
      // 1. Upload to Storage
      const fileName = `${Date.now()}-${file.name}`;
      console.log(`📤 Uploading file: ${fileName}`);
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('artworks')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('✅ File uploaded to storage');

      // 2. Get Public URL
      const { data: urlData } = supabase
        .storage
        .from('artworks')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;
      console.log('🔗 Public URL:', imageUrl);

      // 3. Insert into Database
      console.log('💾 Inserting into database...');
      const { data: insertData, error: insertError } = await (supabase as any)
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
      console.error('❌ Upload failed:', error);
      throw new Error('Failed to upload artwork to museum archives.');
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
