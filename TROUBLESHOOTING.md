# 🔍 Supabaseデータが表示されない場合のトラブルシューティング

## ✅ チェックリスト

### 1. `.env`ファイルの設定確認

`.env`ファイルに正しい認証情報が設定されているか確認してください。

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**取得方法:**
1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択
3. **Settings > API** を開く
4. **Project URL** と **anon/public key** をコピー

### 2. ブラウザコンソールで接続状況を確認

開発サーバーを起動後、ブラウザの開発者ツール（F12）を開き、コンソールを確認してください。

**正常な場合:**
```
✅ Supabase client initialized successfully
🔄 Fetching artworks from Supabase...
✅ Successfully fetched 3 artworks from Supabase
```

**MOCKモードの場合:**
```
⚠️ Supabase credentials not configured. Running in MOCK mode.
💡 Edit .env file and add your Supabase credentials to connect to real database
📦 Using MOCK data (Supabase not configured)
```

### 3. Supabaseのテーブル作成を確認

Supabaseダッシュボードの **SQL Editor** で以下を実行してください:

```sql
-- テーブルが存在するか確認
SELECT * FROM artworks LIMIT 5;
```

**エラーが出る場合:** テーブルが作成されていません。以下のSQLを実行してください:

```sql
create table public.artworks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  image_url text not null,
  title_en text not null,
  title_ja text,
  artist_en text not null,
  artist_ja text,
  period_en text not null,
  period_ja text,
  year_created text not null,
  description_en text,
  description_ja text,
  is_public boolean default true,
  view_count integer default 0
);

-- Row Level Security を有効化
alter table public.artworks enable row level security;

-- 読み取りポリシー（誰でも参照可能）
create policy "Public artworks are viewable by everyone"
  on public.artworks for select
  using (true);

-- 書き込みポリシー（誰でも追加可能 - デモ用）
create policy "Anyone can upload an artwork"
  on public.artworks for insert
  with check (true);
```

### 4. 初期データを投入

テーブルにデータがない場合、以下のSQLで初期データを投入してください:

```sql
insert into public.artworks 
  (title_en, title_ja, artist_en, artist_ja, year_created, period_en, period_ja, image_url)
values
  ('The Night Watch', '夜警', 'Rembrandt van Rijn', 'レンブラント・ファン・レイン', '1642', 'Dutch Golden Age', 'オランダ黄金時代', 'https://picsum.photos/seed/nightwatch/600/400'),
  ('Girl with a Pearl Earring', '真珠の耳飾りの少女', 'Johannes Vermeer', 'ヨハネス・フェルメール', '1665', 'Dutch Golden Age', 'オランダ黄金時代', 'https://picsum.photos/seed/vermeer/600/700'),
  ('The Starry Night', '星月夜', 'Vincent van Gogh', 'フィンセント・ファン・ゴッホ', '1889', 'Post-Impressionism', 'ポスト印象派', 'https://picsum.photos/seed/starry/800/600');
```

### 5. ストレージバケットの作成（画像アップロード用）

画像をアップロードする場合は、Storageバケットが必要です。

1. Supabase Dashboard の **Storage** を開く
2. **New Bucket** をクリック
3. 名前: `artworks`
4. **Public bucket** を ON にする
5. 作成

**ポリシー設定（SQL）:**
```sql
-- 読み取り許可
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'artworks' );

-- アップロード許可
create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'artworks' );
```

### 6. 開発サーバーの再起動

`.env`ファイルを編集した後は、開発サーバーを再起動してください:

```bash
# ターミナルでCtrl+Cで停止
npm run dev
```

---

## 🐛 よくあるエラーと解決方法

### エラー: "Failed to fetch artworks from Supabase"

**原因:**
- RLS (Row Level Security) でアクセスが拒否されている
- テーブル名が間違っている

**解決策:**
```sql
-- RLSポリシーを確認
SELECT * FROM pg_policies WHERE tablename = 'artworks';

-- なければ作成
create policy "Public artworks are viewable by everyone"
  on public.artworks for select
  using (true);
```

### エラー: "Storage upload error"

**原因:**
- `artworks` バケットが存在しない
- Storageポリシーが設定されていない

**解決策:**
上記「手順5」を実行してください。

---

## 📞 サポート

それでも問題が解決しない場合は、以下の情報と共にお問い合わせください:

1. ブラウザコンソールのログ全文
2. Supabaseダッシュボードのテーブル一覧スクリーンショット
3. `.env`ファイルの内容（キーは伏せ字で）
