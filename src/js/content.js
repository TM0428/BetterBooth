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
        // console.log(settings);
        if (settings) {
            const age = settings.age;
            const sort = settings.sort;
            const in_stock = settings.in_stock;
            const new_arrival = settings.new_arrival;
            const aElements = document.querySelectorAll(`a`);
            aElements.forEach(aElement => {
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

function makeNewSearchTab() {
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
        if (!inputElement.classList.contains("focus")) {
            inputElement.classList.add("focus");
            inputElement.focus();
            divElement.classList.add("focus");
        }
        else if (inputElement) {
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
            if (filterArray && filterArray.includes(window.location.origin + "/")) {
                button.classList.add("btn", "small-dense", NOW_BLOCK, "block-button");
                // ブロック中
                text.textContent = "\u30d6\u30ed\u30c3\u30af\u4e2d";
                var contents = document.querySelector("main.modules");
                contents.style.display = "none";
            }
            else {
                button.classList.add("btn", "small-dense", NOT_BLOCK, "block-button");
                // ブロック
                text.textContent = "\u30d6\u30ed\u30c3\u30af";
            }
            button.appendChild(icon);
            button.appendChild(text);
            button.addEventListener('click', () => {
                const url = window.location.origin + "/";
                if (button.classList.contains(NOW_BLOCK)) {
                    button.classList.remove(NOW_BLOCK);
                    button.classList.add(NOT_BLOCK);
                    var contents = document.querySelector("main.modules");
                    contents.style.display = "block";
                    text.textContent = "\u30d6\u30ed\u30c3\u30af";
                    removeFilter(url);
                }
                else {
                    button.classList.remove(NOT_BLOCK);
                    button.classList.add(NOW_BLOCK);
                    var contents = document.querySelector("main.modules");
                    contents.style.display = "none";
                    text.textContent = "\u30d6\u30ed\u30c3\u30af\u4e2d";
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
        content.className = "description";
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

addButton();
attachShopURL();
window.addEventListener("load", attachOptionURL);
hideDescription();

// findTitle();

makeNewSearchTab();
