---
layout: page
title: アイテム検索について
permalink: /howto/
---


購入したものの、出品者がその情報を消してしまうと、情報にアクセス出来なくなってしまいます。

そこで、Chrome内にデータを保管し、Boothのページが無くなった後も確認できるようにしました。

## 使用方法について
使用するためには、拡張機能のオプションページより機能を有効にする必要があります。<br>
Extension Settings項目にある、`商品の情報を保存する`のチェックをオンにし、saveボタンを押してください。<br>
<img src="{{site.baseurl}}/images/extension_setting.png" style="height:350px">

## アイテムの追加方法について
アイテム詳細ページのところに、新しくボタンが配置されます。<br>
<img src="{{site.baseurl}}/images/button_itempage.png" style="height:350px">

このボタンをクリックすることでアイテムデータを自動で収集し、Chrome内に保存します。<br>

また、`購入した商品の情報を自動で保存する`をオンにしておくと、**購入が完了したとき**に情報を自動で保存します。<br>
無料ダウンロード商品は、商品をダウンロードする瞬間に自動で保存します。

## 保存したアイテムの確認方法について
chrome拡張機能->Better Booth->オプションをクリックすると、保存したアイテム一覧というページに着きます。<br>
![]({{site.baseurl}}/images/extension.png)
または、拡張機能の設定ページの下に商品一覧ページへのボタンがあります。

<br>
データが保存されている場合、このページに保存した商品一覧が表示されます。<br>
![](top.png)
アイテムはクリックすると詳細ページに飛ぶことができ、アイテムの説明欄などを見ることができます。

<img src="{{site.baseurl}}/images/list_item.png" style="height:350px">

## 検索方法について
検索には、キーワード検索の他にステータスでも検索することができます。
### is:cart
これは、購入済みの商品のみを表示します。

### is:download
ダウンロード可能な商品のみを表示します。



## 仕様について
この機能は、`chrome.storage.local`を使用しています。<br>
また、データ容量をできるだけ少なくするために、json形式を採用しています。

ver. ~0.3.5
```js=
{
    additionalDescription: "<section> ... </section>",
    Description: ...,
    id: ...,
    images: [...,],
    name: ...,
    price: ...,
    shop: {
        name: ...,
        subdomain: ...,
        url: ...
    }
}
```
ver. 0.4.0~
```
{
    additionalDescription: innerHTML,
    Description: String
    id: Int
    images: List[Dict{
        original: String,
        resized: String
    }],
    name: String,
    price: String
    shop: {
        name: String,
        subdomain: String,
        url: String
    },
    status: List[String],
    tags: List[String],
    purchased: Bool,
    download: Bool
}
```
`ver. 0.4.0`以降は、表示情報を増やすため、データ量を増やしました。その代わり、検索がしやすくなったり、まとめやすくすることができるようになりました。

基本的には、BOOTH側が提供しているJSONファイルの一部を使用し、足りない部分をadditionalDescriptionで補っているという形になります。<br>
このデータ量は画像を含んでいないため、数百件を保存したとしても問題は無いと考えられますが、あまりにも多すぎる場合はストレージを圧迫する可能性が考えられます。<br>
その場合は、"データをエクスポート"からデータをダウンロードし、chromeからは削除してください。

