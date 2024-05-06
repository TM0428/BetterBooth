import {
    getFromSyncStorage,
    mergeToSyncStorage,
    removeFromSyncStorage,
    setToSyncStorage
} from "./chrome_storage.js";

export function getShopId(shop) {
    if (typeof shop == "string") {
        return "shop-" + shop;
    }
    else {
        return "shop-" + shop.subdomain;
    }
}

/**
 * ショップのブロックを追加する関数
 * @param {*} shop ショップのオブジェクト
 */
export async function addShop(shop) {
    const shops = await getFromSyncStorage("shops");
    if (shops) {
        const shopId = getShopId(shop);
        if (shops.includes(shopId)) {
            await mergeToSyncStorage(shopId, shop);
        }
    }
    else {
        console.log("[shop_data] init shop");
        initShop(shop);
    }
}

export async function getShops() {
    const shops = await getFromSyncStorage("shops");
    if (shops) {
        return shops;
    }
    else {
        return [];
    }
}

export async function getShop(shopId) {
    const shop = await getFromSyncStorage(shopId);
    if (shop) {
        return shop;
    }
    else {
        return {};
    }
}

export async function setShop(shop) {
    const shopId = getShopId(shop);
    await setToSyncStorage(shopId, shop);
    console.log("[shop-data] shop data set");
}

/**
 * ショップのデータをリセットする関数
 */
export async function resetShop() {
    const result = await getFromSyncStorage("shops");
    const shops = result.shops;
    await removeFromSyncStorage(shops);
    await removeFromSyncStorage("shops");
}

async function initShop(shop) {
    // リスト作成と登録
    const shopId = getShopId(shop);
    const shops = [shopId];
    await setToSyncStorage({ shops: shops });
    await setToSyncStorage({ [`${shopId}`]: shop });
}
