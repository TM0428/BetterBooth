<template>
    <v-menu v-model="menu" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-icon :icon="LinkIcon" v-bind="props"></v-icon>
        </template>
        <v-card>
            <!-- 2x2でアイコンを表示 -->
            <v-row>
                <v-col cols="6">
                    <v-icon :icon="XTwitterIcon"></v-icon>
                </v-col>
                <v-col cols="6">
                    <v-icon :icon="FanboxIcon"></v-icon>
                </v-col>
                <v-col cols="6">
                    <v-icon :icon="PixivIcon"></v-icon>
                </v-col>
                <v-col cols="6">
                    <v-icon :icon="LinkIcon"></v-icon>
                </v-col>
            </v-row>
        </v-card>
    </v-menu>
</template>
<script>
import LinkIcon from "./LinkIcon.vue";
import XTwitterIcon from "./XTwitterIcon.vue";
import FanboxIcon from "./FanboxIcon.vue";
import PixivIcon from "./PixivIcon.vue";

export default {
    props: {
        icon: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            LinkIcon: LinkIcon,
            XTwitterIcon: XTwitterIcon,
            FanboxIcon: FanboxIcon,
            PixivIcon: PixivIcon
        };
    }
};
</script>
