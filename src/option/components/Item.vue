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
        <div class="button-wrapper">
            <router-link :to="{ name: 'Top' }" class="shop-button">
                <img
                    src="@/assets/redo.svg"
                    alt="Link"
                    width="24"
                    height="24"
                    class="button-icon"
                />
                <span class="button-text">アイテム一覧に戻る</span>
            </router-link>
            <a :href="data.shop.url" target="_blank" class="shop-button">
                <img
                    src="@/assets/link.svg"
                    alt="Link"
                    width="24"
                    height="24"
                    class="button-icon"
                />
                <span class="button-text">ショップへ行く</span>
            </a>
            <button class="delete-button" @click="deleteItem">
                <img
                    src="@/assets/delete.svg"
                    alt="Delete"
                    width="24"
                    height="24"
                    class="button-icon"
                />
                <span class="button-text">このアイテムを削除する</span>
            </button>
        </div>
        <div class="popup" v-if="popupImage">
            <span class="popup-close" @click="closePopup">&times;</span>
            <img :src="popupImage" alt="Popup Image" class="popup-image" />
        </div>
    </div>
</template>

<script>
import router from "@/option/router"; // Vue Router インスタンスのインポート

export default {
    props: ["itemId"],
    data() {
        return {
            data: {
                name: "",
                images: [""],
                description: "",
                additionalDescription: "",
                shop: {
                    url: "",
                },
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
        deleteItem() {
            if (confirm("データを削除しますか？")) {
                chrome.storage.local.get("items", (result) => {
                    const items = result.items || [];
                    const updatedItems = items.filter(
                        (item) => item.id !== "items_" + this.itemId
                    );
                    chrome.storage.local.set({ items: updatedItems }, () => {
                        chrome.storage.local.remove(
                            `items_${this.itemId}`,
                            () => {
                                console.log(
                                    `Item with ID ${this.itemId} deleted successfully.`
                                );
                                // 削除が完了した後の処理をここに記述する
                                window.alert("削除が完了しました。");
                                router.push({ name: "Top" }); // Topページにリダイレクト
                            }
                        );
                    });
                });
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

.button-wrapper {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.delete-button,
.shop-button {
    display: flex;
    align-items: center;
    background: none;
    border: 1px solid rgba(128, 128, 128, 0.24);
    height: 48px;
    padding: 0 24px 0 16px;
    margin-right: 16px;
    letter-spacing: 0.25px;
    border-radius: 24px;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.3s ease;
}

.delete-button:hover,
.shop-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.button-icon {
    fill: red; /* 削除ボタンの色 */
    margin-right: 8px;
}

.shop-button .button-icon {
    fill: green; /* ショップへ行くボタンの色 */
}

.button-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
}

body {
    overflow: auto;
}

.popup ~ * {
    pointer-events: none;
    user-select: none;
    filter: brightness(40%);
}

p {
    font-size: 15px;
}
</style>
