import Item from "./pages/ItemDetail.vue";
import Top from "./pages/TopPage.vue";
import Howto from "./pages/HowtoPage.vue";
import { createRouter, createWebHashHistory } from "vue-router";

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
        path: "/howto",
        name: "Howto",
        component: Howto
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});

export default router;
