<template>
    <v-sheet class="ma-3 pa-0">
        <h1 class="mb-2">{{ $t("filtersHeader") }}</h1>
        <v-card max-width="430px" variant="tonal" color="grey-lighten-1">
            <v-list class="filter-list mx-auto">
                <template v-for="(filter, index) in filters" :key="filter">
                    <v-list-item>
                        <v-list-item-content class="d-flex align-center justify-space-between">
                            <a :href="filter" target="_blank" class="text-body-2">{{ filter }}</a>
                            <v-btn
                                color="red"
                                size="small"
                                variant="outlined"
                                @click="removeFilter(index)"
                            >
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
    min-width: 350px;
    width: 100%;
    max-height: 200px;
    overflow: scroll;
    overflow-x: auto;
    overflow-y: auto;
}
</style>
