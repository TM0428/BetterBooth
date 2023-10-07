const itemGetJa = {
    "saveItem": "Save",
    "clicksaveItem": "データを保存しました。"
};
const itemGetEn = {
    "saveItem": "Save",
    "clicksaveItem": "Saved."
};
console.log(window.navigator.language);
var itemGetLang = itemGetJa;
if(window.navigator.language !== "ja" && window.navigator.language !== "ja-JP"){
    itemGetLang = itemGetEn;
}

async function addData() {
    const itemId = "items_" + window.location.href.match(/\/items\/(\d+)/)[1];
    const url = window.location.href + ".json";
    const response = await fetch(url);
    const text = await response.text();
    const raw_data = JSON.parse(text);
    console.log(raw_data);
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
        status: statusArray
    };
    // 追加のデータを取得して保存
    const additionalDescriptionElement = document.querySelector(
        ".description.empty\\:hidden"
    );
    if (
        additionalDescriptionElement &&
        additionalDescriptionElement.children.length > 0
    ) {
        const additionalDescription = additionalDescriptionElement.innerHTML;
        data.additionalDescription = additionalDescription;
    }

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
            chrome.storage.local.set({ [`${itemId}`]: data });
        }
        else {
            // リスト作成と登録
            items = [itemId];
            console.log(items);
            chrome.storage.local.set({ items: items });
            chrome.storage.local.set({ [`${itemId}`]: data });
        }
    });
}

function addSaveButton() {
    // div要素を作成
    const divElement = document.createElement("div");
    const buttonElement = document.createElement("button");
    buttonElement.className = "border-2 border-border500 box-border cursor-pointer flex gap-4 h-[48px] items-center px-12 rounded-8 select-none text-text-gray300 bg-surface1 shop__background--contents shop__border--text40 shop__text ml-8";
    var icon = document.createElement("i");
    icon.className = "icon-download s-1x";
    var text = document.createElement("span");
    text.classList.add("u-align-middle");
    text.textContent = itemGetLang.saveItem;
    buttonElement.appendChild(icon);
    buttonElement.appendChild(text);
    buttonElement.addEventListener("click", () => {
        addData();
        window.alert(itemGetLang.clicksaveItem);
    });

    divElement.appendChild(buttonElement);

    // div要素を既存の要素に追加
    var intervalId = setInterval(() => {
        // 検索バーの要素を取得
        var share_btn = document.querySelector(`div.flex.items-start.mt-8 div.mr-auto`);
        if (share_btn) {
            clearInterval(intervalId);
            share_btn.className = "flex mr-auto"
            console.log(share_btn);
            share_btn.appendChild(divElement);
        }
    }, 1000);


    
}

chrome.storage.sync.get("extended_settings", (result) => {
    const setting = result.extended_settings;
    if(setting && setting.language !== "ja") {
        itemGetLang = itemGetEn;
    }
    if(setting && setting.save_item){
        addSaveButton();
    }

})
