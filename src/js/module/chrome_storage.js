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

export function setToSyncStorage(key, data) {
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

export function mergeToSyncStorage(key, data) {
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
