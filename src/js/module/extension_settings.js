class ExtensionSettings {
    constructor(language = "ja", auto_reload, save_item, save_purchase) {
        this.language = language;
        this.auto_reload = auto_reload;
        this.save_item = save_item;
        this.save_purchase = save_purchase;
    }
}

export function makeExtensionSettingsFromObject(object) {
    return new ExtensionSettings(
        object.language || object.lang,
        object.auto_reload,
        object.save_item,
        object.save_purchase
    );
}

export default ExtensionSettings;
