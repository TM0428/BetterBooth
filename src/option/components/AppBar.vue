<template>
    <v-app-bar color="primary" density="comfortable" fixed>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title class="d-flex flex-row" v-if="!$vuetify.display.xs">
            {{ $t("topTitle") }}
            <div class="text-caption">v0.5.3</div>
        </v-app-bar-title>
        <v-spacer v-if="!$vuetify.display.xs"></v-spacer>
        <a
            target="_blank"
            href="https://tm0428.github.io/BetterBooth/howto/#%E6%A4%9C%E7%B4%A2%E6%96%B9%E6%B3%95%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6"
        >
            <v-btn icon>
                <v-icon :icon="mdiHelpCircleOutlineIcon" color="white"></v-icon>
                <v-tooltip activator="parent" location="bottom">{{ $t("topHowto") }}</v-tooltip>
            </v-btn>
        </a>
        <v-text-field
            class="mr-4 searchTextBox"
            v-model="searchText"
            :label="$t('topSearchText')"
            clearable
            @click:clear="
                searchText = ''
                // updateQuery();
            "
            rounded="rounded-pill"
            density="compact"
            bg-color="surfaceContainerHighest"
            color="primary"
            single-line
            hide-details
            @change="updateSearchText"
        >
            <template v-slot:clear>
                <v-icon color="onSurfaceVariant" :icon="mdiCloseCircleIcon"> </v-icon>
            </template>
            <template v-slot:append-inner>
                <v-icon color="onSurfaceVariant" :icon="mdiMagnifyIcon"> </v-icon>
            </template>
        </v-text-field>
    </v-app-bar>
    <v-main>
        <v-navigation-drawer
            v-model="drawer"
            :location="$vuetify.display.xs ? 'top' : 'left'"
            temporary
        >
            <v-list>
                <v-list-item
                    v-for="(item, i) in navItems"
                    :key="i"
                    :value="item"
                    color="primary"
                    :href="item.href"
                >
                    <template v-slot:prepend>
                        <v-icon :icon="item.icon"></v-icon>
                    </template>

                    <v-list-item-title> {{ item.text }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-main>
</template>

<script>
import {
    mdiMagnify,
    mdiCartOutline,
    mdiHelpCircleOutline,
    mdiCloseCircle,
    mdiCog,
    mdiStore,
    mdiHome
} from "@mdi/js";
export default {
    data() {
        return {
            drawer: false,
            mdiMagnifyIcon: mdiMagnify,
            mdiCartOutlineIcon: mdiCartOutline,
            mdiHelpCircleOutlineIcon: mdiHelpCircleOutline,
            mdiCloseCircleIcon: mdiCloseCircle,
            navItems: [
                { text: "Home", icon: mdiHome, href: "/src/option/option.html#/" },
                { text: "settings", icon: mdiCog, href: "/src/popup/popup.html" },
                {
                    text: "add shop link",
                    icon: mdiStore,
                    href: "/src/option/option.html#/customshop"
                }
            ]
        };
    }
};
</script>
