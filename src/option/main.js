import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import i18n from "./i18n.js";

const LightTheme = {
    dark: false,
    colors: {
        primary: "#FF4D50",
        surfaceTint: "#904A47",
        onPrimary: "#FFFFFF",
        primaryContainer: "#FFDAD7",
        onPrimaryContainer: "#3B080A",
        secondary: "#775654",
        onSecondary: "#FFFFFF",
        secondaryContainer: "#FFDAD7",
        onSecondaryContainer: "#2C1514",
        tertiary: "#735B2E",
        onTertiary: "#FFFFFF",
        tertiaryContainer: "#FFDEA8",
        onTertiaryContainer: "#271900",
        error: "#BA1A1A",
        onError: "#FFFFFF",
        errorContainer: "#FFDAD6",
        onErrorContainer: "#410002",
        background: "#FAF9F9",
        onBackground: "#1C1B1B",
        surface: "#FFFFFF",
        onSurface: "#1C1B1B",
        surfaceVariant: "#F1EEEE",
        onSurfaceVariant: "#4C4646",
        outline: "#7D7676",
        outlineVariant: "#DEDADA",
        shadow: "#000000",
        scrim: "#000000",
        inverseSurface: "#323030",
        inverseOnSurface: "#F4F0F0",
        inversePrimary: "#FFB3AF",
        primaryFixed: "#FFDAD7",
        onPrimaryFixed: "#3B080A",
        primaryFixedDim: "#FFB3AF",
        onPrimaryFixedVariant: "#733331",
        secondaryFixed: "#FFDAD7",
        onSecondaryFixed: "#2C1514",
        secondaryFixedDim: "#E7BDBA",
        onSecondaryFixedVariant: "#5D3F3D",
        tertiaryFixed: "#FFDEA8",
        onTertiaryFixed: "#271900",
        tertiaryFixedDim: "#E2C28C",
        onTertiaryFixedVariant: "#594319",
        surfaceDim: "#E5E2E2",
        surfaceBright: "#FFFFFF",
        surfaceContainerLowest: "#FFFFFF",
        surfaceContainerLow: "#FFFFFF",
        surfaceContainer: "#F4F1F1",
        surfaceContainerHigh: "#EEEBEB",
        surfaceContainerHighest: "#E8E5E5"
    }
};

const DarkTheme = {
    dark: true,
    colors: {
        primary: "#FFB3AF",
        surfaceTint: "#FFB3AF",
        onPrimary: "#571D1D",
        primaryContainer: "#733331",
        onPrimaryContainer: "#FFDAD7",
        secondary: "#E7BDBA",
        onSecondary: "#442928",
        secondaryContainer: "#5D3F3D",
        onSecondaryContainer: "#FFDAD7",
        tertiary: "#E2C28C",
        onTertiary: "#402D05",
        tertiaryContainer: "#594319",
        onTertiaryContainer: "#FFDEA8",
        error: "#FFB4AB",
        onError: "#690005",
        errorContainer: "#93000A",
        onErrorContainer: "#FFDAD6",
        background: "#141313",
        onBackground: "#E7E3E3",
        surface: "#141313",
        onSurface: "#E7E3E3",
        surfaceVariant: "#4C4646",
        onSurfaceVariant: "#D0CBCB",
        outline: "#999292",
        outlineVariant: "#4C4646",
        shadow: "#000000",
        scrim: "#000000",
        inverseSurface: "#F1DEDD",
        inverseOnSurface: "#382E2D",
        inversePrimary: "#904A47",
        primaryFixed: "#FFDAD7",
        onPrimaryFixed: "#3B080A",
        primaryFixedDim: "#FFB3AF",
        onPrimaryFixedVariant: "#733331",
        secondaryFixed: "#FFDAD7",
        onSecondaryFixed: "#2C1514",
        secondaryFixedDim: "#E7BDBA",
        onSecondaryFixedVariant: "#5D3F3D",
        tertiaryFixed: "#FFDEA8",
        onTertiaryFixed: "#271900",
        tertiaryFixedDim: "#E2C28C",
        onTertiaryFixedVariant: "#594319",
        surfaceDim: "#141313",
        surfaceBright: "#3B3939",
        surfaceContainerLowest: "#0F0E0E",
        surfaceContainerLow: "#1C1B1B",
        surfaceContainer: "#201F1F",
        surfaceContainerHigh: "#2B2929",
        surfaceContainerHighest: "#363434"
    }
};

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
        aliases: {
            ...aliases
        },
        sets: {
            mdi
        }
    },
    theme: {
        defaultTheme: "LightTheme",
        themes: {
            LightTheme,
            DarkTheme
        }
    }
});

async function bootstrap() {
    // dev サーバーでの単体プレビュー時のみ chrome.storage をモックする(本番ビルドでは除去される)
    if (import.meta.env.DEV && !window.chrome?.storage) {
        await import("./dev_chrome_mock.js");
    }
    createApp(App).use(vuetify).use(router).use(i18n).mount("#app");
}
bootstrap();
