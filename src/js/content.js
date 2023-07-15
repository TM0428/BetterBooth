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
 * boothの検索において、自動でソート条件を追加する関数
 */
function attachOptionURL() {
    chrome.storage.sync.get("settings", (result) => {
        const settings = result.settings;
        // console.log(settings);
        if (settings) {
            // 設定から条件を指定しない場合は以下の処理を無視
            if (result.settings.disable === true) {
                return;
            }
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
function setSearchOption(search_input) {

    chrome.storage.sync.get("settings", (result) => {
        var value = search_input;
        if(search_input === ""){
            const input = document.getElementById("new-input-txtbox");
            value = input.value;
        }
        if (value === "") return;
        var url = new URL("https://booth.pm/ja/search/" + value);
        const settings = result.settings;
        // console.log(settings);
        if (settings) {
            // 設定から条件を指定しない場合は以下の処理を無視
            if (result.settings.disable === true) {
                document.location.href = url.href;
                return;
            }
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
            setSearchOption("");
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
            setSearchOption("");
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

function makeNewSPSearchTab() {
    
    // 新しい検索タブの要素を作成
    const newSearchTab = document.createElement('div');
    newSearchTab.classList.add('sp-item-search', 'item-search');
    newSearchTab.setAttribute('data-url', 'https://booth.pm/ja');
    newSearchTab.setAttribute('data-search-params', '{"portal_domain":"ja"}');
    newSearchTab.setAttribute('data-product-list', 'from market_top via global_nav to search_index');
    newSearchTab.setAttribute('data-tracking', 'submit');
    newSearchTab.style.display = 'inline-block';
    newSearchTab.style.width = '100%';
  
    // 検索アイコンの要素を作成
    const searchIcon = document.createElement('i');
    searchIcon.classList.add('icon-search', 's-1x', 'u-text-label');
    newSearchTab.appendChild(searchIcon);
  
    // テキスト入力フィールドの要素を作成
    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.name = 'query';
    searchInput.id = 'query';
    searchInput.placeholder = 'ジャンル、商品名など';
    searchInput.classList.add('ac-tags', 'item-search-input', 'full-length', 'tt-input');
    searchInput.autocomplete = 'off';
    searchInput.spellcheck = 'false';
    searchInput.dir = 'auto';
    searchInput.style.backgroundColor = 'transparent';
    newSearchTab.appendChild(searchInput);
  
    // 入力文字列を消すアイコンの要素を作成
    const clearIcon = document.createElement('i');
    clearIcon.classList.add('icon-cancel-circle-fill', 'search-clear', 'js-search-clear', 'u-text-gray-500', 'u-pt-400');
    clearIcon.style.display = 'none';
    newSearchTab.appendChild(clearIcon);
  
    // テキスト入力完了時のイベントハンドラを設定
    searchInput.addEventListener('input', function() {
      if (this.value) {
        clearIcon.style.display = 'flex';
      } else {
        clearIcon.style.display = 'none';
      }
    });
  
    // 入力文字列を消すアイコンのクリックイベントハンドラを設定
    clearIcon.addEventListener('click', function() {
      searchInput.value = '';
      clearIcon.style.display = 'none';
    });
  
    // テキスト入力完了時のイベントハンドラを設定
    searchInput.addEventListener('keydown', function(event) {
      if (event.keyCode === 13 && this.value) {
        setSearchOption(this.value);
      }
    });
  
    // div要素を既存の要素に追加
    var intervalId = setInterval(() => {

        // 検索バーの要素を取得
        const searchBar = document.querySelector('.sp-item-search.item-search');
        if (searchBar) {
            clearInterval(intervalId);
            // 元の検索バーの要素を非表示にする
            searchBar.style.display = 'none';
          
            // 新しい検索タブを挿入
            searchBar.parentNode.insertBefore(newSearchTab, searchBar.nextSibling);
        }
    }, 1000);

  }

/**
 * ブロック機能用のボタンを作成する関数
 */
function addButton() {

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
window.addEventListener("load", attachOptionURL);
notReload();
hideDescription();

// findTitle();

makeNewSearchTab();
makeNewSPSearchTab();
// testInit();