<template>
    <div>
        <h1>{{ data.name }}</h1>
        <div class="image-container">
            <div class="image-wrapper">
                <div
                    class="arrow-left"
                    v-if="currentImageIndex > 0"
                    @click="changeImage(currentImageIndex - 1)"
                >
                    <img
                        src="@/assets/arrow-left.svg"
                        alt="Previous"
                        width="24"
                        height="24"
                    />
                </div>
                <div class="image-frame">
                    <div class="image-inner">
                        <img
                            :src="currentImage"
                            :key="currentImage"
                            alt="Item Image"
                            @click="openPopup(currentImage)"
                        />
                    </div>
                </div>
                <div
                    class="arrow-right"
                    v-if="currentImageIndex < data.images.length - 1"
                    @click="changeImage(currentImageIndex + 1)"
                >
                    <img
                        src="@/assets/arrow-right.svg"
                        alt="Next"
                        width="24"
                        height="24"
                    />
                </div>
            </div>
        </div>
        <div class="image-indicator">
            <span
                v-for="(image, index) in data.images"
                :key="index"
                class="indicator-dot"
                :class="{ active: index === currentImageIndex }"
                @click="changeImage(index)"
            ></span>
        </div>
        <p class="description" v-html="formatDescription(data.description)"></p>
        <p
            class="additional-description"
            v-if="data.additionalDescription"
            v-html="formatDescription(data.additionalDescription)"
        ></p>
        <router-link :to="{ name: 'Top' }">Top</router-link>
        <div class="popup" v-if="popupImage">
            <span class="popup-close" @click="closePopup">&times;</span>
            <img :src="popupImage" alt="Popup Image" class="popup-image" />
        </div>
    </div>
</template>

<script>
export default {
    props: ["itemId"],
    data() {
        return {
            data: {
                name: "",
                images: [""],
                description: "",
                additionalDescription: "",
            },
            currentImageIndex: 0,
            popupImage: null,
        };
    },

    created() {
        chrome.storage.local.get(`items_${this.itemId}`, (result) => {
            this.data = result[`items_${this.itemId}`];
            console.log(this.data);
        });
    },

    computed: {
        currentImage() {
            const image = this.data.images[this.currentImageIndex];
            return image && image.original ? image.original : "";
        },
    },

    methods: {
        formatDescription(description) {
            return description.replace(/\n/g, "<br>");
        },
        openPopup(imageUrl) {
            this.popupImage = imageUrl;
            document.body.style.overflow = "hidden";
        },
        closePopup() {
            this.popupImage = null;
            document.body.style.overflow = "auto";
        },
        changeImage(index) {
            if (index >= 0 && index < this.data.images.length) {
                this.currentImageIndex = index;
            }
        },
    },
};
</script>

<style>
.image-container {
    position: relative;
    width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-wrapper {
    background-color: #f2f2f2;
}

.arrow-left,
.arrow-right {
    position: absolute;
    top: calc(50% - 12px);
    color: white;
    font-size: 24px;
    cursor: pointer;
    z-index: 1;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    padding: 4px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.arrow-left {
    left: 10px;
}

.arrow-right {
    right: 10px;
}

.arrow-left img,
.arrow-right img {
    width: 24px;
    height: 24px;
}

.image-inner {
    width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-inner img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    cursor: pointer;
}

.image-indicator {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    width: 500px;
    overflow-x: auto;
    white-space: nowrap;
}

.indicator-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: gray;
    margin: 0 5px;
    cursor: pointer;
}

.indicator-dot.active {
    background-color: black;
}

.description {
    padding-top: 10px;
}

.additional-description {
    padding-top: 10px;
}

.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.popup-image {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
}

.popup-close {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    font-size: 36px;
    cursor: pointer;
}

body {
    overflow: auto;
}

.popup ~ * {
    pointer-events: none;
    user-select: none;
    filter: brightness(40%);
}
</style>
