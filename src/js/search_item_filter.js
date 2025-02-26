/**
 * matches: "*://booth.pm/ja/browse/*", "*://booth.pm/ja/search/*", "*://booth.pm/ja/items*",
 * このスクリプトはアイテムの検索ページに影響するものを記述します
 */

async function getFilterDataModule() {
    const src = chrome.runtime.getURL("./js/module/filter_data.js");
    return await import(src);
}
async function getSettingsModule() {
    const src = chrome.runtime.getURL("./js/module/settings_data.js");
    return await import(src);
}

const filterJa = {
    confirmBlockFront: "ショップ「",
    confirmBlockBack: "」をブロックしますか？",
    errorBlockShop:
        "ショップの保存数が上限に達しています。設定からFilterの保存方法を変更してください。"
};
const filterEn = {
    confirmBlockFront: 'Will you block the shop "',
    confirmBlockBack: '"?',
    errorBlockShop: "The number of shops saved has reached the limit. Please change the settings."
};
var filterLang = filterJa;
if (window.navigator.language !== "ja" && window.navigator.language !== "ja-JP") {
    filterLang = filterEn;
}

/**
 * フィルター情報を用いて、リストからブロックされているショップのアイテムを表示しないようにする関数
 */
async function filterList(settingsData, filterData) {
    const marketGrid = document.querySelector("div.l-row.l-market-grid");
    const liElements = document.querySelectorAll(`li.item-card.l-card`);
    const extended_settings = await settingsData.getExtendedSettings();

    const filterArray = await filterData.getFilter(extended_settings.getFilterMode);

    if (filterArray) {
        // li要素の中から、指定された条件に一致する要素を取得する
        liElements.forEach((liElement) => {
            const itemCardSummaryElement = liElement.querySelector("div.item-card__summary");
            const itemCardShopInfoElement = itemCardSummaryElement.querySelector(
                "div.item-card__shop-info"
            );
            const aElement = itemCardShopInfoElement.querySelector("a");

            if (aElement) {
                // hrefValues.push(aElement.href);
                if (filterArray.includes(aElement.href)) {
                    // console.log(liElement);
                    liElement.style.display = "none";
                }
            }
        });
    }
    if (marketGrid) marketGrid.style.visibility = "visible";
    // li要素の中から、指定された条件に一致する要素を取得する
    liElements.forEach((liElement) => {
        attachShopURL(liElement);
        attachBlockButton(liElement, extended_settings, filterData);
    });
}

function filterReload(url) {
    const liElements = document.querySelectorAll(`li.item-card.l-card`);
    // li要素の中から、指定された条件に一致する要素を取得する
    liElements.forEach((liElement) => {
        const itemCardSummaryElement = liElement.querySelector("div.item-card__summary");
        const itemCardShopInfoElement = itemCardSummaryElement.querySelector(
            "div.item-card__shop-info"
        );
        const aElement = itemCardShopInfoElement.querySelector("a");

        if (aElement && aElement.href === url) {
            liElement.style.display = "none";
        }
    });
}

/**
 * カード表示されたアイテムについて、
 * *://booth.pm/items/*のurlを*://*.booth.pm/items/*に変更する関数
 * @param {*} liElement
 */
function attachShopURL(liElement) {
    // リンクをbooth.pmから*.booth.pmに変更する
    const aElement = liElement.querySelector("div.item-card__shop-info a");
    const base_url = aElement.href;
    // console.log(base_url);
    const item = liElement.querySelector("div.item-card__title a");
    const itemURL = new URL(item.getAttribute("href"));
    const lang_URL = itemURL.pathname.substring(itemURL.pathname.indexOf("/") + 1);
    const newURL = base_url + lang_URL.substring(lang_URL.indexOf("/") + 1);
    item.setAttribute("href", newURL);
    const thumbs = liElement.querySelectorAll("a.js-thumbnail-image");
    thumbs.forEach((thumb) => {
        thumb.href = newURL;
    });
}

function attachBlockButton(liElement, extended_settings, filterData) {
    const itemCardSummaryElement = liElement.querySelector("div.item-card__summary");
    const itemCardShopInfoElement = itemCardSummaryElement.querySelector(
        "div.item-card__shop-info"
    );
    const aElement = itemCardShopInfoElement.querySelector("a");
    // ユーザーの横に!マークを設置し、そこからブロックも可にする
    var icon = document.createElement("i");
    icon.className = "icon-attention s-1x";
    icon.display = "inline";
    icon.style.cursor = "pointer";
    icon.classList.add("block-btn_margin");

    const shopName = aElement.querySelector("div.item-card__shop-name").textContent;
    icon.addEventListener("click", async () => {
        var confirm = window.confirm(
            filterLang.confirmBlockFront + shopName + filterLang.confirmBlockBack
        );
        if (confirm) {
            try {
                await filterData.addFilter(aElement.href, extended_settings.getFilterMode);
                filterReload(aElement.href);
            }
            catch (error) {
                alert(filterLang.errorBlockShop);
            }
        }
    });

    liElement.querySelector("div.item-card__shop-info").appendChild(icon);
    liElement.querySelector("div.item-card__shop-info").classList.add("u-justify-content-between");
    liElement.querySelector("a.item-card__shop-name-anchor").display = "inline";
}

async function main() {
    const filterData = await getFilterDataModule();
    const settingsData = await getSettingsModule();
    await filterList(settingsData, filterData);
}

main();
