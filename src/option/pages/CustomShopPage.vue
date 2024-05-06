<template>
    <div class="toolbar">
        <AppBar active-text="add shop link"></AppBar>
    </div>
    <div class="content">
        <v-container fluid>
            <h1>Custom Shop!</h1>
            <h1>WIP</h1>
            <v-row>
                <v-col cols="12" sm="6" md="6" lg="3">
                    <ShopCard shop="test"></ShopCard>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="3">
                    <ShopCard shop="test"></ShopCard>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="3">
                    <ShopCard shop="test"></ShopCard>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="3">
                    <ShopCard shop="test"></ShopCard>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="3">
                    <ShopCard shop="test"></ShopCard>
                </v-col>
            </v-row>
            <ShopStorageTest></ShopStorageTest>
        </v-container>
    </div>
</template>

<script>
import AppBar from "../components/AppBar.vue";
import ShopCard from "../components/ShopCard.vue";
import ShopStorageTest from "../components/ShopStorageTest.vue";

export default {
    components: {
        AppBar,
        ShopCard,
        ShopStorageTest
    },
    data() {
        return {};
    }
};
</script>
