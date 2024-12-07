import { test, expect } from "@jest/globals";
import { makeSearchSettingsFromObject } from "../../src/js/module/search_settings.js";

test("makeSearchSettingsFromObject", () => {
    const searchSettings = makeSearchSettingsFromObject({
        disable: true,
        age: "default",
        in_stock: false,
        new_arrival: true,
        sort: "new"
    });
    expect(searchSettings.disable).toBe(true);
    expect(searchSettings.age).toBe("default");
    expect(searchSettings.in_stock).toBe(false);
    expect(searchSettings.new_arrival).toBe(true);
    expect(searchSettings.sort).toBe("new");
});

test("makeSearchSettingsFromNullObject", () => {
    const searchSettings = makeSearchSettingsFromObject(null);
    expect(searchSettings.disable).toBe(true);
    expect(searchSettings.age).toBe("default");
    expect(searchSettings.in_stock).toBe(false);
    expect(searchSettings.new_arrival).toBe(false);
    expect(searchSettings.sort).toBe("new");
});
