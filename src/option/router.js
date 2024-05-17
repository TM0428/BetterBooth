import Item from "./pages/ItemDetailPage.vue";
import Top from "./pages/TopPage.vue";
import CustomShop from "./pages/CustomShopPage.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { getExtendedSettings } from "@/js/module/settings_data";

const routes = [
    {
        path: "/item/:itemId",
        name: "Item",
        component: Item,
        props: true
    },
    {
        path: "/",
        name: "Top",
        component: Top
    },
    {
        path: "/customshop",
        name: "CustomShop",
        component: CustomShop
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});

router.beforeEach(async () => {
    const extended_settings = await getExtendedSettings();
    if (extended_settings.save_item == false) {
        window.location.href = "/src/popup/popup.html";
        return false;
    }

    return true;
});

export default router;
