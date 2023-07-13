<template>
    <div>
        <h1>{{ lang.filtersHeader }}</h1>
        <ul class="filter-list">
            <li
                v-for="(filter, index) in filters"
                :key="filter"
                class="filter-item"
            >
                <a :href="filter" target="_blank">
                    {{ filter }}
                </a>
                <button
                    @click="removeFilter(index)"
                    class="filter-item right-side"
                >
                    {{ lang.removeButton }}
                </button>
            </li>
        </ul>
        <h1>Search Settings:</h1>
        <ul class="search-setting">
            <div>
                <fieldset :disabled="disable_data">
                    <li>
                        {{ lang.ageLabel }}
                        <select class="right-side" v-model="settings.age">
                            <option value="include">{{
                                lang.includeOption
                            }}</option>
                            <option value="default">{{
                                lang.defaultOption
                            }}</option>
                            <option value="only">{{ lang.onlyOption }}</option>
                        </select>
                    </li>
                    <li>
                        {{ lang.sortLabel }}
                        <select class="right-side" v-model="settings.sort">
                            <option value="">{{ lang.popularOption }}</option>
                            <option value="new">{{ lang.newOption }}</option>
                            <option value="wish_list">{{
                                lang.wishListOption
                            }}</option>
                            <option value="price_desc">{{
                                lang.priceDescOption
                            }}</option>
                            <option value="price_asc">{{
                                lang.priceAscOption
                            }}</option>
                        </select>
                    </li>
                    <li>
                        {{ lang.stockLabel }}
                        <input
                            class="right-side"
                            type="checkbox"
                            v-model="in_stock"
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
        </ul>
        <h1>Extension Setting:</h1>
        <ul>
            <li>
                購入物の情報を保存する(実験的機能)
                <input class="right-side" type="checkbox" v-model="save_item" />
            </li>
        </ul>
    </div>
</template>

<script>
import ja from "../locales/ja.json";
import en from "../locales/en.json";
import ko from "../locales/ko.json";
import zh_cn from "../locales/zh-CN.json";
import zh_tw from "../locales/zh-TW.json";

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
            in_stock: true,
            disable_text: "Disable",
            notificationTimer: null,
            notifText: "",
            lang: ja,
            save_item: false,
        };
    },
    methods: {
        removeFilter(index) {
            this.filters.splice(index, 1);
            console.log(this.filters);
            chrome.storage.sync.set({ filters: Array.from(this.filters) });
        },
        stockBoxChange(value) {
            this.settings.stock = value;
        },
        saveData() {
            this.settings.in_stock = !this.in_stock;
            chrome.storage.sync.set({ settings: this.settings });
            console.log(this.settings);
            this.showNotificationText("Saved!  Please reload.");
        },
        toggleDisable() {
            this.settings.disable = !this.settings.disable;
            if (this.settings.disable) {
                this.disable_text = "Disable";
            } else {
                this.disable_text = "Enable";
            }
            this.saveData();
            this.showNotificationText(this.disable_text + "d!  Please reload.");
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
    },
    computed: {
        disable_data() {
            return this.settings.disable;
        },
    },
};
</script>
<style scoped>
.filter-list {
    min-width: 350px;
    width: 400px;
    max-height: 200px;
    overflow: scroll;
    overflow-x: auto;
    overflow-y: auto;
}

.right-side {
    float: right;
}

.search-setting {
    min-width: 350px;
    width: 400px;
    max-height: 200px;
}

ul {
    box-shadow: 0px 0px 3px silver;
    border: solid 1px whitesmoke;
    padding: 0.5em 1em 0.5em 2.3em;
    position: relative;
    background: #fafafa;
}

ul li {
    line-height: 1.5;
    padding: 0.5em 0;
    list-style-type: none !important;
    font-size: larger;
    font-family: 游ゴシック;
}

fieldset {
    border: none;
}
</style>
