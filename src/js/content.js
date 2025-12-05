/**
 * matches: "https://*.booth.pm/*",
 * このスクリプトはbooth.pm全体に影響するものを記述します
 */

async function getSearchSettingsModule() {
    const src = chrome.runtime.getURL("./js/module/settings_data.js");
    return await import(src);
}
async function getFilterDataModule() {
    const src = chrome.runtime.getURL("./js/module/filter_data.js");
    return await import(src);
}

const contentJa = {
    keyword: "キーワードを入力",
    genre: "ジャンル、商品名など",
    gotoExtension: "拡張機能のページへ"
};
const contentEn = {
    keyword: "Search",
    genre: "Genre, Item Name, etc.",
    gotoExtension: "Go to Extension Page"
};
var contentLang = contentJa;
if (window.navigator.language !== "ja" && window.navigator.language !== "ja-JP") {
    contentLang = contentEn;
}

let reload_count = 0;

/**
 * boothの検索において、自動でソート条件を追加する関数
 */
async function attachOptionURL(searchSettings) {
    const settings = await searchSettings.getSearchSettings();
    // 設定から条件を指定しない場合は以下の処理を無視
    if (settings.disable === true) {
        return;
    }
    const age = settings.age;
    const sort = settings.sort;
    const in_stock = settings.in_stock;
    const new_arrival = settings.new_arrival;
    const aElements = document.querySelectorAll(`a`);
    aElements.forEach((aElement) => {
        // console.log(aElement);
        // 下のナビゲーションに含まれる場合は、ソート条件を維持させる
        if (aElement.classList.contains("nav-item")) return;
        // console.log(aElement.href);
        const regex = new RegExp("https?://booth.pm/.*/(search|browse)/.*");

        if (regex.test(aElement.href)) {
            var url = new URL(aElement.href);
            // console.log(url.href);
            if (age) {
                url.searchParams.set("adult", age);
            }
            if (sort) {
                url.searchParams.set("sort", sort);
            }
            if (in_stock) {
                url.searchParams.set("in_stock", "true");
            }
            if (new_arrival) {
                url.searchParams.set("new_arrival", "true");
            }
            aElement.href = url.href;
        }
    });
    if (reload_count < 3) {
        reload_count++;
        setTimeout(() => attachOptionURL(searchSettings), 1000);
    }
}

/**
 * 入力されたクエリから、検索URLを出力する関数
 */
async function setSearchOption(search_input, searchSettings) {
    const settings = await searchSettings.getSearchSettings();
    var value = search_input;
    if (search_input === "") {
        const input = document.getElementById("new-input-txtbox");
        value = input.value;
    }
    if (value === "") return;
    var url = new URL("https://booth.pm/ja/search/" + value);
    // console.log(settings);
    // 設定から条件を指定しない場合は以下の処理を無視
    if (settings.disable === true) {
        document.location.href = url.href;
        return;
    }
    console.log(settings);
    const age = settings.age;
    const sort = settings.sort;
    const in_stock = settings.in_stock;
    const new_arrival = settings.new_arrival;

    if (age) {
        url.searchParams.set("adult", age);
    }
    if (sort) {
        url.searchParams.set("sort", sort);
    }
    if (in_stock) {
        url.searchParams.set("in_stock", "true");
    }
    if (new_arrival) {
        url.searchParams.set("new_arrival", "true");
    }
    document.location.href = url.href;
}

/**
 * 検索ボックスを再生成するための部分
 */
function makeNewSearchTab(searchSettings) {
    // div要素を作成
    const divElement = document.createElement("div");
    divElement.classList.add(
        "new-item-search-box",
        "flex",
        "w-full",
        "max-w-[600px]",
        "box-border"
    );

    // input要素を作成
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.id = "new-input-txtbox";
    inputElement.autocomplete = "off";
    inputElement.ariaAutocomplete = "list";
    inputElement.ariaControls = "react-autowhatever-1";
    inputElement.classList.add(
        "!rounded-l-[5px]",
        "!h-[32px]",
        "box-border",
        "m-none",
        "!bg-ui-background400",
        "focus:!bg-white",
        "!border",
        "border-border500",
        "placeholder-shown:text-ellipsis"
    );
    inputElement.placeholder = contentLang.keyword;
    inputElement.addEventListener("focus", () => {
        inputElement.classList.add("focus");
    });
    inputElement.addEventListener("blur", () => {
        inputElement.classList.remove("focus");
    });
    inputElement.addEventListener("keydown", function (event) {
        if (event.keyCode === 13 && event.target.value) {
            setSearchOption("", searchSettings);
        }
        if (event.keyCode === 27 && inputElement.classList.contains("focus")) {
            inputElement.classList.remove("focus");
            divElement.classList.remove("focus");
            inputElement.blur();
        }
    });

    // react-autowhatever-1要素を作成
    const reactAutowhatever1Element = document.createElement("div");
    reactAutowhatever1Element.id = "react-autowhatever-1";
    reactAutowhatever1Element.role = "listbox";
    reactAutowhatever1Element.classList.add("item-search-input__suggestions_container");

    // div要素にinput要素とreact-autowhatever-1要素を追加
    const inputContainerElement = document.createElement("div");
    inputContainerElement.classList.add("item-search-input__container", "relative");
    inputContainerElement.appendChild(inputElement);
    inputContainerElement.appendChild(reactAutowhatever1Element);

    inputElement.addEventListener("focus", () => {
        inputElement.classList.add("focus");
        divElement.classList.add("focus");
    });
    inputElement.addEventListener("blur", () => {
        inputElement.classList.remove("focus");
        divElement.classList.remove("focus");
    });

    // button要素を作成
    const buttonElement = document.createElement("button");
    buttonElement.classList.add(
        "btn",
        "search",
        "top-[10%]",
        "absolute",
        "right-8",
        "w-auto",
        "p-4",
        "bg-transparent",
        "border-none"
    );
    buttonElement.setAttribute("aria-label", "検索");
    const iElement = document.createElement("i");
    iElement.classList.add("icon-search", "s-1x");
    buttonElement.appendChild(iElement);
    buttonElement.addEventListener("click", () => {
        if (inputElement.value !== "") {
            setSearchOption("", searchSettings);
        }
    });

    // form要素にbutton要素を追加
    inputContainerElement.appendChild(buttonElement);

    // form要素にdiv要素を追加
    divElement.appendChild(inputContainerElement);

    // div要素を既存の要素に追加
    var intervalId = setInterval(() => {
        var existingElement = document.querySelector("div.w-full.shrink div.item-search-box");
        if (existingElement) {
            clearInterval(intervalId);
            existingElement.prepend(divElement);
        }
    }, 1000);
}

function makeNewSPSearchTab(searchSettings) {
    // 新しい検索タブの要素を作成
    const newSearchTab = document.createElement("div");
    newSearchTab.classList.add("sp-item-search", "item-search");
    newSearchTab.setAttribute("data-url", "https://booth.pm/ja");
    newSearchTab.setAttribute("data-search-params", '{"portal_domain":"ja"}');
    newSearchTab.setAttribute(
        "data-product-list",
        "from market_top via global_nav to search_index"
    );
    newSearchTab.setAttribute("data-tracking", "submit");
    newSearchTab.style.display = "inline-block";
    newSearchTab.style.width = "100%";

    // 検索アイコンの要素を作成
    const searchIcon = document.createElement("i");
    searchIcon.classList.add("icon-search", "s-1x", "u-text-label");
    newSearchTab.appendChild(searchIcon);

    // テキスト入力フィールドの要素を作成
    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.name = "query";
    searchInput.id = "query";
    searchInput.placeholder = contentLang.genre;
    searchInput.classList.add("ac-tags", "item-search-input", "full-length", "tt-input");
    searchInput.autocomplete = "off";
    searchInput.spellcheck = "false";
    searchInput.dir = "auto";
    searchInput.style.backgroundColor = "transparent";
    newSearchTab.appendChild(searchInput);

    // 入力文字列を消すアイコンの要素を作成
    const clearIcon = document.createElement("i");
    clearIcon.classList.add(
        "icon-cancel-circle-fill",
        "search-clear",
        "js-search-clear",
        "u-text-gray-500",
        "u-pt-400"
    );
    clearIcon.style.display = "none";
    newSearchTab.appendChild(clearIcon);

    // テキスト入力完了時のイベントハンドラを設定
    searchInput.addEventListener("input", function () {
        if (this.value) {
            clearIcon.style.display = "flex";
        } else {
            clearIcon.style.display = "none";
        }
    });

    // 入力文字列を消すアイコンのクリックイベントハンドラを設定
    clearIcon.addEventListener("click", function () {
        searchInput.value = "";
        clearIcon.style.display = "none";
    });

    // テキスト入力完了時のイベントハンドラを設定
    searchInput.addEventListener("keydown", function (event) {
        if (event.keyCode === 13 && this.value) {
            setSearchOption(this.value, searchSettings);
        }
    });

    // 検索履歴の部分のURLを変換する
    const historyUl = document.querySelector("div.search-history ul");
    if (historyUl) {
        const historyList = historyUl.childNodes;
        chrome.storage.sync.get("settings", (result) => {
            const settings = result.settings;
            // console.log(settings);
            if (settings) {
                // 設定から条件を指定しない場合は以下の処理を無視
                if (result.settings.disable === true) {
                    return;
                }
                const age = settings.age;
                const sort = settings.sort;
                const in_stock = settings.in_stock;
                const new_arrival = settings.new_arrival;

                historyList.forEach((ul) => {
                    var url = new URL(ul.firstChild.href);
                    if (age) {
                        url.searchParams.set("adult", age);
                    }
                    if (sort) {
                        url.searchParams.set("sort", sort);
                    }
                    if (in_stock) {
                        url.searchParams.set("in_stock", "true");
                    }
                    if (new_arrival) {
                        url.searchParams.set("new_arrival", "true");
                    }
                    ul.firstChild.href = url.href;
                    // console.log(url.href);
                });
            }
        });
    }

    // div要素を既存の要素に追加
    var intervalId = setInterval(() => {
        // 検索バーの要素を取得
        const searchBar = document.querySelector(".sp-item-search.item-search");
        if (searchBar) {
            clearInterval(intervalId);
            // 元の検索バーの要素を非表示にする
            searchBar.style.display = "none";

            // 新しい検索タブを挿入
            searchBar.parentNode.insertBefore(newSearchTab, searchBar.nextSibling);
        }
    }, 1000);
}

function insertLinkIntoNav() {
    // 新しい<a>タグを作成
    const newLink = document.createElement("a");
    newLink.className = "no-underline text-text-default visited:text-text-default";
    newLink.href = "chrome-extension://ncbkofnnehldkacfhlodemjdcicdfopf/src/popup/popup.html";

    // <a>タグの中に<div>要素を作成し、その中にテキストを挿入
    const divElement = document.createElement("div");
    divElement.className = "px-24 py-[10px]";
    divElement.textContent = contentLang.gotoExtension;
    newLink.appendChild(divElement);

    // div要素を既存の要素に追加
    var intervalId = setInterval(() => {
        // nav要素を取得
        const pElement = document.querySelector("div.absolute.bg-white");
        if (pElement) {
            clearInterval(intervalId);
            const navElement = pElement.firstChild;
            // navの子要素として新しいリンクを挿入
            const existingChildren = navElement.children;
            if (existingChildren.length >= 2) {
                navElement.insertBefore(newLink, existingChildren[1]);
            } else {
                navElement.appendChild(newLink);
            }
        }
    }, 1000);
}

/**
 * ページ内のおすすめショップにある、ブロック済みのショップを非表示にする関数
 */
function blockRecommendShop(filterModule) {
    var intervalId = setInterval(() => {
        const Shops = document.querySelectorAll("div.shop-card");
        if (Shops.length > 0) {
            clearInterval(intervalId);
            Shops.forEach((shop) => {
                const shopUrl = shop.querySelector("a.text-ui").href;
                filterModule.getFilter().then((filterArray) => {
                    if (filterArray && filterArray.includes(shopUrl)) {
                        shop.style.display = "none";
                    }
                });
            });
        }
    }, 500);
    var intervalId2 = setInterval(() => {
        const Shops = document.querySelectorAll("div.following-shop-card");
        if (Shops.length > 0) {
            clearInterval(intervalId2);
            Shops.forEach((shop) => {
                const shopUrl = shop.querySelector("a.text-ui").href;
                filterModule.getFilter().then((filterArray) => {
                    if (filterArray && filterArray.includes(shopUrl)) {
                        shop.style.display = "none";
                    }
                });
            });
        }
    }, 500);
}

async function main() {
    const searchSettings = await getSearchSettingsModule();
    const filterModule = await getFilterDataModule();
    window.addEventListener("load", attachOptionURL(searchSettings));

    makeNewSearchTab(searchSettings);
    makeNewSPSearchTab(searchSettings);
    // testInit();
    // リンクをnav要素の子要素の2番目に挿入
    insertLinkIntoNav();
    blockRecommendShop(filterModule);
}

main();
