import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
    { path: '/gateway_rssi', name: 'gateway_rssi', component: () => import('@/views/GatewayRSSI.vue') },
    {
        path: '/rssi_range_graph/:gatewayID',
        name: 'rssi_range_graph',
        component: () => import('@/views/GatewayRSSIRangeGraph.vue'),
    },
    { path: '/manage/devices', name: 'manage_devices', component: () => import('@/views/manage/DevicesManage.vue') },
    // Catch all 404
    { path: '/:pathMatch(.*)*', name: 'not_found', component: () => import('@/views/NotFound.vue') },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
