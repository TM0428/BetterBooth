<!-- ItemCard.vue -->
<template>
    <v-card
        :to="to"
        class="d-flex flex-column ma-2 pa-1"
        width="250px"
        height="350px"
    >
        <v-img :src="item.image" alt="Item Image" aspect-ratio="1.7" />
        <v-card-title class="multi-line-title">{{ item.name }}</v-card-title>
        <!-- タグの表示部分 -->
        <v-card-subtitle>
            <!-- <v-chip v-for="tag in item.tags" :key="tag" small>{{ tag }}</v-chip> -->
            <v-chip small>tag</v-chip>
        </v-card-subtitle>
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
};
</script>

<style></style>
