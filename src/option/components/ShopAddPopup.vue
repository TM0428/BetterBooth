<template>
    <v-fab :icon="mdiPencilIcon" @click="dialog = !dialog"> </v-fab>
    <v-dialog v-model="dialog">
        <v-card>
            <v-card-title>
                {{ $t("addShopTitle") }}
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            placeholder="https://428tm.booth.pm"
                            label="Shop URL"
                            @change="getShopInfo()"
                            v-model="shop.url"
                        >
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { mdiPencil } from "@mdi/js";

export default {
    data() {
        return {
            mdiPencilIcon: mdiPencil,
            dialog: false,
            shop: {
                thumbnail_url: "",
                subdomain: "",
                name: "",
                url: "",
                add_url: []
            }
        };
    },
    methods: {
        async getShopInfo() {
            if (!this.validateUrl(this.shop.url)) {
                console.error("this is not booth shop url.");
                return;
            }
            const response = await fetch(this.shop.url, {
                credentials: "omit"
            });
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const shopNameElement = doc.querySelector(".shop-name-label");
            const homeLinkNicknameElement = doc.querySelector(".home-link-container__nickname");

            let name = "";
            if (
                shopNameElement.classList.contains("display_title") &&
                shopNameElement.classList.contains("no-display")
            ) {
                // display_title no-display クラスがある場合
                name = homeLinkNicknameElement.textContent.trim();
            }
            else {
                // 上記以外の場合
                name = shopNameElement.textContent.trim();
            }
            console.log(name);
            // 要素を取得
            const avatarImageElement = doc.querySelector(".avatar-image");

            // 背景画像のstyle属性の値を取得
            const backgroundImageStyle = avatarImageElement.style.backgroundImage;

            // 背景画像のURL部分を抽出
            const backgroundImageUrl = backgroundImageStyle
                .replace(/^url\(["']?/, "")
                .replace(/["']?\)$/, "");
            console.log(backgroundImageUrl);

            const match = this.shop.url.match(/^(?:https?:\/\/)?([^/]+)/);
            const subdomain = match ? match[1].split(".")[0] : null;
            console.log(subdomain);
        },
        validateUrl(url) {
            // 正規表現パターンを定義
            const pattern = /^https:\/\/[^/]+\.booth\.pm\/?$/;

            // URLが指定のパターンに一致するかどうかを確認
            return pattern.test(url);
        }
    }
};
</script>
