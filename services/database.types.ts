// ============================================
// SUPABASE DATABASE TYPE DEFINITIONS
// ============================================
// Generated with: npx supabase gen types typescript
// You can regenerate this after schema changes

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artworks: {
        Row: {
          id: string
          created_at: string | null
          image_url: string
          title_en: string
          title_ja: string | null
          artist_en: string
          artist_ja: string | null
          period_en: string
          period_ja: string | null
          year_created: string
          description_en: string | null
          description_ja: string | null
          is_public: boolean | null
          view_count: number | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          image_url: string
          title_en: string
          title_ja?: string | null
          artist_en: string
          artist_ja?: string | null
          period_en: string
          period_ja?: string | null
          year_created: string
          description_en?: string | null
          description_ja?: string | null
          is_public?: boolean | null
          view_count?: number | null
        }
        Update: {
          id?: string
          created_at?: string | null
          image_url?: string
          title_en?: string
          title_ja?: string | null
          artist_en?: string
          artist_ja?: string | null
          period_en?: string
          period_ja?: string | null
          year_created?: string
          description_en?: string | null
          description_ja?: string | null
          is_public?: boolean | null
          view_count?: number | null
        }
      }
      ui_translations: {
        Row: {
          id: string
          key: string
          en: string
          ja: string
          created_at: string | null
        }
        Insert: {
          id?: string
          key: string
          en: string
          ja: string
          created_at?: string | null
        }
        Update: {
          id?: string
          key?: string
          en?: string
          ja?: string
          created_at?: string | null
        }
      }
    }
  }
}
