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
        background: "#FFF8F7",
        onBackground: "#231919",
        surface: "#FFF8F7",
        onSurface: "#231919",
        surfaceVariant: "#F4DDDB",
        onSurfaceVariant: "#534342",
        outline: "#857371",
        outlineVariant: "#D8C2C0",
        shadow: "#000000",
        scrim: "#000000",
        inverseSurface: "#382E2D",
        inverseOnSurface: "#FFEDEB",
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
        surfaceDim: "#E8D6D4",
        surfaceBright: "#FFF8F7",
        surfaceContainerLowest: "#FFFFFF",
        surfaceContainerLow: "#FFF0EF",
        surfaceContainer: "#FCEAE8",
        surfaceContainerHigh: "#F6E4E2",
        surfaceContainerHighest: "#F1DEDD"
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
        background: "#1A1111",
        onBackground: "#F1DEDD",
        surface: "#1A1111",
        onSurface: "#F1DEDD",
        surfaceVariant: "#534342",
        onSurfaceVariant: "#D8C2C0",
        outline: "#A08C8B",
        outlineVariant: "#534342",
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
        surfaceDim: "#1A1111",
        surfaceBright: "#423736",
        surfaceContainerLowest: "#140C0C",
        surfaceContainerLow: "#231919",
        surfaceContainer: "#271D1D",
        surfaceContainerHigh: "#322827",
        surfaceContainerHighest: "#3D3231"
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

createApp(App).use(vuetify).use(router).use(i18n).mount("#app");
