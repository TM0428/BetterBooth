import Shop, { makeShopFromObject } from "./shop";

class Item {
    constructor(
        name = "",
        images = [],
        description = "",
        shop = {},
        id = "",
        price = "",
        url = "",
        tags = [],
        category = "",
        status = [],
        wished = false,
        purchased = false,
        additionalDescription = "",
        download = false,
        restock = false
    ) {
        this.name = name;
        if (Array.isArray(images)) {
            this.images = Array.from(images);
        }
        else if (typeof images == "object") {
            this.images = Object.values(images);
        }
        else {
            this.images = new Array();
        }
        this.description = description;
        if (shop) {
            this.shop = makeShopFromObject(shop);
        }
        else {
            this.shop = new Shop();
        }
        this.id = id;
        this.price = price;
        this.url = url;
        if (Array.isArray(tags)) {
            this.tags = Array.from(tags);
        }
        else if (typeof tags == "object") {
            this.tags = Object.values(tags);
        }
        else {
            this.tags = new Array();
        }
        this.category = category;
        if (Array.isArray(status)) {
            this.status = Array.from(status);
        }
        else if (typeof status == "object") {
            this.status = Object.values(status);
        }
        else {
            this.status = new Array();
        }
        this.wished = wished;
        this.purchased = purchased;
        this.additionalDescription = additionalDescription;
        this.download = download;
        this.restock = restock;
    }
}

export function makeItemFromObject(item) {
    if (!item) {
        return null;
    }
    return new Item(
        item.name,
        item.images,
        item.description,
        item.shop,
        item.id,
        item.price,
        item.url,
        item.tags,
        item.category,
        item.status,
        item.wished,
        item.purchased,
        item.additionalDescription,
        item.download,
        item.restock
    );
}

export default Item;
