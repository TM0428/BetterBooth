<template>
    <v-container class="ma-3 pa-0">
        <h1 class="mb-2">Search Settings:</h1>
        <v-card max-width="430px" variant="tonal" color="grey-lighten-1">
            <v-list class="mb-0">
                <v-list-item>
                    <v-list-item-content>
                        <v-row class="align-center">
                            <v-col :cols="7" class="text-body-2">{{
                                $t("toggleSearchSetting")
                            }}</v-col>
                            <v-col :cols="5">
                                <v-checkbox
                                    class="d-flex justify-end"
                                    hide-details
                                    v-model="settings.disable"
                                    @change="saveData"
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
                                $t("ageLabel")
                            }}</v-col>
                            <v-col :cols="5">
                                <v-select
                                    density="compact"
                                    size="small"
                                    v-model="settings.age"
                                    hide-details
                                    :items="[
                                        {
                                            text: $t('includeOption'),
                                            value: 'include',
                                        },
                                        {
                                            text: $t('defaultOption'),
                                            value: 'default',
                                        },
                                        {
                                            text: $t('onlyOption'),
                                            value: 'only',
                                        },
                                    ]"
                                    item-title="text"
                                    item-value="value"
                                    @update:modelValue="saveData"
                                ></v-select>
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-row class="align-center">
                            <v-col :cols="7" class="text-body-2">{{
                                $t("sortLabel")
                            }}</v-col>
                            <v-col :cols="5">
                                <v-select
                                    density="compact"
                                    v-model="settings.sort"
                                    hide-details
                                    :items="[
                                        {
                                            text: $t('popularOption'),
                                            value: '',
                                        },
                                        {
                                            text: $t('newOption'),
                                            value: 'new',
                                        },
                                        {
                                            text: $t('wishListOption'),
                                            value: 'wish_lists',
                                        },
                                        {
                                            text: $t('priceDescOption'),
                                            value: 'price_desc',
                                        },
                                        {
                                            text: $t('priceAscOption'),
                                            value: 'price_asc',
                                        },
                                    ]"
                                    item-title="text"
                                    item-value="value"
                                    @update:modelValue="saveData"
                                ></v-select>
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-row class="align-center">
                            <v-col :cols="7" class="text-body-2">{{
                                $t("stockLabel")
                            }}</v-col>
                            <v-col :cols="5">
                                <v-checkbox
                                    class="d-flex justify-end"
                                    hide-details
                                    v-model="in_stock"
                                    @change="saveData"
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
                                    v-model="settings.new_arrival"
                                    @change="saveData"
                                />
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
</template>

<script>
export default {
    data() {
        return {
            settings: {
                age: "include",
                sort: "",
                in_stock: false,
                new_arrival: false,
                disable: true,
            },
            in_stock: true,
            notificationTimer: null,
            notifText: "",
        };
    },
    methods: {
        saveData() {
            this.settings.in_stock = !this.in_stock;
            chrome.storage.sync.set({ settings: this.settings });
            console.log(this.settings);
            this.showNotificationText("Auto saved!  Please reload.");
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
        });
    },
};
</script>
