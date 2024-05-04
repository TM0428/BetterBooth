<template>
    <v-card
        @click="navigateToItem"
        class="d-flex flex-column"
        height="100%"
        min-width="270px"
        color="surfaceContainerLow"
    >
        <v-img :src="imageUrl" alt="Item Image" class="cover bg-grey-lighten-2" aspect-ratio="1" />
        <div class="ma-2 text-h6 text-weight-regular two-line-title">
            <div class="ellipsis-2-lines inherit">
                {{ item.name }}
            </div>
        </div>
        <!--ショップ-->
        <div class="ma-1 d-flex flex-row">
            <v-chip color="primary" variant="outlined" @click.stop="handleShopClick(item.shop)">
                <v-avatar start>
                    <v-img :src="item.shop.thumbnail_url"></v-img>
                </v-avatar>
                <span class="d-inline-block text-truncate shop-name">
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
                <div v-if="item.restock" class="mx-1">
                    <v-chip :color="item.restock ? 'warning' : 'disable'">
                        <v-icon :icon="mdiEmailAlertOutlineIcon"></v-icon>
                        <v-tooltip activator="parent" location="left">
                            {{ $t("restockRequest") }}
                        </v-tooltip>
                    </v-chip>
                </div>
                <div v-if="item.download" class="mx-1">
                    <v-chip :color="item.download ? 'primary' : 'disable'">
                        <v-icon :icon="mdiCloudArrowDownOutlineIcon"></v-icon>
                        <v-tooltip activator="parent" location="left">
                            {{ $t("isDLItem") }}
                        </v-tooltip>
                    </v-chip>
                </div>
                <div class="mx-1">
                    <v-chip
                        :class="item.purchased ? 'purchased-cart-chip' : 'non-purchased-cart-chip'"
                        :variant="item.purchased ? 'flat' : 'outlined'"
                        :disabled="item.purchased == undefined"
                        @click.stop="handleCartClick()"
                    >
                        <v-icon :icon="mdiCartOutlineIcon"></v-icon>
                        <v-tooltip activator="parent" location="left">
                            <div v-if="item.purchased">
                                {{ $t("purchased") }}
                            </div>
                            <div v-else-if="item.purchased === undefined">
                                {{ $t("undefPurchase") }}
                            </div>
                            <div v-else>
                                {{ $t("notpurchased") }}
                            </div>
                        </v-tooltip>
                    </v-chip>
                </div>
            </div>
        </div>

        <!-- タグの表示部分 -->
        <div class="ma-1">
            <div class="inline-block">
                <v-chip
                    v-for="tag in item.tags"
                    :key="tag"
                    small
                    label
                    rounded="lg"
                    class="ma-1 tag-chip"
                    @click.stop="handleTagClick(tag)"
                    variant="outlined"
                >
                    <span class="d-inline-block text-truncate tag-name">
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
    mdiEmailAlertOutline
} from "@mdi/js";

export default {
    name: "ItemCard",
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            imageUrl: "",
            mdiHeartOutlineIcon: mdiHeartOutline,
            mdiCartOutlineIcon: mdiCartOutline,
            mdiCloudArrowDownOutlineIcon: mdiCloudArrowDownOutline,
            mdiEmailAlertOutlineIcon: mdiEmailAlertOutline
        };
    },
    computed: {
        to() {
            return { name: "Item", params: { itemId: this.item.id } };
        }
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
            if (this.item.purchased) {
                this.$emit("cart-clicked", this.item.purchased);
            }
            else {
                this.$emit("cart-clicked", false);
            }
        }
    },
    created() {
        this.imageUrl = this.item.images[0].original;
    }
};
</script>

<style>
.ellipsis-2-lines {
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
.shop-name {
    max-width: 220px;
}
.tag-name {
    max-width: 240px;
}

.inline-block {
    display: inline-block;
}

.inherit {
    width: inherit;
}
</style>
