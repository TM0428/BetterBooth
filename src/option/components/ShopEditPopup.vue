<template>
    <v-icon :icon="mdiPencilIcon" @click="dialog = !dialog"></v-icon>

    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title>
                {{ $t("editShopTitle") }}
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-card
                            class="d-flex flex-column"
                            height="100%"
                            width="100%"
                            color="surfaceContainerLow"
                            :disabled="loading"
                        >
                            <v-skeleton-loader v-if="loading" type="list-item-avatar-two-line">
                            </v-skeleton-loader>
                            <v-list bg-color="surfaceContainerLow" v-else>
                                <v-list-item :title="shop.name" :subtitle="shop.url">
                                    <template v-slot:prepend>
                                        <v-avatar start>
                                            <v-img :src="shop.thumbnail_url"></v-img>
                                        </v-avatar>
                                    </template>
                                </v-list-item>
                            </v-list>
                            <v-card-text>
                                <v-list>
                                    <v-list-item v-for="(item, i) in shop.add_url" :key="i">
                                        <template v-slot:prepend>
                                            <v-icon :icon="LinkIcon"></v-icon>
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
                                    <v-list-item class="px-2">
                                        <v-list-item-content>
                                            <v-text-field
                                                placeholder="https://428_tm.twitter.com"
                                                label="Add Link"
                                                v-model="newUrl"
                                                hide-details
                                            >
                                                <template v-slot:prepend-inner>
                                                    <v-icon :icon="LinkIcon"></v-icon>
                                                </template>
                                                <template v-slot:append-inner>
                                                    <v-icon
                                                        :icon="mdiPlusIcon"
                                                        @click="addUrl()"
                                                    ></v-icon>
                                                </template>
                                            </v-text-field>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="addShop()">save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mdiPencil, mdiClose, mdiPlus } from "@mdi/js";
import { getShop } from "@/js/module/shop_data";
import LinkIcon from "./icons/LinkIcon.vue";
import Shop from "@/js/module/shop";

export default {
    props: {
        shopId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            LinkIcon: LinkIcon,
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
    }
};
</script>
