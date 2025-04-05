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

## Project Setup

```sh
npm install
```

### Compile and Minify for Production

```sh
npm run build
```

拡張機能を管理から、"パッケージ化されていない拡張機能を読み込む"でdistフォルダを指定してください。
