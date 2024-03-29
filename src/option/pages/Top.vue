<template>
    <v-app class="pa-0 ma-0">
        <div class="toolbar">
            <v-toolbar color="primary" density="comfortable">
                <v-toolbar-title class="d-flex flex-row">
                    {{ lang.topTitle }}
                    <div class="text-caption">v0.4.4</div>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <a
                    target="_blank"
                    href="https://tm0428.github.io/BetterBooth/howto/#%E6%A4%9C%E7%B4%A2%E6%96%B9%E6%B3%95%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6"
                >
                    <v-btn icon>
                        <v-icon
                            :icon="mdiHelpCircleOutlineIcon"
                            color="white"
                        ></v-icon>
                        <v-tooltip activator="parent" location="bottom">{{
                            lang.topHowto
                        }}</v-tooltip>
                    </v-btn>
                </a>
                <v-text-field
                    class="mr-4"
                    v-model="searchText"
                    :label="lang.topSearchText"
                    :prepend-icon="mdiMagnifyIcon"
                    clearable
                    :clear-icon="mdiCloseCircleIcon"
                    @click:clear="
                        searchText = '';
                        updateQuery();
                    "
                    rounded="rounded-pill"
                    density="compact"
                    single-line
                    hide-details
                    @change="updateSearchText"
                ></v-text-field>
            </v-toolbar>
        </div>
        <div class="content">
            <v-container fluid>
                <v-row>
                    <v-col class="pb-2 d-flex flex-row">
                        <div class="text-h4" v-if="searchText != ''">
                            Search by {{ searchText }}
                        </div>
                        <v-spacer></v-spacer>
                        <ItemImportPopup
                            :lang="lang"
                            @item-imported="handleItemImported"
                        ></ItemImportPopup>
                        <ItemDownloadPopup
                            :filtered-item-list="filteredItemList"
                            :lang="lang"
                        >
                        </ItemDownloadPopup>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="py-1">
                        <div v-if="srchShop.name">
                            <div class="text-caption">
                                <p class="text-subtitle-1">shop:</p>
                            </div>
                            <v-chip
                                color="info"
                                variant="outlined"
                                closable
                                @click:close="removeShop()"
                            >
                                <v-avatar start>
                                    <v-img
                                        :src="srchShop.thumbnail_url"
                                    ></v-img>
                                </v-avatar>

                                {{ srchShop.name }}
                            </v-chip>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="py-1">
                        <div v-if="srchTags.length != 0" class="text-caption">
                            <p class="text-subtitle-1">tags:</p>
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
                        v-for="item in paginatedItems"
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
                    <!-- <v-col
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                        xl="2"
                        v-if="paginatedItems.length < 24"
                    >
                        <ItemImportCard
                            :lang="lang"
                            @item-imported="handleItemImported"
                        />
                    </v-col> -->
                </v-row>

                <v-pagination
                    v-model="page"
                    :length="pageCount"
                    :total-visible="7"
                    @update:modelValue="updateQuery"
                ></v-pagination>

                <a
                    class="page-title text-body-1 ml-4"
                    href="/src/popup/popup.html"
                    >{{ lang.topSetttings }}</a
                >
            </v-container>
        </div>
    </v-app>
</template>

<script>
import ja from "../locales/ja.json";
import en from "../locales/en.json";
import ko from "../locales/ko.json";
import zh_cn from "../locales/zh-CN.json";
import zh_tw from "../locales/zh-TW.json";
import ItemCard from "../components/ItemCard.vue";
import ItemImportCard from "../components/ItemImportCard.vue";
import ItemDownloadPopup from "../components/ItemDownloadPopup.vue";
import ItemImportPopup from "../components/ItemImportPopup.vue";

import {
    mdiMagnify,
    mdiCartOutline,
    mdiHelpCircleOutline,
    mdiCloseCircle,
    mdiFileImport,
} from "@mdi/js";

export default {
    components: {
        ItemCard,
        ItemImportCard,
        ItemDownloadPopup,
        ItemImportPopup,
    },
    data() {
        return {
            itemList: [],
            srchTags: Array(),
            srchShop: {},
            srchCart: -1,
            searchText: "",
            inputKey: 0,
            lang: ja,
            page: 1,
            itemsPerPage: 24,
            mdiMagnifyIcon: mdiMagnify,
            mdiCartOutlineIcon: mdiCartOutline,
            mdiHelpCircleOutlineIcon: mdiHelpCircleOutline,
            mdiCloseCircleIcon: mdiCloseCircle,
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
                    if (term === "!is:cart") {
                        return !item.purchased;
                    }
                    // "is:download" という単語の特別な処理
                    if (term === "is:download") {
                        return item.download;
                    }
                    if (term === "!is:download") {
                        return !item.download;
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
                    this.srchShop.url === item.shop.url;

                return keywordMatch && tagsMatch && shopMatch;
            });
        },
        paginatedItems() {
            const start = (this.page - 1) * this.itemsPerPage;
            const end = this.page * this.itemsPerPage;
            return this.filteredItemList.slice(start, end);
        },
        pageCount() {
            return Math.ceil(this.filteredItemList.length / this.itemsPerPage);
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
            console.log(tag);
            if (!this.srchTags.includes(tag)) {
                this.srchTags.push(tag);
            }
            this.page = 1;
            this.updateQuery();
        },
        handleShopClicked(shop) {
            console.log(shop);
            this.srchShop = shop;
            this.page = 1;
            this.updateQuery();
        },
        handleCartClicked(cart) {
            console.log(cart);
            cart ? (this.srchCart = 1) : (this.srchCart = 0);
            this.page = 1;
        },
        handleItemImported(status) {
            if (!status) {
                this.reloadList();
            }
            this.page = 1;
        },
        removeTag(index) {
            this.srchTags.splice(index, 1); // 配列から指定されたインデックスのタグを削除
            this.page = 1;
            this.updateQuery();
        },
        removeShop() {
            this.srchShop = {};
            this.page = 1;
            this.updateQuery();
        },
        removeCart() {
            this.srchCart = -1;
            this.page = 1;
        },
        updateSearchText() {
            this.page = 1;
            this.updateQuery();
        },
        updatePageFromQuery() {
            this.page = Number(this.$route.query.page) || 1;
        },
        updateSearchTextFromQuery() {
            this.searchText = this.$route.query.search || "";
        },
        updateTagsFromQuery() {
            console.log("updateTagsFromQuery");
            if (this.$route.query.tags) {
                this.srchTags = this.$route.query.tags.split(",") || [];
            }
        },
        updateShopFromQuery() {
            if (this.$route.query.shop_name) {
                this.srchShop = {
                    name: this.$route.query.shop_name,
                    thumbnail_url: this.$route.query.shop_icon,
                    url: this.$route.query.shop_url,
                };
            } else {
                this.srchShop = {};
            }
        },
        updateQuery() {
            const tags_str = this.srchTags.join(",");
            this.$router.push({
                query: {
                    search: this.searchText,
                    page: this.page,
                    tags: tags_str,
                    shop_url: this.srchShop.url,
                    shop_icon: this.srchShop.thumbnail_url,
                    shop_name: this.srchShop.name,
                },
            });
        },
        updateAllQuery() {
            this.updateSearchTextFromQuery();
            this.updateTagsFromQuery();
            this.updateShopFromQuery();
            this.updatePageFromQuery();
            // this.updateQuery();
        },
    },
    mounted() {
        this.updateAllQuery();
    },
    watch: {
        $route: function(newVal, oldVal) {
            this.updateAllQuery();
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
