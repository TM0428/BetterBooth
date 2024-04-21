<template>
    <div class="content">
        <v-card
            @click="uploadDataCardClicked"
            class="d-flex flex-column ma-auto pa-1"
            height="100%"
            max-width="310px"
        >
            <v-icon :icon="mdiPlusCircleOutlineIcon" alt="Item Image" class="cover" size="100%" />

            <div class="ma-2 text-h6 text-weight-regular two-line-title">
                <div class="ellipsis-2-lines">
                    {{ $t("topImport") }}
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
import { mdiPlusCircleOutline } from "@mdi/js";
import { setItemData } from "../js/localStorage";

export default {
    name: "ItemCard",
    data() {
        return {
            mdiPlusCircleOutlineIcon: mdiPlusCircleOutline
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
                        additionalDescription: data.additionalDescription || null,
                        description: data.description,
                        id: data.id,
                        price: data.price || "",
                        images: data.images || [],
                        name: data.name,
                        price: data.price || null,
                        url: data.url || "",
                        shop: data.shop || null,
                        tags: data.tags || [],
                        purchased: data.purchased || false
                    };
                    console.log(sanitizedData);

                    this.addStorage(sanitizedData);
                    // Perform any further operations with the sanitizedData
                }
                else {
                    window.alert(this.$t("topInvalid"));
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
        async addStorage(data) {
            const result = await setItemData(data);
            if (result != 0) {
                window.alert("Some error occured!");
            }
            else {
                window.alert(this.$t("topDataAdd"));
                this.$emit("item-imported", result);
            }
        }
    },
    computed: {
        to() {
            return { name: "Item", params: { itemId: this.item.id } };
        }
    }
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
