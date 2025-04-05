<template>
    <v-icon :icon="mdiPencilIcon" @click="dialog = !dialog"></v-icon>

    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title>
                {{ $t("editShopTitle") }}
            </v-card-title>
            <v-card-text class="pa-2">
                <v-skeleton-loader v-if="loading" type="list-item-avatar-two-line">
                </v-skeleton-loader>
                <v-list v-else>
                    <v-list-item :title="shop.name" :subtitle="shop.url">
                        <template v-slot:prepend>
                            <v-avatar start>
                                <v-img :src="shop.thumbnail_url"></v-img>
                            </v-avatar>
                        </template>
                    </v-list-item>
                </v-list>
                <v-card variant="outlined" color="outlineVariant" rounded="lg">
                    <v-list bg-color="surface" class="list-container">
                        <div class="scrollable-list">
                            <div v-for="(item, i) in shop.add_url" :key="i">
                                <v-list-item>
                                    <template v-slot:prepend>
                                        <BoothIconPicker></BoothIconPicker>
                                    </template>
                                    <v-list-item-content>
                                        <v-list-item-title> {{ item.url }} </v-list-item-title>
                                    </v-list-item-content>
                                    <template v-slot:append>
                                        <v-icon
                                            :icon="mdiCloseIcon"
                                            @click="deleteUrl(i, item.url)"
                                        ></v-icon>
                                    </template>
                                </v-list-item>
                                <div v-if="i != shop.add_url.length - 1">
                                    <v-divider></v-divider>
                                </div>
                            </div>
                        </div>
                        <v-divider></v-divider>
                        <v-list-item class="px-2 pb-0">
                            <v-list-item-content>
                                <v-text-field
                                    placeholder="https://428_tm.twitter.com"
                                    label="Add Link"
                                    v-model="newUrl"
                                    @change="addUrl()"
                                    variant="underlined"
                                    hide-details
                                >
                                    <template v-slot:prepend-inner>
                                        <v-icon :icon="LinkIcon"></v-icon>
                                    </template>
                                    <template v-slot:append-inner>
                                        <v-icon :icon="mdiPlusIcon" @click="addUrl()"></v-icon>
                                    </template>
                                </v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="updateShop()">update</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mdiPencil, mdiClose, mdiPlus } from "@mdi/js";
import { getShop, setShop } from "@/js/module/shop_data";
import LinkIcon from "./icons/LinkIcon.vue";
import FanboxIcon from "./icons/FanboxIcon.vue";
import BoothIconPicker from "./icons/BoothIconPicker.vue";
import Shop from "@/js/module/shop";

export default {
    components: {
        BoothIconPicker
    },
    props: {
        shopId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            newUrl: "",
            shop: {},
            LinkIcon: LinkIcon,
            FanboxIcon: FanboxIcon,
            BoothIconPicker: BoothIconPicker,
            mdiPencilIcon: mdiPencil,
            mdiCloseIcon: mdiClose,
            mdiPlusIcon: mdiPlus,
            dialog: false
        };
    },
    async created() {
        this.shop = new Shop();
        this.shop = await getShop(this.shopId);
        console.log(this.shop);
    },
    methods: {
        async deleteUrl(i, url) {
            if (this.shop.add_url[i].url != url) {
                console.error("index and url is invalid.");
                return;
            }
            this.shop.add_url.splice(i, 1);
        },
        async addUrl() {
            console.log(this.newUrl);
            if (this.newUrl == "") {
                return;
            }
            const urlObject = {
                icon: "link",
                url: this.newUrl
            };
            this.shop.add_url.push(urlObject);
            this.newUrl = "";
        },
        async updateShop() {
            await setShop(this.shop);
            this.dialog = false;
        }
    }
};
</script>

<style scoped>
.list-container {
    max-height: 450px; /* Adjust the total height of the container */
    display: flex;
    flex-direction: column;
}

.scrollable-list {
    max-height: 400px; /* Height for the scrollable part */
    overflow-y: auto;
    flex: 1;
}
</style>
