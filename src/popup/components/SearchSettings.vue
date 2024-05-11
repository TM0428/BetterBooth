<template>
    <v-sheet color="surfaceContainerLow" border="sm" rounded="lg">
        <h1 class="ma-4">Search Settings:</h1>
        <v-divider></v-divider>
        <div class="settingsContents">
            <v-sheet color="surface" border="sm" rounded="lg" class="my-4 mx-2">
                <v-list class="pa-0 mx-2">
                    <v-list-item>
                        <v-list-item-content>
                            <v-row class="align-center">
                                <v-col :cols="7" class="text-body-2">
                                    {{ $t("toggleSearchSetting") }}
                                </v-col>
                                <v-col :cols="5">
                                    <v-checkbox
                                        class="d-flex justify-end"
                                        color="primary"
                                        base-color="on-surface-variant"
                                        hide-details
                                        v-model="settings.disable"
                                        @update:modelValue="saveData()"
                                    />
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list class="pa-0 mx-2" v-bind:disabled="settings.disable">
                    <v-list-item height="64">
                        <v-list-item-content>
                            <v-row class="align-center">
                                <v-col :cols="7" class="text-body-2">{{ $t("ageLabel") }}</v-col>
                                <v-col :cols="5">
                                    <v-select
                                        density="comfortable"
                                        v-model="settings.age"
                                        hide-details
                                        :items="ageLabelOptions"
                                        item-title="text"
                                        item-value="value"
                                        @update:modelValue="saveData()"
                                    ></v-select>
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item height="64">
                        <v-list-item-content>
                            <v-row class="align-center">
                                <v-col :cols="7" class="text-body-2">{{ $t("sortLabel") }}</v-col>
                                <v-col :cols="5">
                                    <v-select
                                        density="comfortable"
                                        v-model="settings.sort"
                                        hide-details
                                        :items="sortLabelOptions"
                                        item-title="text"
                                        item-value="value"
                                        @update:modelValue="saveData()"
                                    ></v-select>
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-row class="align-center">
                                <v-col :cols="7" class="text-body-2">{{ $t("stockLabel") }}</v-col>
                                <v-col :cols="5">
                                    <v-checkbox
                                        class="d-flex justify-end"
                                        hide-details
                                        color="primary"
                                        base-color="on-surface-variant"
                                        v-model="in_stock"
                                        @update:modelValue="saveData()"
                                    />
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-content>
                            <v-row class="align-center">
                                <v-col :cols="7" class="text-body-2">{{
                                    $t("newArrivalLabel")
                                }}</v-col>
                                <v-col :cols="5">
                                    <v-checkbox
                                        class="d-flex justify-end"
                                        hide-details
                                        color="primary"
                                        base-color="on-surface-variant"
                                        v-model="settings.new_arrival"
                                        @update:modelValue="saveData()"
                                    />
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-sheet>
        </div>
        <div class="text-body-1 ma-2">
            {{ notifText }}
        </div>
    </v-sheet>
</template>

<script>
import { setSearchSettings, getSearchSettings } from "@/js/module/settings_data";

export default {
    data() {
        return {
            settings: {
                age: "include",
                sort: "",
                in_stock: false,
                new_arrival: false,
                disable: true
            },
            in_stock: true,
            notificationTimer: null,
            notifText: "",
            ageLabelOptions: [
                {
                    text: this.$t("includeOption"),
                    value: "include"
                },
                {
                    text: this.$t("defaultOption"),
                    value: "default"
                },
                {
                    text: this.$t("onlyOption"),
                    value: "only"
                }
            ],
            sortLabelOptions: [
                {
                    text: this.$t("popularOption"),
                    value: ""
                },
                {
                    text: this.$t("newOption"),
                    value: "new"
                },
                {
                    text: this.$t("wishListOption"),
                    value: "wish_lists"
                },
                {
                    text: this.$t("priceDescOption"),
                    value: "price_desc"
                },
                {
                    text: this.$t("priceAscOption"),
                    value: "price_asc"
                }
            ]
        };
    },
    methods: {
        async saveData() {
            this.settings.in_stock = !this.in_stock;
            await setSearchSettings(this.settings).then(() => {
                this.showNotificationText("Auto saved!  Please reload.");
            });
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
        }
    },
    async created() {
        await getSearchSettings().then((result) => {
            console.log(result);
            if (result !== undefined) {
                this.settings = result;
                this.in_stock = !this.settings.in_stock;
            }
        });
    },
    watch: {
        "$i18n.locale": function () {
            this.ageLabelOptions = [
                {
                    text: this.$t("includeOption"),
                    value: "include"
                },
                {
                    text: this.$t("defaultOption"),
                    value: "default"
                },
                {
                    text: this.$t("onlyOption"),
                    value: "only"
                }
            ];
            this.sortLabelOptions = [
                {
                    text: this.$t("popularOption"),
                    value: ""
                },
                {
                    text: this.$t("newOption"),
                    value: "new"
                },
                {
                    text: this.$t("wishListOption"),
                    value: "wish_lists"
                },
                {
                    text: this.$t("priceDescOption"),
                    value: "price_desc"
                },
                {
                    text: this.$t("priceAscOption"),
                    value: "price_asc"
                }
            ];
        }
    }
};
</script>
