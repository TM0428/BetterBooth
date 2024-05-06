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
        const shopId = getShopId(shop);
        if (shops.includes(shopId)) {
            await mergeToSyncStorage(shopId, shop);
        }
    }
    else {
        console.log("init shop");
        initShop(shop);
    }
}

export async function getShops() {
    const result = await getFromSyncStorage("shops");
    const shops = result.shops;
    if (shops) {
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
            return shop;
        }
        else {
            return {};
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

export async function setItemData(data) {
    const itemId = "items_" + String(data.id);
    try {
        const result = await getFromLocalStorage("items");
        let items = result.items;

        if (items && !items.includes(itemId)) {
            // アイテムが存在しないとき
            items.push(itemId);
            await setToLocalStorage({ items: items });
            await setToLocalStorage({ [`${itemId}`]: data });
        }
        else if (items) {
            // 既にあるため、元のデータとのマージ
            const oldDataResult = await getFromLocalStorage(itemId);
            const oldData = oldDataResult[itemId];
            // oldDataのtagを一時保存
            data.tags = oldData.tags;

            await mergeToLocalStorage(itemId, data);
        }
        else {
            // リストの新規作成
            items = [itemId];
            await setToLocalStorage({ items: items });
            await setToLocalStorage({ [`${itemId}`]: data });
        }
        return 0;
    }
    catch (err) {
        console.error(err);
        return 1;
    }
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

function mergeToSyncStorage(key, data) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                const oldData = result[key];
                const mergedData = {
                    ...oldData,
                    ...data
                };
                chrome.storage.sync.set({ [`${key}`]: mergedData }, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError));
                    }
                    else {
                        resolve();
                    }
                });
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

function getFromLocalStorage(key) {
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

function setToLocalStorage(data) {
    return new Promise((resolve, reject) => {
        chrome.storage.Local.set(data, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                resolve();
            }
        });
    });
}

function mergeToLocalStorage(key, data) {
    return new Promise((resolve, reject) => {
        chrome.storage.Local.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                const oldData = result[key];
                const mergedData = {
                    ...oldData,
                    ...data
                };
                chrome.storage.Local.set({ [`${key}`]: mergedData }, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError));
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    });
}

/*
function removeFromLocalStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.Local.remove(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                resolve(result);
            }
        });
    });
}
*/
