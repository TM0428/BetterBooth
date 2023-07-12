import Item from './components/Item.vue'
import Top from './components/Top.vue'
import { createRouter, createWebHistory } from "vue-router";


const routes = [
    {
        path: '/src/option/item/:itemId',
        name: 'Item',
        component: Item,
        props: true
    },
    {
        path: '/src/option/option.html',
        name: 'Top',
        component: Top
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router