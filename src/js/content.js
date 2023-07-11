const NOW_BLOCK = "shop__border--price";
const NOT_BLOCK = "shop__background--price";


function addFilter(word) {
    chrome.storage.sync.get('filters', (result) => {
        var filterArray = result.filters;
        if (filterArray && !filterArray.includes(word)) {
            filterArray.push(word);
            chrome.storage.sync.set({ filters: filterArray });
            console.log("filter add.");
        }
        else {
            filterArray = [word];
            chrome.storage.sync.set({ filters: filterArray });
            console.log("filter add.");
        }
    });
}

function removeFilter(word) {
    chrome.storage.sync.get('filters', (result) => {
        var filterArray = result.filters;
        if (filterArray && filterArray.includes(word)) {
            const newfilterArray = filterArray.filter(n => n !== word);
            chrome.storage.sync.set({ filters: newfilterArray });
            console.log("filter remove.");
        }
    });
}

/**
 * Boothのアイテムに対して、リンクがbooth.pm/ja/item/1234であるのを、**.booth.pm/item/1234に変更するための関数
 */
function attachShopURL() {
    const liElements = document.querySelectorAll(`li.item-card.l-card`);
    // console.log(liElements);
    liElements.forEach(liElement => {
        // リンクをbooth.pmから*.booth.pmに変更する
        const aElement = liElement.querySelector('div.item-card__shop-info a');
        const base_url = aElement.href;
        // console.log(base_url);
        const item = liElement.querySelector("div.item-card__title a");
        const itemURL = new URL(item.getAttribute("href"));
        const lang_URL = itemURL.pathname.substring(itemURL.pathname.indexOf('/') + 1);
        const newURL = base_url + lang_URL.substring(lang_URL.indexOf('/') + 1);
        item.setAttribute("href", newURL);
        const thumbs = liElement.querySelectorAll("a.js-thumbnail-image");
        thumbs.forEach(thumb => {
            thumb.href = newURL;
        });
    })
}

/**
 * boothの検索において、自動でソート条件を追加する関数
 */
function attachOptionURL() {
    chrome.storage.sync.get("settings", (result) => {
        const settings = result.settings;
        // 設定から条件を指定しない場合は以下の処理を無視
        if (result.settings.disable === true) {
            return;
        }
        // console.log(settings);
        if (settings) {
            const age = settings.age;
            const sort = settings.sort;
            const in_stock = settings.in_stock;
            const new_arrival = settings.new_arrival;
            const aElements = document.querySelectorAll(`a`);
            aElements.forEach(aElement => {
                // console.log(aElement);
                // 下のナビゲーションに含まれる場合は、ソート条件を維持させる
                if (aElement.classList.contains("nav-item")) return;
                // console.log(aElement.href);
                const regex = new RegExp('https?://booth.pm/.*/(search|browse)/.*');

                if (regex.test(aElement.href)) {
                    var url = new URL(aElement.href);
                    // console.log(url.href);
                    if (age) {
                        url.searchParams.set("adult", age);
                    }
                    if (sort) {
                        url.searchParams.set("sort", sort);
                    }
                    if (in_stock) {
                        url.searchParams.set("in_stock", "true");
                    }
                    if (new_arrival) {
                        url.searchParams.set("new_arrival", "true");
                    }
                    aElement.href = url.href;
                }
            })

        }
    });
}

/**
 * 入力されたクエリから、検索URLを出力する関数
 */
function setSearchOption() {

    chrome.storage.sync.get("settings", (result) => {
        const input = document.getElementById("new-input-txtbox");
        const value = input.value;
        if (value === "") return;
        var url = new URL("https://booth.pm/ja/search/" + value);
        const settings = result.settings;
        // 設定から条件を指定しない場合は以下の処理を無視
        if (result.settings.disable === true) {
            document.location.href = url.href;
            return;
        }
        // console.log(settings);
        if (settings) {
            console.log(settings);
            const age = settings.age;
            const sort = settings.sort;
            const in_stock = settings.in_stock;
            const new_arrival = settings.new_arrival;

            if (age) {
                url.searchParams.set("adult", age);
            }
            if (sort) {
                url.searchParams.set("sort", sort);
            }
            if (in_stock) {
                url.searchParams.set("in_stock", "true");
            }
            if (new_arrival) {
                url.searchParams.set("new_arrival", "true");
            }
        }
        document.location.href = url.href;
    });
}

/**
 * 検索ボックスを再生成するための部分
 */
function makeNewSearchTab() {

    const url = window.location.href;
    const regex = new RegExp('https?://(manage|checkout|accounts).*.booth.pm.*');

    // 管理のページでは、検索バーの処理を行わない
    if (regex.test(url)) {
        console.log("disabled.");
        return;
    }

    // div要素を作成
    const divElement = document.createElement("div");
    divElement.classList.add("new-item-search-box", "flex", "w-full", "max-w-[600px]", "box-border");

    // input要素を作成
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.id = "new-input-txtbox";
    inputElement.autocomplete = "off";
    inputElement.ariaAutocomplete = "list";
    inputElement.ariaControls = "react-autowhatever-1";
    inputElement.classList.add("!rounded-l-[5px]", "!h-[32px]", "box-border", "m-none", "!bg-ui-background400", "focus:!bg-white", "!border", "border-border500", "placeholder-shown:text-ellipsis");
    inputElement.placeholder = "キーワードを入力";
    inputElement.addEventListener("focus", () => {
        inputElement.classList.add("focus");
    });
    inputElement.addEventListener("blur", () => {
        inputElement.classList.remove("focus");
    });
    inputElement.addEventListener("keydown", function (event) {
        if (event.keyCode === 13 && event.target.value) {
            setSearchOption();
        }
        if (event.keyCode === 27 && inputElement.classList.contains("focus")) {
            inputElement.classList.remove("focus");
            divElement.classList.remove("focus");
            inputElement.blur();
        }
    });

    // react-autowhatever-1要素を作成
    const reactAutowhatever1Element = document.createElement("div");
    reactAutowhatever1Element.id = "react-autowhatever-1";
    reactAutowhatever1Element.role = "listbox";
    reactAutowhatever1Element.classList.add("item-search-input__suggestions_container");

    // div要素にinput要素とreact-autowhatever-1要素を追加
    const inputContainerElement = document.createElement("div");
    inputContainerElement.classList.add("item-search-input__container", "relative");
    inputContainerElement.appendChild(inputElement);
    inputContainerElement.appendChild(reactAutowhatever1Element);

    document.addEventListener("keydown", (event) => {
        // フォーカスがない場合、sが入力された時にフォーカスをあてる
        if (event.key === "s" && document.activeElement !== inputElement) {
            inputElement.focus();
            event.preventDefault(); // sの入力をキャンセル
        }
    });
    inputElement.addEventListener("focus", () => {
        inputElement.classList.add("focus");
        divElement.classList.add("focus");

    });
    inputElement.addEventListener("blur", () => {
        inputElement.classList.remove("focus");
        divElement.classList.remove("focus");
    });

    // button要素を作成
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("btn", "search");
    buttonElement.setAttribute("aria-label", "検索");
    const iElement = document.createElement("i");
    iElement.classList.add("icon-search", "s-1x");
    buttonElement.appendChild(iElement);
    buttonElement.addEventListener("click", () => {
        if (inputElement.value !== "") {
            setSearchOption();
        }
    })

    // form要素にbutton要素を追加
    inputContainerElement.appendChild(buttonElement);

    // form要素にdiv要素を追加
    divElement.appendChild(inputContainerElement);

    // div要素を既存の要素に追加
    var intervalId = setInterval(() => {
        var existingElement = document.querySelector("div.w-full.shrink div.item-search-box");
        if (existingElement) {
            clearInterval(intervalId);
            existingElement.prepend(divElement);
        }
    }, 1000);

}

/**
 * ブロック機能用のボタンを作成する関数
 */
function addButton() {
    const url = window.location.href;
    const regex = new RegExp('https?://(?!manage|checkout|accounts).*.booth.pm.*');

    if (regex.test(url)) {

        chrome.storage.sync.get('filters', (result) => {
            // console.log(result);
            var filterArray = result.filters;

            var parentDiv = document.querySelector('div.js-shop-follow');
            if (!parentDiv) return;
            const button = document.createElement('button');
            var icon = document.createElement('i');
            icon.className = 'icon-attention s-1x';
            var text = document.createElement('span');
            text.classList.add("u-align-middle");
            const htmlLang = document.documentElement.lang;
            var block = "";
            var blocking = "";
            if (htmlLang == "ja") {
                block = "ブロック";
                blocking = "ブロック中";
            }
            else {
                block = "block";
                blocking = "blocking";
            }
            if (filterArray && filterArray.includes(window.location.origin + "/")) {
                button.classList.add("btn", "small-dense", NOW_BLOCK, "block-button", "shop__background--contents", "shop__text--price");
                // ブロック中
                text.textContent = blocking;
                var contents = document.querySelector("main.modules");
                contents.style.display = "none";
            }
            else {
                button.classList.add("btn", "small-dense", NOT_BLOCK, "block-button", "shop__text--contents");
                // ブロック
                text.textContent = block;
            }
            button.appendChild(icon);
            button.appendChild(text);
            button.addEventListener('click', () => {
                const url = window.location.origin + "/";
                if (button.classList.contains(NOW_BLOCK)) {
                    button.classList.remove(NOW_BLOCK, "shop__background--contents", "shop__text--price");
                    button.classList.add(NOT_BLOCK, "shop__text--contents");
                    var contents = document.querySelector("main.modules");
                    contents.style.display = "block";
                    text.textContent = block;
                    removeFilter(url);
                }
                else {
                    button.classList.remove(NOT_BLOCK, "shop__text--contents");
                    button.classList.add(NOW_BLOCK, "shop__background--contents", "shop__text--price");
                    var contents = document.querySelector("main.modules");
                    contents.style.display = "none";
                    text.textContent = blocking;
                    addFilter(url);
                }
            });
            parentDiv.appendChild(button);
        });
    }
}

function toggleFade(content) {
    content.classList.toggle('fade');
}

function hideDescription() {
    const description = document.querySelector("div.booth-description div.u-mb-300");
    if (description && description.clientHeight > 400) {
        const content = description.children[0];
        content.className = "description-contents";
        // console.log(description);
        const showMore = document.createElement("div");
        showMore.className = "show-more";
        const icon = document.createElement("i");
        icon.className = "icon-arrow-open-down s-2x";
        showMore.appendChild(icon);
        description.appendChild(showMore);
        toggleFade(content);
        showMore.addEventListener("click", () => {
            toggleFade(content);
            if (content.clientHeight <= 400) {
                var height = content.scrollHeight + "px";
                content.style.height = height;
                icon.className = "icon-arrow-open-up s-2x";
            }
            else {
                content.style.height = '400px';
                icon.className = "icon-arrow-open-down s-2x";
            }
        });

    }
}
async function findTitle(event) {
    console.log("hoge");
    const url = "https://booth.pm/ja/items/4489295";
    const response = await fetch(url);
    const text = await response.text();
    const title = text.match(/<title>(.*?)<\/title>/i)[1];
    console.log(title);
}

function testInit() {
    chrome.storage.local.set({
        items_4846739: { "description": "サイズ：B2（515×728mm）\n素材：Wスエード\n2023/8/12(土)COMIC MARKET 102発売\n\n画像は仮のものになります。\n\n★BOOTHでは7/23(日)までの予約分のみの販売となりますので、ご注意ください。\nまた、新刊セットとまとめての発送をご希望の方は同時にご購入ください。\n新刊セット→https://honeydots.booth.pm/items/4905582 #booth_pm \n\n※絵柄の細部は予告なく調整される可能性がございます。ご了承ください。\n\n★予約商品となります。\n発送は8月下旬以降となります。\nメロンブックスでも取り扱いいたします。", "factory_description": null, "id": 4907728, "is_adult": true, "is_buyee_possible": false, "is_end_of_sale": false, "is_placeholder": false, "is_sold_out": false, "name": "甘雨＆申鶴水着タペストリー（予約7/23まで）", "price": "¥ 3,500", "purchase_limit": null, "shipping_info": "発送までの日数：7日以内", "small_stock": null, "url": "https://honeydots.booth.pm/items/4907728", "wish_list_url": "https://honeydots.booth.pm/items/4907728/wish_list", "wish_lists_count": 48, "wished": false, "buyee_variations": [], "category": { "id": 90, "name": "タペストリー", "parent": { "name": "グッズ", "url": "https://booth.pm/ja/browse/%E3%82%B0%E3%83%83%E3%82%BA" }, "url": "https://booth.pm/ja/browse/%E3%82%BF%E3%83%9A%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC" }, "embeds": [], "images": [{ "caption": null, "original": "https://booth.pximg.net/a598fe3d-0b91-4f9e-972c-d5c44ad71985/i/4907728/fe5187f1-a696-45e8-9b96-a3e276fba73b_base_resized.jpg", "resized": "https://booth.pximg.net/c/72x72_a2_g5/a598fe3d-0b91-4f9e-972c-d5c44ad71985/i/4907728/fe5187f1-a696-45e8-9b96-a3e276fba73b_base_resized.jpg" }], "order": null, "share": { "hashtags": ["booth_pm"], "text": "甘雨＆申鶴水着タペストリー（予約7/23まで） | ヤバ谷らんど" }, "shop": { "name": "ヤバ谷らんど", "subdomain": "honeydots", "thumbnail_url": "https://booth.pximg.net/c/48x48/users/1255093/icon_image/9e21487b-de63-4dd8-a46f-9fe921bdfc86_base_resized.jpg", "url": "https://honeydots.booth.pm/", "verified": false }, "sound": null, "tags": [{ "name": "R18", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=R18" }, { "name": "タペストリー", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E3%82%BF%E3%83%9A%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC" }, { "name": "水着", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E6%B0%B4%E7%9D%80" }, { "name": "原神", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E5%8E%9F%E7%A5%9E" }, { "name": "甘雨", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E7%94%98%E9%9B%A8" }, { "name": "申鶴", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E7%94%B3%E9%B6%B4" }, { "name": "C102", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=C102" }, { "name": "コミックマーケット102", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%83%9E%E3%83%BC%E3%82%B1%E3%83%83%E3%83%88102" }], "tag_banners": [{ "image_url": "https://booth.pximg.net/c/150x150/510ed4ab-eeef-445d-b137-079e4e5b7533/i/3485012/056ee1d3-f87f-4fae-bc41-97981b74febb_base_resized.jpg", "name": "R18", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=R18" }, { "image_url": "https://booth.pximg.net/c/150x150/758c7e3f-af9e-443f-af01-5eb104763616/i/4082953/2469a0ed-51ca-4d1f-89d1-1b73cd54ca62_base_resized.jpg", "name": "タペストリー", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E3%82%BF%E3%83%9A%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC" }, { "image_url": "https://booth.pximg.net/c/150x150/17e0846b-bc83-4a5a-86b5-4defb38c8278/i/4097459/08677f13-e907-4721-ae92-9fff8130a94f_base_resized.jpg", "name": "水着", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E6%B0%B4%E7%9D%80" }, { "image_url": "https://booth.pximg.net/c/150x150/750c3954-df13-42f8-817c-bf4703835c95/i/4440914/5ae6f99b-5f90-41d7-892e-5348eac90635_base_resized.jpg", "name": "原神", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E5%8E%9F%E7%A5%9E" }, { "image_url": "https://booth.pximg.net/c/150x150/1b9d3d81-c8fb-42e9-8e6e-7dbd009d8ea8/i/2959174/9d064638-4e28-4535-8753-4c3791c38b4e_base_resized.jpg", "name": "甘雨", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E7%94%98%E9%9B%A8" }, { "image_url": "https://booth.pximg.net/c/150x150/08ce8414-3443-4b85-a182-6c2f94fe9c3f/i/3560793/1fae1a0c-3459-4825-8987-e7c025906392_base_resized.jpg", "name": "申鶴", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E7%94%B3%E9%B6%B4" }, { "image_url": null, "name": "C102", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=C102" }, { "image_url": null, "name": "コミックマーケット102", "url": "https://booth.pm/ja/items?adult=only\u0026tags%5B%5D=%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%83%9E%E3%83%BC%E3%82%B1%E3%83%83%E3%83%88102" }], "tag_combination": { "category": "タペストリー", "tag": "R18", "url": "https://booth.pm/ja/browse/%E3%82%BF%E3%83%9A%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC?tags%5B%5D=R18" }, "tracks": null, "variations": [{ "buyee_html": null, "downloadable": null, "factory_image_url": null, "has_download_code": false, "id": 8240791, "is_anshin_booth_pack": false, "is_empty_allocatable_stock_with_preorder": true, "is_empty_stock": false, "is_factory_item": false, "is_mailbin": false, "is_waiting_on_arrival": false, "name": null, "order_url": null, "price": 3500, "small_stock": null, "status": "addable_to_cart", "type": "via_warehouse" }] }
    });
}

function addDeletedItem() {
    // ここに実行したいコードを記述する
    console.log('addDeletedItem 関数が実行されました');
    // window.location.href から itemID を取得
    var itemID = window.location.href.match(/\/items\/(\d+)/)[1];
    chrome.storage.local.get(`items_${itemID}`, (result) => {
        var itemdata = result[`items_${itemID}`];;
        console.log(itemdata);
        if (itemdata === undefined) {
            console.log(itemID);
            return;
        }

        // 動的な HTML 要素を作成
        var div = document.createElement('div');
        var warning = document.createElement('p');
        var title_h1 = document.createElement('h1');
        var image_img = document.createElement('img');
        var description_p = document.createElement('p');

        // テキストコンテンツを設定
        title_h1.textContent = itemdata.name;
        title_h1.classList.add("font-bold", "leading-[32px]", "m-0", "text-[24px]");
        var des = itemdata.description.replace("\\n", "<br>");
        console.log(des);
        warning.textContent = "*このページは、拡張機能\"Better BOOTH\"によって作成されています。"
        description_p.innerHTML = itemdata.description.replace(/\n/g, "<br>");
        image_img.src = itemdata.images[0].original;


        // bodyの直下のコンテンツを非表示にする
        var bodyChildren = document.body.children;
        for (var i = 0; i < bodyChildren.length; i++) {
            bodyChildren[i].style.display = 'none';
        }

        // 要素を追加
        div.appendChild(warning)
        div.appendChild(title_h1);
        div.appendChild(image_img);
        div.appendChild(description_p);
        document.body.appendChild(div);
    });
}



function notReload() {
    if (document.body.children.length === 1) {
        // リダイレクト
        const url = window.location.href;
        // const regex = new RegExp('https?://(manage|checkout|accounts).*.booth.pm.*');
        const regex = new RegExp('https?://(?!.*(manage|checkout|accounts)).*.booth.pm/items/.*');
        if (regex.test(url)) {
            console.log("reload");
            window.location.href = window.location.href.replace('booth.pm/items/', 'booth.pm/en/items/');
        }
        else {

            addDeletedItem();
        }
    }
}

addButton();
attachShopURL();
window.addEventListener("load", attachOptionURL);
// window.addEventListener("load", notReload);
// notReload();
hideDescription();

// findTitle();

makeNewSearchTab();
// testInit();