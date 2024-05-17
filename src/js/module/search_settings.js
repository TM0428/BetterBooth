class SearchSettings {
    constructor(
        disable = true,
        age = "default",
        in_stock = false,
        new_arrival = false,
        sort = "new"
    ) {
        this.disable = disable;
        this.age = age;
        this.in_stock = in_stock;
        this.new_arrival = new_arrival;
        this.sort = sort;
    }
}

export function makeSearchSettingsFromObject(object) {
    if (!object) {
        return new SearchSettings();
    }
    return new SearchSettings(
        object.disable,
        object.age,
        object.in_stock,
        object.new_arrival,
        object.sort
    );
}

export default SearchSettings;
