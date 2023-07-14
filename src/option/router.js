import Item from './components/Item.vue'
import Top from './components/Top.vue'
import Howto from './components/Howto.vue'
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