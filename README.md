# BetterBooth

![GitHub Release](https://img.shields.io/github/v/release/TM0428/BetterBooth)
![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/ncbkofnnehldkacfhlodemjdcicdfopf)
![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/ncbkofnnehldkacfhlodemjdcicdfopf)
[FireFox Version](https://github.com/TM0428/BetterBooth/releases)

![](public/icon/icon-128.png)<br>
[booth.pm](https://booth.pm)の若干不便に感じる部分を改変する拡張機能です。

## 実装項目

### shop filter

見たくないコンテンツを売っているショップを、検索欄から表示しないように設定します。<br>
また、ショップの商品一覧も表示されないように設定されます。

### search settings

Boothの検索では、毎回検索条件がクリアされてしまうため、何度も絞り込み検索をする必要があります。そこで、オプションから設定を保存することで、毎回同じ絞り込み検索をしてくれます。

対応項目は、年齢制限、ソート条件、在庫なし・販売終了を含む、最近公開された商品のみになります。

"esc"キーで入力状態から抜けられるようになります。

### save contents

ショップのオーナーが商品情報を削除しても、商品データを保存しておくことでいつでも確認できるようにする機能です。<br>
利用するためには、設定からonにする必要があります。

## Support

この拡張機能を気に入っていただけたら、Buy Me a Coffeeで開発を支援していただけると嬉しいです☕

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-FFDD00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/428_tm)

## Project Setup

```sh
npm install
```

### Development (UI Preview)

```sh
npm run dev
```

開発サーバーが起動したら、ブラウザで以下のURLを開くことで、拡張機能として読み込まずに各ページをプレビューできます。

- 保存したアイテム一覧(オプションページ): `http://localhost:5173/src/option/option.html#/`
- ポップアップ(設定画面): `http://localhost:5173/src/popup/popup.html`

開発サーバー上では `chrome.storage` が存在しないため、`src/option/dev_chrome_mock.js` がサンプルデータ入りのモックを自動で適用します(`import.meta.env.DEV` ガード付きのため、本番ビルドには含まれません)。

### Compile and Minify for Production

```sh
npm run build
```

拡張機能を管理から、"パッケージ化されていない拡張機能を読み込む"でdistフォルダを指定してください。
