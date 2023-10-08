<template>
    <div>
        <div class="text-h2 page-title ma-3">{{ lang.topTitle }}</div>
        <div class="help-and-search text-body-1 ml-4">
            <div class="help-link">
                <router-link :to="{ name: 'Howto' }" class="help-link-text">{{
                    lang.topHowto
                }}</router-link>
            </div>
        </div>

        <v-container fluid>
            <v-row>
                <v-col cols="12" sm="6" md="4" lg="3">
                    <v-text-field
                        v-model="searchText"
                        :label="lang.topSearchText"
                        :prepend-icon="mdiMagnifyIcon"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div v-if="srchShop.name">
                        <div class="text-caption">shop:</div>
                        <v-chip
                            class="text-blue-darken-3"
                            variant="outlined"
                            closable
                            @click:close="removeShop()"
                        >
                            <v-avatar start>
                                <v-img :src="srchShop.thumbnail_url"></v-img>
                            </v-avatar>

                            {{ srchShop.name }}
                        </v-chip>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <div v-if="srchTags.length != 0" class="text-caption">
                        tags:
                    </div>
                    <v-chip
                        v-for="(stag, index) in srchTags"
                        :key="stag"
                        closable
                        @click:close="removeTag(index)"
                        class="ma-1"
                        style="text-align: right"
                    >
                        {{ stag }}
                    </v-chip>
                </v-col>
            </v-row>
            <v-row class="mx-auto">
                <!-- アイテムカードを表示 -->
                <v-col
                    v-for="item in filteredItemList"
                    :key="item.id"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    xl="2"
                >
                    <ItemCard
                        :item="item"
                        @tag-clicked="handleTagClicked"
                        @shop-clicked="handleShopClicked"
                    />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                    <ItemImportCard :lang="lang" />
                </v-col>
            </v-row>
        </v-container>

        <a class="page-title text-body-1 ml-4" href="/src/popup/popup.html">{{
            lang.topSetttings
        }}</a>
        <input
            ref="uploadInput"
            type="file"
            accept=".json"
            style="display: none"
            @change="onFileChange"
            :key="inputKey"
        />
    </div>
</template>

<style>
.page-title {
    text-align: center;
}

.search-bar {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.search-icon {
    position: absolute;
    left: 30px;
}

.search-input {
    padding: 5px 10px 5px 30px;
    border: 1px solid #ccc;
    border-radius: 20px;
    outline: none;
    font-size: 16px;
    width: 100%;
}

.search-input:focus {
    border: 1px solid #999;
}

.card-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
}
</style>

<script>
import ja from "../locales/ja.json";
import en from "../locales/en.json";
import ko from "../locales/ko.json";
import zh_cn from "../locales/zh-CN.json";
import zh_tw from "../locales/zh-TW.json";
import ItemCard from "../components/ItemCard.vue";
import ItemImportCard from "../components/ItemImportCard.vue";
import { mdiMagnify } from "@mdi/js";

export default {
    components: {
        ItemCard,
        ItemImportCard,
    },
    data() {
        return {
            itemList: [],
            srchTags: [],
            srchShop: {},
            searchText: "",
            inputKey: 0,
            lang: ja,
            mdiMagnifyIcon: mdiMagnify,
        };
    },
    computed: {
        filteredItemList() {
            const keyword = this.searchText.toLowerCase();

            return this.itemList.filter((item) => {
                // キーワードによるフィルタリング
                const keywordMatch =
                    item.name.toLowerCase().includes(keyword) ||
                    item.shop.name.toLowerCase().includes(keyword);

                // srchTagsによるフィルタリング
                // const tagsMatch =
                //     this.srchTags.length === 0 ||
                //     this.srchTags.some((stag) => item.tags.includes(stag));
                const tagsMatch = this.srchTags.every((stag) =>
                    item.tags.includes(stag)
                );

                const shopMatch =
                    this.srchShop.name === undefined ||
                    this.srchShop.name === item.shop.name;

                return keywordMatch && tagsMatch && shopMatch;
            });
        },
    },
    methods: {
        uploadDataCardClicked() {
            this.$refs.uploadInput.click();
        },
        onFileChange(event) {
            this.inputKey += 1;
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const data = JSON.parse(reader.result);
                if (this.validateData(data)) {
                    // Only keep the required properties from the data object
                    const sanitizedData = {
                        additionalDescription:
                            data.additionalDescription || null,
                        description: data.description,
                        id: data.id,
                        price: data.price || "",
                        images: data.images || [],
                        name: data.name,
                        price: data.price || null,
                        shop: data.shop || null,
                    };
                    console.log(sanitizedData);

                    this.addStorage(sanitizedData);
                    // Perform any further operations with the sanitizedData
                } else {
                    window.alert(this.lang.topInvalid);
                }
            };
            reader.readAsText(file);
        },
        validateData(data) {
            // データがオブジェクトで、必要なプロパティが含まれているかを確認するバリデーション
            return (
                typeof data === "object" &&
                data !== null &&
                "description" in data &&
                typeof data.description === "string" &&
                "id" in data &&
                typeof data.id === "number" &&
                "images" in data &&
                Array.isArray(data.images) &&
                data.images.every(
                    (image) =>
                        typeof image === "object" &&
                        image !== null &&
                        "original" in image &&
                        typeof image.original === "string" &&
                        "resized" in image &&
                        typeof image.resized === "string"
                ) &&
                "name" in data &&
                typeof data.name === "string" &&
                "price" in data &&
                typeof data.price === "string" &&
                "shop" in data &&
                typeof data.shop === "object" &&
                data.shop !== null &&
                "name" in data.shop &&
                typeof data.shop.name === "string" &&
                "subdomain" in data.shop &&
                typeof data.shop.subdomain === "string" &&
                "url" in data.shop &&
                typeof data.shop.url === "string"
            );
        },
        addStorage(data) {
            const itemId = "items_" + String(data.id);
            chrome.storage.local.get("items", (result) => {
                var items = result.items;
                if (items && !items.includes(itemId)) {
                    // 新たに登録
                    items.push(itemId);
                    chrome.storage.local.set({ items: items });
                    chrome.storage.local.set({ [`${itemId}`]: data });
                } else if (items) {
                    // 既に登録されているので更新
                    chrome.storage.local.set({ [`${itemId}`]: data });
                } else {
                    // リスト作成と登録
                    items = [itemId];
                    console.log(items);
                    chrome.storage.local.set({ items: items });
                    chrome.storage.local.set({ [`${itemId}`]: data });
                }

                window.alert(this.lang.topDataAdd);
                this.reloadList();
            });
        },
        reloadList() {
            chrome.storage.local.get("items", (result) => {
                const itemIdList = result.items || [];
                this.itemList = [];
                itemIdList.forEach((itemId) => {
                    chrome.storage.local.get(`${itemId}`, (itemResult) => {
                        const itemData = itemResult[itemId];
                        if (itemData && itemData.name) {
                            this.itemList.push({
                                id: itemId.replace("items_", ""),
                                name: itemData.name,
                                shop: itemData.shop,
                                image: itemData.images[0].original,
                            });
                        }
                    });
                });
                console.log(this.itemList);
            });
        },
        handleTagClicked(tag) {
            console.log(tag); // ここでクリックされたtagを受け取る
            // srchTagsに同じテキストが存在しない場合、配列に追加
            if (!this.srchTags.includes(tag)) {
                this.srchTags.push(tag);
            }
        },
        handleShopClicked(shop) {
            console.log(shop);
            this.srchShop = shop;
        },
        removeTag(index) {
            this.srchTags.splice(index, 1); // 配列から指定されたインデックスのタグを削除
        },
        removeShop() {
            this.srchShop = {};
        },
    },
    created() {
        // 言語ファイルが正しく読み込まれることを確認してください
        const userLocale = window.navigator.language;
        // console.log(userLocale);
        switch (userLocale) {
            case "en":
                this.lang = en;
                break;
            case "ko":
                this.lang = ko;
                break;
            case "zh-CN":
                this.lang = zh_cn;
                break;
            case "zh-TW":
                this.lang = zh_tw;
                break;
            case "zh":
                this.lang = zh_cn;
                break;
            default:
                this.lang = ja;
        }
        chrome.storage.sync.get("extended_settings", (result) => {
            const extended_settings = result.extended_settings;
            if (!(extended_settings && extended_settings.save_item)) {
                window.location.href = "/src/popup/popup.html";
                return;
            }
            if (extended_settings && extended_settings.language) {
                switch (extended_settings.language) {
                    case "ko":
                        this.lang = ko;
                        break;
                    case "zh-CN":
                        this.lang = zh_cn;
                        break;
                    case "zh-TW":
                        this.lang = zh_tw;
                        break;
                    case "zh":
                        this.lang = zh_cn;
                        break;
                    case "en":
                        this.lang = en;
                        break;
                    default:
                        this.lang = ja;
                }
            }
        });
        chrome.storage.local.get("items", (result) => {
            const itemIdList = result.items || [];
            itemIdList.forEach((itemId) => {
                chrome.storage.local.get(`${itemId}`, (itemResult) => {
                    const itemData = itemResult[itemId];
                    if (itemData && itemData.name) {
                        this.itemList.push({
                            id: itemId.replace("items_", ""),
                            name: itemData.name,
                            shop: itemData.shop,
                            image: itemData.images[0].original,
                            tags: itemData.tags ? itemData.tags : [],
                        });
                    }
                });
            });
        });
    },
};
</script>
