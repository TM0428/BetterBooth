<template>
    <v-card class="d-flex flex-column" height="100%" color="surfaceContainerLow" :title="shop.name">
        <template v-slot:prepend
            ><v-avatar start>
                <v-img :src="shop.thumbnail_url"></v-img>
            </v-avatar>
        </template>
        <template v-slot:subtitle>
            <a :href="shop.url" target="_blank">{{ shop.url }}</a>
        </template>
        <template v-slot:append>
            <shop-edit-popup :shopId="shopId"></shop-edit-popup>
        </template>
        <v-card-text>
            <v-list>
                <v-list-item v-for="(item, i) in shop.add_url" :key="i">
                    <template v-slot:prepend>
                        <v-icon :icon="LinkIcon"></v-icon>
                    </template>
                    <v-list-item-content append-icon="mdi-delete">
                        <v-list-item-title> {{ item.url }} </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
import { getShop } from "@/js/module/shop_data";
import LinkIcon from "./icons/LinkIcon.vue";
import { mdiClose } from "@mdi/js";
import ShopEditPopup from "./ShopEditPopup.vue";

export default {
    props: {
        shopId: {
            type: String,
            required: true
        }
    },
    components: {
        ShopEditPopup
    },
    data() {
        return {
            LinkIcon: LinkIcon,
            mdiClose: mdiClose,
            shop: {}
        };
    },
    async mounted() {
        this.shop = await getShop(this.shopId);
    }
};
</script>
