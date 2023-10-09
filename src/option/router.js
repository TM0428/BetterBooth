import Item from './pages/ItemDetail.vue'
import Top from './pages/Top.vue'
import Howto from './pages/Howto.vue'
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";


const routes = [
    {
        path: '/item/:itemId',
        name: 'Item',
        component: Item,
        props: true
    },
    {
        path: '/',
        name: 'Top',
        component: Top
    },
    {
        path: '/howto',
        name: 'Howto',
        component: Howto
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router