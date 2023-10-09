<template>
    <div class="content">
        <div class="new-filter">
            <v-container class="ma-3 pa-0">
                <h1 class="mb-2">{{ lang.filtersHeader }}</h1>
                <v-card
                    max-width="430px"
                    variant="tonal"
                    color="grey-lighten-1"
                >
                    <v-list class="filter-list mx-auto">
                        <template
                            v-for="(filter, index) in filters"
                            :key="filter"
                        >
                            <v-list-item>
                                <v-list-item-content
                                    class="d-flex align-center justify-space-between"
                                >
                                    <a
                                        :href="filter"
                                        target="_blank"
                                        class="text-body-2"
                                        >{{ filter }}</a
                                    >
                                    <v-btn
                                        color="red"
                                        size="small"
                                        variant="tonal"
                                        @click="removeFilter(index)"
                                    >
                                        {{ lang.removeButton }}
                                    </v-btn>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider
                                v-if="index !== filters.length - 1"
                                :key="`divider-${index}`"
                            ></v-divider>
                        </template>
                    </v-list>
                </v-card>
            </v-container>
        </div>

        <!-- <h1 class="ma-3">{{ lang.filtersHeader }}</h1>
        <v-list class="filter-list d-flex flex-row justify-center">
            <v-list-item-group style="width: 100%">
                <v-list-item v-for="(filter, index) in filters" :key="filter">
                    <v-list-item-content
                        class="d-flex align-center justify-space-between"
                    >
                        <a :href="filter" target="_blank">{{ filter }}</a>

                        <v-btn
                            color="red"
                            @click="removeFilter(index)"
                            size="small"
                        >
                            {{ lang.removeButton }}
                        </v-btn>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list> -->

        <div class="new-search-setting">
            <v-container class="ma-3 pa-0">
                <h1 class="mb-2">Search Settings:</h1>
                <v-card
                    max-width="430px"
                    variant="tonal"
                    color="grey-lighten-1"
                >
                    <v-list class="mb-0">
                        <v-list-item>
                            <v-list-item-content>
                                <v-row class="align-center">
                                    <v-col :cols="7" class="text-body-2">{{
                                        lang.toggleSearchSetting
                                    }}</v-col>
                                    <v-col :cols="5">
                                        <v-checkbox
                                            class="d-flex justify-end"
                                            hide-details
                                            v-model="settings.disable"
                                        />
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-list class="my-0" v-bind:disabled="settings.disable">
                        <v-list-item>
                            <v-list-item-content>
                                <v-row class="align-center">
                                    <v-col :cols="7" class="text-body-2">{{
                                        lang.ageLabel
                                    }}</v-col>
                                    <v-col :cols="5">
                                        <v-select
                                            density="compact"
                                            size="small"
                                            v-model="settings.age"
                                            hide-details
                                            :items="[
                                                {
                                                    text: lang.includeOption,
                                                    value: 'include',
                                                },
                                                {
                                                    text: lang.defaultOption,
                                                    value: 'default',
                                                },
                                                {
                                                    text: lang.onlyOption,
                                                    value: 'only',
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
                                    <v-col :cols="7" class="text-body-2">{{
                                        lang.sortLabel
                                    }}</v-col>
                                    <v-col :cols="5">
                                        <v-select
                                            density="compact"
                                            v-model="settings.sort"
                                            hide-details
                                            :items="[
                                                {
                                                    text: lang.popularOption,
                                                    value: '',
                                                },
                                                {
                                                    text: lang.newOption,
                                                    value: 'new',
                                                },
                                                {
                                                    text: lang.wishListOption,
                                                    value: 'wish_list',
                                                },
                                                {
                                                    text: lang.priceDescOption,
                                                    value: 'price_desc',
                                                },
                                                {
                                                    text: lang.priceAscOption,
                                                    value: 'price_asc',
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
                                    <v-col :cols="7" class="text-body-2">{{
                                        lang.stockLabel
                                    }}</v-col>
                                    <v-col :cols="5">
                                        <v-checkbox
                                            class="d-flex justify-end"
                                            hide-details
                                            v-model="in_stock"
                                        />
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-row class="align-center">
                                    <v-col :cols="7" class="text-body-2">{{
                                        lang.newArrivalLabel
                                    }}</v-col>
                                    <v-col :cols="5">
                                        <v-checkbox
                                            class="d-flex justify-end"
                                            hide-details
                                            v-model="settings.new_arrival"
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
                                            @click="saveData()"
                                        >
                                            {{ lang.saveButton }}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <div class="text-body-1">
                        {{ notifText }}
                    </div>
                </v-card>
            </v-container>
        </div>

        <!-- <h1 class="ma-3">Search Settings:</h1>
        <ul class="search-setting">
            <div>
                <fieldset :disabled="disable_data">
                    <li>
                        {{ lang.ageLabel }}
                        <select class="right-side" v-model="settings.age">
                            <option value="include">
                                {{ lang.includeOption }}
                            </option>
                            <option value="default">
                                {{ lang.defaultOption }}
                            </option>
                            <option value="only">{{ lang.onlyOption }}</option>
                        </select>
                    </li>
                    <li>
                        {{ lang.sortLabel }}
                        <select class="right-side" v-model="settings.sort">
                            <option value="">{{ lang.popularOption }}</option>
                            <option value="new">{{ lang.newOption }}</option>
                            <option value="wish_list">
                                {{ lang.wishListOption }}
                            </option>
                            <option value="price_desc">
                                {{ lang.priceDescOption }}
                            </option>
                            <option value="price_asc">
                                {{ lang.priceAscOption }}
                            </option>
                        </select>
                    </li>
                    <li>
                        {{ lang.stockLabel }}
                        <input
                            class="right-side"
                            type="checkbox"
                            v-model="in_stock"
                            name="checkbox01"
                        />
                    </li>
                    <li>
                        {{ lang.newArrivalLabel }}
                        <input
                            class="right-side"
                            type="checkbox"
                            v-model="settings.new_arrival"
                        />
                    </li>
                </fieldset>
            </div>
            <li>
                <button @click="saveData()">{{ lang.saveButton }}</button>
                <button class="right-side" @click="toggleDisable()">
                    {{ disable_text }}
                </button>
            </li>
            <div>
                {{ notifText }}
            </div>
        </ul> -->

        <div class="new-extension-setting">
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
                                    href="/src/option/option.html#/howto"
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

        <!-- <h1>Extension Settings:</h1>
        <ul class="extended-setting">
            <li>
                Language
                <select
                    class="right-side"
                    v-model="extended_settings.language"
                    v-on:change="changeLanguage"
                    :menu-icon="mdiMenuDownIcon"
                >
                    <option value="ja">日本語</option>
                    <option value="en">English</option>
                    <option value="ko">한국어</option>
                    <option value="zh-CN">中文（简体）</option>
                    <option value="zh-TW">中文（繁體）</option>
                </select>
            </li>
            <li>
                {{ lang.saveItemOption }}
                <input
                    class="right-side"
                    type="checkbox"
                    v-model="extended_settings.save_item"
                />
            </li>
            <li>
                <a target="_blank" href="/src/option/option.html#/howto">{{
                    lang.linkToHelp
                }}</a>
            </li>
            <li class="save-button">
                <button class="right-side" @click="saveExtendedData()">
                    {{ lang.saveButton }}
                </button>
            </li>
            <div>
                {{ exnotifText }}
            </div>
        </ul> -->
    </div>
</template>

<script>
import ja from "../locales/ja.json";
import en from "../locales/en.json";
import ko from "../locales/ko.json";
import zh_cn from "../locales/zh-CN.json";
import zh_tw from "../locales/zh-TW.json";
import { mdiMenuDown } from "@mdi/js";

export default {
    data() {
        return {
            filters: [],
            settings: {
                age: "include",
                sort: "",
                in_stock: false,
                new_arrival: false,
                disable: true,
            },
            extended_settings: {
                language: "ja",
                save_item: false,
                save_purchase: false,
            },
            in_stock: true,
            notificationTimer: null,
            notifText: "",
            exnotifText: "",
            lang: ja,
            mdiMenuDownIcon: mdiMenuDown,
        };
    },
    methods: {
        removeFilter(index) {
            this.filters.splice(index, 1);
            console.log(this.filters);
            chrome.storage.sync.set({ filters: Array.from(this.filters) });
        },
        saveData() {
            this.settings.in_stock = !this.in_stock;
            chrome.storage.sync.set({ settings: this.settings });
            console.log(this.settings);
            this.showNotificationText("Saved!  Please reload.");
        },
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
        showNotificationText(txt) {
            this.notifText = txt;

            if (this.notificationTimer) {
                clearTimeout(this.notificationTimer); // 前回のタイマーをキャンセル
            }

            this.notificationTimer = setTimeout(() => {
                this.notifText = "";
                this.notificationTimer = null; // タイマーをクリア
            }, 2000);
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
        chrome.storage.sync.get("filters", (result) => {
            this.filters = result.filters || [];
        });
        chrome.storage.sync.get("settings", (result) => {
            console.log(result.settings);
            if (result.settings !== undefined) {
                this.settings = result.settings;
                this.settings.disable =
                    this.settings.disable === undefined
                        ? true
                        : this.settings.disable;
                this.in_stock =
                    this.settings.in_stock === undefined
                        ? true
                        : !this.settings.in_stock;
            }
            if (this.settings.disable) {
                this.disable_text = "Disable";
            } else {
                this.disable_text = "Enable";
            }
        });
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
    computed: {
        disable_data() {
            return this.settings.disable;
        },
    },
};
</script>
<style scoped>
.content {
    width: 450px;
}

.filter-list {
    min-width: 350px;
    width: 100%;
    max-height: 200px;
    overflow: scroll;
    overflow-x: auto;
    overflow-y: auto;
}
</style>
