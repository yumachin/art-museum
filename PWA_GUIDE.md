# 🚀 PWA (Progressive Web App) 対応完了

Art Museum アプリが PWA に対応しました！

## ✨ 実装された機能

### 1. **アプリインストール機能**
- ブラウザから直接アプリをインストール可能
- ホーム画面にアイコンを追加してネイティブアプリのように起動
- スタンドアロンモードで全画面表示

### 2. **オフライン対応**
- Service Worker によるキャッシュ機能
- オフライン時でも閲覧可能
- オフライン状態を視覚的に通知

### 3. **パフォーマンス最適化**
- 画像の自動キャッシュ
- フォントのキャッシュ
- API レスポンスのキャッシュ（1時間）

### 4. **アイコンとマニフェスト**
- 複数サイズのアイコン生成済み
- maskable icon 対応（Android）
- Apple Touch Icon 対応（iOS）

---

## 📱 インストール方法

### Chrome / Edge (デスクトップ)
1. アプリを開く
2. アドレスバー右側の「インストール」アイコンをクリック
3. 「インストール」を確認

または:
- アプリ内に表示される「Install Art Museum」プロンプトから

### Chrome / Safari (モバイル)

#### Android (Chrome):
1. メニュー (⋮) を開く
2. 「アプリをインストール」または「ホーム画面に追加」を選択

#### iOS (Safari):
1. 共有ボタン (□↑) をタップ
2. 「ホーム画面に追加」を選択
3. 「追加」をタップ

---

## 🎨 生成されたアイコン

以下のアイコンが自動生成されました:

- `/pwa-64x64.png` - 小サイズアイコン
- `/pwa-192x192.png` - 標準アイコン
- `/pwa-512x512.png` - 大サイズアイコン
- `/maskable-icon-512x512.png` - Android用マスカブルアイコン
- `/apple-touch-icon-180x180.png` - iOS用アイコン
- `/favicon.ico` - ブラウザファビコン
- `/icon.svg` - ベクターアイコン

---

## ⚙️ キャッシュ戦略

### CacheFirst (長期キャッシュ)
以下のリソースは一度キャッシュされると長期間保存されます:
- Google Fonts (1年)
- 画像 (30日)
  - picsum.photos
  - Supabase Storage

### NetworkFirst (ネットワーク優先)
以下のリソースは常に最新データを取得しようとします:
- Supabase API
- タイムアウト: 10秒
- フォールバック: キャッシュ

---

## 🔧 開発者向け情報

### Service Worker の確認
1. Chrome DevTools を開く (F12)
2. **Application** タブを選択
3. **Service Workers** セクションで状態を確認

### キャッシュの確認
1. DevTools の **Application** タブ
2. **Cache Storage** を展開
3. 各キャッシュの内容を確認:
   - `google-fonts-cache`
   - `gstatic-fonts-cache`
   - `image-cache`
   - `supabase-images-cache`
   - `api-cache`

### キャッシュのクリア
開発中にキャッシュをクリアする場合:

```bash
# ブラウザで Shift + 再読み込み

# または DevTools で:
Application > Clear storage > Clear site data
```

---

## 📦 ビルドと本番環境

### ビルド
```bash
npm run build
```

### プレビュー
```bash
npm run preview
```

### 本番環境での確認事項
- [x] Service Worker が正常に登録される
- [x] HTTPS で配信されている（必須）
- [x] manifest.json が正しく提供される
- [x] すべてのアイコンが読み込める

---

## 🌐 対応ブラウザ

| ブラウザ | インストール | Service Worker | オフライン |
|---------|------------|----------------|-----------|
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Chrome (Android) | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Safari (iOS 16.4+) | ✅ | ✅ | ✅ |
| Firefox | ⚠️ Manual | ✅ | ✅ |

---

## 🐛 トラブルシューティング

### インストールプロンプトが表示されない
1. HTTPS で配信されているか確認
2. manifest.json が正しいか確認
3. Service Worker が登録されているか確認
4. すでにインストール済みでないか確認

### オフラインで動作しない
1. Service Worker が active 状態か確認
2. キャッシュにデータが保存されているか確認
3. ネットワークタブで確認

### アイコンが表示されない
```bash
# アイコンを再生成
npx @vite-pwa/assets-generator --preset minimal public/icon.svg
```

---

## 📊 PWA スコア

Lighthouse で PWA スコアを確認できます:

```bash
# Chrome DevTools > Lighthouse
# PWA カテゴリでスコアを確認
```

目標スコア: **90+**

---

## 🎉 完了！

これで Art Museum アプリは完全な PWA として動作します:

✅ インストール可能  
✅ オフライン動作  
✅ 高速読み込み  
✅ ネイティブアプリ風の体験  
✅ 自動更新対応  

アプリをインストールして、ホーム画面から美術館を楽しんでください！
