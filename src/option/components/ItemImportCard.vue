<template>
    <div class="content">
        <v-card
            @click="uploadDataCardClicked"
            class="d-flex flex-column ma-2 pa-1"
            height="100%"
            max-width="310px"
        >
            <img
                src="@/assets/add_circle.svg"
                class="card-svg-image"
                alt="Add Icon"
                aspect-ratio="1"
            />
            <div class="ma-2 text-h6 text-weight-regular two-line-title">
                <div class="ellipsis-2-lines" style="inherit;">
                    {{ lang.topImport }}<v-icon :icon="mdiAccountIcon"></v-icon>
                </div>
            </div>
            <input
                ref="uploadInput"
                type="file"
                accept=".json"
                style="display: none"
                @change="onFileChange"
                :key="inputKey"
            />
        </v-card>
    </div>
</template>

<script>
import { mdiAccount } from "@mdi/js";
export default {
    name: "ItemCard",
    props: {
        lang: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            mdiAccountIcon: mdiAccount,
        };
    },
    methods: {
        uploadDataCardClicked() {
            this.$refs.uploadInput.click();
        },
        onFileChange(event) {
            this.inputKey += 1;
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const data = JSON.parse(reader.result);
                if (this.validateData(data)) {
                    // Only keep the required properties from the data object
                    const sanitizedData = {
                        additionalDescription:
                            data.additionalDescription || null,
                        description: data.description,
                        id: data.id,
                        price: data.price || "",
                        images: data.images || [],
                        name: data.name,
                        price: data.price || null,
                        shop: data.shop || null,
                    };
                    console.log(sanitizedData);

                    this.addStorage(sanitizedData);
                    // Perform any further operations with the sanitizedData
                } else {
                    window.alert(this.lang.topInvalid);
                }
            };
            reader.readAsText(file);
        },
        validateData(data) {
            // データがオブジェクトで、必要なプロパティが含まれているかを確認するバリデーション
            return (
                typeof data === "object" &&
                data !== null &&
                "description" in data &&
                typeof data.description === "string" &&
                "id" in data &&
                typeof data.id === "number" &&
                "images" in data &&
                Array.isArray(data.images) &&
                data.images.every(
                    (image) =>
                        typeof image === "object" &&
                        image !== null &&
                        "original" in image &&
                        typeof image.original === "string" &&
                        "resized" in image &&
                        typeof image.resized === "string"
                ) &&
                "name" in data &&
                typeof data.name === "string" &&
                "price" in data &&
                typeof data.price === "string" &&
                "shop" in data &&
                typeof data.shop === "object" &&
                data.shop !== null &&
                "name" in data.shop &&
                typeof data.shop.name === "string" &&
                "subdomain" in data.shop &&
                typeof data.shop.subdomain === "string" &&
                "url" in data.shop &&
                typeof data.shop.url === "string"
            );
        },
        addStorage(data) {
            const itemId = "items_" + String(data.id);
            chrome.storage.local.get("items", (result) => {
                var items = result.items;
                if (items && !items.includes(itemId)) {
                    // 新たに登録
                    items.push(itemId);
                    chrome.storage.local.set({ items: items });
                    chrome.storage.local.set({ [`${itemId}`]: data });
                } else if (items) {
                    // 既に登録されているので更新
                    chrome.storage.local.set({ [`${itemId}`]: data });
                } else {
                    // リスト作成と登録
                    items = [itemId];
                    console.log(items);
                    chrome.storage.local.set({ items: items });
                    chrome.storage.local.set({ [`${itemId}`]: data });
                }

                window.alert(this.lang.topDataAdd);
            });
        },
    },
    computed: {
        to() {
            return { name: "Item", params: { itemId: this.item.id } };
        },
    },
};
</script>

<style>
.content {
    height: 100%;
}
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
}
</style>
