# PWA Icons

このディレクトリには以下のサイズのアイコンが必要です:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## アイコンの生成方法

### オプション1: オンラインツール（推奨）

1. [https://realfavicongenerator.net/](https://realfavicongenerator.net/) にアクセス
2. `/public/icon.svg` をアップロード
3. 必要なサイズを選択して生成
4. ダウンロードしたファイルをこのディレクトリに配置

### オプション2: ImageMagick（コマンドライン）

```bash
# ImageMagickがインストールされている場合
convert icon.svg -resize 72x72 icon-72x72.png
convert icon.svg -resize 96x96 icon-96x96.png
convert icon.svg -resize 128x128 icon-128x128.png
convert icon.svg -resize 144x144 icon-144x144.png
convert icon.svg -resize 152x152 icon-152x152.png
convert icon.svg -resize 192x192 icon-192x192.png
convert icon.svg -resize 384x384 icon-384x384.png
convert icon.svg -resize 512x512 icon-512x512.png
```

### オプション3: PWA Asset Generator

```bash
npx @vite-pwa/assets-generator --preset minimal public/icon.svg
```

## 一時的な対処

アイコンが生成されるまで、`icon.svg`がフォールバックとして使用されます。
