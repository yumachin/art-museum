-- ============================================
-- Supabase Storage: artworks バケット作成
-- ============================================
-- このSQLをSupabaseのSQL Editorで実行してください。
-- または: supabase db push でマイグレーションとして適用できます。

-- 1. artworksバケットを作成（公開バケット）
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES (
  'artworks',
  'artworks',
  true,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  10485760  -- 10MB
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
  file_size_limit = 10485760;

-- 2. 誰でも画像を閲覧できるポリシー（公開読み取り）
CREATE POLICY "Public can view artwork images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'artworks');

-- 3. 認証済みユーザーまたは匿名ユーザーがアップロードできるポリシー
CREATE POLICY "Anyone can upload artwork images"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'artworks');

-- 4. 確認
SELECT id, name, public FROM storage.buckets WHERE id = 'artworks';
