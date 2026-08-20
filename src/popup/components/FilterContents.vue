<template>
    <v-sheet color="surfaceContainerLow" border="sm" rounded="lg">
        <h1 class="ma-4">{{ $t("filtersHeader") }}</h1>
        <v-divider></v-divider>
        <v-card class="mb-4" variant="tonal" color="surface">
            <v-list class="filter-list py-0">
                <template v-for="(filter, index) in filters" :key="index">
                    <v-list-item>
                        <v-list-item-content class="d-flex align-center justify-space-between">
                            <a :href="filter" target="_blank" class="text-body-2">{{ filter }}</a>
                            <v-btn color="primary" size="small" @click="removeFilter(index)">
                                {{ $t("removeButton") }}
                            </v-btn>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider
                        v-if="index !== filters.length - 1"
                        :key="`divider-${index}`"
                    ></v-divider>
                </template>
            </v-list>
        </v-card>
        <div class="pa-2">
            <v-btn
                color="primary"
                block
                :disabled="filters.length === 0"
                @click="openMigrationPage()"
            >
                {{ $t("migrateToOfficialButton") }}
            </v-btn>
        </div>
    </v-sheet>
</template>

<script setup>
import { getFilter, setFilter } from "@/js/module/filter_data";
import { getExtendedSettings } from "@/js/module/settings_data";
import { setToLocalStorage } from "@/js/module/chrome_storage";
import { MIGRATION_REQUEST_KEY } from "@/js/module/notice_constants";
import { ref, onMounted } from "vue";

const filters = ref([]);

const removeFilter = async (index) => {
    filters.value.splice(index, 1);
    await setFilter(Array.from(filters.value));
};

// booth.pmのトップページを開き、content.js側で移行ポップアップを表示させる
// (移行APIはbooth.pmのページ上からしか呼び出せないため)
const openMigrationPage = async () => {
    await setToLocalStorage(MIGRATION_REQUEST_KEY, true);
    chrome.tabs.create({ url: "https://booth.pm/" });
    window.close();
};

onMounted(async () => {
    const settings = await getExtendedSettings();
    filters.value = (await getFilter(settings.getFilterMode)) || [];
});
</script>

<style lang="scss">
.filter-list {
    width: 100%;
    max-height: 200px;
    overflow: scroll;
    overflow-x: auto;
    overflow-y: auto;
}
</style>
