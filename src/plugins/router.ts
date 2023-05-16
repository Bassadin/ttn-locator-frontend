import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomePage.vue'),
        meta: {
            title: 'Home',
        },
    },
    // Device-based
    {
        path: '/rssi_similarity',
        name: 'rssi_similarity',
        component: () => import('@/views/localization/RssiSimilarity.vue'),
        meta: {
            title: 'RSSI similarity',
        },
    },

    // Gateway-based
    {
        path: '/gateway_rssi/:gatewayId',
        name: 'gateway_rssi',
        component: () => import('@/views/localization/GatewayRSSI.vue'),
        meta: {
            title: 'Gateway Range (RSSI)',
        },
    },
    {
        path: '/rssi_range_graph/:gatewayId',
        name: 'rssi_range_graph',
        component: () => import('@/views/localization/GatewayRSSIRangeGraph.vue'),
        meta: {
            title: 'RSSI Range Graph',
        },
    },

    // Manage pages
    {
        path: '/manage/devices',
        name: 'manage_devices',
        component: () => import('@/views/manage/DevicesManage.vue'),
        meta: {
            title: 'Manage Devices',
        },
    },
    {
        path: '/manage/gateways',
        name: 'manage_gateways',
        component: () => import('@/views/manage/GatewaysManage.vue'),
        meta: {
            title: 'Manage Gateways',
        },
    },
    // Catch all 404
    {
        path: '/:pathMatch(.*)*',
        name: 'not_found',
        component: () => import('@/views/NotFound.vue'),
        meta: {
            title: '404 Not Found',
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const DEFAULT_TITLE = 'Default Title';
router.afterEach((to, _from) => {
    document.title = (to.meta?.title ?? DEFAULT_TITLE).toString();
});

export default router;
