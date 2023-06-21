import { createApp } from 'vue';
import i18n from 'vue-plugin-webextension-i18n';
import App from './App.vue';
// import i18n from "./i18n";


createApp(App).use(i18n).mount('#app')
