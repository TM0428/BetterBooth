<template>
    <v-card
        @click="navigateToItem"
        class="item-card d-flex flex-column"
        height="100%"
        rounded="lg"
        variant="flat"
        border
        color="surface"
    >
        <v-img
            :src="imageUrl"
            alt="Item Image"
            class="bg-surfaceContainer flex-grow-0"
            aspect-ratio="1"
            cover
        />
        <div class="pa-3 d-flex flex-column flex-grow-1">
            <div class="item-title text-subtitle-1 font-weight-medium">
                {{ item.name }}
            </div>
            <!--ショップ-->
            <div
                class="shop-row d-flex align-center mt-1"
                @click.stop="handleShopClick(item.shop)"
            >
                <v-avatar size="20">
                    <v-img :src="item.shop.thumbnail_url"></v-img>
                </v-avatar>
                <span class="text-body-2 text-onSurfaceVariant ml-2 text-truncate">
                    {{ item.shop.name }}
                </span>
            </div>
            <div class="d-flex align-center mt-2">
                <div class="text-subtitle-1 font-weight-bold text-primary">
                    {{ item.price }}
                </div>
                <v-spacer></v-spacer>
                <!--再入荷リクエスト・DL商品・購入状態-->
                <div class="d-flex align-center ga-1">
                    <v-chip v-if="item.restock" size="small" color="tertiary" variant="tonal">
                        <v-icon :icon="mdiEmailAlertOutlineIcon"></v-icon>
                        <v-tooltip activator="parent" location="top">
                            {{ $t("restockRequest") }}
                        </v-tooltip>
                    </v-chip>
                    <v-chip v-if="item.download" size="small" color="primary" variant="tonal">
                        <v-icon :icon="mdiCloudArrowDownOutlineIcon"></v-icon>
                        <v-tooltip activator="parent" location="top">
                            {{ $t("isDLItem") }}
                        </v-tooltip>
                    </v-chip>
                    <v-chip
                        size="small"
                        :color="item.purchased ? 'primary' : 'onSurfaceVariant'"
                        :variant="item.purchased ? 'tonal' : 'outlined'"
                        :disabled="item.purchased == undefined"
                        @click.stop="handleCartClick()"
                    >
                        <v-icon
                            :icon="item.purchased ? mdiCartCheckIcon : mdiCartOutlineIcon"
                        ></v-icon>
                        <v-tooltip activator="parent" location="top">
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

            <!-- タグの表示部分 -->
            <div v-if="item.tags && item.tags.length" class="d-flex flex-wrap ga-1 mt-2">
                <v-chip
                    v-for="tag in item.tags"
                    :key="tag"
                    size="small"
                    label
                    rounded="lg"
                    color="onSurfaceVariant"
                    variant="tonal"
                    @click.stop="handleTagClick(tag)"
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
    mdiCartCheck,
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
            mdiCartCheckIcon: mdiCartCheck,
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
            } else {
                this.$emit("cart-clicked", false);
            }
        }
    },
    created() {
        this.imageUrl = this.item.images[0].original;
    }
};
</script>

<style scoped>
.item-card {
    transition:
        box-shadow 0.2s ease,
        transform 0.2s ease;
}

.item-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.item-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    min-height: 2.8em;
    word-break: break-all;
}

.shop-row {
    cursor: pointer;
    min-width: 0;
}

.shop-row:hover span {
    text-decoration: underline;
}

.tag-name {
    max-width: 200px;
}
</style>
