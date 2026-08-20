<template>
    <v-btn variant="outlined" color="primary" :prepend-icon="mdiFileImportIcon">
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
                                    <v-icon :icon="mdiFileImportIcon" size="40"> </v-icon>
                                </v-col>
                                <v-col cols="12" class="text-truncate mb-2 mt-n2 text-lowercase">
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
import { addItem } from "@/js/module/item_data";
import { validateItemData, sanitizeItemData } from "@/js/module/item_export";
import { mdiFileImport } from "@mdi/js";

export default {
    data() {
        return {
            dialog_import: false,
            mdiFileImportIcon: mdiFileImport,
            import_dragged: false
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
                let data;
                try {
                    data = JSON.parse(reader.result);
                } catch (error) {
                    console.error(error);
                    window.alert(this.$t("topInvalid"));
                    return;
                }

                // 単体エクスポート(object)と一括エクスポート(array)の両方に対応
                const rawItems = Array.isArray(data) ? data : [data];
                const validItems = [];
                let skippedCount = 0;
                for (const rawItem of rawItems) {
                    if (validateItemData(rawItem)) {
                        validItems.push(sanitizeItemData(rawItem));
                    } else {
                        skippedCount++;
                    }
                }

                if (validItems.length === 0) {
                    window.alert(this.$t("topInvalid"));
                    return;
                }
                this.addStorage(validItems, skippedCount);
            };
            reader.readAsText(file);
        },
        async addStorage(items, skippedCount) {
            try {
                for (const item of items) {
                    await addItem(item);
                }
            } catch (error) {
                console.error(error);
                window.alert("Some error occurred!");
                this.dialog_import = false;
                return;
            }
            let message = this.$t("topDataAddCount", { count: items.length });
            if (skippedCount > 0) {
                message += "\n" + this.$t("topImportSkippedCount", { count: skippedCount });
            }
            window.alert(message);
            this.$emit("item-imported", 0);
            this.dialog_import = false;
        }
    }
};
</script>
