<script setup>
import Option from "./pages/OptionPage.vue";
</script>

<template>
    <div class="main">
        <v-app color="background">
            <v-main>
                <Option></Option>
            </v-main>
            <v-footer app class="tip-container" color="background">
                <a
                    href="https://buymeacoffee.com/428_tm"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="tip-link"
                >
                    ☕ Do you like my extension? Buy me a coffee
                </a>
            </v-footer>
        </v-app>
    </div>
</template>

<style scoped>
.main {
    margin-left: auto;
    margin-right: auto;
    min-width: 300px;
    width: 450px;
}

.tip-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 0;
    border-top: 1px solid rgba(128, 128, 128, 0.2);
}

.tip-link {
    font-size: 11px;
    color: #888;
    text-decoration: none;
    transition: color 0.2s;
}

.tip-link:hover {
    color: #555;
}
</style>
