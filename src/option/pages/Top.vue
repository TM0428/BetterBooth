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
            <!-- <v-row>
                <v-col>
                    <div v-if="srchCart >= 0">
                        <div class="text-caption">cart:</div>
                        <v-chip
                            closable
                            :color="srchCart === 1 ? 'blue' : 'grey lighten-2'"
                            @click.close="removeCart()"
                        >
                            <v-icon :icon="mdiCartOutlineIcon"></v-icon>
                        </v-chip>
                    </div>
                </v-col>
            </v-row> -->
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
                        @cart-clicked="handleCartClicked"
                    />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                    <ItemImportCard
                        :lang="lang"
                        @item-imported="handleItemImported"
                    />
                </v-col>
            </v-row>
        </v-container>

        <a class="page-title text-body-1 ml-4" href="/src/popup/popup.html">{{
            lang.topSetttings
        }}</a>
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
import { mdiMagnify, mdiCartOutline } from "@mdi/js";

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
            srchCart: -1,
            searchText: "",
            inputKey: 0,
            lang: ja,
            mdiMagnifyIcon: mdiMagnify,
            mdiCartOutlineIcon: mdiCartOutline,
        };
    },
    computed: {
        filteredItemList() {
            const searchTerms = this.searchText.toLowerCase().split(" "); // スペースで検索ワードを分割

            return this.itemList.filter((item) => {
                // キーワードによるフィルタリング
                const keywordMatch = searchTerms.every((term) => {
                    // "is:cart" という単語の特別な処理
                    if (term === "is:cart") {
                        return item.purchased;
                    }

                    return (
                        item.name.toLowerCase().includes(term) ||
                        item.shop.name.toLowerCase().includes(term)
                    );
                });

                // srchTagsによるフィルタリング
                let tagsMatch = false;
                if (this.srchTags.length === 0) {
                    tagsMatch = true;
                } else if (item.tags) {
                    tagsMatch = this.srchTags.every((stag) =>
                        item.tags.includes(stag)
                    );
                }

                const shopMatch =
                    this.srchShop.name === undefined ||
                    this.srchShop.name === item.shop.name;

                return keywordMatch && tagsMatch && shopMatch;
            });
        },
    },
    methods: {
        reloadList() {
            chrome.storage.local.get("items", (result) => {
                const itemIdList = result.items || [];
                this.itemList = [];
                itemIdList.forEach((itemId) => {
                    chrome.storage.local.get(`${itemId}`, (itemResult) => {
                        const itemData = itemResult[itemId];
                        if (itemData && itemData.name) {
                            this.itemList.push(itemData);
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
        handleCartClicked(cart) {
            console.log(cart);
            cart ? (this.srchCart = 1) : (this.srchCart = 0);
        },
        handleItemImported(status) {
            console.log(status);
            if (!status) {
                this.reloadList();
            }
        },
        removeTag(index) {
            this.srchTags.splice(index, 1); // 配列から指定されたインデックスのタグを削除
        },
        removeShop() {
            this.srchShop = {};
        },
        removeCart() {
            this.srchCart = -1;
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
                        this.itemList.push(itemData);
                    }
                });
            });
        });
    },
};
</script>