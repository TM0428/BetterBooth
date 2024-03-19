<template>
    <v-btn class="mr-4" variant="outlined" color="success">
        {{ $t("topImport") }}
        <v-dialog v-model="dialog_import" activator="parent" width="auto">
            <v-card width="100%" height="100%">
                <v-row class="my-3 text-center" justify="center">
                    <v-col cols="10">
                        <v-btn
                            @dragover.prevent="import_dragged = true"
                            @dragleave.prevent="import_dragged = false"
                            @drop.prevent="onFileDropped"
                            @click="uploadDataCardClicked"
                            block
                            height="100%"
                            color="primary"
                            :variant="!import_dragged ? 'elevated' : 'outlined'"
                        >
                            <v-row class="text-center" justify="center">
                                <v-col cols="12" class="mt-2 mb-n2">
                                    <v-icon :icon="mdiFileImportIcon" size="40">
                                    </v-icon>
                                </v-col>
                                <v-col
                                    cols="12"
                                    class="text-truncate mb-2 mt-n2 text-lowercase"
                                >
                                    {{ $t("topImportJson") }}
                                </v-col>
                            </v-row>
                        </v-btn>
                    </v-col>
                </v-row>

                <input
                    ref="uploadInput"
                    type="file"
                    accept=".json"
                    style="display: none"
                    @change="onFileChange"
                    :key="inputKey"
                />
            </v-card>
        </v-dialog>
    </v-btn>
</template>
<script>
import { mdiFileImport } from "@mdi/js";
import { setItemData } from "../js/localStorage";

export default {
    props: {
        filteredItemList: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            dialog_import: false,
            mdiFileImportIcon: mdiFileImport,
            import_dragged: false,
        };
    },
    methods: {
        uploadDataCardClicked() {
            this.$refs.uploadInput.click();
        },
        onFileDropped(event) {
            console.log(event.dataTransfer.files[0]);
            this.import_dragged = false;
            this.fileRead(event.dataTransfer.files[0]);
        },
        onFileChange(event) {
            this.inputKey += 1;
            const file = event.target.files[0];
            if (!file) return;
            this.fileRead(file);
        },
        fileRead(file) {
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
                        url: data.url || "",
                        shop: data.shop || null,
                        tags: data.tags || [],
                        purchased: data.purchased || false,
                    };
                    console.log(sanitizedData);

                    this.addStorage(sanitizedData);
                    // Perform any further operations with the sanitizedData
                } else {
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
            } else {
                window.alert(this.lang.topDataAdd);
                this.$emit("item-imported", result);
            }
            this.dialog_import = false;
        },
    },
};
</script>
