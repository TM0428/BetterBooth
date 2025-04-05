<template>
    <div class="toolbar">
        <AppBar active-text="add shop link"></AppBar>
    </div>
    <div class="content" style="height: 100%">
        <v-container>
            <v-row class="fill-height">
                <v-col cols="12" sm="6" md="6" lg="4" xl="3" v-for="(shop, i) in shops" :key="i">
                    <ShopCard :shopId="shop"></ShopCard>
                </v-col>
            </v-row>
        </v-container>
    </div>
    <div class="fab">
        <ShopAddPopup></ShopAddPopup>
    </div>
</template>

<script>
import { getShopsList } from "@/js/module/shop_data";
import AppBar from "../components/AppBar.vue";
import ShopCard from "../components/ShopCard.vue";
import ShopAddPopup from "../components/ShopAddPopup.vue";

export default {
    components: {
        AppBar,
        ShopCard,
        ShopAddPopup
    },
    data() {
        return {
            shops: []
        };
    },
    async mounted() {
        this.shops = await getShopsList();
    }
};
</script>
