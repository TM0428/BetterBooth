<script setup>
import Option from "./pages/OptionPage.vue";
</script>

<template>
    <div class="main">
        <v-app color="background">
            <v-main>
                <Option></Option>
            </v-main>
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
</style>
