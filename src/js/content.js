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
async function getChromeStorageModule() {
    const src = chrome.runtime.getURL("./js/module/chrome_storage.js");
    return await import(src);
}
async function getMigrationModule() {
    const src = chrome.runtime.getURL("./js/module/hidden_shops_migration.js");
    return await import(src);
}

const contentJa = {
    keyword: "キーワードを入力",
    genre: "ジャンル、商品名など",
    gotoExtension: "拡張機能のページへ",
    noticeTitle: "Better BOOTHからのお知らせ",
    noticeBody:
        "BOOTH公式にショップの非表示機能が追加されました。Better BOOTHでブロック中のショップを、BOOTH本体の非表示リストへ移行できます。今まで通りBetter BOOTHでのブロックも有効です。(公式の上限は200件です)",
    noticeMigrate: "移行する",
    noticeClose: "閉じる",
    noticeProgress: (current, total) => `移行中... (${current}/${total})`,
    noticeResult: (migrated, skipped, failed, limit) => {
        let text = `${migrated}件を移行しました。`;
        if (skipped > 0) text += `(移行済みのため${skipped}件をスキップ)`;
        if (limit > 0) text += `(上限に達したため${limit}件は未移行)`;
        if (failed > 0) text += `(${failed}件は失敗)`;
        return text;
    },
    noticeCheckList: "非表示ショップ一覧を確認",
    noticeNeedLogin:
        "移行にはBOOTHへのログインが必要です。ログイン後にトップページを開くと、再度お知らせが表示されます。",
    noticeError: "エラーが発生しました。時間をおいて再度お試しください。"
};
const contentEn = {
    keyword: "Search",
    genre: "Genre, Item Name, etc.",
    gotoExtension: "Go to Extension Page",
    noticeTitle: "News from Better BOOTH",
    noticeBody:
        "BOOTH now officially supports hiding shops. You can migrate the shops blocked by Better BOOTH to BOOTH's own hidden shop list. Blocking by Better BOOTH keeps working as before. (The official limit is 200 shops.)",
    noticeMigrate: "Migrate",
    noticeClose: "Close",
    noticeProgress: (current, total) => `Migrating... (${current}/${total})`,
    noticeResult: (migrated, skipped, failed, limit) => {
        let text = `Migrated ${migrated} shop(s).`;
        if (skipped > 0) text += ` (${skipped} skipped: already hidden)`;
        if (limit > 0) text += ` (${limit} not migrated: limit reached)`;
        if (failed > 0) text += ` (${failed} failed)`;
        return text;
    },
    noticeCheckList: "Check your hidden shops",
    noticeNeedLogin:
        "You need to sign in to BOOTH to migrate. After signing in, open the top page again to see this notice.",
    noticeError: "An error occurred. Please try again later."
};
var contentLang = contentJa;
if (window.navigator.language !== "ja" && window.navigator.language !== "ja-JP") {
    contentLang = contentEn;
}

function getCurrentLang() {
    const match = window.location.pathname.match(/^\/(ja|en|ko|zh-cn|zh-tw)/);
    if (match) return match[1];

    const htmlLang = document.documentElement.lang;
    if (htmlLang) {
        if (htmlLang.toLowerCase().startsWith("zh")) {
            return htmlLang.toLowerCase();
        }
        return htmlLang.split("-")[0].toLowerCase();
    }

    return "ja";
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
        // ソート・フィルター設定のプルダウンメニュー内の場合は、リンクを変更しない
        if (aElement.closest("#js-market-result-pulldown")) return;
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
    const lang = getCurrentLang();
    var url = new URL("https://booth.pm/" + lang + "/search/" + value);
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
    const lang = getCurrentLang();
    newSearchTab.setAttribute("data-url", "https://booth.pm/" + lang);
    newSearchTab.setAttribute("data-search-params", '{"portal_domain":"' + lang + '"}');
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
function blockRecommendShop(filterModule, extended_settings) {
    var intervalId = setInterval(() => {
        const Shops = document.querySelectorAll("div.shop-card");
        if (Shops.length > 0) {
            clearInterval(intervalId);
            Shops.forEach((shop) => {
                const shopUrl = shop.querySelector("a.text-ui").href;
                filterModule.getFilter(extended_settings.getFilterMode).then((filterArray) => {
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
                filterModule.getFilter(extended_settings.getFilterMode).then((filterArray) => {
                    if (filterArray && filterArray.includes(shopUrl)) {
                        shop.style.display = "none";
                    }
                });
            });
        }
    }, 500);
}

/**
 * 新しい構造のアイテムカードのリンクをショップURLに変換する関数
 * @param {HTMLElement} itemCard - アイテムカードのラッパー要素
 */
function convertItemCardLinks(itemCard) {
    // ショップリンクを取得（ショップ名の部分）
    const shopLinkElement = itemCard.querySelector('a[href*="booth.pm"][href$="/"]');
    if (!shopLinkElement) return;

    const shopUrl = shopLinkElement.getAttribute("href");
    if (!shopUrl) return;

    // shopUrl を正規化（末尾を "/" に揃える）
    const normalizedShopUrl = shopUrl.endsWith("/") ? shopUrl : shopUrl + "/";

    // アイテムへのリンクを取得
    const itemLinks = itemCard.querySelectorAll('a[href*="/items/"]');
    itemLinks.forEach((itemLink) => {
        const itemHref = itemLink.getAttribute("href");
        if (!itemHref) {
            return;
        }

        // 絶対URLに変換して、既に shop の items パスを指しているか確認
        let absoluteItemUrl;
        try {
            absoluteItemUrl = new URL(itemHref, window.location.href).href;
        } catch (e) {
            // 不正な URL は変換対象外
            return;
        }

        if (absoluteItemUrl.startsWith(normalizedShopUrl + "items/")) {
            return; // 既に変換済みの場合はスキップ
        }

        // booth.pm/ja/items/xxx または booth.pm/items/xxx を shop.booth.pm/items/xxx に変換
        const itemIdMatch = itemHref.match(/\/items\/(\d+)/);
        if (itemIdMatch) {
            const newUrl = new URL(`items/${itemIdMatch[1]}`, shopUrl).toString();
            itemLink.setAttribute("href", newUrl);
        }
    });
}

/**
 * 動的に追加されるアイテムカードを監視し、リンクを変換する関数
 */
function observeItemCards(searchSettings) {
    // 既存の要素を処理
    const processExistingCards = () => {
        const itemCards = document.querySelectorAll("div.item-card-wrapper");
        itemCards.forEach(convertItemCardLinks);
    };

    // 初回実行
    processExistingCards();

    // MutationObserverで動的に追加される要素を監視
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // data-ga-section属性を持つ要素を探す
                    if (node.matches && node.matches("[data-ga-section]")) {
                        const itemCards = node.querySelectorAll("div.item-card-wrapper");
                        itemCards.forEach(convertItemCardLinks);
                    } else if (node.querySelector) {
                        const itemCards = node.querySelectorAll("div.item-card-wrapper");
                        itemCards.forEach(convertItemCardLinks);
                    }

                    // 要素自体がitem-card-wrapperの場合
                    if (node.matches && node.matches("div.item-card-wrapper")) {
                        convertItemCardLinks(node);
                    }
                }
            });
        });

        // リンクにオプションURLを付与
        attachOptionURL(searchSettings);
    });

    // body全体を監視対象に
    const targetNode = document.body;
    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(targetNode, config);

    // 念のため、1秒後にも再実行
    setTimeout(processExistingCards, 1000);
    setTimeout(processExistingCards, 2000);
}

async function getNoticeConstantsModule() {
    const src = chrome.runtime.getURL("./js/module/notice_constants.js");
    return await import(src);
}

/**
 * booth.pmのトップページ(メインページ)かどうかを判定する関数
 */
function isMarketTopPage() {
    if (window.location.host !== "booth.pm") return false;
    return /^\/(?:(?:ja|en|ko|zh-cn|zh-tw)\/?)?$/.test(window.location.pathname);
}

/**
 * お知らせIDを表示済みから外す関数(ログイン後に再表示したい場合など)
 */
async function unmarkNoticeShown(noticeId) {
    const storage = await getChromeStorageModule();
    const constants = await getNoticeConstantsModule();
    const shownIds = (await storage.getFromLocalStorage(constants.SHOWN_NOTICE_IDS_KEY)) || [];
    await storage.setToLocalStorage(
        constants.SHOWN_NOTICE_IDS_KEY,
        shownIds.filter((id) => id !== noticeId)
    );
}

/**
 * 未表示のお知らせをトップページに1件だけ表示する関数
 * お知らせの追加方法はnotice_constants.jsのコメントを参照
 */
async function showNotices(filterModule, extended_settings) {
    if (!isMarketTopPage()) return;

    const storage = await getChromeStorageModule();
    const constants = await getNoticeConstantsModule();

    // ポップアップの「移行」ボタンから要求された場合は、表示済みでも移行UIを表示する
    const migrationRequested = await storage.getFromLocalStorage(constants.MIGRATION_REQUEST_KEY);
    if (migrationRequested) {
        await storage.removeFromLocalStorage(constants.MIGRATION_REQUEST_KEY);
        await showHiddenShopsMigrationNotice(filterModule, extended_settings);
        return;
    }

    const shownIds = (await storage.getFromLocalStorage(constants.SHOWN_NOTICE_IDS_KEY)) || [];

    // お知らせの定義(上から順に、未表示かつshouldShowがtrueの最初の1件を表示する)
    const notices = [
        {
            id: constants.noticeIds.hiddenShopsMigration,
            shouldShow: async () => {
                // ブロック中のショップがなければ移行するものがないので表示しない
                const filterArray = await filterModule.getFilter(extended_settings.getFilterMode);
                return !!filterArray && filterArray.length > 0;
            },
            show: () => showHiddenShopsMigrationNotice(filterModule, extended_settings)
        }
    ];

    for (const notice of notices) {
        if (shownIds.includes(notice.id)) continue;
        if (!(await notice.shouldShow())) continue;
        // 1度のみ表示するため、表示時点でIDを保存する
        await storage.setToLocalStorage(constants.SHOWN_NOTICE_IDS_KEY, [...shownIds, notice.id]);
        await notice.show();
        break;
    }
}

/**
 * BOOTH本体の非表示機能への移行を通知するポップアップを表示する関数
 */
async function showHiddenShopsMigrationNotice(filterModule, extended_settings) {
    const filterArray = await filterModule.getFilter(extended_settings.getFilterMode);

    const notice = document.createElement("div");
    notice.className = "bb-migration-notice";

    const header = document.createElement("div");
    header.className = "bb-migration-notice__header";
    const title = document.createElement("span");
    title.className = "bb-migration-notice__title";
    title.textContent = contentLang.noticeTitle;
    const closeIcon = document.createElement("button");
    closeIcon.className = "bb-migration-notice__close";
    closeIcon.setAttribute("aria-label", contentLang.noticeClose);
    closeIcon.textContent = "×";
    header.appendChild(title);
    header.appendChild(closeIcon);

    const body = document.createElement("p");
    body.className = "bb-migration-notice__body";
    body.textContent = contentLang.noticeBody;

    const status = document.createElement("div");
    status.className = "bb-migration-notice__status";

    const actions = document.createElement("div");
    actions.className = "bb-migration-notice__actions";
    const migrateButton = document.createElement("button");
    migrateButton.className = "bb-migration-notice__button bb-migration-notice__button--primary";
    migrateButton.textContent = contentLang.noticeMigrate;
    const closeButton = document.createElement("button");
    closeButton.className = "bb-migration-notice__button";
    closeButton.textContent = contentLang.noticeClose;
    actions.appendChild(migrateButton);
    actions.appendChild(closeButton);

    notice.appendChild(header);
    notice.appendChild(body);
    notice.appendChild(status);
    notice.appendChild(actions);
    document.body.appendChild(notice);

    const closeNotice = () => notice.remove();
    closeIcon.addEventListener("click", closeNotice);
    closeButton.addEventListener("click", closeNotice);

    migrateButton.addEventListener("click", async () => {
        migrateButton.disabled = true;
        try {
            const migration = await getMigrationModule();
            const results = await migration.migrateFilters(filterArray, (current, total) => {
                status.textContent = contentLang.noticeProgress(current, total);
            });
            const count = (targetStatus) =>
                results.filter((result) => result.status === targetStatus).length;
            const failedResults = results.filter(
                (result) => result.status === migration.migrationStatus.failed
            );
            if (failedResults.length > 0) {
                console.warn("[migration] failed shops:", failedResults);
            }
            status.textContent = contentLang.noticeResult(
                count(migration.migrationStatus.migrated),
                count(migration.migrationStatus.skipped),
                count(migration.migrationStatus.failed),
                count(migration.migrationStatus.limit)
            );
            const listLink = document.createElement("a");
            listLink.className = "bb-migration-notice__link";
            listLink.href = "https://accounts.booth.pm/hidden_shops";
            listLink.target = "_blank";
            listLink.rel = "noopener";
            listLink.textContent = contentLang.noticeCheckList;
            status.appendChild(document.createElement("br"));
            status.appendChild(listLink);
            migrateButton.style.display = "none";
        } catch (error) {
            console.warn("[migration] error:", error);
            if (error.status === 401 || error.status === 403) {
                // 未ログインの場合は、ログイン後に再度お知らせを表示できるようにする
                const constants = await getNoticeConstantsModule();
                await unmarkNoticeShown(constants.noticeIds.hiddenShopsMigration);
                status.textContent = contentLang.noticeNeedLogin;
            } else {
                status.textContent = contentLang.noticeError;
            }
            migrateButton.disabled = false;
        }
    });
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
    const extended_settings = await searchSettings.getExtendedSettings();
    blockRecommendShop(filterModule, extended_settings);
    // 動的に追加されるアイテムカードを監視
    observeItemCards(searchSettings);
    // トップページのお知らせ表示
    showNotices(filterModule, extended_settings);
}

main();
