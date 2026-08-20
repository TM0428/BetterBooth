/**
 * matches: "*://accounts.booth.pm/library*",
 * このスクリプトはライブラリページでのダウンロード操作を検知し、商品情報を保存します
 * ダウンロード方法（通常 / BOOTH Library Manager / VRoid Studio）を downloadTypes として区別して保存します
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

// downloadTypes に保存される値
const DOWNLOAD_TYPE = {
    normal: "normal",
    boothLibraryManager: "booth_library_manager",
    vroidStudio: "vroid_studio"
};

/**
 * クリックされた要素からダウンロード種別を判定する
 * 該当しない場合は null を返す
 *
 * ライブラリページのDOM構造（実測）:
 * - 通常DL: div.js-download-button[data-test="downloadable"] > button "ダウンロード"
 * - その他: div.js-download-button[data-test="other-downloads-button"]
 *     - トグルボタン "その他のDL方法"（保存対象外）
 *     - div.absolute（ドロップダウンパネル、常にDOM内にあり div.hidden で隠れる）
 *         - div "BOOTH Library ManagerでDL"
 *         - div "VRoid StudioでDL"
 */
function detectDownloadType(element) {
    const block = element.closest("div.js-download-button");
    if (block) {
        const testAttr = block.getAttribute("data-test");
        if (testAttr === "downloadable") {
            return DOWNLOAD_TYPE.normal;
        }
        if (testAttr === "other-downloads-button") {
            // ドロップダウンパネル内のクリックのみ対象（トグルボタンは対象外）
            if (!element.closest("div.absolute")) {
                return null;
            }
            // トグルボタンや行の親要素はパネル全体のテキストを含むため、
            // 片方のラベルだけを含む行のみを有効とする
            const row = element.closest("div");
            const text = row ? row.textContent : "";
            const isVroid = text.includes("VRoid Studio");
            const isBlm = text.includes("Library Manager");
            if (isVroid && !isBlm) {
                return DOWNLOAD_TYPE.vroidStudio;
            }
            if (isBlm && !isVroid) {
                return DOWNLOAD_TYPE.boothLibraryManager;
            }
            return null;
        }
        return null;
    }
    // 旧レイアウト向けフォールバック: /downloadables/ への直接リンク
    const trigger = element.closest("a, button");
    if (!trigger) {
        return null;
    }
    const href = trigger.getAttribute("href") || "";
    if (href.includes("/items/")) {
        return null;
    }
    if (href.includes("booth.pm/downloadables/")) {
        return DOWNLOAD_TYPE.normal;
    }
    return null;
}

/**
 * クリックされた要素の祖先を辿り、同じカード内の商品リンクから商品IDを取得する
 */
function findProductId(element) {
    let node = element.parentElement;
    while (node && node !== document.body) {
        const link = node.querySelector('a[href*="/items/"]');
        if (link) {
            const matched = link.getAttribute("href").match(/\/items\/(\d+)/);
            if (matched) {
                return matched[1];
            }
        }
        node = node.parentElement;
    }
    return null;
}

async function saveDownloadedItem(productId, downloadType) {
    const url = "https://booth.pm/ja/items/" + String(productId) + ".json";
    const response = await fetch(url);
    const text = await response.text();
    const raw_data = JSON.parse(text);
    const tags = raw_data.tags.map((tag) => tag.name);
    const statusArray = raw_data.variations.map((item) => item.status);

    // 保存済みの downloadTypes を引き継いで種別を追加する
    const stored = await itemData.getItem(itemData.getItemId(String(productId)));
    const oldTypes = stored && Array.isArray(stored.downloadTypes) ? stored.downloadTypes : [];
    const downloadTypes = Array.from(new Set([...oldTypes, downloadType]));

    // ギフトページ（/library/gifts）の場合は purchased を付けない
    const isGift = window.location.pathname.startsWith("/library/gifts");

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
        purchased: isGift ? (stored ? stored.purchased : false) : true,
        download: true,
        downloadTypes: downloadTypes
    };
    const data = item.makeItemFromObject(dataObj);
    await itemData.addItem(data);
    console.log("[library] item data add: " + productId + " (" + downloadType + ")");
}

function watchDownloadClicks() {
    // BOOTH Library Manager 拡張機能などが後から挿入するボタンにも反応できるよう、
    // document 全体でキャプチャする
    document.addEventListener(
        "click",
        (event) => {
            if (!(event.target instanceof Element)) {
                return;
            }
            const downloadType = detectDownloadType(event.target);
            if (!downloadType) {
                return;
            }
            const productId = findProductId(event.target);
            if (!productId) {
                console.log("[library] product id not found for download click");
                return;
            }
            saveDownloadedItem(productId, downloadType);
        },
        true
    );
}

async function main() {
    await getItemDataModule();
    await getItemModule();
    await getSettingsModule();
    const setting = await settings.getExtendedSettings();
    if (setting && setting.save_item) {
        watchDownloadClicks();
    }
}

main();
