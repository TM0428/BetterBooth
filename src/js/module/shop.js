class Shop {
    constructor(thumbnail_url = "", subdomain = "", name = "", url = "", add_url) {
        this.thumbnail_url = thumbnail_url;
        this.subdomain = subdomain;
        this.name = name;
        this.url = url;
        if (Array.isArray(add_url)) {
            this.add_url = Array.from(add_url);
        }
        else if (typeof add_url == "object") {
            this.add_url = Object.values(add_url);
        }
        else {
            this.add_url = new Array();
        }
    }

    addUrl(url) {
        this.add_url.push(url);
    }
}

export function makeShopFromObject(shop) {
    return new Shop(shop.thumbnail_url, shop.subdomain, shop.name, shop.url, shop.add_url);
}

export default Shop;
