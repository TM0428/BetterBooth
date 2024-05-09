class SearchSettings {
    constructor(disable, age, in_stock, new_arrival, sort) {
        this.disable = disable;
        this.age = age;
        this.in_stock = in_stock;
        this.new_arrival = new_arrival;
        this.sort = sort;
    }
}

export function makeSearchSettingsFromObject(object) {
    return new SearchSettings(
        object.disable,
        object.age,
        object.in_stock,
        object.new_arrival,
        object.sort
    );
}

export default SearchSettings;
