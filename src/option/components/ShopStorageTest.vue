<template>
    <v-btn @click="addShopToStorage()"> add </v-btn>
    <v-btn @click="addAnotherShopToStorage()"> add1 </v-btn>
    <v-btn @click="getShopsFromStorage()"> debug </v-btn>
    <v-btn @click="resetShopsFromStorage()"> reset </v-btn>
</template>
<script>
import { addShop, getShops, getShop, resetShop } from "@/js/module/shop_data.js";

export default {
    methods: {
        async addShopToStorage() {
            const shop = {
                thumbnail_url:
                    "https://booth.pximg.net/c/128x128/users/4312177/icon_image/73dd12b3-8562-4271-a4f9-1a4b57bce623_base_resized.jpg",
                subdomain: "tm428",
                name: "428tm",
                url: "https://tm428.booth.pm/",
                add_url: [
                    {
                        icon: "link",
                        url: "https://twitter.com"
                    },
                    {
                        icon: "link",
                        url: "https://facebook.com"
                    }
                ]
            };
            await addShop(shop);
        },
        async addAnotherShopToStorage() {
            const shop = {
                thumbnail_url:
                    "https://booth.pximg.net/c/128x128/users/4312177/icon_image/73dd12b3-8562-4271-a4f9-1a4b57bce623_base_resized.jpg",
                subdomain: "tm428",
                name: "428tm",
                url: "https://tm428.booth.pm/",
                add_url: [
                    {
                        icon: "link",
                        url: "https://twitter.com"
                    },
                    {
                        icon: "link",
                        url: "https://facebook.com"
                    },
                    {
                        icon: "link",
                        url: "https://youtube.com"
                    }
                ]
            };
            await addShop(shop);
        },
        async getShopsFromStorage() {
            const shops = await getShops();
            console.log(shops);
            shops.forEach((element) => {
                console.log(element);
                getShop(element);
            });
        },
        async resetShopsFromStorage() {
            await resetShop();
        }
    }
};
</script>
