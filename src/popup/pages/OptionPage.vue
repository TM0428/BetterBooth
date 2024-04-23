<template>
    <div class="content">
        <div class="filter">
            <filter-contents></filter-contents>
        </div>

        <div class="search-setting">
            <search-settings></search-settings>
        </div>

        <div class="extension-setting">
            <extension-settings></extension-settings>
        </div>
    </div>
</template>

<script>
import FilterContents from "../components/FilterContents.vue";
import SearchSettings from "../components/SearchSettings.vue";
import ExtensionSettings from "../components/ExtensionSettings.vue";

export default {
    components: {
        FilterContents,
        SearchSettings,
        ExtensionSettings
    }
};
</script>
<style scoped>
.content {
    width: 450px;
}
</style>
