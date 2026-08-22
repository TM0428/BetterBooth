// vite dev サーバーでオプションページを単体プレビューするための chrome.storage モック。
// 本番ビルドでは main.js 側の import.meta.env.DEV ガードにより取り込まれない。

const seedShops = [
    {
        name: "サンプルショップA",
        subdomain: "sample-a",
        thumbnail_url: "https://picsum.photos/seed/shopa/64/64",
        add_url: []
    },
    {
        name: "とても長い名前のショップですこれは表示確認用",
        subdomain: "sample-b",
        thumbnail_url: "https://picsum.photos/seed/shopb/64/64",
        add_url: []
    },
    {
        name: "Shop C",
        subdomain: "sample-c",
        thumbnail_url: "https://picsum.photos/seed/shopc/64/64",
        add_url: []
    }
];

function makeSeedItem(i) {
    const shop = seedShops[i % seedShops.length];
    const purchased = i % 5 === 0 ? undefined : i % 2 === 0;
    return {
        name:
            i % 4 === 0
                ? `【VRChat想定】とても長いアイテム名のサンプルです 折り返し表示の確認用アイテム No.${i}`
                : `サンプルアイテム No.${i}`,
        images: [{ original: `https://picsum.photos/seed/item${i}/600/600` }],
        description: "サンプル説明文",
        shop,
        id: String(1000000 + i),
        price: i % 3 === 0 ? "0 JPY" : `${(i + 1) * 500} JPY`,
        url: `https://${shop.subdomain}.booth.pm/items/${1000000 + i}`,
        tags:
            i % 4 === 0
                ? ["VRChat", "3Dモデル", "とても長いタグ名のサンプルタグです", "衣装", "小物"]
                : i % 2 === 0
                  ? ["VRChat", "衣装"]
                  : [],
        category: "3Dモデル",
        status: [],
        wished: true,
        purchased,
        additionalDescription: "",
        download: i % 3 === 0,
        restock: i % 7 === 0
    };
}

const store = { items: [] };
for (let i = 0; i < 30; i++) {
    const item = makeSeedItem(i);
    const key = "items_" + item.id;
    store.items.push(key);
    store[key] = item;
}

function makeStorageArea(backing) {
    return {
        get(key, callback) {
            const result = {};
            if (key == null) {
                Object.assign(result, backing);
            } else if (Array.isArray(key)) {
                for (const k of key) {
                    if (k in backing) result[k] = backing[k];
                }
            } else if (typeof key === "object") {
                for (const [k, v] of Object.entries(key)) {
                    result[k] = k in backing ? backing[k] : v;
                }
            } else if (key in backing) {
                result[key] = backing[key];
            }
            setTimeout(() => callback(structuredClone(result)), 0);
        },
        set(obj, callback) {
            Object.assign(backing, structuredClone(obj));
            if (callback) setTimeout(callback, 0);
        },
        remove(key, callback) {
            for (const k of Array.isArray(key) ? key : [key]) {
                delete backing[k];
            }
            if (callback) setTimeout(callback, 0);
        },
        getBytesInUse(key, callback) {
            setTimeout(() => callback(0), 0);
        }
    };
}

window.chrome = {
    storage: {
        local: makeStorageArea(store),
        sync: makeStorageArea({
            extended_settings: { language: "ja", save_item: true }
        })
    },
    runtime: { lastError: undefined }
};

console.log("[dev_chrome_mock] chrome.storage mocked with", store.items.length, "items");
