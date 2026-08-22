/**
 * BOOTH本体の「ショップの非表示」機能へ、拡張機能のブロックリストを移行するためのモジュール
 *
 * API仕様(2026-07時点):
 * - 一覧取得: GET https://api.booth.pm/frontend/accounts/hidden_shops.json
 *     -> { hidden_shops: [{ shop_uuid, shop_name, nickname, base_url }], max_hidden_shops: 200 }
 * - 非表示追加: POST https://api.booth.pm/frontend/accounts/hidden_shops.json
 *     body: { "shop_uuid": "<uuid>" } / 201 Created
 * - 非表示解除: DELETE https://api.booth.pm/frontend/accounts/hidden_shops/{uuid}.json / 204 No Content
 *
 * いずれもbooth.pmのページ上(コンテンツスクリプト)から、Cookieと
 * meta[name="csrf-token"]のX-CSRF-Tokenを付けて呼び出す必要がある
 */

const API_ORIGIN = "https://api.booth.pm";
const HIDDEN_SHOPS_PATH = "/frontend/accounts/hidden_shops.json";

export const migrationStatus = {
    migrated: "migrated",
    skipped: "skipped",
    failed: "failed",
    limit: "limit"
};

/**
 * ショップURLを "https://xxx.booth.pm/" 形式に正規化する関数
 * @param {string} url ショップのURL
 * @returns {string|null} 正規化したURL(不正な場合はnull)
 */
export function normalizeShopUrl(url) {
    if (typeof url !== "string") return null;
    const trimmed = url.trim();
    if (!/^https:\/\/[a-z0-9-]+\.booth\.pm\/?$/i.test(trimmed)) return null;
    return trimmed.endsWith("/") ? trimmed : trimmed + "/";
}

/**
 * ショップページのHTMLからshop_uuidを抽出する関数
 * (ショップヘッダーのメニュー要素が data-shop-uuid 属性を持っている)
 * @param {string} html ショップページのHTML
 * @returns {string|null} shop_uuid(見つからない場合はnull)
 */
export function extractShopUuid(html) {
    if (typeof html !== "string") return null;
    const match = html.match(
        /data-shop-uuid="([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"/
    );
    return match ? match[1] : null;
}

function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return (meta && meta.getAttribute("content")) || "";
}

/**
 * BOOTH本体の非表示ショップ一覧を取得する関数
 * @returns {Promise<{hidden_shops: Array, max_hidden_shops: number}>}
 */
export async function getHiddenShops() {
    const response = await fetch(API_ORIGIN + HIDDEN_SHOPS_PATH, {
        credentials: "include",
        headers: { Accept: "application/json" }
    });
    if (!response.ok) {
        const error = new Error("Failed to fetch hidden shops: " + response.status);
        error.status = response.status;
        throw error;
    }
    return await response.json();
}

/**
 * BOOTH本体でショップを非表示にする関数
 * @param {string} shopUuid ショップのUUID
 */
export async function hideShop(shopUuid) {
    const response = await fetch(API_ORIGIN + HIDDEN_SHOPS_PATH, {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-Token": getCsrfToken()
        },
        body: JSON.stringify({ shop_uuid: shopUuid })
    });
    if (!response.ok) {
        let message = "HTTP " + response.status;
        try {
            const body = await response.json();
            if (body && body.messages && body.messages.base && body.messages.base[0]) {
                message = body.messages.base[0];
            }
        } catch {
            // レスポンスがJSONでない場合はステータスコードのまま
        }
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }
}

/**
 * BOOTH本体でショップの非表示を解除する関数
 * (非表示になっていないショップの場合は404が返るが、結果は同じなのでエラーにしない)
 * @param {string} shopUuid ショップのUUID
 */
export async function unhideShop(shopUuid) {
    const response = await fetch(
        API_ORIGIN + "/frontend/accounts/hidden_shops/" + shopUuid + ".json",
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-CSRF-Token": getCsrfToken()
            }
        }
    );
    if (!response.ok && response.status !== 404) {
        const error = new Error("HTTP " + response.status);
        error.status = response.status;
        throw error;
    }
}

/**
 * ショップURLからshop_uuidを解決する関数
 * (CORSの制約のため、ショップページのHTML取得はservice worker側で行う)
 * @param {string} shopUrl ショップのURL
 * @returns {Promise<string>} shop_uuid
 */
export function resolveShopUuid(shopUrl) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "resolve_shop_uuid", shopUrl }, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else if (!response || !response.ok) {
                reject(new Error((response && response.error) || "Failed to resolve shop uuid"));
            } else {
                resolve(response.uuid);
            }
        });
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 拡張機能のブロックリストをBOOTH本体の非表示リストへ移行する関数
 * @param {Array<string>} filterUrls 拡張機能に保存されているショップURLの配列
 * @param {Function} onProgress (current, total) => void 進捗コールバック
 * @returns {Promise<Array<{url: string, status: string, reason?: string}>>}
 */
export async function migrateFilters(filterUrls, onProgress = () => {}) {
    const hiddenShopsResponse = await getHiddenShops();
    const alreadyHidden = new Set(hiddenShopsResponse.hidden_shops.map((shop) => shop.base_url));
    const maxHiddenShops = hiddenShopsResponse.max_hidden_shops;
    let hiddenCount = hiddenShopsResponse.hidden_shops.length;

    const targets = [...new Set((filterUrls || []).map(normalizeShopUrl))].filter(Boolean);
    const results = [];
    let limitReached = false;

    for (let i = 0; i < targets.length; i++) {
        const url = targets[i];
        onProgress(i + 1, targets.length);
        if (alreadyHidden.has(url)) {
            results.push({ url, status: migrationStatus.skipped });
            continue;
        }
        if (limitReached || hiddenCount >= maxHiddenShops) {
            limitReached = true;
            results.push({ url, status: migrationStatus.limit });
            continue;
        }
        try {
            const uuid = await resolveShopUuid(url);
            await hideShop(uuid);
            hiddenCount++;
            results.push({ url, status: migrationStatus.migrated });
        } catch (error) {
            results.push({ url, status: migrationStatus.failed, reason: error.message });
        }
        // BOOTH側への負荷を抑えるため、リクエスト間隔を空ける
        await sleep(300);
    }
    return results;
}
