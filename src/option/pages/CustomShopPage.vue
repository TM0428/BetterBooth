<template>
    <div class="toolbar">
        <AppBar active-text="add shop link"></AppBar>
    </div>
    <div class="content">
        <v-container fluid>
            <v-row>
                <v-col cols="12" sm="6" md="6" lg="3" v-for="(shop, i) in shops" :key="i">
                    <ShopCard :shopId="shop"></ShopCard>
                </v-col>
            </v-row>
            <ShopAddPopup></ShopAddPopup>
        </v-container>
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
