async function addData() {
    const itemId = "items_" + window.location.href.match(/\/items\/(\d+)/)[1];
    const url = window.location.href + ".json";
    const response = await fetch(url);
    const text = await response.text();
    const raw_data = JSON.parse(text);
    const data = {
        name: raw_data.name,
        images: raw_data.images,
        description: raw_data.description,
        shop: raw_data.shop,
        id: raw_data.id,
        price: raw_data.price,
        url: raw_data.url
    }

    chrome.storage.local.get('items', (result) => {
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
    var share_btn = document.querySelector(`div#js-item-share-buttons`);
    // div要素を作成
    const divElement = document.createElement("div");
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("btn", "small-dense", "shop__background--price", "block-button", "shop__text--contents");
    var icon = document.createElement('i');
    icon.className = 'icon-plus-circle s-1x';
    var text = document.createElement('span');
    text.classList.add("u-align-middle");
    text.textContent = "データを保存";
    buttonElement.appendChild(icon);
    buttonElement.appendChild(text);
    buttonElement.addEventListener('click', () => {
        addData();
    })

    divElement.appendChild(buttonElement);

    share_btn.appendChild(divElement);

}



async function findTitle() {
    const url = window.location.href + ".json";
    const response = await fetch(url);
    const text = await response.text();
    console.log(text);
    return JSON.parse(text);
}

// findTitle();
addSaveButton();