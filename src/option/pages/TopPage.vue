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
        <v-container fluid class="pa-4 pa-sm-6">
            <v-row align="center" class="mb-1">
                <v-col cols="12" md="6">
                    <div class="text-h6 font-weight-medium">
                        {{ $t("topItemCount", { count: filteredItemList.length }) }}
                    </div>
                </v-col>
                <v-col cols="12" md="6" class="d-flex flex-wrap ga-2 justify-md-end align-center">
                    <ItemImportPopup @item-imported="handleItemImported"></ItemImportPopup>
                    <ItemDownloadPopup
                        :filtered-item-list="filteredItemList"
                    ></ItemDownloadPopup>
                </v-col>
            </v-row>
            <v-row v-if="hasActiveFilter" class="mb-1" dense>
                <v-col cols="12" class="d-flex flex-wrap ga-2 align-center">
                    <v-chip
                        v-if="searchText"
                        closable
                        @click:close="clearSearchText()"
                        color="onSurfaceVariant"
                        variant="outlined"
                    >
                        <v-icon :icon="mdiMagnifyIcon" start></v-icon>
                        {{ searchText }}
                    </v-chip>
                    <v-chip
                        v-if="srchCart >= 0"
                        closable
                        @click:close="removeCart()"
                        :color="srchCart == 1 ? 'primary' : 'onSurfaceVariant'"
                        :variant="srchCart == 1 ? 'tonal' : 'outlined'"
                    >
                        <v-icon :icon="mdiCartOutlineIcon" start></v-icon>
                        <template v-if="srchCart == 1">
                            {{ $t("purchased") }}
                        </template>
                        <template v-else>
                            {{ $t("notpurchased") }}
                        </template>
                    </v-chip>
                    <v-chip
                        v-if="srchShop.name"
                        color="onSurfaceVariant"
                        variant="outlined"
                        closable
                        @click:close="removeShop()"
                    >
                        <v-avatar start>
                            <v-img :src="srchShop.thumbnail_url"></v-img>
                        </v-avatar>
                        {{ srchShop.name }}
                    </v-chip>
                    <v-chip
                        v-for="(stag, index) in srchTags"
                        :key="stag"
                        closable
                        label
                        rounded="lg"
                        @click:close="removeTag(index)"
                        color="onSurfaceVariant"
                        variant="tonal"
                    >
                        tag: {{ stag }}
                    </v-chip>
                </v-col>
            </v-row>
            <v-row>
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

            <div
                v-if="filteredItemList.length === 0"
                class="text-center py-16 text-onSurfaceVariant"
            >
                <v-icon :icon="mdiPackageVariantIcon" size="64" class="mb-4"></v-icon>
                <div class="text-h6">{{ $t("topNoItems") }}</div>
            </div>

            <v-pagination
                v-if="pageCount > 1"
                v-model="page"
                :length="pageCount"
                :total-visible="7"
                active-color="primary"
                class="my-6"
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

import {
    mdiMagnify,
    mdiCartOutline,
    mdiHelpCircleOutline,
    mdiCloseCircle,
    mdiPackageVariantClosed
} from "@mdi/js";
import { getItems } from "@/js/module/item_data";
import { getExtendedSettings } from "@/js/module/settings_data";

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
            mdiCloseCircleIcon: mdiCloseCircle,
            mdiPackageVariantIcon: mdiPackageVariantClosed
        };
    },
    computed: {
        hasActiveFilter() {
            return (
                this.searchText !== "" ||
                this.srchTags.length > 0 ||
                this.srchCart >= 0 ||
                Boolean(this.srchShop.name)
            );
        },
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
                } else if (this.srchCart == 0) {
                    cartMatch = !item.purchased;
                } else if (this.srchCart == 1) {
                    cartMatch = item.purchased;
                } else {
                    cartMatch = true;
                }
                // srchTagsによるフィルタリング
                let tagsMatch = false;
                if (this.srchTags.length === 0) {
                    tagsMatch = true;
                } else if (item.tags) {
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
            } else {
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
        clearSearchText() {
            if (this.$refs.appbar) {
                this.$refs.appbar.handleClearText();
            } else {
                this.updateSearchText("");
            }
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
        const extended_settings = await getExtendedSettings();
        if (extended_settings.language) {
            this.$i18n.locale = extended_settings.language;
        }

        this.itemList = await getItems();
        console.log(this.itemList);
    }
};
</script>

<style scoped>
.content {
    min-height: 100vh;
}
</style>
