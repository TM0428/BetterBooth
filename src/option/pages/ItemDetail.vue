<template>
    <div class="content">
        <!--title-->
        <div class="text-h4 ma-2">{{ data.name }}</div>

        <v-container class="mx-lg-2 px-2 mx-sm-4">
            <v-row class="mx-sm-4">
                <v-col cols="12" sm="12" md="6" lg="6" xl="4">
                    <!--タグの追加-->
                    <v-combobox
                        class="ma-2"
                        v-model="data.tags"
                        :items="data.tags"
                        chips
                        clearable
                        multiple
                        label="tags"
                        variant="solo"
                    >
                    </v-combobox>
                </v-col>
            </v-row>
            <v-row class="mx-sm-4">
                <v-col cols="12" sm="12" md="6" lg="6" xl="4">
                    <v-carousel class="bg-grey-lighten-2">
                        <v-carousel-item
                            v-for="image in data.images"
                            :src="image.original"
                            @click="openPopup(image.original)"
                        ></v-carousel-item>
                    </v-carousel>
                </v-col>
            </v-row>
        </v-container>

        <p
            class="description text-justify ml-2"
            v-html="formatDescription(data.description)"
        ></p>
        <p
            class="additional-description text-justify ml-2"
            v-if="data.additionalDescription"
            v-html="formatDescription(data.additionalDescription)"
        ></p>

        <div class="new-buttons">
            <v-container>
                <v-row>
                    <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                        <v-btn
                            block
                            :to="{ name: 'Top' }"
                            :prepend-icon="mdiArrowLeftIcon"
                            rounded="xl"
                            size="large"
                        >
                            {{ lang.itemBackToList }}
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                        <a
                            :href="data.url"
                            target="_blank"
                            style="text-decoration: none"
                        >
                            <v-btn
                                block
                                rounded="xl"
                                size="large"
                                :prepend-icon="mdiLinkIcon"
                            >
                                {{ lang.itemGotoLink }}
                            </v-btn>
                        </a>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                        <a
                            :href="data.shop.url"
                            target="_blank"
                            style="text-decoration: none"
                        >
                            <v-btn
                                block
                                rounded="xl"
                                size="large"
                                :prepend-icon="mdiLinkIcon"
                            >
                                {{ lang.itemGotoShop }}
                            </v-btn>
                        </a>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                        <v-btn
                            block
                            :prepend-icon="mdiDownloadIcon"
                            rounded="xl"
                            size="large"
                            @click="exportData"
                        >
                            {{ lang.itemExport }}
                        </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3" xl="2">
                        <v-btn
                            block
                            :prepend-icon="mdiDeleteIcon"
                            rounded="xl"
                            size="large"
                            @click="deleteItem"
                        >
                            {{ lang.itemDelete }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <div class="popup" v-if="popupImage" @click="closePopup">
            <span class="popup-close" @click="closePopup">&times;</span>
            <img :src="popupImage" alt="Popup Image" class="popup-image" />
        </div>
    </div>
</template>

<script>
import router from "@/option/router"; // Vue Router インスタンスのインポート
import ja from "../locales/ja.json";
import en from "../locales/en.json";
import ko from "../locales/ko.json";
import zh_cn from "../locales/zh-CN.json";
import zh_tw from "../locales/zh-TW.json";
import { mdiArrowLeft, mdiLink, mdiDownload, mdiDelete } from "@mdi/js";

export default {
    props: ["itemId"],
    data() {
        return {
            data: {
                name: "",
                images: [""],
                description: "",
                additionalDescription: "",
                shop: {
                    url: "",
                },
            },
            popupImage: null,
            lang: ja,
            mdiArrowLeftIcon: mdiArrowLeft,
            mdiLinkIcon: mdiLink,
            mdiDownloadIcon: mdiDownload,
            mdiDeleteIcon: mdiDelete,
        };
    },

    created() {
        // 言語ファイルが正しく読み込まれることを確認してください
        const userLocale = window.navigator.language;
        console.log(userLocale);
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
        chrome.storage.local.get(`items_${this.itemId}`, (result) => {
            this.data = result[`items_${this.itemId}`];
            console.log(this.data);
        });
    },

    methods: {
        formatDescription(description) {
            return description.replace(/\n/g, "<br>");
        },
        openPopup(imageUrl) {
            this.popupImage = imageUrl;
            document.body.style.overflow = "hidden";
        },
        closePopup() {
            this.popupImage = null;
            document.body.style.overflow = "auto";
        },
        exportData() {
            const dataToExport = JSON.stringify(this.data);
            const filename = `${this.itemId}.json`;

            const blob = new Blob([dataToExport], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();

            URL.revokeObjectURL(url);
        },
        deleteItem() {
            if (confirm("データを削除しますか？")) {
                chrome.storage.local.get("items", (result) => {
                    const items = result.items || [];
                    const updatedItems = items.filter(
                        (item) => item !== "items_" + String(this.itemId)
                    );
                    console.log(updatedItems);

                    chrome.storage.local.set({ items: updatedItems }, () => {
                        chrome.storage.local.remove(
                            `items_${this.itemId}`,
                            () => {
                                console.log(
                                    `Item with ID ${this.itemId} deleted successfully.`
                                );
                                // 削除が完了した後の処理をここに記述する
                                window.alert("削除が完了しました。");
                                router.push({ name: "Top" }); // Topページにリダイレクト
                            }
                        );
                    });
                });
            }
        },
    },
    watch: {
        "data.tags": {
            handler(n, old) {
                const new_data = JSON.parse(JSON.stringify(this.data));
                chrome.storage.local.set({
                    [`items_${this.data.id}`]: new_data,
                });
                chrome.storage.local.get(`items_${this.itemId}`, (result) => {
                    console.log(result[`items_${this.itemId}`]);
                });
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
.content {
    font-family: -apple-system, BlinkMacSystemFont, Avenir, "Helvetica Neue",
        "Segoe UI", Arial, "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic ProN",
        メイリオ, Meiryo, "ＭＳ Ｐゴシック", sans-serif;
}

.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.popup-image {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
}

.popup-close {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    font-size: 36px;
    cursor: pointer;
}

.button-wrapper {
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.delete-button,
.export-button,
.shop-button {
    display: flex;
    align-items: center;
    background: none;
    border: 1px solid rgba(128, 128, 128, 0.24);
    height: 48px;
    padding: 0 24px 0 16px;
    margin-right: 16px;
    margin-bottom: 8px;
    letter-spacing: 0.25px;
    border-radius: 24px;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.3s ease;
}

.delete-button:hover,
.export-button:hover,
.shop-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.delete-button:active,
.export-button:active,
.shop-button:active {
    background-color: rgba(0, 0, 0, 0.2);
}

.button-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
}

body {
    overflow: auto;
}

.popup ~ * {
    pointer-events: none;
    user-select: none;
    filter: brightness(40%);
}

p {
    font-size: 15px;
}

.button-icon {
    margin-right: 10px;
}
</style>
