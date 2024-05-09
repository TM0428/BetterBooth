import { getFromSyncStorage, setToSyncStorage } from "./chrome_storage.js";
import { makeExtensionSettingsFromObject } from "./extension_settings.js";
import { makeSearchSettingsFromObject } from "./search_settings.js";

export async function getSearchSettings() {
    return await makeSearchSettingsFromObject(await getFromSyncStorage("settings"));
}

export async function setSearchSettings(searchSettings) {
    return await setToSyncStorage("settings", searchSettings);
}

export async function getExtensionSettings() {
    return await makeExtensionSettingsFromObject(await getFromSyncStorage("extended_settings"));
}

export async function setExtensionSettings(extensionSettings) {
    return await setToSyncStorage("extended_settings", extensionSettings);
}
