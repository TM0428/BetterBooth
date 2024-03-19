<template>
    <div class="content">
        <div class="filter">
            <filter-contents></filter-contents>
        </div>

        <div class="search-setting">
            <search-settings></search-settings>
        </div>

        <div class="extension-setting">
            <v-container class="ma-3 pa-0">
                <h1 class="mb-2">Extension Settings:</h1>
                <v-card
                    max-width="430px"
                    variant="tonal"
                    color="grey-lighten-1"
                >
                    <v-list class="mb-0">
                        <v-list-item>
                            <v-list-item-content>
                                <v-row class="align-center">
                                    <v-col :cols="7" class="text-body-2"
                                        >Language</v-col
                                    >
                                    <v-col :cols="5">
                                        <v-select
                                            density="compact"
                                            size="small"
                                            v-model="extended_settings.language"
                                            @update:modelValue="changeLanguage"
                                            hide-details
                                            :items="[
                                                {
                                                    text: '日本語',
                                                    value: 'ja',
                                                },
                                                {
                                                    text: 'English',
                                                    value: 'en',
                                                },
                                                {
                                                    text: '한국어',
                                                    value: 'ko',
                                                },
                                                {
                                                    text: '中文（简体）',
                                                    value: 'zh-CN',
                                                },
                                                {
                                                    text: '中文（繁體）',
                                                    value: 'zh-TW',
                                                },
                                            ]"
                                            item-title="text"
                                            item-value="value"
                                        ></v-select>
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-row class="align-center">
                                    <v-col :cols="8" class="text-body-2">
                                        {{ lang.saveItemOption }}
                                    </v-col>
                                    <v-col :cols="4">
                                        <v-checkbox
                                            class="d-flex justify-end"
                                            hide-details
                                            v-model="
                                                extended_settings.save_item
                                            "
                                        />
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <a
                                    target="_blank"
                                    href="https://tm0428.github.io/BetterBooth/howto/"
                                    >{{ lang.linkToHelp }}</a
                                >
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-list
                        class="my-0"
                        v-bind:disabled="!extended_settings.save_item"
                    >
                        <v-list-item>
                            <v-list-item-content>
                                <v-row class="align-center">
                                    <v-col :cols="8" class="text-body-2">{{
                                        lang.savePurchaseItem
                                    }}</v-col>
                                    <v-col :cols="4">
                                        <v-checkbox
                                            class="d-flex justify-end"
                                            hide-details
                                            v-model="
                                                extended_settings.save_purchase
                                            "
                                        />
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-row class="align-center">
                                    <v-col :cols="7" class="text-body-2">{{
                                        lang.autoReloadLabel
                                    }}</v-col>
                                    <v-col :cols="5">
                                        <v-checkbox
                                            class="d-flex justify-end"
                                            hide-details
                                            v-model="
                                                extended_settings.auto_reload
                                            "
                                        />
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-list class="mt-0">
                        <v-list-item>
                            <v-list-item-content>
                                <v-row class="align-center">
                                    <v-col cols="auto" class="ms-auto">
                                        <v-btn
                                            color="blue"
                                            variant="tonal"
                                            class="d-flex justify-end"
                                            @click="saveExtendedData()"
                                        >
                                            {{ lang.saveButton }}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <div class="text-body-1">
                        {{ exnotifText }}
                    </div>
                </v-card>
            </v-container>
        </div>
        <div v-if="extended_settings.save_item" class="d-flex justify-end ma-2">
            <a target="_blank" href="/src/option/option.html#/">
                <v-btn> {{ lang.gotoItemPage }} </v-btn>
            </a>
        </div>
    </div>
</template>

<script>
import ja from "../locales/ja.json";
import en from "../locales/en.json";
import ko from "../locales/ko.json";
import zh_cn from "../locales/zh-CN.json";
import zh_tw from "../locales/zh-TW.json";
import { mdiMenuDown } from "@mdi/js";
import FilterContents from "../components/FilterContents.vue";
import SearchSettings from "../components/SearchSettings.vue";

export default {
    components: {
        FilterContents,
        SearchSettings,
    },
    data() {
        return {
            extended_settings: {
                language: "ja",
                save_item: false,
                save_purchase: false,
                auto_reload: false,
            },
            notificationTimer: null,
            exnotifText: "",
            lang: ja,
            mdiMenuDownIcon: mdiMenuDown,
        };
    },
    methods: {
        saveExtendedData() {
            console.log(this.extended_settings);
            chrome.storage.sync.set({
                extended_settings: this.extended_settings,
            });
            this.showExNotificationText("Saved!");
        },
        changeLanguage() {
            switch (this.extended_settings.language) {
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
                    this.extended_settings.language = "ja";
            }
        },
        showExNotificationText(txt) {
            this.exnotifText = txt;

            if (this.notificationTimer) {
                clearTimeout(this.notificationTimer); // 前回のタイマーをキャンセル
            }

            this.notificationTimer = setTimeout(() => {
                this.exnotifText = "";
                this.notificationTimer = null; // タイマーをクリア
            }, 2000);
        },
    },
    created() {
        // 言語ファイルが正しく読み込まれることを確認してください
        const userLocale = window.navigator.language;
        console.log(userLocale);
        this.extended_settings.language = userLocale;
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
                this.extended_settings.language = "ja";
        }
        chrome.storage.sync.get("extended_settings", (result) => {
            console.log(result.extended_settings);
            const extended_settings = result.extended_settings;
            if (extended_settings) {
                this.extended_settings = extended_settings;
                if (this.extended_settings.language) {
                } else {
                    this.extended_settings.language = userLocale;
                }
            } else {
                this.extended_settings.language = userLocale;
            }
            this.changeLanguage();
        });
    },
};
</script>
<style scoped>
.content {
    width: 450px;
}
</style>
