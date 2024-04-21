let next_page = 2;
let max_page = 2;
let ul_height = 0;
let not_adding = true;
let filter_section = null;
let include_sold_out = true;
let include_r18 = "none";

/**
 * if scroll to bottom, load more items
 * access to https://*.booth.pm/items?page=2
 *
 */
async function load_more_items() {
    if (next_page > max_page) return;
    not_adding = false;
    const next_url = window.location.href + "items?page=" + next_page;
    const response = await fetch(next_url);
    const text = await response.text();
    // DOMParser has a bug, so extract ul.item-list and into DOMParser
    const ul_text = text.match(/<ul class="item-list[\s\S]*<\/ul>/)[0];

    const parser = new DOMParser();
    const doc = parser.parseFromString(ul_text, "text/html");
    // find ul.item-list
    const ul = doc.querySelector("ul.item-list");
    // add ul child to current page
    const item_list = document.querySelector("ul.item-list");
    const li_list = ul.children;
    for (var i = 0; i < li_list.length; i++) {
        // console.log(i);
        // console.log(li_list[i]);
        // li have a data-item
        // delete &quot; from data-item and load json
        // li object deep copy
        const li = li_list[i].cloneNode(true);
        const data_item = li.getAttribute("data-item");
        const data_item_json = JSON.parse(data_item.replace(/&quot;/g, '"'));
        const div_item = make_content(data_item_json);
        li.appendChild(div_item);

        item_list.appendChild(li);
        // break;
    }

    filter_content();
    make_filter_section_category_content();

    next_page++;
    not_adding = true;
}

/**
 * make content from data_item_json
 * @param {JSON} data_item_json
 * @returns html
 */
function make_content(data_item_json) {
    /*
	<div class="item !grid grid-rows-[auto_1fr]">
		<div class="thumb">
			<a href=shop_item_url>
				<div class="thumb-inside">
					<div class="swap-image">
						<img src=thumbnail_image_urls[0] alt=category.name width="300px" height="300px">
					</div>
				</div>
			</a>
		</div>

		<div class="item-head grid grid-rows-[auto_auto_1fr_auto]">
			<div class="item-category">name.ja</div>
			<div class="relative w-full flex flex-wrap items-center gap-4 mt-4 mb-2 empty:m-0 [&amp;_.badge]:!m-0 overflow-hidden">
				<div class="font-bold inline-block px-8 rounded-4 typography-12 preserve-half-leading text-white bg-[#e74a31] shop__text--contents shop__background--text">R-18</div>
				<div class="font-bold inline-block px-8 rounded-4 typography-12 preserve-half-leading shop__text--contents shop__background--text90">在庫なし</div>
				<a class="max-w-full" rel="noopener noreferrer" target="_blank" href=event.url>
					<div class="badge event u-text-ellipsis box-border">event.name</div>
				</a>
			</div>
			<h2 class="item-name">
				<a class="item-card__title-anchor--multiline whitespace-normal" href="https://setoran.booth.pm/items/5389885">name</a>
			</h2>
			<div class="lo-grid u-justify-content-between u-align-items-center">
				<div class="price u-align-middle">price</div>
				<form action="https://booth.pm/items/5389885/wish_list" method="post" class="hidden">
					<input name="authenticity_token" type="hidden" value="WaD6PJhLc-6R6ORe1Fo6Uf6ozmoXyNBE43dXsv1FJYMYmOicAsUnOfINwDDOAF98ojV6Ioa_tvC3PDKGbNmoOQ">
				</form>
				<button class="relative flex gap-2 items-center no-underline font-heavy-sans font-semibold bg-transparent !text-text-gray300 shop__text--link50">
					<pixiv-icon name="24/BoothLikeOn" unsafe-non-guideline-scale="0.6666666666666666"></pixiv-icon>
					<div class="typography-14 !typography-16">33</div>
				</button>
			</div>
		</div>
	</div>
	*/
    // console.log(data_item_json);
    // make div.item
    const div_item = document.createElement("div");
    div_item.className = "item !grid grid-rows-[auto_1fr]";
    // make div.thumb
    const div_thumb = document.createElement("div");
    div_thumb.className = "thumb";
    // make img
    const item_img = document.createElement("a");
    item_img.href = data_item_json.shop_item_url;
    // make div.thumb-inside
    const div_thumb_inside = document.createElement("div");
    div_thumb_inside.className = "thumb-inside";
    // make div.swap-image
    const div_swap_image = document.createElement("div");
    div_swap_image.className = "swap-image";
    // make img
    const img = document.createElement("img");
    img.src = data_item_json.thumbnail_image_urls[0];
    img.alt = data_item_json.category.name.ja;
    img.width = "300px";
    img.height = "300px";
    // make div.absolute
    const div_absolute = document.createElement("div");
    div_absolute.className =
        "absolute left-[1px] bottom-[-1px] right:-[-1px] w-full h-[6px] overflow-hidden";

    // make swap image function
    // image set is data_item_json.thumbnail_image_urls(1 to 4)
    // if mouse left to right, change image
    const image_count = Math.min(4, data_item_json.thumbnail_image_urls.length);
    // div_swap_image上にマウスがいる場合はずっと実行される
    div_swap_image.addEventListener("mousemove", () => {
        // 表示領域をimage_count分割する
        // その中でどこにいるかを計算する
        // その位置に応じてimg.srcを変更する
        const width = div_swap_image.offsetWidth;
        const x = event.clientX - div_swap_image.getBoundingClientRect().left;
        // console.log(x);
        const index = Math.max(0, Math.min(Math.floor((x / width) * image_count), image_count - 1));
        img.src = data_item_json.thumbnail_image_urls[index];
    });
    // マウスが外れた場合は最初の画像に戻す
    div_swap_image.addEventListener("mouseleave", () => {
        img.src = data_item_json.thumbnail_image_urls[0];
    });

    // make tree
    div_item.appendChild(div_thumb);
    div_thumb.appendChild(item_img);
    item_img.appendChild(div_thumb_inside);
    div_thumb_inside.appendChild(div_swap_image);
    div_swap_image.appendChild(img);
    div_thumb_inside.appendChild(div_absolute);

    // item説明
    // make div.item-head
    const div_item_head = document.createElement("div");
    div_item_head.className = "item-head grid grid-rows-[auto_auto_1fr_auto]";
    // make div.item-category
    const a_item_category = document.createElement("a");
    a_item_category.className = "item-category";
    a_item_category.textContent = data_item_json.category.name.ja;
    a_item_category.href = data_item_json.category.url;
    // make div.relative
    const div_relative = document.createElement("div");
    div_relative.className =
        "relative w-full flex flex-wrap items-center gap-4 mt-4 mb-2 empty:m-0 [&amp;_.badge]:!m-0 overflow-hidden";
    if (data_item_json.is_adult) {
        // make div.font-bold
        const div_font_bold = document.createElement("div");
        div_font_bold.className =
            "font-bold inline-block px-8 rounded-4 typography-12 preserve-half-leading text-white bg-[#e74a31] shop__text--contents shop__background--text";
        div_font_bold.textContent = "R-18";
        div_relative.appendChild(div_font_bold);
    }
    if (data_item_json.is_sold_out) {
        // make div.font-bold
        const div_font_bold = document.createElement("div");
        div_font_bold.className =
            "font-bold inline-block px-8 rounded-4 typography-12 preserve-half-leading shop__text--contents shop__background--text90";
        div_font_bold.textContent = "在庫なし";
        div_relative.appendChild(div_font_bold);
    }
    if (data_item_json.event) {
        // make event a element
        const a = document.createElement("a");
        a.className = "max-w-full";
        a.rel = "noopener noreferrer";
        a.target = "_blank";
        a.href = data_item_json.event.url;
        // make div.badge
        const div_badge = document.createElement("div");
        div_badge.className = "badge event u-text-ellipsis box-border";
        div_badge.textContent = data_item_json.event.name;
        div_relative.appendChild(a);
        a.appendChild(div_badge);
    }
    // make h2.item-name
    const h2_item_name = document.createElement("h2");
    h2_item_name.className = "item-name";
    // make a.item-card__title-anchor--multiline
    const a_item_card_title_anchor_multiline = document.createElement("a");
    a_item_card_title_anchor_multiline.textContent = data_item_json.name;
    a_item_card_title_anchor_multiline.className =
        "item-card__title-anchor--multiline whitespace-normal";
    a_item_card_title_anchor_multiline.href = data_item_json.shop_item_url;

    // make div.lo-grid
    const div_lo_grid = document.createElement("div");
    div_lo_grid.className = "lo-grid u-justify-content-between u-align-items-center";
    // make div.price
    const div_price = document.createElement("div");
    div_price.className = "price u-align-middle";
    div_price.textContent = data_item_json.price;
    // make tree
    div_item.appendChild(div_thumb);
    div_item.appendChild(div_item_head);
    div_item_head.appendChild(a_item_category);
    div_item_head.appendChild(div_relative);
    h2_item_name.appendChild(a_item_card_title_anchor_multiline);
    div_item_head.appendChild(h2_item_name);
    div_item_head.appendChild(div_lo_grid);
    div_lo_grid.appendChild(div_price);
    return div_item;
}

function make_filter_section() {
    // make section
    // const section = make_filter_section_content();
    const section = document.createElement("section");
    section.className = "filter-section";
    // make div.section-header
    const div_section_header = document.createElement("div");
    div_section_header.className = "section-header";
    // make h2.section-title
    const h2_section_title = document.createElement("h2");
    h2_section_title.className = "section-title";
    h2_section_title.textContent = "フィルター";
    // make div.section-body
    const div_section_body = document.createElement("div");
    div_section_body.className = "section-body";
    // make div.section-body-contents
    const div_section_body_contents = make_filter_section_category_content();
    // make div.filter-meta
    const div_filter_meta = make_filter_meta_content();

    // make tree
    section.appendChild(div_section_header);
    div_section_header.appendChild(h2_section_title);
    section.appendChild(div_section_body);
    div_section_body.appendChild(div_section_body_contents);
    div_section_body.appendChild(div_filter_meta);

    // add to div#js-shop first child
    const div_js_shop = document.querySelector("div#js-shop");
    div_js_shop.insertBefore(section, div_js_shop.firstChild);
}

function make_filter_section_category_content() {
    if (filter_section != null) add_filter_section_content();
    // make div.section-body-inner
    const div_section_body_category = document.createElement("div");
    div_section_body_category.className = "section-body-category";
    // make a filter content
    // all div.item-category textContent(duplication is removed)
    // wait loading list
    const item_category_list = document.querySelectorAll("div.item-category");
    if (item_category_list.length == 0) {
        setTimeout(make_filter_section_category_content, 1000);
    }
    const item_category_text_list = [];
    for (const item_category of item_category_list) {
        item_category_text_list.push(item_category.textContent);
    }
    const item_category_text_list_set = new Set(item_category_text_list);
    const item_category_text_list_unique = Array.from(item_category_text_list_set);
    // make div.filter-content
    const div_filter_content = document.createElement("div");
    div_filter_content.className = "filter-content";
    // make div.filter-content-inner > div.filter-content-item
    for (const item_category_text of item_category_text_list_unique) {
        // make input and label
        // label can click
        // input is checkbox
        const div_filter_content_inner = document.createElement("div");
        div_filter_content_inner.className = "filter-content-inner";
        const div_filter_content_item = document.createElement("div");
        div_filter_content_item.className = "filter-content-item";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = item_category_text;
        input.name = "filter";
        input.value = item_category_text;

        const label = document.createElement("label");
        label.htmlFor = item_category_text;
        label.textContent = item_category_text;

        // add event listener
        input.addEventListener("change", filter_content);

        // make tree
        div_filter_content.appendChild(div_filter_content_inner);
        div_filter_content_inner.appendChild(div_filter_content_item);
        div_filter_content_item.appendChild(input);
        div_filter_content_item.appendChild(label);
    }
    div_section_body_category.appendChild(div_filter_content);
    // console.log(section);
    filter_section = div_section_body_category;
    return div_section_body_category;
}

function add_filter_section_content() {
    // sectionは既にあるので、item-categoryで追加されているものを追加する
    // get all div.item-category textContent
    const item_category_list = document.querySelectorAll(".item-category");
    const item_category_text_list = [];
    for (const item_category of item_category_list) {
        item_category_text_list.push(item_category.textContent);
    }
    const item_category_text_list_set = new Set(item_category_text_list);
    const item_category_text_list_unique = Array.from(item_category_text_list_set);
    // search div.filter-content
    const div_filter_content = document.querySelector("div.filter-content");
    for (const item_category_text of item_category_text_list_unique) {
        // if item_category_text is already in div.filter-content, continue
        const div_filter_content_inner_list = div_filter_content.querySelectorAll(
            "div.filter-content-inner"
        );
        let already_in = false;
        for (const div_filter_content_inner of div_filter_content_inner_list) {
            const input = div_filter_content_inner.querySelector("input");
            if (input.value == item_category_text) {
                already_in = true;
                break;
            }
        }
        if (already_in) continue;
        // make input and label
        // label can click
        // input is checkbox
        const div_filter_content_inner = document.createElement("div");
        div_filter_content_inner.className = "filter-content-inner";
        const div_filter_content_item = document.createElement("div");
        div_filter_content_item.className = "filter-content-item";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = item_category_text;
        input.name = "filter";
        input.value = item_category_text;

        const label = document.createElement("label");
        label.htmlFor = item_category_text;
        label.textContent = item_category_text;

        // add event listener
        input.addEventListener("change", filter_content);

        // make tree
        div_filter_content.appendChild(div_filter_content_inner);
        div_filter_content_inner.appendChild(div_filter_content_item);
        div_filter_content_item.appendChild(input);
        div_filter_content_item.appendChild(label);
    }
}

function make_filter_meta_content() {
    // make div.filter-meta
    const div_filter_meta = document.createElement("div");
    div_filter_meta.className = "filter-meta";
    // make div.filter-meta-inner
    const div_filter_meta_inner_stock = document.createElement("div");
    div_filter_meta_inner_stock.className = "filter-meta-inner";
    // first, make input and label
    // label "在庫なしを含む" can click
    // input is checkbox and checked
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "filter-meta";
    input.name = "filter-meta";
    input.value = "filter-meta";
    input.checked = true;
    const label = document.createElement("label");
    label.htmlFor = "filter-meta";
    label.textContent = "在庫なしを含む";
    // add event listener
    input.addEventListener("change", function () {
        include_sold_out = !include_sold_out;
        filter_content();
    });

    // second, make select and option
    // option is "R-18のみ". "全年齢のみ", "指定なし"
    const div_filter_meta_inner_rate = document.createElement("div");
    div_filter_meta_inner_rate.className = "filter-meta-inner";
    // make select
    const select = document.createElement("select");
    select.id = "filter-meta";
    select.name = "filter-meta";
    // make option
    const option_r18 = document.createElement("option");
    option_r18.value = "r18";
    option_r18.textContent = "R-18のみ";
    const option_all = document.createElement("option");
    option_all.value = "all";
    option_all.textContent = "全年齢のみ";
    const option_none = document.createElement("option");
    option_none.value = "none";
    option_none.textContent = "指定なし";
    // add event listener
    select.addEventListener("change", () => {
        include_r18 = select.value;
        filter_content();
    });
    select.appendChild(option_none);
    select.appendChild(option_r18);
    select.appendChild(option_all);

    // make tree
    div_filter_meta.appendChild(div_filter_meta_inner_stock);
    div_filter_meta.appendChild(div_filter_meta_inner_rate);
    div_filter_meta_inner_stock.appendChild(input);
    div_filter_meta_inner_stock.appendChild(label);
    div_filter_meta_inner_rate.appendChild(select);
    return div_filter_meta;
}

function filter_content() {
    // get all checkbox
    const checkbox_list = document.querySelectorAll("input[name='filter']");
    // if all checkbox is not checked, display all li
    let all_not_checked = true;
    for (const checkbox of checkbox_list) {
        if (checkbox.checked) {
            all_not_checked = false;
            break;
        }
    }

    // get ul.item-list
    const item_list = document.querySelector("ul.item-list");
    for (const li of item_list.children) {
        li.style.display = "none";
        if (all_not_checked) {
            li.style.display = "contents";
        }

        // if checkbox is checked, and checkbox.value is in li.item-category, li.style.display = "contents"
        for (const checkbox of checkbox_list) {
            if (
                checkbox.checked &&
                li.querySelector(".item-category").textContent == checkbox.value
            ) {
                li.style.display = "contents";
            }
        }

        const data_item = li.getAttribute("data-item");
        const data_item_json = JSON.parse(data_item.replace(/&quot;/g, '"'));
        if (!include_sold_out && data_item_json.is_sold_out) {
            li.style.display = "none";
        }
        if (include_r18 == "r18" && !data_item_json.is_adult) {
            li.style.display = "none";
        }
        if (include_r18 == "all" && data_item_json.is_adult) {
            li.style.display = "none";
        }
    }
}

chrome.storage.sync.get("extended_settings", (result) => {
    const setting = result.extended_settings;
    if (setting && setting.auto_reload) {
        // define max page
        // query select div.shop-pager > nav > ul > li:last-child > a
        const last_page = document.querySelector("div.shop-pager > nav > ul > li:last-child > a");
        // if last_page is null, max_page is 1
        if (last_page == null) {
            max_page = 1;
            return;
        }
        // href has "/items?page=2" format
        const href = last_page.href;
        // split href by "="
        const href_split = href.split("=");
        // get last page number
        max_page = parseInt(href_split[href_split.length - 1]);
        // add event listener
        window.addEventListener("scroll", () => {
            // const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop;
            // get height from ul.item-list's bottom
            const item_list = document.querySelector("ul.item-list");
            ul_height = item_list.getBoundingClientRect().height;
            // console.log(scrollHeight - scrollTop);
            // console.log(item_list.getBoundingClientRect());
            if (scrollTop >= ul_height && not_adding) {
                // console.log(item_list.getBoundingClientRect());
                // console.log(scrollTop);
                load_more_items();
            }
        });

        // disable shop-pager
        const shop_pager = document.querySelector("div.shop-pager");
        shop_pager.style.display = "none";
        // make_filter_section();
        window.addEventListener("load", make_filter_section());
    }
});

// load_more_items();
