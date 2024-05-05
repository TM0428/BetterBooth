<template>
    <v-card
        class="d-flex flex-column"
        height="100%"
        min-width="300px"
        color="surfaceContainerLow"
        :title="shop.name"
        :subtitle="shop.url"
    >
        <template v-slot:prepend
            ><v-avatar start>
                <v-img :src="shop.thumbnail_url"></v-img>
            </v-avatar>
        </template>
        <v-card-text>
            <v-list>
                <v-list-item v-for="(item, i) in shop.add_url" :key="i">
                    <template v-slot:prepend>
                        <v-icon :icon="LinkIcon"></v-icon>
                    </template>
                    <v-list-item-content append-icon="mdi-delete">
                        <v-list-item-title> {{ item.url }}</v-list-item-title>
                    </v-list-item-content>
                    <template v-slot:append>
                        <v-icon :icon="mdiClose" @click="deleteUrl(i, item.url)"></v-icon>
                    </template>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
import LinkIcon from "./icons/LinkIcon.vue";
import { mdiClose } from "@mdi/js";
export default {
    props: {
        shop_name: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            LinkIcon: LinkIcon,
            mdiClose: mdiClose,
            shop: {
                thumbnail_url:
                    "https://booth.pximg.net/c/128x128/users/4312177/icon_image/73dd12b3-8562-4271-a4f9-1a4b57bce623_base_resized.jpg",
                subdomain: "tm428",
                name: "428tm",
                url: "https://tm428.booth.pm/",
                add_url: [
                    {
                        icon: "link",
                        url: "twitter.com"
                    },
                    {
                        icon: "link",
                        url: "facebook.com"
                    }
                ]
            }
        };
    },
    methods: {
        deleteUrl(i, url) {
            if (this.shop.add_url[i].url != url) {
                console.error("index and url is invalid.");
                return;
            }
            this.shop.add_url.splice(i, 1);
        }
    }
};
</script>
