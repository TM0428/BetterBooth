import { getFromSyncStorage, setToSyncStorage } from "./chrome_storage.js";

/**
 * ショップのブロックを追加する関数
 * @param {*} word ショップのURL
 */
export async function addFilter(word) {
    let filterArray = await getFromSyncStorage("filters");
    if (filterArray && !filterArray.includes(word)) {
        filterArray.push(word);
    }
    else {
        console.log("[filter_data] filter array init.");
        filterArray = [word];
    }
    await setToSyncStorage("filters", filterArray);
    console.log("[filter_data] filter add.");
}

/**
 * ショップのブロックを解除する関数
 * @param {*} word ショップのURL
 */
export async function removeFilter(word) {
    let filterArray = await getFromSyncStorage("filters");
    if (filterArray && filterArray.includes(word)) {
        const newfilterArray = filterArray.filter((n) => n !== word);
        await setToSyncStorage("filters", newfilterArray);
        console.log("[filter_data] filter remove.");
    }
}

export async function getFilter() {
    return await getFromSyncStorage("filters");
}
