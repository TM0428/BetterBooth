---
layout: page
title: how to
permalink: /howto/
---

*この機能は実験的機能のため、今後機能しなくなる可能性もあります。ご了承ください。*


# 購入物の保存機能について

購入したものの、出品者がその情報を消してしまうと、情報にアクセス出来なくなってしまいます。

そこで、Chrome内にデータを保管し、基本的な内容だけは確認できるようにしました。

# 使用方法について
使用するためには、拡張機能のオプションページより機能を有効にする必要があります。<br>
Extension Settings項目にある、商品の情報を保存する(実験的機能)のチェックをオンにし、saveボタンを押してください。

## アイテムの追加方法について
アイテム詳細ページのところに、新しくボタンが配置されます。<br>
このボタンをクリックすることでアイテムデータを自動で収集し、Chrome内に保存します。<br>

## 保存したアイテムの確認方法について
chrome拡張機能->Better Booth->オプションをクリックすると、保存したアイテム一覧というページに着きます。<br>
![]({{site.baseurl}}/images/extension.png)

<br>
データが保存されている場合、このページに保存した商品一覧が表示されます。<br>
![](top.png)
アイテムはクリックすると詳細ページに飛ぶことができ、アイテムの説明欄などを見ることができます。

![](itempage.png)

## アイテムの追加方法について
ver. 0.3.1より、アイテムのインポート機能の追加を行いました。<br>
これは、基本的にエクスポートしてしまったデータを再登録するための機能であり、自分で作成したファイルは基本的には機能しません。ご了承ください。

## 仕様について
この機能は、`chrome.storage.local`を使用しています。<br>
また、データ容量をできるだけ少なくするために、json形式を採用しています。

```js=
ver. ~0.3.5
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

ver. 0.4.0~
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

