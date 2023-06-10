function addFilter(word) {
    chrome.storage.sync.get('filters', (result) => {
        var filterArray = result.filters;
        if (filterArray && !filterArray.includes(word)) {
            filterArray.push(word);
            chrome.storage.sync.set({ filters: filterArray });
            console.log("filter add.");
        }
        else {
            filterArray = [word];
            chrome.storage.sync.set({ filters: filterArray });
            console.log("filter add.");
        }
    });
}

function filterList() {
    const marketGrid = document.querySelector("div.l-row.l-market-grid");
    const liElements = document.querySelectorAll(`li.item-card.l-card`);
    chrome.storage.sync.get('filters', (result) => {
        var filterArray = result.filters;
        if (filterArray) {
            // li要素の中から、指定された条件に一致する要素を取得する
            liElements.forEach(liElement => {
                const itemCardSummaryElement = liElement.querySelector('div.item-card__summary');
                const itemCardShopInfoElement = itemCardSummaryElement.querySelector('div.item-card__shop-info');
                const aElement = itemCardShopInfoElement.querySelector('a');

                if (aElement) {
                    // hrefValues.push(aElement.href);
                    if (filterArray.includes(aElement.href)) {
                        // console.log(liElement);
                        liElement.style.display = "none";
                    }
                    else {
                        // ユーザーの横に!マークを設置し、そこからブロックも可にする
                        var icon = document.createElement('i');
                        icon.className = 'icon-attention s-1x';
                        icon.display = "inline";
                        icon.style.cursor = "pointer";
                        icon.classList.add("block-btn_margin");

                        const shopName = aElement.querySelector('div.item-card__shop-name').textContent;
                        icon.addEventListener('click', () => {
                            var confirm = window.confirm("ショップ「" + shopName + "」をブロックしますか？");
                            if (confirm) {
                                addFilter(aElement.href);
                                filterReload(aElement.href);
                            }
                        });

                        liElement.querySelector('div.item-card__shop-info').appendChild(icon);
                        liElement.querySelector('div.item-card__shop-info').classList.add("u-justify-content-between");
                        liElement.querySelector('a.item-card__shop-name-anchor').display = "inline";
                    }
                }
            });
        }
        marketGrid.style.visibility = "visible";
    });
}

function filterReload(url) {
    const liElements = document.querySelectorAll(`li.item-card.l-card`);
    // li要素の中から、指定された条件に一致する要素を取得する
    liElements.forEach(liElement => {
        const itemCardSummaryElement = liElement.querySelector('div.item-card__summary');
        const itemCardShopInfoElement = itemCardSummaryElement.querySelector('div.item-card__shop-info');
        const aElement = itemCardShopInfoElement.querySelector('a');

        if (aElement && aElement.href === url) {
            liElement.style.display = "none";
        }
    });
}

function hasParentItemCard(target) {
    let currentElement = target;
    while (currentElement) {
        if (currentElement.classList.contains('item-card') && currentElement.classList.contains('l-card')) {
            return true;
        }
        currentElement = currentElement.parentElement;
    }
    return false;
}

/**
 * ページ上でコンテストメニューを表示した時に発生するイベント
 */
/*
document.addEventListener("contextmenu", function (event) {
    // イベント発生時の要素を保存
    clickedEl = event.target;
    if (hasParentItemCard(event.target)) {
        // li.item-card.l-cardの子孫要素がクリックされたときの処理
        chrome.runtime.sendMessage({ type: "visibleContextMenu" });
    }
    else {
        chrome.runtime.sendMessage({ type: "unvisibleContextMenu" });
    }
}, true);
*/

/**
 * Background Scriptからのメッセージを受け取るためのリスナー
 */
/*
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message);
    if (message.type === "contextMenuClick") {
        // メッセージから情報を取得
        var target = message.target;
        var pageUrl = message.pageUrl;

        //alert("message pushed.");
        // メッセージを受信した後の処理
        // ...
        addFilter("hoge");
    }
    else if (message.type === "add-filter") {
        console.log("come here!!");
        addFilter(message.name);
    }
});

*/


filterList();