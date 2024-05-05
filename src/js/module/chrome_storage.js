export function getShopId(shop) {
    return "shop-" + shop.subdomain;
}

/**
 * ショップのブロックを追加する関数
 * @param {*} shop ショップのオブジェクト
 */
export async function addShop(shop) {
    const result = await getFromSyncStorage("shops");
    const shops = result.shops;
    if (shops) {
        console.log(shops);
    }
    else {
        console.log("init shop");
        console.log(shop);
        initShop(shop);
    }
}

export async function getShops() {
    const result = await getFromSyncStorage("shops");
    const shops = result.shops;
    if (shops) {
        console.log(shops);
        return shops;
    }
    else {
        return [];
    }
}

export function getShop(shopId) {
    chrome.storage.sync.get(shopId, (result) => {
        var shop = result[shopId];
        if (shop) {
            console.log(shop);
            return shop;
        }
    });
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

function getFromSyncStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                resolve(result);
            }
        });
    });
}

function setToSyncStorage(data) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(data, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                resolve();
            }
        });
    });
}

function removeFromSyncStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.remove(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                resolve(result);
            }
        });
    });
}
