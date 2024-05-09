<template>
    <div class="toolbar">
        <AppBar
            ref="appbar"
            active-text="Home"
            @update-text="updateSearchText"
            @clear-text="updateSearchText"
        ></AppBar>
    </div>
    <div class="content">
        <v-container fluid>
            <v-row height="64">
                <v-col cols="12" lg="8" height="64">
                    <div
                        class="text-h4"
                        v-if="
                            !(
                                searchText == '' &&
                                srchTags.length == 0 &&
                                srchCart == -1 &&
                                (srchShop.name == '' || srchShop.name == undefined)
                            )
                        "
                    >
                        Search by {{ searchText }}

                        <span v-if="srchCart >= 0">
                            <v-chip
                                closable
                                @click:close="removeCart()"
                                :class="
                                    srchCart == 0
                                        ? 'ma-1 non-purchased-cart-chip'
                                        : 'ma-1 purchased-cart-chip'
                                "
                                :variant="srchCart == 0 ? 'outlined' : 'flat'"
                            >
                                <v-icon :icon="mdiCartOutlineIcon" class="mr-2"></v-icon>

                                <div v-if="srchCart == 1">
                                    {{ $t("purchased") }}
                                </div>
                                <div v-else>
                                    {{ $t("notpurchased") }}
                                </div>
                            </v-chip>
                        </span>
                        <span v-if="srchShop.name">
                            <v-chip
                                class="ma-1 shop-chip"
                                variant="outlined"
                                closable
                                @click:close="removeShop()"
                            >
                                <v-avatar start>
                                    <v-img :src="srchShop.thumbnail_url"></v-img>
                                </v-avatar>
                                shop: {{ srchShop.name }}
                            </v-chip>
                        </span>
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
                            tag: {{ stag }}
                        </v-chip>
                    </div>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="2">
                    <ItemImportPopup
                        @item-imported="handleItemImported"
                        class="ma-1"
                    ></ItemImportPopup>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="2">
                    <ItemDownloadPopup :filtered-item-list="filteredItemList" class="ma-1">
                    </ItemDownloadPopup>
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
import { getItems } from "@/js/module/item_data";

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
            srchShop: {
                name: "",
                thumbnail_url: "",
                url: ""
            },
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

                // cartデータによるフィルタリング
                let cartMatch = false;
                if (item.purchased == undefined && this.srchCart >= 0) {
                    cartMatch = false;
                }
                else if (this.srchCart == 0) {
                    cartMatch = !item.purchased;
                }
                else if (this.srchCart == 1) {
                    cartMatch = item.purchased;
                }
                else {
                    cartMatch = true;
                }
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

                return keywordMatch && tagsMatch && shopMatch && cartMatch;
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
        async reloadList() {
            this.itemList = await getItems();
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
            // const cart_command = cart ? "is:cart" : "!is:cart";
            // this.$refs.appbar.addSearchText(cart_command);
            if (cart) {
                this.srchCart = 1;
            }
            else {
                this.srchCart = 0;
            }
            this.page = 1;
            this.updateQuery();
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
    async created() {
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

        this.itemList = await getItems();
    }
};
</script>

<style>
.non-purchased-cart-chip {
    color: rgb(var(--v-theme-outline)) !important;
}

.non-purchased-cart-chip * {
    color: rgb(var(--v-theme-onSurfaceVariant)) !important;
}

.purchased-cart-chip {
    color: rgb(var(--v-theme-primary)) !important;
    background-color: rgb(var(--v-theme-secondaryContainer)) !important;
}

.purchased-cart-chip * {
    color: rgb(var(--v-theme-onSecondaryContainer)) !important;
}

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
