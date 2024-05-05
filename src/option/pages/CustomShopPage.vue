<template>
    <div class="toolbar">
        <AppBar active-text="add shop link"></AppBar>
    </div>
    <div class="content">
        <h1>Custom Shop!</h1>
        <h1>WIP</h1>
        <v-row>
            <v-col cols="12" sm="6" md="6" lg="2">
                <ShopCard :shop="test"></ShopCard>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import AppBar from "../components/AppBar.vue";
import ShopCard from "../components/ShopCard.vue";

export default {
    components: {
        AppBar,
        ShopCard
    },
    data() {
        return {
            test: {
                thumbnail_url:
                    "https://booth.pximg.net/c/48x48/users/6511749/icon_image/53af20ae-3df9-480d-bb3d-87a413298c32_base_resized.jpg",
                name: "ルネッパンツ",
                nickname: "ルネッパンツ",
                url: "https://renaipantsu.booth.pm/",
                add_url: [
                    {
                        icon: "link",
                        url: "twitter.com"
                    }
                ]
            }
        };
    }
};
</script>
