<template>
    <div class="toolbar">
        <AppBar active-text="add shop link"></AppBar>
    </div>
    <div class="content">
        <v-container fluid>
            <h1>Custom Shop!</h1>
            <h1>WIP</h1>
            <v-row>
                <v-col cols="12" sm="6" md="6" lg="3" v-for="(shop, i) in shops" :key="i">
                    <ShopCard :shopId="shop"></ShopCard>
                </v-col>
            </v-row>
            <ShopStorageTest></ShopStorageTest>
            <ShopAddPopup></ShopAddPopup>
        </v-container>
    </div>
</template>

<script>
import { getShops } from "@/js/module/shop_data";
import AppBar from "../components/AppBar.vue";
import ShopCard from "../components/ShopCard.vue";
import ShopStorageTest from "../components/ShopStorageTest.vue";
import ShopAddPopup from "../components/ShopAddPopup.vue";

export default {
    components: {
        AppBar,
        ShopCard,
        ShopAddPopup,
        ShopStorageTest
    },
    data() {
        return {
            shops: []
        };
    },
    async mounted() {
        this.shops = await getShops();
    }
};
</script>
