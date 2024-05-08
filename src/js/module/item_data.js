import { getFromLocalStorage, mergeToLocalStorage, setToLocalStorage } from "./chrome_storage";
import { makeItemFromObject } from "./item";

export function getItemId(item) {
    if (typeof item == "string") {
        return "items_" + item;
    }
    else {
        return "items_" + item.id;
    }
}

export async function addItem(item) {
    let items = await getFromLocalStorage("items");
    if (items) {
        const itemId = getItemId(item);
        if (items.includes(itemId)) {
            console.log("[item_data] item data merge");
            await mergeToLocalStorage(itemId, item);
        }
        else {
            console.log("[item_data] item data add");
            items.push(itemId);
            await setToLocalStorage("items", items);
            await setToLocalStorage(itemId, item);
        }
    }
    else {
        initItem(item);
    }
}

export async function mergeItem(item) {
    // itemのマージの際は、既存のtagsを優先して保持する
    const itemId = getItemId(item);
    const oldData = await getFromLocalStorage(itemId);
    const tags = oldData.tags;
    const mergedItem = {
        ...oldData,
        ...item,
        tags: tags
    };
    await setToLocalStorage(itemId, mergedItem);
}

export async function getItems() {
    return await getFromLocalStorage("items");
}

export async function getItem(itemId) {
    return makeItemFromObject(await getFromLocalStorage(itemId));
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

async function initItem(item) {
    // リスト作成と登録
    const itemId = getItemId(item);
    const items = [itemId];
    await setToLocalStorage("items", items);
    await setToLocalStorage(itemId, item);
}
