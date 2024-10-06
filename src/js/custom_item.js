/**
 * matches: "https://*.booth.pm/* /items/*",
 * このスクリプトはアイテムページに関する処理を記述します
 */

let itemData;
async function getItemDataModule() {
    const src = chrome.runtime.getURL("./js/module/item_data.js");
    itemData = await import(src);
}

async function getSettingsModule() {
    const src = chrome.runtime.getURL("./js/module/settings_data.js");
    return await import(src);
}

const itemGetJa = {
    saveItem: "Save",
    clicksaveItem: "データを保存しました。"
};
const itemGetEn = {
    saveItem: "Save",
    clicksaveItem: "Saved."
};

var itemGetLang = itemGetJa;
if (window.navigator.language !== "ja" && window.navigator.language !== "ja-JP") {
    itemGetLang = itemGetEn;
}

async function addData(additionalData = {}) {
    const url = window.location.href + ".json";
    const response = await fetch(url);
    const text = await response.text();
    const raw_data = JSON.parse(text);
    console.log(raw_data);
    const tags = raw_data.tags.map((tag) => tag.name);
    const statusArray = raw_data.variations.map((item) => item.status);

    const data = {
        name: raw_data.name,
        images: raw_data.images,
        description: raw_data.description,
        shop: raw_data.shop,
        id: raw_data.id,
        price: raw_data.price,
        url: raw_data.url,
        tags: tags,
        category: raw_data.category.name,
        status: statusArray,
        wished: raw_data.wished,
        ...additionalData
    };
    // 追加のデータを取得して保存
    const additionalDescriptionElement = document.querySelector(".description.empty\\:hidden");
    if (additionalDescriptionElement && additionalDescriptionElement.children.length > 0) {
        const additionalDescription = additionalDescriptionElement.innerHTML;
        data.additionalDescription = additionalDescription;
    }

    await itemData.addItem(data);
}

function addSaveButton() {
    // div要素を作成
    const divElement = document.createElement("div");
    const buttonElement = document.createElement("button");
    buttonElement.className =
        "border-2 border-border500 box-border cursor-pointer flex gap-4 h-[48px] items-center px-12 rounded-8 select-none text-text-gray300 bg-surface1 shop__background--contents shop__border--text40 shop__text ml-8";
    var icon = document.createElement("i");
    icon.className = "icon-download s-1x";
    var text = document.createElement("span");
    text.classList.add("u-align-middle");
    text.textContent = itemGetLang.saveItem;
    buttonElement.appendChild(icon);
    buttonElement.appendChild(text);
    buttonElement.addEventListener("click", () => {
        addData();
        window.alert(itemGetLang.clicksaveItem);
    });

    divElement.appendChild(buttonElement);

    // div要素を既存の要素に追加
    var intervalId = setInterval(() => {
        // 検索バーの要素を取得
        var share_btn = document.querySelector(`div.flex.items-start.mt-8 div.mr-auto`);
        if (share_btn) {
            clearInterval(intervalId);
            share_btn.className = "flex mr-auto";
            // console.log(share_btn);
            share_btn.appendChild(divElement);
        }
    }, 1000);
}

function addDownloadedItem() {
    const cartElements = document.querySelectorAll(".variation-cart");
    cartElements.forEach((cart) => {
        // 子要素にdivタグ且つclassが"restock-request-links"がある場合は起動しない
        const div = cart.querySelector("div.restock-request-links");
        if (div) {
            return;
        }
        // 各 '.variation-cart' 要素の子要素がaタグである場合
        const anchor = cart.querySelector("a");
        if (anchor) {
            // クリックイベントリスナを追加
            anchor.addEventListener("click", function (event) {
                handleButtonClick(event, anchor, { download: true });
            });
        }
    });
}

function addRestockItem() {
    const cartElements = document.querySelectorAll(".variation-cart");
    cartElements.forEach((cart) => {
        // 各 '.variation-cart' 要素の子要素がdivタグ且つclassが"restock-request-links"である場合
        const div = cart.querySelector("div.restock-request-links");
        if (div) {
            // クリックイベントリスナを追加
            // divにrequestedというクラスがある場合は、restock=falseにする
            div.addEventListener("click", function (event) {
                if (div.classList.contains("requested")) {
                    handleButtonClick(event, div, { restock: false });
                }
                else {
                    handleButtonClick(event, div, { restock: true });
                }
            });
        }
    });
}

function handleButtonClick(event, anchorElement, data) {
    // ここで何らかのデータを収集または処理を行う
    console.log("Button clicked:", anchorElement.href);

    // 例: ダウンロードリンクを取得する
    const downloadLink = anchorElement.href;
    console.log("Download link:", downloadLink);

    // その他の必要な処理...
    addData(data);
}

function validateItemPage() {
    if (document.body.children[0].className == "dialog") {
        return false;
    }
    return true;
}

function redirectToEn() {
    const url = window.location.href;
    // リダイレクト
    console.log(url);
    // もし、*://*booth.pm/en/items/* の場合はそのまま
    if (url.match(/.*booth\.pm\/en\/items\/.*/)) {
        mountDeletedItem();
    }
    else {
        // url候補:
        // https://booth.pm/ja/items/xxxxxx to https://428_tm.booth.pm/en/items/xxxxxx
        if (url.match(/.*booth\.pm\/ja\/items\/.*/)) {
            window.location.href = url.replace(/booth\.pm\/ja/, "428_tm.booth.pm/en");
        }
        // https://hoge.booth.pm/items/xxxxxx to https://hoge.booth.pm/en/items/xxxxxx
        if (url.match(/.*booth\.pm\/items\/.*/)) {
            window.location.href = url.replace(/booth\.pm/, "booth.pm/en");
        }
    }
}

async function mountDeletedItem() {
    // window.location.href から itemID を取得
    var itemId = itemData.getItemId(window.location.href.match(/\/items\/(\d+)/)[1]);
    if (itemData === undefined) {
        await getItemDataModule();
    }
    const item = await itemData.getItem(itemId);
    if (item == null || item == undefined) {
        return;
    }

    // 動的な HTML 要素を作成
    var div = document.createElement("div");
    var warning = document.createElement("p");
    var title_h1 = document.createElement("h1");
    var image_img = document.createElement("img");
    var description_p = document.createElement("p");

    // テキストコンテンツを設定
    title_h1.textContent = item.name;
    title_h1.classList.add("font-bold", "leading-[32px]", "m-0", "text-[24px]");
    var des = item.description.replace("\\n", "<br>");
    console.log(des);
    warning.textContent = '*このページは、拡張機能"Better BOOTH"によって作成されています。';
    description_p.innerHTML = item.description.replace(/\n/g, "<br>");
    image_img.src = item.images[0].original;

    // bodyの直下のコンテンツを非表示にする
    var bodyChildren = document.body.children;
    for (var i = 0; i < bodyChildren.length; i++) {
        bodyChildren[i].style.display = "none";
    }

    // 要素を追加
    div.appendChild(warning);
    div.appendChild(title_h1);
    div.appendChild(image_img);
    div.appendChild(description_p);
    document.body.appendChild(div);
}

async function main() {
    await getItemDataModule();
    const settingsData = await getSettingsModule();
    const setting = await settingsData.getExtendedSettings();
    if (setting.language !== "ja") {
        itemGetLang = itemGetEn;
    }
    if (setting.save_item) {
        if (validateItemPage()) {
            addSaveButton();
            addDownloadedItem();
            addRestockItem();
        }
        else {
            redirectToEn();
        }
    }
}

main();
