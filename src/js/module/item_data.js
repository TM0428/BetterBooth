import {
    getFromLocalStorage,
    mergeToLocalStorage,
    removeFromLocalStorage,
    setToLocalStorage
} from "./chrome_storage";
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

export async function mergeItem(itemId, item) {
    // itemのマージの際は、既存のtagsを優先して保持する
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

export async function deleteItem(itemId) {
    const items = await getFromLocalStorage("items");
    const newItems = items.filter((item) => item != itemId);
    console.log(newItems);
    await setToLocalStorage("items", newItems);
    await removeFromLocalStorage(itemId);
    console.log("[item_data] item data: " + itemId + " deleted");
}

async function initItem(item) {
    // リスト作成と登録
    const itemId = getItemId(item);
    const items = [itemId];
    await setToLocalStorage("items", items);
    await setToLocalStorage(itemId, item);
}
