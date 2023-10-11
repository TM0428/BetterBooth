<template>
    <v-app class="pa-0 ma-0">
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
                    :clear-icon="mdiCloseCircleIcon"
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
                <v-row>
                    <v-col class="pb-2 d-flex flex-row">
                        <div class="text-h4" v-if="searchText != ''">
                            Search by {{ searchText }}
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn>
                            {{ lang.allDownloadButton }}
                            <v-dialog
                                v-model="dialog"
                                activator="parent"
                                width="auto"
                            >
                                <v-card>
                                    <v-card-title>
                                        {{ lang.downloadTitle }}
                                    </v-card-title>
                                    <div class="ma-4">
                                        <div class="v-subtitle-1">
                                            {{ lang.downloadExt }}
                                        </div>
                                        <v-radio-group
                                            inline
                                            v-model="downloadSaveExt"
                                        >
                                            <v-radio
                                                label="CSV"
                                                value="CSV"
                                            ></v-radio>
                                            <v-radio
                                                label="JSON"
                                                value="JSON"
                                            ></v-radio>
                                        </v-radio-group>
                                        <div
                                            v-if="downloadSaveExt == ''"
                                            class="text-error"
                                        >
                                            At least one item should be selected
                                        </div>
                                        <div class="v-subtitle-1">
                                            {{ lang.downloadInfo }}
                                        </div>
                                        <v-row>
                                            <v-col
                                                cols="12"
                                                sm="6"
                                                md="4"
                                                lg="3"
                                                v-for="(info,
                                                index) in downloadSaveList"
                                                :key="info.value"
                                            >
                                                <v-checkbox
                                                    :label="info.label"
                                                    v-model="downloadSaveInfo"
                                                    color="primary"
                                                    :value="info.value"
                                                    hide-details
                                                    :rules="
                                                        downloadSaveInfoRules
                                                    "
                                                ></v-checkbox>
                                            </v-col>
                                        </v-row>
                                        <div
                                            v-if="
                                                downloadSaveInfoRules[0] != true
                                            "
                                            class="text-error"
                                        >
                                            {{ downloadSaveInfoRules[0] }}
                                        </div>
                                    </div>

                                    <v-card-actions>
                                        <v-btn
                                            color="primary"
                                            @click="dialog = false"
                                        >
                                            Close
                                        </v-btn>
                                        <v-btn
                                            type="submit"
                                            color="primary"
                                            @click="downloadItems()"
                                            v-bind:disabled="
                                                downloadSaveInfoRules[0] !=
                                                    true ||
                                                    downloadSaveExt == ''
                                            "
                                        >
                                            Save
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-btn>
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

                <a
                    class="page-title text-body-1 ml-4"
                    href="/src/popup/popup.html"
                    >{{ lang.topSetttings }}</a
                >
            </v-container>
        </div>
    </v-app>
</template>

<style scoped></style>

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
    mdiCloseCircle,
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
            downloadSaveExt: "CSV",
            downloadSaveList: [],
            downloadSaveInfo: [],
            inputKey: 0,
            lang: ja,
            page: 1,
            itemsPerPage: 24,
            dialog: false,
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
                    this.srchShop.name === item.shop.name;

                return keywordMatch && tagsMatch && shopMatch;
            });
        },
        downloadSaveInfoRules() {
            return [
                this.downloadSaveInfo.length > 0 ||
                    "At least one item should be selected",
            ];
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
        downloadItems() {
            // 1. filteredItemListから必要なデータを抽出
            const dataToDownload = this.filteredItemList.map((item) => {
                const extracted = {};
                this.downloadSaveInfo.forEach((key) => {
                    switch (key) {
                        case "shop.name":
                            extracted["shop.name"] = item.shop.name;
                            break;
                        case "shop.url":
                            extracted["shop.url"] = item.shop.url;
                            break;
                        default:
                            extracted[key] = item[key];
                    }
                });
                return extracted;
            });

            let fileContent;
            let mimeType;
            let fileExtension;

            // 2. this.downloadSaveExtの値に基づいて、データの形式を決定
            if (this.downloadSaveExt === "CSV") {
                fileContent = this.convertToCSV(dataToDownload);
                mimeType = "text/csv;charset=utf-8;";
                fileExtension = ".csv";
            } else if (this.downloadSaveExt === "JSON") {
                fileContent = JSON.stringify(dataToDownload, null, 4);
                mimeType = "application/json;charset=utf-8;";
                fileExtension = ".json";
            } else {
                console.error("Unknown download format:", this.downloadSaveExt);
                return;
            }

            // 3. データをBlobオブジェクトに変換し、それをダウンロードするリンクとして使用
            const blob = new Blob([fileContent], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "download" + fileExtension);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        convertToCSV(objArray) {
            const array =
                typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
            let str = "";
            let headers = this.downloadSaveInfo.join(",") + "\r\n";
            str += headers;

            for (let i = 0; i < array.length; i++) {
                let line = "";
                for (let index in array[i]) {
                    if (line !== "") line += ",";
                    line += '"' + String(array[i][index]) + '"';
                }
                str += line + "\r\n";
            }
            return str;
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

            this.downloadSaveList = this.lang.downloadSaveList;
            this.downloadSaveInfo = this.downloadSaveList.map(
                (item) => item.value
            );
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
