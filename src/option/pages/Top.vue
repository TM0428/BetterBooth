<template>
    <div>
        <div class="toolbar">
            <v-toolbar color="primary" density="comfortable">
                <v-toolbar-title>{{ lang.topTitle }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <a
                    target="_blank"
                    href="https://tm0428.github.io/BetterBooth/howto/"
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
                    :clear-icon="mdiCloseCircleOutlineIcon"
                    @click:clear="searchText = ''"
                    rounded="rounded-pill"
                    density="compact"
                    single-line
                    hide-details
                ></v-text-field>
            </v-toolbar>
        </div>
        <div class="content">
            <v-container fluid>
                <!-- <v-row>
                    <v-col cols="12" sm="6" md="4" lg="3">
                        <v-text-field
                            v-model="searchText"
                            :label="lang.topSearchText"
                            :prepend-icon="mdiMagnifyIcon"
                            single-line
                            hide-details
                        ></v-text-field>
                    </v-col>
                </v-row> -->
                <v-row>
                    <v-col class="pb-2">
                        <div class="text-h4" v-if="searchText != ''">
                            Search by {{ searchText }}
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="py-1">
                        <div v-if="srchShop.name">
                            <div class="text-caption">
                                <p class="text-subtitle-1">
                                    shop:
                                </p>
                            </div>
                            <v-chip
                                class="text-blue-darken-3"
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
                    <v-col class="py-1">
                        <div v-if="srchTags.length != 0" class="text-caption">
                            <p class="text-subtitle-1">
                                tags:
                            </p>
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
                    <v-col
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
                    </v-col>
                </v-row>

                <v-pagination
                    v-model="page"
                    :length="pageCount"
                    :total-visible="7"
                ></v-pagination>
            </v-container>

            <a
                class="page-title text-body-1 ml-4"
                href="/src/popup/popup.html"
                >{{ lang.topSetttings }}</a
            >
        </div>
    </div>
</template>

<style scoped>
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
import {
    mdiMagnify,
    mdiCartOutline,
    mdiHelpCircleOutline,
    mdiCloseCircleOutline,
} from "@mdi/js";

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
            page: 1,
            itemsPerPage: 24,
            mdiMagnifyIcon: mdiMagnify,
            mdiCartOutlineIcon: mdiCartOutline,
            mdiHelpCircleOutlineIcon: mdiHelpCircleOutline,
            mdiCloseCircleOutlineIcon: mdiCloseCircleOutline,
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
                    // "is:download" という単語の特別な処理
                    if (term === "is:download") {
                        return item.download;
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
            console.log(tag); // ここでクリックされたtagを受け取る
            // srchTagsに同じテキストが存在しない場合、配列に追加
            if (!this.srchTags.includes(tag)) {
                this.srchTags.push(tag);
            }
            this.page = 1;
        },
        handleShopClicked(shop) {
            console.log(shop);
            this.srchShop = shop;
            this.page = 1;
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
        },
        removeShop() {
            this.srchShop = {};
            this.page = 1;
        },
        removeCart() {
            this.srchCart = -1;
            this.page = 1;
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
