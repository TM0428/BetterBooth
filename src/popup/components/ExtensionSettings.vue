<template>
    <v-container class="ma-3 pa-0">
        <h1 class="mb-2">Extension Settings:</h1>
        <v-card max-width="430px" variant="tonal" color="grey-lighten-1">
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
                                    @update:modelValue="
                                        changeLanguage();
                                        saveExtendedData();
                                    "
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
                            <v-col :cols="7" class="text-body-2">
                                <div>{{ $t("autoReloadLabel") }}</div>
                                <div class="text-caption">
                                    {{ $t("autoReloadWarning") }}
                                </div>
                            </v-col>
                            <v-col :cols="5">
                                <v-checkbox
                                    class="d-flex justify-end"
                                    hide-details
                                    v-model="extended_settings.auto_reload"
                                    @click="saveExtendedData"
                                />
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-row class="align-center">
                            <v-col :cols="8" class="text-body-2">
                                {{ $t("saveItemOption") }}
                            </v-col>
                            <v-col :cols="4">
                                <v-checkbox
                                    class="d-flex justify-end"
                                    hide-details
                                    v-model="extended_settings.save_item"
                                    @click="saveExtendedData"
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
                            >{{ $t("linkToHelp") }}</a
                        >
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-list class="my-0" v-bind:disabled="!extended_settings.save_item">
                <v-list-item>
                    <v-list-item-content>
                        <v-row class="align-center">
                            <v-col :cols="8" class="text-body-2">{{
                                $t("savePurchaseItem")
                            }}</v-col>
                            <v-col :cols="4">
                                <v-checkbox
                                    class="d-flex justify-end"
                                    hide-details
                                    v-model="extended_settings.save_purchase"
                                    @click="saveExtendedData"
                                />
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-list class="mt-0" v-if="extended_settings.save_item">
                <v-list-item>
                    <v-list-item-content>
                        <v-row class="align-center">
                            <v-col cols="auto" class="ms-auto">
                                <a
                                    target="_blank"
                                    href="/src/option/option.html#/"
                                >
                                    <v-btn color="#ff4d50">
                                        {{ $t("gotoItemPage") }}
                                    </v-btn>
                                </a>
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
</template>

<script>
export default {
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
        changeLanguage() {
            this.$i18n.locale = this.extended_settings.language;
        },
    },
    created() {
        const userLocale = window.navigator.language;
        chrome.storage.sync.get("extended_settings", (result) => {
            console.log(result.extended_settings);
            // this.extended_settingsに対して、result.extended_settingsを更新
            this.extended_settings.language =
                result.extended_settings.language || "ja";
            this.extended_settings.save_item =
                result.extended_settings.save_item || false;
            this.extended_settings.save_purchase =
                result.extended_settings.save_purchase || false;
            this.extended_settings.auto_reload =
                result.extended_settings.auto_reload || false;

            if (result.extended_settings && result.extended_settings.language) {
            } else {
                this.extended_settings.language = userLocale;
            }
            this.$i18n.locale = this.extended_settings.language;
        });
    },
};
</script>
