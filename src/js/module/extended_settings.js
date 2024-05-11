class ExtendedSettings {
    constructor(language = "ja", auto_reload = false, save_item = false, save_purchase = false) {
        this.language = language;
        this.auto_reload = auto_reload;
        this.save_item = save_item;
        this.save_purchase = save_purchase;
    }
}

export function makeExtensionSettingsFromObject(object) {
    return new ExtendedSettings(
        object.language || object.lang,
        object.auto_reload,
        object.save_item,
        object.save_purchase
    );
}

export default ExtendedSettings;
