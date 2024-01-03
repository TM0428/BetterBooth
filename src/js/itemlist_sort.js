let next_page = 2;
let max_page = 2;
let ul_height = 0;
let not_adding = true;

/**
 * if scroll to bottom, load more items
 * access to https://*.booth.pm/items?page=2
 * 
 */
async function load_more_items() {
	if(next_page > max_page) return;
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
	for(var i = 0; i < li_list.length; i++) {
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
	}


	// for(const li of ul.children) {
	// 	console.log(li);
	// 	// li have a data-item
	// 	// delete &quot; from data-item and load json
	// 	const data_item = li.getAttribute("data-item");
	// 	const data_item_json = JSON.parse(data_item.replace(/&quot;/g, '"'));
	// 	const div_item = make_content(data_item_json);
	// 	li.appendChild(div_item);

	// 	item_list.appendChild(li);
	// }
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
	div_absolute.className = "absolute left-[1px] bottom-[-1px] right:-[-1px] w-full h-[6px] overflow-hidden";

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
		const x = event.clientX - div_swap_image.parentNode.parentNode.parentNode.parentNode.offsetLeft;
		const index = Math.max(0, Math.min(Math.floor(x / width * image_count), image_count - 1));
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
	div_relative.className = "relative w-full flex flex-wrap items-center gap-4 mt-4 mb-2 empty:m-0 [&amp;_.badge]:!m-0 overflow-hidden";
	if(data_item_json.is_adult) {
		// make div.font-bold
		const div_font_bold = document.createElement("div");
		div_font_bold.className = "font-bold inline-block px-8 rounded-4 typography-12 preserve-half-leading text-white bg-[#e74a31] shop__text--contents shop__background--text";
		div_font_bold.textContent = "R-18";
		div_relative.appendChild(div_font_bold);
	}
	if(data_item_json.is_sold_out) {
		// make div.font-bold
		const div_font_bold = document.createElement("div");
		div_font_bold.className = "font-bold inline-block px-8 rounded-4 typography-12 preserve-half-leading shop__text--contents shop__background--text90";
		div_font_bold.textContent = "在庫なし";
		div_relative.appendChild(div_font_bold);
	}
	if(data_item_json.event) {
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
	a_item_card_title_anchor_multiline.className = "item-card__title-anchor--multiline whitespace-normal";
	a_item_card_title_anchor_multiline.href = data_item_json.shop_item_url;

	// make div.lo-grid
	const div_lo_grid = document.createElement("div");
	div_lo_grid.className = "lo-grid u-justify-content-between u-align-items-center";
	// make div.price
	const div_price = document.createElement("div");
	div_price.className = "price u-align-middle";
	div_price.textContent = data_item_json.price;
	// make form
	const form = document.createElement("form");
	form.action = data_item_json.url;
	form.method = "post";

	// make input
	const input = document.createElement("input");
	input.name = "authenticity_token";
	input.type = "hidden";
	input.value = "WaD6PJhLc-6R6ORe1Fo6Uf6ozmoXyNBE43dXsv1FJYMYmOicAsUnOfINwDDOAF98ojV6Ioa_tvC3PDKGbNmoOQ";
	// make button
	const button = document.createElement("button");
	button.className = "relative flex gap-2 items-center no-underline font-heavy-sans font-semibold bg-transparent !text-text-gray300 shop__text--link50";
	// make pixiv-icon
	// const pixiv_icon = document.createElement("pixiv-icon");
	// // pixiv_icon.name = "24/BoothLikeOn";
	// // pixiv_icon["unsafe-non-guideline-scale"] = "0.6666666666666666";
	// // make div.typography-14
	// const div_typography_14 = document.createElement("div");
	// div_typography_14.className = "typography-14 !typography-16";
	// div_typography_14.textContent = data_item_json.like_count;
	// make tree
	div_item.appendChild(div_thumb);
	div_item.appendChild(div_item_head);
	div_item_head.appendChild(a_item_category);
	div_item_head.appendChild(div_relative);
	h2_item_name.appendChild(a_item_card_title_anchor_multiline);
	div_item_head.appendChild(h2_item_name);
	div_item_head.appendChild(div_lo_grid);
	div_lo_grid.appendChild(div_price);
	div_lo_grid.appendChild(form);
	form.appendChild(input);
	form.appendChild(button);
	// button.appendChild(pixiv_icon);
	// button.appendChild(div_typography_14);
	return div_item;
}




chrome.storage.sync.get("extended_settings", (result) => {
    const setting = result.extended_settings;
    if (setting && setting.auto_reload) {

		// define max page
		// query select div.shop-pager > nav > ul > li:last-child > a
		const last_page = document.querySelector("div.shop-pager > nav > ul > li:last-child > a");
		// href has "/items?page=2" format
		const href = last_page.href;
		// split href by "="
		const href_split = href.split("=");
		// get last page number
		max_page = parseInt(href_split[href_split.length - 1]);
		// add event listener
		window.addEventListener("scroll", () => {
			const scrollHeight = document.documentElement.scrollHeight;
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

    }
});

// load_more_items();