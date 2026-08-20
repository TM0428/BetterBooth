/**
 * アイテムのエクスポート・インポートで共通利用するユーティリティ。
 * エクスポート時は Shop クラスの url getter が JSON.stringify で失われるため、
 * ここで明示的に plain object へ変換してから保存する。
 */

/**
 * アイテムをエクスポート用の plain object に変換する
 * @param {*} item Item クラスインスタンスまたは同形の object
 * @returns エクスポート用 object(そのままインポート可能)
 */
export function itemToExportObject(item) {
    const exported = {
        additionalDescription: item.additionalDescription || "",
        category: item.category || "",
        description: item.description || "",
        download: Boolean(item.download),
        id: item.id,
        images: (item.images || []).map((image) => ({
            original: image.original,
            resized: image.resized || image.original
        })),
        name: item.name,
        price: item.price || "",
        restock: Boolean(item.restock),
        shop: item.shop
            ? {
                  name: item.shop.name || "",
                  subdomain: item.shop.subdomain || "",
                  thumbnail_url: item.shop.thumbnail_url || "",
                  url: item.shop.url || "",
                  add_url: item.shop.add_url || []
              }
            : null,
        status: item.status || [],
        tags: item.tags || [],
        url: item.url || "",
        wished: Boolean(item.wished)
    };
    // purchased は undefined(購入不明)を区別して保持する
    if (item.purchased !== undefined) {
        exported.purchased = Boolean(item.purchased);
    }
    return exported;
}

/**
 * インポートデータが必要な形式を満たしているかを検証する
 * @param {*} data パースされた object
 * @returns {boolean}
 */
export function validateItemData(data) {
    return (
        typeof data === "object" &&
        data !== null &&
        "id" in data &&
        (typeof data.id === "number" || typeof data.id === "string") &&
        typeof data.name === "string" &&
        data.name !== "" &&
        Array.isArray(data.images) &&
        data.images.every(
            (image) =>
                typeof image === "object" &&
                image !== null &&
                typeof image.original === "string"
        ) &&
        typeof data.shop === "object" &&
        data.shop !== null &&
        typeof data.shop.name === "string" &&
        typeof data.shop.subdomain === "string"
    );
}

/**
 * インポートデータから保存に必要なプロパティだけを取り出す
 * @param {*} data validateItemData を通過した object
 * @returns 保存用 object
 */
export function sanitizeItemData(data) {
    const sanitized = {
        additionalDescription: data.additionalDescription || "",
        category: data.category || "",
        description: typeof data.description === "string" ? data.description : "",
        download: Boolean(data.download),
        id: data.id,
        images: data.images.map((image) => ({
            original: image.original,
            resized: image.resized || image.original
        })),
        name: data.name,
        price: typeof data.price === "string" ? data.price : "",
        restock: Boolean(data.restock),
        shop: {
            name: data.shop.name,
            subdomain: data.shop.subdomain,
            thumbnail_url: data.shop.thumbnail_url || "",
            add_url: Array.isArray(data.shop.add_url) ? data.shop.add_url : []
        },
        status: Array.isArray(data.status) ? data.status : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        url: typeof data.url === "string" ? data.url : "",
        wished: Boolean(data.wished)
    };
    if (data.purchased !== undefined) {
        sanitized.purchased = Boolean(data.purchased);
    }
    return sanitized;
}
