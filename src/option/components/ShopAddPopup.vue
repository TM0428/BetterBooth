<template>
    <v-btn
        @click="dialog = !dialog"
        class="mr-6 mb-6 fab-c"
        max-width="64"
        height="64"
        position="absolute"
        rounded="xl"
    >
        <template v-slot:default>
            <v-icon :icon="mdiPencilIcon" color="primary" size="30"></v-icon>
        </template>
    </v-btn>
    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title>
                {{ $t("addShopTitle") }}
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" class="pb-0">
                        <v-text-field
                            placeholder="https://428tm.booth.pm"
                            label="Shop URL"
                            @input="getShopInfo()"
                            v-model="shopUrl"
                            :rules="boothUrlRules"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-card
                            class="d-flex flex-column"
                            height="100%"
                            width="100%"
                            color="surfaceContainerLow"
                            :disabled="loading"
                        >
                            <v-skeleton-loader v-if="loading" type="list-item-avatar-two-line">
                            </v-skeleton-loader>
                            <v-list bg-color="surfaceContainerLow" v-else>
                                <v-list-item :title="shop.name" :subtitle="shop.url">
                                    <template v-slot:prepend>
                                        <v-avatar start>
                                            <v-img :src="shop.thumbnail_url"></v-img>
                                        </v-avatar>
                                    </template>
                                </v-list-item>
                            </v-list>
                            <v-card-text>
                                <v-list>
                                    <v-list-item v-for="(item, i) in shop.add_url" :key="i">
                                        <template v-slot:prepend>
                                            <v-icon :icon="LinkIcon"></v-icon>
                                        </template>
                                        <v-list-item-content>
                                            <v-list-item-title> {{ item.url }} </v-list-item-title>
                                        </v-list-item-content>
                                        <template v-slot:append>
                                            <v-icon
                                                :icon="mdiCloseIcon"
                                                @click="deleteUrl(i, item.url)"
                                            ></v-icon>
                                        </template>
                                    </v-list-item>
                                    <v-list-item class="px-2">
                                        <v-list-item-content>
                                            <v-text-field
                                                placeholder="https://428_tm.twitter.com"
                                                label="Add Link"
                                                v-model="newUrl"
                                                hide-details
                                                @change="addUrl()"
                                            >
                                                <template v-slot:prepend-inner>
                                                    <v-icon :icon="LinkIcon"></v-icon>
                                                </template>
                                                <template v-slot:append-inner>
                                                    <v-icon
                                                        :icon="mdiPlusIcon"
                                                        @change="addUrl()"
                                                    ></v-icon>
                                                </template>
                                            </v-text-field>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="addShop()">save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mdiPencil } from "@mdi/js";
import LinkIcon from "./icons/LinkIcon.vue";
import { mdiPlusCircle, mdiClose } from "@mdi/js";
import Shop from "@/js/module/shop";
import { addShop } from "@/js/module/shop_data";

export default {
    data() {
        return {
            mdiPencilIcon: mdiPencil,
            dialog: false,
            shop: {},
            shopUrl: "",
            loading: true,
            newUrl: "",
            boothUrlRules: [(v) => this.validateUrl(v) || "invalidURL."],
            LinkIcon: LinkIcon,
            mdiPlusIcon: mdiPlusCircle,
            mdiCloseIcon: mdiClose
        };
    },
    created() {
        this.shop = new Shop();
    },
    methods: {
        async getShopInfo() {
            if (!this.validateUrl(this.shopUrl)) {
                return;
            }
            const response = await fetch(this.shopUrl, {
                credentials: "omit"
            });
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const shopNameElement = doc.querySelector(".shop-name-label");
            const homeLinkNicknameElement = doc.querySelector(".home-link-container__nickname");

            let name = "";
            // 名前の取得方法
            // 1. homeLinkNicknameElementが存在する場合、そのテキストを取得
            // 2. 存在しない場合、shopNameElementが存在する場合、そのテキストを取得
            // 3. それも存在しない場合、サブドメインを取得
            if (homeLinkNicknameElement) {
                name = homeLinkNicknameElement.textContent;
            }
            else if (shopNameElement) {
                name = shopNameElement.textContent;
            }
            else {
                const match = this.shopUrl.match(/^(?:https?:\/\/)?([^/]+)/);
                const subdomain = match ? match[1].split(".")[0] : null;
                name = subdomain;
            }

            // 要素を取得
            const avatarImageElement = doc.querySelector(".avatar-image");

            // 背景画像のstyle属性の値を取得
            const backgroundImageStyle = avatarImageElement.style.backgroundImage;

            // 背景画像のURL部分を抽出
            const backgroundImageUrl = backgroundImageStyle
                .replace(/^url\(["']?/, "")
                .replace(/["']?\)$/, "");

            const match = this.shopUrl.match(/^(?:https?:\/\/)?([^/]+)/);
            const subdomain = match ? match[1].split(".")[0] : null;
            this.shop = new Shop(backgroundImageUrl, subdomain, name, []);
            this.loading = false;
        },
        validateUrl(url) {
            // 正規表現パターンを定義
            const pattern = /^https:\/\/[^/]+\.booth\.pm\/?$/;

            // URLが指定のパターンに一致するかどうかを確認
            return pattern.test(url);
        },
        addUrl() {
            const urlObject = {
                icon: "link",
                url: this.newUrl
            };
            this.shop.addUrl(urlObject);
            this.newUrl = "";
            console.log(this.shop);
        },
        deleteUrl(i, url) {
            if (this.shop.add_url[i].url != url) {
                console.error("index and url is invalid.");
                return;
            }
            this.shop.add_url.splice(i, 1);
        },
        async addShop() {
            console.log(this.shop);
            await addShop(this.shop);
            this.shop = new Shop();
            this.dialog = false;
        }
    }
};
</script>

<style scoped>
.fab-c {
    right: 0;
    bottom: 0;
    background-color: rgb(var(--v-theme-surfaceContainerLow)) !important;
}
</style>
