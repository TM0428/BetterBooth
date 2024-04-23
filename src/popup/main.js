import { createApp } from "vue";
import App from "./App.vue";
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import { mdiAccount } from "@mdi/js";
import i18n from "./i18n";

const LightTheme = {
    dark: false,
    colors: {
        background: "#EEE",
        surface: "#FFFFFF",
        primary: "#ff4d50",
        "primary-darken-1": "#3700B3",
        secondary: "#03DAC6",
        "secondary-darken-1": "#018786",
        error: "#B00020",
        info: "#2196F3",
        disable: "#BDBDBD",
        success: "#4CAF50",
        warning: "#FB8C00"
    }
};
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
        aliases: {
            ...aliases,
            account: mdiAccount
        },
        sets: {
            mdi
        }
    },
    theme: {
        defaultTheme: "LightTheme",
        themes: {
            LightTheme
        }
    }
});

createApp(App).use(vuetify).use(i18n).mount("#app");
