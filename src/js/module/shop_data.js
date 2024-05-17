import {
    getFromSyncStorage,
    mergeToSyncStorage,
    removeFromSyncStorage,
    setToSyncStorage
} from "./chrome_storage.js";
import { makeShopFromObject } from "./shop.js";

export function getShopId(shop) {
    if (typeof shop == "string") {
        return "shop_" + shop;
    }
    else {
        return "shop_" + shop.subdomain;
    }
}

/**
 * ショップのブロックを追加する関数
 * @param {*} shop ショップのオブジェクト
 */
export async function addShop(shop) {
    let shops = await getFromSyncStorage("shops");
    if (shops) {
        const shopId = getShopId(shop);
        if (shops.includes(shopId)) {
            console.log("[shop-data] shop data merge");
            await mergeToSyncStorage(shopId, shop);
        }
        else {
            console.log("[shop-data] shop data add");
            shops.push(shopId);
            await setToSyncStorage("shops", shops);
            await setToSyncStorage(shopId, shop);
        }
    }
    else {
        initShop(shop);
    }
}

export async function getShopsList() {
    const shops = await getFromSyncStorage("shops");
    if (shops) {
        return shops;
    }
    else {
        return [];
    }
}

export async function getShops() {
    const shopList = await getShopsList();
    const shops = [];
    for (const shopId of shopList) {
        shops.push(makeShopFromObject(await getFromSyncStorage(shopId)));
    }
    return shops;
}

export async function getShop(shopId) {
    return makeShopFromObject(await getFromSyncStorage(shopId));
}

export async function setShop(shop) {
    addShop(shop);
}

/**
 * ショップのデータをリセットする関数
 */
export async function resetShop() {
    const shops = await getFromSyncStorage("shops");
    await removeFromSyncStorage(shops);
    await removeFromSyncStorage("shops");
}

async function initShop(shop) {
    // リスト作成と登録
    console.log("[shop_data] init shop");
    const shopId = getShopId(shop);
    const shops = [shopId];
    await setToSyncStorage("shops", shops);
    await setToSyncStorage(shopId, shop);
}
