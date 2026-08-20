/**
 * Service Worker (ESM)
 * - ショップページのHTMLを取得してshop_uuidを解決する
 *   (コンテンツスクリプトはCORSの制約で他サブドメインのHTMLを取得できないため)
 * - 新規インストール時に既存のお知らせを表示済みにする
 *   (お知らせをバージョンアップ時のみ表示するため)
 */

import { allNoticeIds, SHOWN_NOTICE_IDS_KEY } from "./module/notice_constants.js";

const SHOP_UUID_REGEX =
    /data-shop-uuid="([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"/;

function isBoothShopUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" && /^[a-z0-9-]+\.booth\.pm$/.test(parsed.hostname);
    } catch {
        return false;
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || message.type !== "resolve_shop_uuid") return;
    (async () => {
        try {
            if (!isBoothShopUrl(message.shopUrl)) {
                throw new Error("Invalid shop url");
            }
            const response = await fetch(message.shopUrl, { credentials: "include" });
            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }
            const html = await response.text();
            const match = html.match(SHOP_UUID_REGEX);
            if (!match) {
                throw new Error("Shop uuid not found");
            }
            sendResponse({ ok: true, uuid: match[1] });
        } catch (error) {
            sendResponse({ ok: false, error: (error && error.message) || String(error) });
        }
    })();
    // sendResponseを非同期で呼ぶためtrueを返す
    return true;
});

chrome.runtime.onInstalled.addListener((details) => {
    // 新規インストール時は既存のお知らせをすべて表示済みにする
    // (details.reason === "update" のときは何もしない -> 未表示のお知らせが発火する)
    if (details.reason !== "install") return;
    chrome.storage.local.get(SHOWN_NOTICE_IDS_KEY, (result) => {
        const shownIds = new Set(result[SHOWN_NOTICE_IDS_KEY] || []);
        allNoticeIds.forEach((id) => shownIds.add(id));
        chrome.storage.local.set({ [SHOWN_NOTICE_IDS_KEY]: [...shownIds] });
    });
});
