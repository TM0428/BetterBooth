/**
 * matches: "*://*.booth.pm/*"
 * このスクリプトはそれぞれのショップページの全体に影響するものを記述します
 */

let filterData;
async function getFilterDataModule() {
    const src = chrome.runtime.getURL("./js/module/filter_data.js");
    filterData = await import(src);
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
var contentLang = customShopJa;
if (window.navigator.language !== "ja" && window.navigator.language !== "ja-JP") {
    contentLang = customShopEn;
}

/**
 * ブロック機能用のボタンを作成する関数
 */
async function addButton() {
    var filterArray = await filterData.getFilter();

    var parentDiv = document.querySelector("div.js-shop-follow");
    if (!parentDiv) return;
    const button = document.createElement("button");
    var icon = document.createElement("i");
    icon.className = "icon-attention s-1x";
    var text = document.createElement("span");
    text.classList.add("u-align-middle");
    // const htmlLang = document.documentElement.lang;
    var block = contentLang.block;
    var blocking = contentLang.blocking;
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
    button.addEventListener("click", () => {
        const url = window.location.origin + "/";
        var module_contents = document.querySelector("main.modules");
        if (button.classList.contains(NOW_BLOCK)) {
            button.classList.remove(NOW_BLOCK, "shop__background--contents", "shop__text--price");
            button.classList.add(NOT_BLOCK, "shop__text--contents");
            module_contents.style.display = "block";
            text.textContent = block;
            filterData.removeFilter(url);
        }
        else {
            button.classList.remove(NOT_BLOCK, "shop__text--contents");
            button.classList.add(NOW_BLOCK, "shop__background--contents", "shop__text--price");
            module_contents.style.display = "none";
            text.textContent = blocking;
            filterData.addFilter(url);
        }
    });
    parentDiv.appendChild(button);
}

async function main() {
    await getFilterDataModule();
    addButton();
}

main();
