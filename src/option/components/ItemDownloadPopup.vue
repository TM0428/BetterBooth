<template>
    <v-btn color="info" variant="outlined">
        {{ lang.allDownloadButton }}
        <v-dialog v-model="dialog_download" activator="parent" width="auto">
            <v-card>
                <v-card-title>
                    {{ lang.downloadTitle }}
                </v-card-title>
                <div class="ma-4">
                    <div class="v-subtitle-1">
                        {{ lang.downloadExt }}
                    </div>
                    <v-radio-group inline v-model="downloadSaveExt">
                        <v-radio label="CSV" value="CSV"></v-radio>
                        <v-radio label="JSON" value="JSON"></v-radio>
                    </v-radio-group>
                    <div v-if="downloadSaveExt == ''" class="text-error">
                        At least one item should be selected
                    </div>
                    <div class="v-subtitle-1">
                        {{ lang.downloadInfo }}
                    </div>
                    <v-row>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            lg="3"
                            v-for="(info, index) in downloadSaveList"
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
                    <div
                        v-if="downloadSaveInfoRules[0] != true"
                        class="text-error"
                    >
                        {{ downloadSaveInfoRules[0] }}
                    </div>
                </div>

                <v-card-actions>
                    <v-btn color="primary" @click="dialog_download = false">
                        Close
                    </v-btn>
                    <v-btn
                        type="submit"
                        color="primary"
                        @click="downloadItems()"
                        v-bind:disabled="
                            downloadSaveInfoRules[0] != true ||
                            downloadSaveExt == ''
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
export default {
    name: "DownloadPopup",
    props: {
        lang: {
            type: Object,
            required: true,
        },
        filteredItemList: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            dialog_download: false,
            downloadSaveExt: "CSV",
            downloadSaveList: [],
            downloadSaveInfo: [],
        };
    },
    methods: {
        downloadItems() {
            // 1. filteredItemListから必要なデータを抽出
            const dataToDownload = this.filteredItemList.map((item) => {
                const extracted = {};
                this.downloadSaveInfo.forEach((key) => {
                    switch (key) {
                        case "shop.name":
                            extracted["shop.name"] = item.shop.name;
                            break;
                        case "shop.url":
                            extracted["shop.url"] = item.shop.url;
                            break;
                        default:
                            extracted[key] = item[key];
                    }
                });
                return extracted;
            });

            let fileContent;
            let mimeType;
            let fileExtension;

            // 2. this.downloadSaveExtの値に基づいて、データの形式を決定
            if (this.downloadSaveExt === "CSV") {
                fileContent = this.convertToCSV(dataToDownload);
                mimeType = "text/csv;charset=utf-8;";
                fileExtension = ".csv";
            } else if (this.downloadSaveExt === "JSON") {
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
            link.setAttribute("download", "download" + fileExtension);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        convertToCSV(objArray) {
            const array =
                typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
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
        },
    },
    computed: {
        downloadSaveInfoRules() {
            return [
                this.downloadSaveInfo.length > 0 ||
                    "At least one item should be selected",
            ];
        },
    },
    created() {
        this.downloadSaveList = this.lang.downloadSaveList;
        this.downloadSaveInfo = this.downloadSaveList.map((item) => item.value);
    },
};
</script>
