<template>
    <v-card
        @click="navigateToItem"
        class="d-flex flex-column ma-2 pa-1"
        height="100%"
        max-width="310px"
    >
        <v-img
            :src="item.image"
            alt="Item Image"
            class="cover"
            aspect-ratio="1"
        />
        <div class="ma-2 text-h6 text-weight-regular two-line-title">
            <div class="ellipsis-2-lines" style="inherit;">
                {{ item.name }}
            </div>
        </div>
        <!-- タグの表示部分 -->
        <div class="ma-1">
            <div style="display: inline-block;">
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
