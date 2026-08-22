/**
 * matches: "*://accounts.booth.pm/dashboard*",
 * このスクリプトはダッシュボードページの商品リンクを
 * booth.pm/ja/items/xxx からショップURL(xxx.booth.pm/items/xxx)に変換します
 */

/**
 * アイテムカードのリンクをショップURLに変換する関数
 * @param {HTMLElement} itemCard - data-product-brand を持つアイテムカード要素
 */
function convertItemCardLinks(itemCard) {
    // data-product-brand にショップのサブドメインが入っている
    const brand = itemCard.getAttribute("data-product-brand");
    // サブドメインとして不正な値は変換対象外
    if (!brand || !/^[a-z0-9][a-z0-9_-]*$/i.test(brand)) {
        return;
    }

    const itemLinks = itemCard.querySelectorAll('a[href*="/items/"]');
    itemLinks.forEach((itemLink) => {
        const itemHref = itemLink.getAttribute("href");
        if (!itemHref) {
            return;
        }
        const itemIdMatch = itemHref.match(/\/items\/(\d+)/);
        if (!itemIdMatch) {
            return;
        }
        // 属性由来の値はエンコードしてからURLに組み込む
        const newUrl =
            "https://" + encodeURIComponent(brand) + ".booth.pm/items/" + encodeURIComponent(itemIdMatch[1]);
        if (itemHref !== newUrl) {
            itemLink.setAttribute("href", newUrl);
        }
    });
}

/**
 * 動的に追加されるアイテムカードを監視し、リンクを変換する関数
 */
function observeItemCards() {
    // 既存の要素を処理
    const processExistingCards = () => {
        const itemCards = document.querySelectorAll("li.item-card[data-product-brand]");
        itemCards.forEach(convertItemCardLinks);
    };

    // 初回実行
    processExistingCards();

    // MutationObserverで動的に追加される要素を監視
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches && node.matches("li.item-card[data-product-brand]")) {
                        convertItemCardLinks(node);
                    } else if (node.querySelectorAll) {
                        const itemCards = node.querySelectorAll("li.item-card[data-product-brand]");
                        itemCards.forEach(convertItemCardLinks);
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 念のため、時間差でも再実行
    setTimeout(processExistingCards, 1000);
    setTimeout(processExistingCards, 2000);
}

observeItemCards();
