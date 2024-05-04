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
    </v-sheet>
</template>
<script>
export default {
    data() {
        return {
            filters: []
        };
    },
    methods: {
        removeFilter(index) {
            this.filters.splice(index, 1);
            console.log(this.filters);
            chrome.storage.sync.set({ filters: Array.from(this.filters) });
        }
    },
    created() {
        chrome.storage.sync.get("filters", (result) => {
            this.filters = result.filters || [];
        });
    }
};
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
