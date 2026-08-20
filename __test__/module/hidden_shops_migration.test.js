import { test, expect } from "@jest/globals";
import {
    normalizeShopUrl,
    extractShopUuid
} from "../../src/js/module/hidden_shops_migration.js";

test("normalizeShopUrl adds trailing slash", () => {
    expect(normalizeShopUrl("https://hoperabbit.booth.pm")).toBe("https://hoperabbit.booth.pm/");
});

test("normalizeShopUrl keeps trailing slash", () => {
    expect(normalizeShopUrl("https://hoperabbit.booth.pm/")).toBe("https://hoperabbit.booth.pm/");
});

test("normalizeShopUrl rejects invalid urls", () => {
    expect(normalizeShopUrl("https://booth.pm/")).toBe(null);
    expect(normalizeShopUrl("https://example.com/")).toBe(null);
    expect(normalizeShopUrl("https://evil.com/?u=https://a.booth.pm/")).toBe(null);
    expect(normalizeShopUrl("hoperabbit.booth.pm")).toBe(null);
    expect(normalizeShopUrl(null)).toBe(null);
    expect(normalizeShopUrl(undefined)).toBe(null);
});

test("extractShopUuid extracts uuid from shop page html", () => {
    const html =
        '<div class="js-shop-header-menu-buttons shrink-0 empty:hidden" ' +
        'data-shop-uuid="6f85b898-3c11-4621-a41e-767acaf7b19f"><div><button></button></div></div>';
    expect(extractShopUuid(html)).toBe("6f85b898-3c11-4621-a41e-767acaf7b19f");
});

test("extractShopUuid returns null when uuid is not found", () => {
    expect(extractShopUuid("<html><body>Just a moment...</body></html>")).toBe(null);
    expect(extractShopUuid('data-shop-uuid="not-a-uuid"')).toBe(null);
    expect(extractShopUuid(null)).toBe(null);
});
