/**
 * matches: "https://checkout.booth.pm/orders*",
 * このスクリプトは購入情報を取得するものを記述します
 */

let itemData;
async function getItemDataModule() {
    const src = chrome.runtime.getURL("./js/module/item_data.js");
    itemData = await import(src);
}

let item;
async function getItemModule() {
    const src = chrome.runtime.getURL("./js/module/item.js");
    item = await import(src);
}

let settings;
async function getSettingsModule() {
    const src = chrome.runtime.getURL("./js/module/settings_data.js");
    settings = await import(src);
}

async function getPurchaseData() {
    // クラス名 "hidden" を持つすべての要素を取得
    let elements = document.querySelectorAll("div.hidden");
    // 各要素から "data-product-id" の値を取得してコンソールに出力
    for (let i = 0; i < elements.length; i++) {
        const productId = elements[i].getAttribute("data-product-id");
        if (productId) {
            const url = "https://booth.pm/ja/items/" + String(productId) + ".json";
            const response = await fetch(url);
            const text = await response.text();
            const raw_data = JSON.parse(text);
            const tags = raw_data.tags.map((tag) => tag.name);
            const statusArray = raw_data.variations.map((item) => item.status);

            const dataObj = {
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
                purchased: true
            };
            const data = item.makeItemFromObject(dataObj);
            await itemData.addItem(data);
            console.log("[purchase] item data add");
        }
    }
}

async function main() {
    await getItemDataModule();
    await getItemModule();
    await getSettingsModule();
    const setting = await settings.getExtensionSettings();
    if (setting && setting.save_item && setting.save_purchase) {
        getPurchaseData();
    }
}

main();
