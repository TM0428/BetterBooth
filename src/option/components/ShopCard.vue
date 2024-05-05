<template>
    <v-card
        class="d-flex flex-column"
        height="100%"
        color="surfaceContainerLow"
        :title="shop.name"
        :subtitle="shop.url"
    >
        <template v-slot:prepend
            ><v-avatar start>
                <v-img :src="shop.thumbnail_url"></v-img>
            </v-avatar>
        </template>
        <v-card-text> </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        shop: {
            type: Object,
            required: true
        }
    }
};
</script>
