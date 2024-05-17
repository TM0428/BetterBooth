<template>
    <div class="image-carousel">
        <v-carousel class="bg-grey-lighten-2" v-if="data.images.length > 0">
            <v-carousel-item
                v-for="(image, i) in data.images"
                :key="i"
                :src="image.original"
                @click="
                    dialogImage = image.original;
                    dialog = true;
                "
            ></v-carousel-item>
        </v-carousel>
        <v-dialog v-model="dialog" max-width="1000px">
            <v-card>
                <v-img :src="dialogImage" contain></v-img>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
            dialogImage: ""
        };
    }
};
</script>
