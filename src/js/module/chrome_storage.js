const DEFAULT_STORAGE_CAPACITY = 7500;

function checkSyncStorageCapacity(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.getBytesInUse(key, (bytesInUse) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                if (bytesInUse >= DEFAULT_STORAGE_CAPACITY) {
                    reject(new Error("The storage capacity is full."));
                } else {
                    resolve();
                }
            }
        });
    });
}

/**
 * SyncStorageからデータを取得する関数
 * @param {*} key key
 * @returns data
 */
export function getFromSyncStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(result[key]);
            }
        });
    });
}

/**
 * SyncStorageにデータを保存する関数
 * @param {*} key key
 * @param {*} data data
 * @returns Promise(保存上限に達している場合はエラー)
 */
export async function setToSyncStorage(key, data) {
    try {
        await checkSyncStorageCapacity(key);
    } catch (error) {
        return Promise.reject(error);
    }
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [`${key}`]: data }, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve();
            }
        });
    });
}

export async function mergeToSyncStorage(key, data) {
    try {
        await checkSyncStorageCapacity(key);
    } catch (error) {
        return Promise.reject(error);
    }
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                const oldData = result[key];
                const mergedData = {
                    ...oldData,
                    ...data
                };
                chrome.storage.sync.set({ [`${key}`]: mergedData }, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError));
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

export function removeFromSyncStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.remove(key, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve();
            }
        });
    });
}

export function getFromLocalStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(result[key]);
            }
        });
    });
}

export function setToLocalStorage(key, data) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [`${key}`]: data }, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve();
            }
        });
    });
}

export function mergeToLocalStorage(key, data) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                const oldData = result[key];
                const mergedData = {
                    ...oldData,
                    ...data
                };
                chrome.storage.local.set({ [`${key}`]: mergedData }, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError));
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

export function removeFromLocalStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(key, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve();
            }
        });
    });
}
