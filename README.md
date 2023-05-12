# BetterBooth

[booth.pm](https://booth.pm)の若干不便に感じる部分を改変する拡張機能です。
![](public/icon/icon-128.png)

## 実装項目
### shop filter
見たくないコンテンツを売っているショップを、検索欄から表示しないように設定します。<br>
また、ショップの商品一覧も表示されないように設定されます。
### search settings
Boothの検索では、毎回検索条件がクリアされてしまうため、何度も絞り込み検索をする必要があります。そこで、オプションから設定を保存することで、毎回同じ絞り込み検索をしてくれます。

対応項目は、年齢制限、ソート条件、在庫なし・販売終了を含む、最近公開された商品のみになります。

また、検索バーに"s"キーでアクセスできるようになります。同様に、"esc"キーで入力状態から抜けられるようになります。


## Project Setup

```sh
npm install
```

### Compile and Minify for Production

```sh
npm run build
```
