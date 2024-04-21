export async function setItemData(data) {
    const itemId = "items_" + String(data.id);
    try {
        const result = await getFromStorage("items");
        let items = result.items;

        if (items && !items.includes(itemId)) {
            // アイテムが存在しないとき
            items.push(itemId);
            await setToStorage({ items: items });
            await setToStorage({ [`${itemId}`]: data });
        }
        else if (items) {
            // 既にあるため、元のデータとのマージ
            const oldDataResult = await getFromStorage(itemId);
            const oldData = oldDataResult[itemId];
            // oldDataのtagを一時保存
            const oldTag = oldData.tags;

            const mergedData = {
                ...oldData,
                ...data,
                tags: oldTag
            };
            await setToStorage({ [`${itemId}`]: mergedData });
        }
        else {
            // リストの新規作成
            items = [itemId];
            await setToStorage({ items: items });
            await setToStorage({ [`${itemId}`]: data });
        }
        return 0;
    }
    catch (err) {
        console.error(err);
        return 1;
    }
}

function getFromStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                resolve(result);
            }
        });
    });
}

function setToStorage(data) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(data, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                resolve();
            }
        });
    });
}
