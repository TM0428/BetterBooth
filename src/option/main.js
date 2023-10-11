import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mdiAccount } from "@mdi/js";
import colors from "vuetify/lib/util/colors";

const LightTheme = {
    dark: false,
    colors: {
        background: "#eee",
        surface: "#FFFFFF",
        primary: "#ff4d50",
        "primary-darken-1": "#3700B3",
        secondary: "#03DAC6",
        "secondary-darken-1": "#018786",
        error: "#B00020",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00",
    },
};

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
        aliases: {
            ...aliases,
            account: mdiAccount,
        },
        sets: {
            mdi,
        },
    },
    theme: {
        defaultTheme: "themes",
        themes: {
            LightTheme,
        },
    },
});

createApp(App)
    .use(vuetify)
    .use(router)
    .mount("#app");
