<template>
    <div class="contents">
        <div class="content filter">
            <filter-contents></filter-contents>
        </div>

        <div class="content search-setting">
            <search-settings></search-settings>
        </div>

        <div class="content extension-setting">
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
.contents {
    width: 450px;
}

.content {
    margin: 10px 4px;
}
</style>
