const NOW_BLOCK = "shop__border--price";
const NOT_BLOCK = "shop__background--price";

function addFilter(word) {
    chrome.storage.sync.get('filters', (result) => {
        console.log(result);
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
        console.log(filterArray);
    });
}

function removeFilter(word) {
    chrome.storage.sync.get('filters', (result) => {
        console.log(result);
        var filterArray = result.filters;
        if (filterArray && filterArray.includes(word)) {
            const newfilterArray = filterArray.filter(n => n !== word);
            chrome.storage.sync.set({ filters: newfilterArray });
            console.log("filter remove.");
            console.log(newfilterArray);
        }
    });
}

/**
 * Boothのアイテムに対して、リンクがbooth.pm/ja/item/1234であるのを、**.booth.pm/item/1234に変更するための関数
 */
function reattachURL() {
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
 * ブロック機能用のボタンを作成する関数
 */
function addButton() {
    chrome.storage.sync.get('filters', (result) => {
        console.log(result);
        var filterArray = result.filters;

        var parentDiv = document.querySelector('div.js-shop-follow');
        if (!parentDiv) return;
        const button = document.createElement('button');
        var icon = document.createElement('i');
        icon.className = 'fas fa-exclamation';
        var text = document.createElement('span');
        text.classList.add("u-align-middle");
        if (filterArray && filterArray.includes(window.location.origin + "/")) {
            button.classList.add("btn", "small-dense", NOW_BLOCK, "block-button");
            text.textContent = "ブロック中";
            var contents = document.querySelector("main.modules");
            contents.style.display = "none";
        }
        else {
            button.classList.add("btn", "small-dense", NOT_BLOCK, "block-button");
            text.textContent = "ブロック";
        }
        button.appendChild(icon);
        button.appendChild(text);
        button.addEventListener('click', () => {
            const url = window.location.origin + "/";
            console.log(button.classList);
            if (button.classList.contains(NOW_BLOCK)) {
                button.classList.remove(NOW_BLOCK);
                button.classList.add(NOT_BLOCK);
                var contents = document.querySelector("main.modules");
                contents.style.display = "block";
                text.textContent = "ブロック";
                removeFilter(url);
            }
            else {
                button.classList.remove(NOT_BLOCK);
                button.classList.add(NOW_BLOCK);
                var contents = document.querySelector("main.modules");
                contents.style.display = "none";
                text.textContent = "ブロック中";
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
        content.className = "description";
        console.log(description);
        const showMore = document.createElement("div");
        showMore.className = "show-more";
        const icon = document.createElement("i");
        icon.className = "fas fa-chevron-down";
        showMore.appendChild(icon);
        description.appendChild(showMore);
        toggleFade(content);

        showMore.addEventListener("click", () => {
            toggleFade(content);
            if (content.clientHeight <= 400) {
                content.style.height = 'auto';
                icon.className = "fas fa-chevron-up";
            }
            else {
                content.style.height = '400px';
                icon.className = "fas fa-chevron-down";
            }
        });

    }
}

let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
document.head.insertAdjacentElement('beforeEnd', link);

console.log(window.location.origin);

addButton();
reattachURL();
hideDescription();