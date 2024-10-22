const DEFAULT_STORAGE_CAPACITY = 70;
export function getFromSyncStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                resolve(result[key]);
            }
        });
    });
}

function cionfirmSyncStorageCapacity(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.getBytesInUse(key, (bytesInUse) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                if (bytesInUse >= DEFAULT_STORAGE_CAPACITY) {
                    reject(new Error("The storage capacity is full."));
                }
                else {
                    resolve();
                }
            }
        });
    });
}

export async function setToSyncStorage(key, data) {
    try {
        await cionfirmSyncStorageCapacity(key);
    }
    catch (error) {
        return Promise.reject(error);
    }
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [`${key}`]: data }, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                resolve();
            }
        });
    });
}

export async function mergeToSyncStorage(key, data) {
    try {
        await cionfirmSyncStorageCapacity(key);
    }
    catch (error) {
        console.log(error);
        return new Error(error);
    }
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

export function removeFromSyncStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.remove(key, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
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
            }
            else {
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
            }
            else {
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
            }
            else {
                const oldData = result[key];
                const mergedData = {
                    ...oldData,
                    ...data
                };
                chrome.storage.local.set({ [`${key}`]: mergedData }, () => {
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

export function removeFromLocalStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(key, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            }
            else {
                resolve();
            }
        });
    });
}
