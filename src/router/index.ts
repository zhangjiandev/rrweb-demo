// src/router/index.ts
import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import IndexMm from '@/views/index-rrweb.vue'
import OtherPage from '@/views/other.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Index',
        component: IndexMm,
    },
    {
        path: '/other',
        name: 'Other',
        component: OtherPage,
    },
]

const router = new VueRouter({
    mode: 'hash',
    routes,
})

export default router
