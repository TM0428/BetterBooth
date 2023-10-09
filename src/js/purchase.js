async function getPurchaseData() {
    // クラス名 "hidden" を持つすべての要素を取得
    let elements = document.querySelectorAll('div.hidden');
    // 各要素から "data-product-id" の値を取得してコンソールに出力
    for(let i = 0;i < elements.length; i++){
        const productId = elements[i].getAttribute('data-product-id');
        if(productId){
            const itemId = "items_" + String(productId);
            const url = "https://booth.pm/ja/items/" + String(productId) + ".json";
            const response = await fetch(url);
            const text = await response.text();
            const raw_data = JSON.parse(text);
            const tags = raw_data.tags.map(tag => tag.name);
            const statusArray = raw_data.variations.map(item => item.status);
        
            const data = {
                name: raw_data.name,
                images: raw_data.images,
                description: raw_data.description,
                shop: raw_data.shop,
                id: raw_data.id,
                price: raw_data.price,
                url: raw_data.url,
                tags: tags,
                category: raw_data.category.name,
                status: statusArray,
                wished: raw_data.wished,
                purchased: true
            };
            console.log(data);
            chrome.storage.local.get("items", (result) => {
                var items = result.items;
                if (items && !items.includes(itemId)) {
                    // 新たに登録
                    items.push(itemId);
                    chrome.storage.local.set({ items: items });
                    chrome.storage.local.set({ [`${itemId}`]: data });
                }
                else if (items) {
                    // 既に登録されているので更新
                    chrome.storage.local.get(itemId, (result) => {
    
                        const oldData = result[itemId];
                        const mergedData = {
                            ...oldData,
                            ...data
                          };
                        chrome.storage.local.set({ [`${itemId}`]: mergedData });
                    });
                    
                }
                else {
                    // リスト作成と登録
                    items = [itemId];
                    console.log(items);
                    chrome.storage.local.set({ items: items });
                    chrome.storage.local.set({ [`${itemId}`]: data });
                }
            });
            console.log("item add complete.");

        }
    }

}


chrome.storage.sync.get("extended_settings", (result) => {
    const setting = result.extended_settings;
    if(setting && setting.save_item && setting.save_purchase){
        getPurchaseData();
    }

});