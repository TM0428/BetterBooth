import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import {
    getFromSyncStorage,
    setToSyncStorage,
    removeFromLocalStorage
} from "../../src/js/module/chrome_storage";

describe("getFromSyncStorage", () => {
    beforeEach(() => {
        global.chrome = {
            storage: {
                sync: {
                    get: jest.fn()
                }
            },
            runtime: {
                lastError: null
            }
        };
    });

    it("should resolve when chrome.storage.sync.get succeeds", async () => {
        const key = "testKey";
        const value = "testValue";
        chrome.storage.sync.get.mockImplementation((key, callback) => {
            callback({ [key]: value });
        });

        await expect(getFromSyncStorage(key)).resolves.toBe(value);
        expect(chrome.storage.sync.get).toHaveBeenCalledWith(key, expect.any(Function));
    });

    it("should reject when chrome.runtime.lastError is set", async () => {
        const key = "testKey";
        const errorMessage = "An error occurred";
        chrome.runtime.lastError = new Error(errorMessage);
        chrome.storage.sync.get.mockImplementation((key, callback) => {
            callback();
        });

        await expect(getFromSyncStorage(key)).rejects.toThrow(errorMessage);
        expect(chrome.storage.sync.get).toHaveBeenCalledWith(key, expect.any(Function));
    });
});

describe("setToSyncStorage", () => {
    beforeEach(() => {
        global.chrome = {
            storage: {
                sync: {
                    set: jest.fn(),
                    getBytesInUse: jest.fn()
                }
            },
            runtime: {
                lastError: null
            }
        };
    });

    it("should resolve when chrome.storage.sync.set succeeds", async () => {
        const key = "testKey";
        const value = "testValue";
        chrome.storage.sync.getBytesInUse.mockImplementation((key, callback) => {
            callback(0);
        });
        chrome.storage.sync.set.mockImplementation((data, callback) => {
            callback();
        });

        await expect(setToSyncStorage(key, value)).resolves.toBeUndefined();
        expect(chrome.storage.sync.set).toHaveBeenCalledWith(
            { [key]: value },
            expect.any(Function)
        );
    });

    it("should reject when chrome.runtime.lastError is set", async () => {
        const key = "testKey";
        const value = "testValue";
        const errorMessage = "An error occurred";
        chrome.runtime.lastError = new Error(errorMessage);
        chrome.storage.sync.getBytesInUse.mockImplementation((key, callback) => {
            callback();
        });

        await expect(setToSyncStorage(key, value)).rejects.toThrow(errorMessage);
        expect(chrome.storage.sync.set).not.toHaveBeenCalled();
    });
});

describe("removeFromLocalStorage", () => {
    beforeEach(() => {
        global.chrome = {
            storage: {
                local: {
                    remove: jest.fn()
                }
            },
            runtime: {
                lastError: null
            }
        };
    });

    it("should resolve when chrome.storage.local.remove succeeds", async () => {
        const key = "testKey";
        chrome.storage.local.remove.mockImplementation((key, callback) => {
            callback();
        });

        await expect(removeFromLocalStorage(key)).resolves.toBeUndefined();
        expect(chrome.storage.local.remove).toHaveBeenCalledWith(key, expect.any(Function));
    });

    it("should reject when chrome.runtime.lastError is set", async () => {
        const key = "testKey";
        const errorMessage = "An error occurred";
        chrome.runtime.lastError = new Error(errorMessage);
        chrome.storage.local.remove.mockImplementation((key, callback) => {
            callback();
        });

        await expect(removeFromLocalStorage(key)).rejects.toThrow(errorMessage);
        expect(chrome.storage.local.remove).toHaveBeenCalledWith(key, expect.any(Function));
    });
});