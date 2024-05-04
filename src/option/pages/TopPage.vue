<template>
    <div class="toolbar">
        <AppBar
            active-text="Home"
            @update-text="updateSearchText"
            @clear-text="updateSearchText"
        ></AppBar>
    </div>
    <div class="content">
        <v-container fluid>
            <v-row>
                <v-col cols="12" lg="8">
                    <div class="text-h4" v-if="searchText != ''">Search by {{ searchText }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="2">
                    <ItemImportPopup @item-imported="handleItemImported"></ItemImportPopup>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="2">
                    <ItemDownloadPopup :filtered-item-list="filteredItemList"> </ItemDownloadPopup>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="py-1">
                    <div v-if="srchShop.name">
                        <div class="text-caption">
                            <p class="text-subtitle-1">shop:</p>
                        </div>
                        <v-chip
                            class="shop-chip"
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
                <v-col class="py-1">
                    <div v-if="srchTags.length != 0" class="text-caption">
                        <p class="text-subtitle-1">tags:</p>
                    </div>
                    <v-chip
                        v-for="(stag, index) in srchTags"
                        :key="stag"
                        closable
                        label
                        rounded="lg"
                        @click:close="removeTag(index)"
                        class="ma-1 tag-chip"
                        variant="outlined"
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
            </v-row>

            <v-pagination
                v-model="page"
                :length="pageCount"
                :total-visible="7"
                @update:modelValue="updateQuery"
            ></v-pagination>
        </v-container>
    </div>
</template>

<script>
import ItemCard from "../components/ItemCard.vue";
import ItemDownloadPopup from "../components/ItemDownloadPopup.vue";
import ItemImportPopup from "../components/ItemImportPopup.vue";
import AppBar from "../components/AppBar.vue";

import { mdiMagnify, mdiCartOutline, mdiHelpCircleOutline, mdiCloseCircle } from "@mdi/js";

export default {
    components: {
        ItemCard,
        ItemDownloadPopup,
        ItemImportPopup,
        AppBar
    },
    data() {
        return {
            itemList: [],
            srchTags: Array(),
            srchShop: {},
            srchCart: -1,
            searchText: "",
            inputKey: 0,
            page: 1,
            itemsPerPage: 24,
            drawer: false,
            mdiMagnifyIcon: mdiMagnify,
            mdiCartOutlineIcon: mdiCartOutline,
            mdiHelpCircleOutlineIcon: mdiHelpCircleOutline,
            mdiCloseCircleIcon: mdiCloseCircle
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
                }
                else if (item.tags) {
                    tagsMatch = this.srchTags.every((stag) => item.tags.includes(stag));
                }

                const shopMatch =
                    this.srchShop.name === undefined || this.srchShop.url === item.shop.url;

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
        }
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
            const cart_command = cart ? "is:cart" : "!is:cart";
            this.searchText += " " + cart_command;
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
        updateSearchText(text) {
            this.searchText = text;
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
            if (this.$route.query.tags) {
                this.srchTags = this.$route.query.tags.split(",") || [];
            }
        },
        updateShopFromQuery() {
            if (this.$route.query.shop_name) {
                this.srchShop = {
                    name: this.$route.query.shop_name,
                    thumbnail_url: this.$route.query.shop_icon,
                    url: this.$route.query.shop_url
                };
            }
            else {
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
                    shop_name: this.srchShop.name
                }
            });
        },
        updateAllQuery() {
            this.updateSearchTextFromQuery();
            this.updateTagsFromQuery();
            this.updateShopFromQuery();
            this.updatePageFromQuery();
            // this.updateQuery();
        }
    },
    mounted() {
        this.updateAllQuery();
    },
    watch: {
        $route: function () {
            this.updateAllQuery();
        }
    },
    created() {
        // 言語ファイルが正しく読み込まれることを確認してください
        const userLocale = window.navigator.language;
        // console.log(userLocale);
        this.$i18n.locale = userLocale;
        chrome.storage.sync.get("extended_settings", (result) => {
            const extended_settings = result.extended_settings;
            if (!(extended_settings && extended_settings.save_item)) {
                window.location.href = "/src/popup/popup.html";
                return;
            }
            if (extended_settings && extended_settings.language) {
                this.$i18n.locale = extended_settings.language;
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
    }
};
</script>

<style>
.tag-chip {
    color: rgb(var(--v-theme-onSurfaceVariant)) !important;
    background-color: rgba(var(--v-theme-onSurfaceVariant), 0.12) !important;
}

.shop-chip {
    color: rgb(var(--v-theme-primary)) !important;
    background-color: rgb(var(--v-theme-surfaceContainerLow)) !important;
}
</style>

<style scoped>
.searchTextBox >>> input {
    color: rgb(var(--v-theme-onSurface)) !important;
}
</style>
