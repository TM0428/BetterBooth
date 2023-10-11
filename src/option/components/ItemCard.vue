<template>
    <v-card
        @click="navigateToItem"
        class="d-flex flex-column ma-auto pa-1"
        height="100%"
        max-width="310px"
        min-width="270px"
    >
        <v-img
            :src="imageUrl"
            alt="Item Image"
            class="cover bg-grey-lighten-2"
            aspect-ratio="1"
        />
        <div class="ma-2 text-h6 text-weight-regular two-line-title">
            <div class="ellipsis-2-lines" style="inherit;">
                {{ item.name }}
            </div>
        </div>
        <!--ショップ-->
        <div class="ma-1 d-flex flex-row">
            <v-chip
                class="text-blue-darken-3"
                variant="outlined"
                @click.stop="handleShopClick(item.shop)"
            >
                <v-avatar start>
                    <v-img :src="item.shop.thumbnail_url"></v-img>
                </v-avatar>
                <span
                    class="d-inline-block text-truncate"
                    style="max-width: 220px"
                >
                    {{ item.shop.name }}
                </span>
            </v-chip>
        </div>
        <div class="ma-1 d-flex flex-row">
            <div class="text-subtitle-1 text-primary">
                {{ item.price }}
            </div>
            <v-spacer></v-spacer>
            <!--購入したか-->
            <div class="d-flex flex-row">
                <div v-if="item.download" class="mx-1">
                    <v-chip :color="item.download ? 'blue' : 'grey lighten-2'">
                        <v-icon :icon="mdiCloudArrowDownOutlineIcon"></v-icon>
                        <v-tooltip activator="parent" location="left">
                            Download item
                        </v-tooltip>
                    </v-chip>
                </div>
                <div class="mx-1">
                    <v-chip
                        :color="item.purchased ? 'blue' : 'grey lighten-2'"
                        @click.stop="handleCartClick()"
                    >
                        <v-icon :icon="mdiCartOutlineIcon"></v-icon>
                        <v-tooltip activator="parent" location="left">
                            <div v-if="item.purchased">
                                Purchased!
                            </div>
                            <div v-else-if="item.purchased === undefined">
                                No data
                            </div>
                            <div v-else>
                                Not Purchased
                            </div>
                        </v-tooltip>
                    </v-chip>
                </div>
            </div>
        </div>

        <!-- タグの表示部分 -->
        <div class="ma-1">
            <div style="display: inline-block">
                <v-chip
                    v-for="tag in item.tags"
                    :key="tag"
                    small
                    class="ma-1"
                    @click.stop="handleTagClick(tag)"
                >
                    <span
                        class="d-inline-block text-truncate"
                        style="max-width: 240px"
                    >
                        {{ tag }}
                    </span>
                </v-chip>
            </div>
        </div>
    </v-card>
</template>

<script>
import {
    mdiHeartOutline,
    mdiCartOutline,
    mdiCloudArrowDownOutline,
} from "@mdi/js";

export default {
    name: "ItemCard",
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            imageUrl: "",
            mdiHeartOutlineIcon: mdiHeartOutline,
            mdiCartOutlineIcon: mdiCartOutline,
            mdiCloudArrowDownOutlineIcon: mdiCloudArrowDownOutline,
        };
    },
    computed: {
        to() {
            return { name: "Item", params: { itemId: this.item.id } };
        },
    },
    methods: {
        navigateToItem() {
            this.$router.push(this.to);
        },
        handleTagClick(tag) {
            this.$emit("tag-clicked", tag);
        },
        handleShopClick(shop) {
            this.$emit("shop-clicked", shop);
        },
        handleCartClick() {
            // if (this.item.purchased) {
            //     this.$emit("cart-clicked", this.item.purchased);
            // } else {
            //     this.$emit("cart-clicked", false);
            // }
            if (this.item.purchased) {
                this.item.purchased = !this.item.purchased;
                const new_data = JSON.parse(JSON.stringify(this.item));
                chrome.storage.local.set({
                    [`items_${this.item.id}`]: new_data,
                });
            } else {
                this.item.purchased = true;
                const new_data = JSON.parse(JSON.stringify(this.item));
                new_data.purchased = true;
                chrome.storage.local.set({
                    [`items_${this.item.id}`]: new_data,
                });
            }
        },
    },
    created() {
        this.imageUrl = this.item.images[0].original;
    },
};
</script>

<style>
.ellipsis-2-lines {
    height: 62px;
    text-overflow: ellipsis;
}
.cover {
    max-height: 242px !important;
}
.two-line-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 66px;
}
</style>
