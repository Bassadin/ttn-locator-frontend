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

    // Localization
    {
        path: '/rssi_to_range_multilateration',
        name: 'rssi_to_range_multilateration',
        component: () => import('@/views/localization/RssiToRangeMultilateration.vue'),
        meta: {
            title: 'RSSI to Range Multilateration',
        },
    },
    {
        path: '/fingerprinting',
        name: 'fingerprinting',
        component: () => import('@/views/localization/RssiSimilarity.vue'),
        meta: {
            title: 'Fingerprinting',
        },
    },
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
    {
        path: '/snr_range_graph/:gatewayId',
        name: 'snr_range_graph',
        component: () => import('@/views/localization/GatewaySNRRangeGraph.vue'),
        meta: {
            title: 'SNR Range Graph',
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

    // Stats pages
    {
        path: '/stats/device_gps_datapoints',
        name: 'device_gps_datapoints_stats',
        component: () => import('@/views/stats/DeviceGpsDatapointsStats.vue'),
        meta: {
            title: 'Device GPS Datapoints Stats',
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
