// i18n
import { createI18n } from "vue-i18n";
import ja from "./locales/ja.json";
import en from "./locales/en.json";
import ko from "./locales/ko.json";
import zh_cn from "./locales/zh-CN.json";
import zh_tw from "./locales/zh-TW.json";

const i18n = createI18n({
    locale: "ja",
    fallbackLocale: "ja",
    messages: {
        ja,
        en,
        ko,
        "zh-CN": zh_cn,
        "zh-TW": zh_tw,
    },
});

export default i18n;
