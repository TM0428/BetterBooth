<template>
    <v-card
        @click="navigateToItem"
        class="d-flex flex-column ma-auto pa-1"
        height="100%"
        max-width="310px"
    >
        <v-img
            :src="item.image"
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
        <div class="ma-1">
            <v-chip
                class="text-blue-darken-3"
                variant="outlined"
                @click.stop="handleShopClick(item.shop)"
            >
                <v-avatar start>
                    <v-img :src="item.shop.thumbnail_url"></v-img>
                </v-avatar>

                {{ item.shop.name }}
            </v-chip>
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
                    {{ tag }}
                </v-chip>
            </div>
        </div>
    </v-card>
</template>

<script>
export default {
    name: "ItemCard",
    props: {
        item: {
            type: Object,
            required: true,
        },
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
