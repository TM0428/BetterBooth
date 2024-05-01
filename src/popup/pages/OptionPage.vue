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
<style>
.contents {
    width: 450px;
    font-family: -apple-system, BlinkMacSystemFont, Avenir, "Helvetica Neue", "Segoe UI", Arial,
        "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic ProN", メイリオ, Meiryo, "ＭＳ Ｐゴシック",
        sans-serif !important;
}

.content {
    margin: 16px;
}
</style>
