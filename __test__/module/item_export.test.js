import { test, expect } from "@jest/globals";
import {
    itemToExportObject,
    validateItemData,
    sanitizeItemData
} from "../../src/js/module/item_export.js";
import { makeItemFromObject } from "../../src/js/module/item.js";

const storedItem = {
    name: "テストアイテム",
    images: [{ original: "https://example.com/a.jpg", resized: "https://example.com/a_s.jpg" }],
    description: "説明文",
    shop: {
        name: "テストショップ",
        subdomain: "testshop",
        thumbnail_url: "https://example.com/shop.jpg",
        add_url: []
    },
    id: 1234567,
    price: "1,500 JPY",
    url: "https://testshop.booth.pm/items/1234567",
    tags: ["VRChat", "衣装"],
    category: "3Dモデル",
    status: [],
    wished: true,
    purchased: true,
    additionalDescription: "",
    download: true,
    restock: false
};

test("itemToExportObject includes shop.url from Shop getter", () => {
    const item = makeItemFromObject(storedItem);
    // Shopクラスのurlはgetterのため、JSON.stringifyでは失われる
    expect(JSON.parse(JSON.stringify(item)).shop.url).toBeUndefined();
    const exported = itemToExportObject(item);
    expect(exported.shop.url).toBe("https://testshop.booth.pm");
});

test("export -> validate -> sanitize round trip", () => {
    const item = makeItemFromObject(storedItem);
    const exported = JSON.parse(JSON.stringify(itemToExportObject(item)));
    expect(validateItemData(exported)).toBe(true);

    const sanitized = sanitizeItemData(exported);
    expect(sanitized.id).toBe(storedItem.id);
    expect(sanitized.name).toBe(storedItem.name);
    expect(sanitized.price).toBe(storedItem.price);
    expect(sanitized.images).toEqual(storedItem.images);
    expect(sanitized.shop.subdomain).toBe(storedItem.shop.subdomain);
    expect(sanitized.tags).toEqual(storedItem.tags);
    expect(sanitized.purchased).toBe(true);
    expect(sanitized.download).toBe(true);

    // sanitize後のデータからShopのurlが再生成できること
    const restored = makeItemFromObject(sanitized);
    expect(restored.shop.url).toBe("https://testshop.booth.pm");
});

test("itemToExportObject keeps purchased undefined", () => {
    // makeItemFromObjectはpurchased:undefinedをfalseに変換するため、生のobjectで確認する
    const exported = itemToExportObject({ ...storedItem, purchased: undefined });
    expect("purchased" in exported).toBe(false);
});

test("itemToExportObject falls back resized to original", () => {
    const item = makeItemFromObject({
        ...storedItem,
        images: [{ original: "https://example.com/a.jpg" }]
    });
    const exported = itemToExportObject(item);
    expect(exported.images[0].resized).toBe("https://example.com/a.jpg");
});

test("validateItemData rejects invalid data", () => {
    expect(validateItemData(null)).toBe(false);
    expect(validateItemData("string")).toBe(false);
    expect(validateItemData({})).toBe(false);
    expect(validateItemData({ ...storedItem, name: "" })).toBe(false);
    expect(validateItemData({ ...storedItem, id: undefined })).toBe(false);
    expect(validateItemData({ ...storedItem, images: "not-array" })).toBe(false);
    expect(validateItemData({ ...storedItem, shop: null })).toBe(false);
});

test("validateItemData accepts string id and missing optional fields", () => {
    const minimal = {
        id: "9876",
        name: "minimal item",
        images: [{ original: "https://example.com/x.jpg" }],
        shop: { name: "shop", subdomain: "sub" }
    };
    expect(validateItemData(minimal)).toBe(true);
    const sanitized = sanitizeItemData(minimal);
    expect(sanitized.description).toBe("");
    expect(sanitized.tags).toEqual([]);
    expect("purchased" in sanitized).toBe(false);
});
