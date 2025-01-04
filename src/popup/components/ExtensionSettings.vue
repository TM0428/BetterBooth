<template>
    <v-sheet color="surfaceContainerLow" border="sm" rounded="lg" style="position: relative">
        <h1 class="ma-4">Extension Settings:</h1>
        <v-divider></v-divider>
        <div class="settingsContents">
            <v-sheet color="surface" border="sm" rounded="lg" class="my-4 mx-2">
                <v-list class="pa-0 mx-2">
                    <v-list-item height="64">
                        <v-list-item-content>
                            <v-row class="align-center">
                                <v-col :cols="7" class="text-body-2">Language</v-col>
                                <v-col :cols="5">
                                    <v-select
                                        density="comfortable"
                                        size="small"
                                        v-model="extended_settings.language"
                                        @update:modelValue="
                                            changeLanguage();
                                            saveExtendedData();
                                        "
                                        hide-details
                                        :items="lang_data"
                                        item-title="text"
                                        item-value="value"
                                    ></v-select>
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item height="64">
                        <v-list-item-content>
                            <v-row class="align-center">
                                <v-col :cols="8" class="text-body-2">
                                    <div>{{ $t("changeFilterLabel") }}</div>
                                </v-col>
                                <v-col :cols="4">
                                    <v-btn color="primary" block @click="confirmDialog = true">
                                        {{ $t("changeFilterButtonLabel") }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item height="64">
                        <v-list-item-content>
                            <v-row class="align-center">
                                <v-col :cols="8" class="text-body-2">
                                    <div>{{ $t("autoReloadLabel") }}</div>
                                </v-col>
                                <v-col :cols="4">
                                    <v-checkbox
                                        class="d-flex justify-end"
                                        hide-details
                                        color="primary"
                                        base-color="on-surface-variant"
                                        v-model="extended_settings.auto_reload"
                                        @update:modelValue="saveExtendedData()"
                                    />
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item height="64">
                        <v-list-item-content>
                            <v-row class="align-center">
                                <v-col :cols="8" class="text-body-2">
                                    <div>{{ $t("saveItemOption") }}</div>
                                    <a
                                        target="_blank"
                                        href="https://tm0428.github.io/BetterBooth/howto/"
                                        >{{ $t("linkToHelp") }}</a
                                    >
                                </v-col>
                                <v-col :cols="4">
                                    <v-checkbox
                                        class="d-flex justify-end"
                                        hide-details
                                        color="primary"
                                        base-color="on-surface-variant"
                                        v-model="extended_settings.save_item"
                                        @update:modelValue="saveExtendedData()"
                                    />
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-list class="pa-0 mx-2" v-bind:disabled="!extended_settings.save_item">
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
                                        color="primary"
                                        base-color="on-surface-variant"
                                        v-model="extended_settings.save_purchase"
                                        @update:modelValue="saveExtendedData()"
                                    />
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-list class="pa-0 mx-2" v-if="extended_settings.save_item">
                    <v-list-item height="64">
                        <v-list-item-content>
                            <v-btn
                                color="primary"
                                block
                                @click="open('/src/option/option.html#/', '_blank')"
                            >
                                {{ $t("gotoItemPage") }}
                            </v-btn>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-sheet>
            <div class="text-body-1 ma-2">
                {{ exnotifText }}
            </div>
        </div>
        <v-dialog v-model="confirmDialog" contained>
            <v-card>
                <v-card-title class="headline">{{ $t("confirmFilterChangeTitle") }}</v-card-title>
                <v-card-text>
                    <div v-if="extended_settings.filter_mode == mode.sync">
                        {{ $t("confirmFilterChangeMessage") }}
                    </div>
                    <div v-else>
                        {{ $t("confirmFilterDeleteMessage") }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="confirmDialog = false">
                        {{ $t("cancel") }}
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveFilterMode()">
                        {{ $t("ok") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-sheet>
</template>

<script>
import { getExtendedSettings, setExtendedSettings } from "@/js/module/settings_data";
import { mode, convertStorageMode } from "@/js/module/filter_data";

export default {
    data() {
        return {
            extended_settings: {
                language: "ja",
                save_item: false,
                save_purchase: false,
                auto_reload: false,
                filter_mode: mode.sync
            },
            notificationTimer: null,
            exnotifText: "",
            lang_data: [
                {
                    text: "日本語",
                    value: "ja"
                },
                {
                    text: "English",
                    value: "en"
                },
                {
                    text: "한국어",
                    value: "ko"
                },
                {
                    text: "中文（简体）",
                    value: "zh-CN"
                },
                {
                    text: "中文（繁體）",
                    value: "zh-TW"
                }
            ],
            confirmDialog: false,
            mode: mode
        };
    },
    methods: {
        async saveExtendedData() {
            console.log(this.extended_settings);
            await setExtendedSettings(this.extended_settings).then(() => {
                this.showExNotificationText("Auto Saved!");
            });

            // this.showExNotificationText("Saved!");
        },
        async saveFilterMode() {
            if (this.extended_settings.filter_mode == mode.sync) {
                this.extended_settings.filter_mode = mode.local;
                await convertStorageMode(mode.sync, mode.local);
            } else if (this.extended_settings.filter_mode == mode.local) {
                this.extended_settings.filter_mode = mode.sync;
                await convertStorageMode(mode.local, mode.sync);
            } else {
                console.warn("Invalid mode");
                return;
            }

            await this.saveExtendedData();
            this.confirmDialog = false;
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
        open(url, target) {
            window.open(url, target);
        }
    },
    async created() {
        const userLocale = window.navigator.language;
        const extended_settings = await getExtendedSettings();
        console.log(extended_settings);
        // this.extended_settingsに対して、extended_settingsを更新
        this.extended_settings.language = extended_settings.language || "ja";
        this.extended_settings.save_item = extended_settings.save_item || false;
        this.extended_settings.save_purchase = extended_settings.save_purchase || false;
        this.extended_settings.auto_reload = extended_settings.auto_reload || false;
        this.extended_settings.filter_mode = extended_settings.getFilterMode || mode.sync;

        if (!extended_settings.language) {
            this.extended_settings.language = userLocale;
        }
        this.$i18n.locale = this.extended_settings.language;
    }
};
</script>
