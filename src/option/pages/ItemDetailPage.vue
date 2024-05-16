<template>
    <v-app class="content pa-0 ma-0">
        <div class="center-margin">
            <!--title-->
            <div class="text-h4 ma-2 py-2 font-bold">{{ data.name }}</div>

            <div class="mx-lg-2 px-2 mx-sm-4">
                <v-row class="mx-sm-4">
                    <v-col cols="12" sm="12" md="12" lg="6" xl="6">
                        <v-carousel class="bg-grey-lighten-2" v-if="data.images.length > 0">
                            <v-carousel-item
                                v-for="(image, i) in data.images"
                                :key="i"
                                :src="image.original"
                                @click="openPopup(image.original)"
                            ></v-carousel-item>
                        </v-carousel>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="6" xl="6">
                        <!--タグの追加-->
                        <v-combobox
                            class="ma-2"
                            v-model="data.tags"
                            :items="data.tags"
                            chips
                            clearable
                            multiple
                            hide-details
                            label="tags"
                            variant="solo"
                        >
                        </v-combobox>
                        <div class="text-h4 ma-2">
                            {{ data.price }}
                        </div>
                        <v-row class="ma-2">
                            <v-col cols="12">
                                <v-btn
                                    block
                                    :prepend-icon="mdiCartOutlineIcon"
                                    rounded="xl"
                                    :variant="data.purchased ? 'flat' : 'outlined'"
                                    :class="
                                        data.purchased
                                            ? 'purchased-cart-chip'
                                            : 'non-purchased-cart-chip'
                                    "
                                    size="large"
                                    @click="togglePurchased"
                                >
                                    <div v-if="data.purchased">
                                        {{ $t("purchased") }}
                                    </div>
                                    <div v-else>
                                        {{ $t("notpurchased") }}
                                    </div>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" v-if="data.download">
                                <v-btn
                                    block
                                    :prepend-icon="mdiCloudArrowDownOutlineIcon"
                                    rounded="xl"
                                    size="large"
                                    color="info"
                                    variant="tonal"
                                >
                                    {{ $t("isDLItem") }}
                                </v-btn>
                            </v-col>
                            <v-col cols="12" v-if="data.restock">
                                <v-btn
                                    block
                                    :prepend-icon="mdiEmailAlertOutlineIcon"
                                    rounded="xl"
                                    size="large"
                                    color="warning"
                                    variant="tonal"
                                >
                                    {{ $t("restockRequest") }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </div>

            <p class="description text-body-1 mx-4" v-html="formatDescription"></p>
            <p
                class="additional-description text-body-1 mx-4"
                v-if="data.additionalDescription"
                v-html="formatAdditionalDescription"
            ></p>

            <div class="footer-buttons">
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4" lg="3" xl="3">
                            <v-btn
                                block
                                @click="$router.go(-1)"
                                :prepend-icon="mdiArrowLeftIcon"
                                rounded="xl"
                                size="large"
                            >
                                {{ $t("itemBackToList") }}
                            </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" xl="3">
                            <a :href="data.url" target="_blank" style="text-decoration: none">
                                <v-btn block rounded="xl" size="large" :prepend-icon="mdiLinkIcon">
                                    {{ $t("itemGotoLink") }}
                                </v-btn>
                            </a>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" xl="3">
                            <a :href="data.shop.url" target="_blank" style="text-decoration: none">
                                <v-btn block rounded="xl" size="large" :prepend-icon="mdiLinkIcon">
                                    {{ $t("itemGotoShop") }}
                                </v-btn>
                            </a>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" xl="3">
                            <v-btn
                                block
                                :prepend-icon="mdiDownloadIcon"
                                rounded="xl"
                                size="large"
                                @click="exportData"
                            >
                                {{ $t("itemExport") }}
                            </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" xl="3">
                            <v-btn
                                block
                                :prepend-icon="mdiDeleteIcon"
                                rounded="xl"
                                size="large"
                                @click="deleteItem"
                            >
                                {{ $t("itemDelete") }}
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
    </v-app>
</template>

<script>
import Item from "@/js/module/item";
import { deleteItem, getItem, getItemId, mergeItem } from "@/js/module/item_data";
import router from "@/option/router"; // Vue Router インスタンスのインポート
import {
    mdiArrowLeft,
    mdiLink,
    mdiDownload,
    mdiDelete,
    mdiCartOutline,
    mdiEmailAlertOutline,
    mdiCloudArrowDownOutline
} from "@mdi/js";

export default {
    props: ["itemId"],
    data() {
        return {
            itemIdKey: "",
            data: new Item(),
            popupImage: null,
            mdiArrowLeftIcon: mdiArrowLeft,
            mdiLinkIcon: mdiLink,
            mdiDownloadIcon: mdiDownload,
            mdiDeleteIcon: mdiDelete,
            mdiCartOutlineIcon: mdiCartOutline,
            mdiEmailAlertOutlineIcon: mdiEmailAlertOutline,
            mdiCloudArrowDownOutlineIcon: mdiCloudArrowDownOutline
        };
    },
    async mounted() {
        this.itemIdKey = getItemId(this.itemId);
        this.data = await getItem(this.itemIdKey);
        console.log(this.data);
        // error
        if (!this.data) {
            router.push({ name: "Top" });
        }
        if (this.data.additionalDescription) {
            // additionalDescriptionが存在する場合、クラスである"pb-16"を"pb-2"に変更する
        }
    },

    methods: {
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
        async deleteItem() {
            if (confirm(this.$t("itemDeleteConfirm"))) {
                await deleteItem(this.itemIdKey);
                window.alert(this.$t("itemDeleteComplete"));
                router.push({ name: "Top" }); // Topページにリダイレクト
            }
        },
        togglePurchased() {
            this.data.purchased = !this.data.purchased;
            this.saveData();
        },
        toggleWished() {
            this.data.wished = !this.data.wished;
            this.saveData();
        },
        async saveData() {
            await mergeItem(this.itemIdKey, this.data);
        }
    },
    computed: {
        formatDescription() {
            if (this.data.description) return this.data.description.replace(/\n/g, "<br>");
            else return "";
        },
        formatAdditionalDescription() {
            if (this.data.additionalDescription) return this.data.additionalDescription;
            else return "";
        }
    },
    watch: {
        "data.tags": {
            handler() {
                this.saveData();
            },
            deep: true
        }
    }
};
</script>

<style scoped>
.content {
    font-family: -apple-system, BlinkMacSystemFont, Avenir, "Helvetica Neue", "Segoe UI", Arial,
        "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic ProN", メイリオ, Meiryo, "ＭＳ Ｐゴシック",
        sans-serif !important;
}
.center-margin {
    margin: 0 auto;
    max-width: 1100px;
    background-color: #fafafa;
}

.font-bold {
    font-weight: 700 !important;
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

body {
    overflow: auto;
}

.popup ~ * {
    pointer-events: none;
    user-select: none;
    filter: brightness(40%);
}

h2 {
    margin-top: 6px !important;
}

section.grid {
    display: grid !important;
    gap: 40px;
}
</style>
