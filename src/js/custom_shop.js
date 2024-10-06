/**
 * matches: "*://*.booth.pm/*"
 * このスクリプトはそれぞれのショップページの全体に影響するものを記述します
 */

let filterData;
let shopData;
async function getFilterDataModule() {
    const src = chrome.runtime.getURL("./js/module/filter_data.js");
    filterData = await import(src);
}
async function getShopDataModule() {
    const src = chrome.runtime.getURL("./js/module/shop_data.js");
    shopData = await import(src);
}
async function getSettingsModule() {
    const src = chrome.runtime.getURL("./js/module/settings_data.js");
    return await import(src);
}

const NOW_BLOCK = "shop__border--price";
const NOT_BLOCK = "shop__background--price";
const customShopJa = {
    block: "ブロック",
    blocking: "ブロック中"
};
const customShopEn = {
    block: "block",
    blocking: "blocking"
};
var customShopLang = customShopJa;
if (window.navigator.language !== "ja" && window.navigator.language !== "ja-JP") {
    customShopLang = customShopEn;
}

/**
 * ブロック機能用のボタンを作成する関数
 */
async function addButton(settingsData) {
    var filterArray = await filterData.getFilter();

    var parentDiv = document.querySelector("div.js-shop-follow");
    if (!parentDiv) return;
    const button = document.createElement("button");
    var icon = document.createElement("i");
    icon.className = "icon-attention s-1x";
    var text = document.createElement("span");
    text.classList.add("u-align-middle");
    // const htmlLang = document.documentElement.lang;
    var block = customShopLang.block;
    var blocking = customShopLang.blocking;
    if (filterArray && filterArray.includes(window.location.origin + "/")) {
        button.classList.add(
            "btn",
            "small-dense",
            NOW_BLOCK,
            "block-button",
            "shop__background--contents",
            "shop__text--price"
        );
        // ブロック中
        text.textContent = blocking;
        var contents = document.querySelector("main.modules");
        contents.style.display = "none";
    }
    else {
        button.classList.add(
            "btn",
            "small-dense",
            NOT_BLOCK,
            "block-button",
            "shop__text--contents"
        );
        // ブロック
        text.textContent = block;
    }
    button.appendChild(icon);
    button.appendChild(text);

    const extended_settings = await settingsData.getExtendedSettings();

    button.addEventListener("click", () => {
        const url = window.location.origin + "/";
        var module_contents = document.querySelector("main.modules");
        if (button.classList.contains(NOW_BLOCK)) {
            button.classList.remove(NOW_BLOCK, "shop__background--contents", "shop__text--price");
            button.classList.add(NOT_BLOCK, "shop__text--contents");
            module_contents.style.display = "block";
            text.textContent = block;
            filterData.removeFilter(url, extended_settings.getFilterMode);
        }
        else {
            button.classList.remove(NOT_BLOCK, "shop__text--contents");
            button.classList.add(NOW_BLOCK, "shop__background--contents", "shop__text--price");
            module_contents.style.display = "none";
            text.textContent = blocking;
            try {
                filterData.addFilter(url, extended_settings.getFilterMode);
            }
            catch (error) {
                alert("Failed to block shop");
            }
        }
    });
    parentDiv.appendChild(button);
}

async function addLink() {
    const shops = await shopData.getShopsList();
    const url = window.location.href;
    const match = url.match(/^(?:https?:\/\/)?([^/]+)/);
    const subdomain = match ? match[1].split(".")[0] : null;
    const shopId = shopData.getShopId(subdomain);
    if (shops.includes(shopId)) {
        // add link
        const shop = await shopData.getShop(shopId);
        shop.add_url.forEach((element) => {
            const aElement = document.createElement("a");
            aElement.classList.add(
                "border",
                "flex",
                "gap-4",
                "items-center",
                "no-underline",
                "rounded-oval",
                "shrink-0",
                "shop__border--text40",
                "!no-underline",
                "p-8"
            );
            aElement.href = element.url;
            aElement.setAttribute("target", "_blank");
            aElement.setAttribute("rel", "noopener");
            const pixivIconElement = document.createElement("pixiv-icon");
            pixivIconElement.classList.add("shop__text--link");
            pixivIconElement.setAttribute("name", "24/BoothGlobe");
            pixivIconElement.setAttribute("unsafe-non-guideline-scale", "0.833333333");
            aElement.appendChild(pixivIconElement);
            const links = document.querySelector("div.booth-description div.flex");
            links.appendChild(aElement);
        });
    }
}

async function main() {
    await getFilterDataModule();
    await getShopDataModule();

    const settingsData = await getSettingsModule();
    await addButton(settingsData);
    addLink();
}

main();
