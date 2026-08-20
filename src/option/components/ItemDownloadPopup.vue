<template>
    <v-btn color="primary" variant="flat" :prepend-icon="mdiTrayArrowDownIcon">
        {{ $t("allDownloadButton") }}
        <v-dialog v-model="dialog_download" activator="parent" width="auto">
            <v-card>
                <v-card-title>
                    {{ $t("downloadTitle") }}
                </v-card-title>
                <div class="ma-4">
                    <div class="v-subtitle-1">
                        {{ $t("downloadExt") }}
                    </div>
                    <v-radio-group inline v-model="downloadSaveExt">
                        <v-radio label="CSV" value="CSV"></v-radio>
                        <v-radio label="JSON" value="JSON"></v-radio>
                    </v-radio-group>
                    <div v-if="downloadSaveExt == ''" class="text-error">
                        At least one item should be selected
                    </div>
                    <template v-if="downloadSaveExt == 'CSV'">
                        <div class="v-subtitle-1">
                            {{ $t("downloadInfo") }}
                        </div>
                        <v-row>
                            <v-col
                                cols="12"
                                sm="6"
                                md="4"
                                lg="3"
                                v-for="info in downloadSaveList"
                                :key="info.value"
                            >
                                <v-checkbox
                                    :label="info.label"
                                    v-model="downloadSaveInfo"
                                    color="primary"
                                    :value="info.value"
                                    hide-details
                                    :rules="downloadSaveInfoRules"
                                ></v-checkbox>
                            </v-col>
                        </v-row>
                        <div v-if="downloadSaveInfoRules[0] != true" class="text-error">
                            {{ downloadSaveInfoRules[0] }}
                        </div>
                    </template>
                    <div v-else-if="downloadSaveExt == 'JSON'" class="text-body-2 text-onSurfaceVariant">
                        {{ $t("downloadJsonNote") }}
                    </div>
                </div>

                <v-card-actions>
                    <v-btn color="primary" @click="dialog_download = false"> Close </v-btn>
                    <v-btn
                        type="submit"
                        color="primary"
                        @click="downloadItems()"
                        v-bind:disabled="
                            downloadSaveExt == '' ||
                            (downloadSaveExt == 'CSV' && downloadSaveInfoRules[0] != true)
                        "
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>

<script>
import { mdiTrayArrowDown } from "@mdi/js";
import { itemToExportObject } from "@/js/module/item_export";

export default {
    name: "DownloadPopup",
    props: {
        filteredItemList: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            mdiTrayArrowDownIcon: mdiTrayArrowDown,
            dialog_download: false,
            downloadSaveExt: "CSV",
            downloadSaveList: [],
            downloadSaveInfo: []
        };
    },
    methods: {
        downloadItems() {
            let fileContent;
            let mimeType;
            let fileExtension;

            if (this.downloadSaveExt === "CSV") {
                // CSVは選択された項目だけを抽出して保存
                const dataToDownload = this.filteredItemList.map((item) => {
                    const extracted = {};
                    this.downloadSaveInfo.forEach((key) => {
                        switch (key) {
                            case "shop.name":
                                extracted["shopName"] = item.shop.name;
                                break;
                            case "shop.url":
                                extracted["shopURL"] = item.shop.url;
                                break;
                            default:
                                extracted[key] = item[key];
                        }
                    });
                    return extracted;
                });
                fileContent = this.convertToCSV(dataToDownload);
                mimeType = "text/csv;charset=utf-8;";
                fileExtension = ".csv";
            } else if (this.downloadSaveExt === "JSON") {
                // JSONは再インポートできるよう全データを保存
                const dataToDownload = this.filteredItemList.map((item) =>
                    itemToExportObject(item)
                );
                fileContent = JSON.stringify(dataToDownload, null, 4);
                mimeType = "application/json;charset=utf-8;";
                fileExtension = ".json";
            } else {
                console.error("Unknown download format:", this.downloadSaveExt);
                return;
            }

            // 3. データをBlobオブジェクトに変換し、それをダウンロードするリンクとして使用
            const blob = new Blob([fileContent], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "betterbooth_items" + fileExtension);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        convertToCSV(objArray) {
            const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
            let str = "";
            let headers = this.downloadSaveInfo.join(",") + "\r\n";
            str += headers;

            for (let i = 0; i < array.length; i++) {
                let line = "";
                for (let index in array[i]) {
                    if (line !== "") line += ",";
                    line += '"' + String(array[i][index]) + '"';
                }
                str += line + "\r\n";
            }
            return str;
        }
    },
    computed: {
        downloadSaveInfoRules() {
            return [this.downloadSaveInfo.length > 0 || "At least one item should be selected"];
        }
    },
    created() {
        this.downloadSaveList = [
            { label: this.$t("downloadSaveList.shopName"), value: "shop.name" },
            { label: this.$t("downloadSaveList.shopUrl"), value: "shop.url" },
            { label: this.$t("downloadSaveList.itemName"), value: "name" },
            { label: this.$t("downloadSaveList.price"), value: "price" },
            {
                label: this.$t("downloadSaveList.downloaded"),
                value: "download"
            },
            {
                label: this.$t("downloadSaveList.purchased"),
                value: "purchased"
            }
        ];
        this.downloadSaveInfo = this.downloadSaveList.map((item) => item.value);
    }
};
</script>
