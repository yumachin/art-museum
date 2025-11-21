# 🚀 Supabase接続セットアップガイド

Supabaseのデータベースに接続し、動的にデータを取得・保存できるようにします。

---

## 📋 手順

### ステップ 1: Supabaseプロジェクトを作成

1. [https://supabase.com](https://supabase.com) にアクセス
2. **Start your project** をクリックしてサインアップ/ログイン
3. **New Project** を作成
   - Organization: 任意
   - Name: `art-museum` (任意)
   - Database Password: 安全なパスワードを設定（保存しておく）
   - Region: 近い地域を選択（例: Northeast Asia (Tokyo)）
4. プロジェクトが作成されるまで待機（約2分）

---

### ステップ 2: データベーステーブルを作成

1. 左メニューの **SQL Editor** を開く
2. 以下のSQLをコピー＆ペーストして **Run** をクリック

```sql
-- 作品情報テーブル
create table public.artworks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  
  -- 画像URL
  image_url text not null,
  
  -- 作品情報（英語・日本語）
  title_en text not null,
  title_ja text,
  artist_en text not null,
  artist_ja text,
  period_en text not null,
  period_ja text,
  year_created text not null,
  
  -- 詳細説明
  description_en text,
  description_ja text,
  
  -- 管理用
  is_public boolean default true,
  view_count integer default 0
);

-- Row Level Security を有効化
alter table public.artworks enable row level security;

-- 誰でも参照可能
create policy "Public artworks are viewable by everyone"
  on public.artworks for select
  using (true);

-- 誰でも追加可能（デモ用）
create policy "Anyone can upload an artwork"
  on public.artworks for insert
  with check (true);

-- 初期データを投入
insert into public.artworks 
  (title_en, title_ja, artist_en, artist_ja, year_created, period_en, period_ja, image_url)
values
  ('The Night Watch', '夜警', 'Rembrandt van Rijn', 'レンブラント・ファン・レイン', '1642', 'Dutch Golden Age', 'オランダ黄金時代', 'https://picsum.photos/seed/nightwatch/600/400'),
  ('Girl with a Pearl Earring', '真珠の耳飾りの少女', 'Johannes Vermeer', 'ヨハネス・フェルメール', '1665', 'Dutch Golden Age', 'オランダ黄金時代', 'https://picsum.photos/seed/vermeer/600/700'),
  ('The Starry Night', '星月夜', 'Vincent van Gogh', 'フィンセント・ファン・ゴッホ', '1889', 'Post-Impressionism', 'ポスト印象派', 'https://picsum.photos/seed/starry/800/600'),
  ('The Birth of Venus', 'ヴィーナスの誕生', 'Sandro Botticelli', 'サンドロ・ボッティチェッリ', '1486', 'Early Renaissance', '初期ルネサンス', 'https://picsum.photos/seed/venus/800/500'),
  ('Guernica', 'ゲルニカ', 'Pablo Picasso', 'パブロ・ピカソ', '1937', 'Cubism / Surrealism', 'キュビズム / シュルレアリスム', 'https://picsum.photos/seed/guernica/900/400'),
  ('The Kiss', '接吻', 'Gustav Klimt', 'グスタフ・クリムト', '1908', 'Art Nouveau', 'アール・ヌーヴォー', 'https://picsum.photos/seed/klimt/500/500');
```

3. ✅ "Success. No rows returned" と表示されればOK

---

### ステップ 3: Storageバケットを作成（画像アップロード用）

1. 左メニューの **Storage** を開く
2. **New bucket** をクリック
3. 設定:
   - Name: `artworks`
   - **Public bucket** を **ON** にする
4. **Create bucket** をクリック
5. 作成した `artworks` バケットをクリック
6. 右上の **Policies** タブを開く
7. **New Policy** > **For full customization** をクリック
8. 以下の2つのポリシーを作成:

**読み取りポリシー:**
- Policy name: `Public Access`
- Allowed operation: `SELECT`
- Target roles: `public`
- USING expression: `true`

**アップロードポリシー:**
- Policy name: `Public Upload`
- Allowed operation: `INSERT`
- Target roles: `public`
- WITH CHECK expression: `true`

**または、SQL Editorで一括設定:**
```sql
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'artworks' );

create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'artworks' );
```

---

### ステップ 4: API認証情報を取得

1. 左メニューの **Settings** > **API** を開く
2. 以下の情報をコピー:
   - **Project URL** (例: `https://xxxxx.supabase.co`)
   - **Project API keys** > **anon public** の値

---

### ステップ 5: `.env`ファイルに認証情報を設定

1. VS Codeで `.env` ファイルを開く
2. 以下のように、コピーした値を貼り付ける:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

API_KEY=あなたのGemini APIキー
```

3. ファイルを保存（Cmd+S / Ctrl+S）

---

### ステップ 6: アプリを起動

ターミナルで以下を実行:

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

---

## ✅ 動作確認

### 1. データが表示されているか

- ギャラリーに作品が表示されていればOK
- ブラウザのコンソール（F12）を開いて以下のログを確認:

```
✅ Supabase client initialized successfully
🔄 Fetching artworks from Supabase...
✅ Successfully fetched 6 artworks from Supabase
```

### 2. 作品を追加できるか

1. 画面右上の **+** ボタンをクリック
2. 画像を選択し、情報を入力
3. **ARCHIVE WORK** をクリック
4. 画面に新しい作品が表示されればOK

---

## 🐛 トラブルシューティング

問題が発生した場合は `TROUBLESHOOTING.md` を参照してください。

---

## 🎉 完了！

これで、アプリがSupabaseの本番データベースに接続され、動的にデータを取得・保存できるようになりました。

MOCKモードとの違い:
- ✅ データがリロード後も永続化される
- ✅ 複数デバイス間でデータが同期される
- ✅ 本物の画像ストレージを使用
- ✅ スケーラブルな本番環境
