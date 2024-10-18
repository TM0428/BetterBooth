import {
    getFromSyncStorage,
    setToSyncStorage,
    getFromLocalStorage,
    setToLocalStorage
} from "./chrome_storage.js";

export const mode = {
    local: "local",
    sync: "sync"
};

/**
 * ショップのブロックを追加する関数
 * @param {*} word ショップのURL
 */
export async function addFilter(word, storageMode = mode.sync) {
    let filterArray;
    if (storageMode === mode.sync) {
        filterArray = await getFromSyncStorage("filters");
    }
    else {
        filterArray = await getFromLocalStorage("filters");
    }
    if (filterArray) {
        if (filterArray.includes(word)) {
            console.warn("[filter_data] already blocked");
            return;
        }
        else {
            filterArray.push(word);
        }
    }
    else {
        console.log("[filter_data] filter array init");
        filterArray = [word];
    }
    try {
        if (storageMode === mode.sync) {
            await setToSyncStorage("filters", filterArray);
        }
        else {
            await setToLocalStorage("filters", filterArray);
        }
        console.log("[filter_data] filter add");
    }
    catch (error) {
        throw new Error("Failed to set filters to storage");
    }
}

/**
 * ショップのブロックを解除する関数
 * @param {*} word ショップのURL
 */
export async function removeFilter(word, storageMode = mode.sync) {
    let filterArray;
    if (storageMode === mode.sync) {
        filterArray = await getFromSyncStorage("filters");
    }
    else {
        filterArray = await getFromLocalStorage("filters");
    }
    if (filterArray && filterArray.includes(word)) {
        const newfilterArray = filterArray.filter((n) => n !== word);
        try {
            if (storageMode === mode.sync) {
                await setToSyncStorage("filters", newfilterArray);
            }
            else {
                await setToLocalStorage("filters", newfilterArray);
            }
            console.log("[filter_data] filter remove");
        }
        catch (error) {
            throw new Error("Failed to remove filters to storage");
        }
    }
}

export async function convertStorageMode(fromstorageMode, toStorageMode) {
    const filterArray = await getFilter(fromstorageMode);
    if (toStorageMode === mode.sync) {
        // fromから削除
        await setFilter([], fromstorageMode);
        await setFilter([], toStorageMode);
    }
    else if (toStorageMode === mode.local) {
        // コピーしてから削除
        await setFilter(filterArray, toStorageMode);
        await setFilter([], fromstorageMode);
    }
}

export async function getFilter(storageMode = mode.sync) {
    if (storageMode === mode.sync) {
        return await getFromSyncStorage("filters");
    }
    else {
        return await getFromLocalStorage("filters");
    }
}

export async function setFilter(filter, storageMode = mode.sync) {
    if (storageMode === mode.sync) {
        await setToSyncStorage("filters", filter);
    }
    else {
        await setToLocalStorage("filters", filter);
    }
    console.log("[filter_data] filter set");
}
