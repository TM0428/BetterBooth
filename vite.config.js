import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

const root = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), VueI18nPlugin({ compositionOnly: false })],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
                quietDeps: true
            },
            sass: {
                api: "modern-compiler",
                quietDeps: true
            }
        }
    },
    build: {
        rollupOptions: {
            input: {
                popup: resolve(root, "popup", "popup.html"),
                option: resolve(root, "option", "option.html")
            },
            output: {
                // entry chunk assets それぞれの書き出し名の指定
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        },
        emptyOutDir: false
    }
});
