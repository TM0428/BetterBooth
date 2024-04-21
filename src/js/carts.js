/*
const carts = document.querySelector("div.l-carts").querySelectorAll("div.cart-box");
carts.forEach((node) => {
    const shop = node.querySelector("div.cart-box__shop-name a");
    const base_url = shop.getAttribute("href");
    // console.log(base_url);
    const item = node.querySelectorAll("div.cart-item-container");
    item.forEach(n => {
        const item = n.querySelector("div.cart-item__name a");
        const itemURL = new URL(item.getAttribute("href"));
        const lang_URL = itemURL.pathname.substring(itemURL.pathname.indexOf('/') + 1);
        const newURL = base_url + lang_URL.substring(lang_URL.indexOf('/') + 1);
        console.log(itemURL);
        console.log(newURL);
        item.setAttribute("href", newURL);
    })
    // console.log(node);
})
*/
