function attachShippingInfo() {
    /**
     * https://accounts.booth.pm/ordersの内容に対して、配送情報を付与する
     */
    const orderLinks = document.querySelectorAll(
        "div.l-orders-index > div.sheet > div.l-orders-index-line-item-actions > a"
    );
    orderLinks.forEach((orderLink) => {
        const orderNumber = orderLink.getAttribute("href").replace("/orders/", "");
        getShippingInfo(orderNumber).then((shippingInfo) => {
            if (shippingInfo) {
                const orderCol = orderLink.parentElement.parentElement;
                const textContents = orderCol.querySelector("div.l-col");
                const badge = orderCol.querySelector("div.badge");
                if (
                    badge.classList.contains("cancelled") ||
                    badge.classList.contains("dispatched")
                ) {
                    return;
                }
                const span = document.createElement("span");
                span.innerHTML = badge.outerHTML + shippingInfo;
                // textContentsの最初にspanを追加する
                textContents.insertBefore(span, textContents.firstChild);
                // badgeを削除する
                badge.remove();
            }
        });
    });
}

async function getShippingInfo(orderNumber) {
    /**
     * https://accounts.booth.pm/orders/orderNumberを開く
     * div.l-order-detail-by-shop > div.sheet-group > div.sheet > div.badge が存在すれば、配送情報がある
     * 無ければ、配送情報が無い
     * 配送情報がある場合、div.badge自身のHTMLを返却する
     * 配送情報が無い場合、nullを返却する
     */
    const url = `https://accounts.booth.pm/orders/${orderNumber}`;
    const response = await fetch(url);
    const html = await response.text();
    const dom = new DOMParser().parseFromString(html, "text/html");
    const badge = dom.querySelector(
        "div.l-order-detail-by-shop > div.sheet-group > div.sheet > div.badge"
    );
    if (badge) {
        // クラスにcancelledが含まれる場合は、nullを返却する
        if (badge.classList.contains("cancelled") || badge.classList.contains("dispatched")) {
            return null;
        }
        // badgeのtext処理
        // classの値をu-align-middle,u-mx-0からそれぞれu-align-top,u-mx-2に変更する
        badge.classList.remove("u-align-middle");
        badge.classList.remove("u-mx-0");
        badge.classList.add("u-align-top");
        badge.classList.add("u-mx-2");
        return badge.outerHTML;
    }
    return null;
}

function main() {
    attachShippingInfo();
}

main();
