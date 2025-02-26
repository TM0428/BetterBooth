import { mode } from "./filter_data.js";

class ExtendedSettings {
    constructor(
        language = "ja",
        auto_reload = false,
        save_item = false,
        save_purchase = false,
        filter_mode = mode.sync
    ) {
        this.language = language;
        this.auto_reload = auto_reload;
        this.save_item = save_item;
        this.save_purchase = save_purchase;
        this.filter_mode = filter_mode;
    }

    get getFilterMode() {
        if (this.filter_mode) {
            return this.filter_mode;
        }
        else {
            return mode.sync;
        }
    }

    set setFilterMode(value) {
        this.filter_mode = value;
    }
}

export function makeExtensionSettingsFromObject(object) {
    if (!object) {
        return new ExtendedSettings();
    }
    return new ExtendedSettings(
        object.language || object.lang,
        object.auto_reload,
        object.save_item,
        object.save_purchase,
        object.filter_mode
    );
}

export default ExtendedSettings;
