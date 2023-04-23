import { createRouter, createWebHistory } from 'vue-router';

// Routes
import Home from '@/views/HomePage.vue';
import GatewayRSSI from '@/views/GatewayRSSI.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/gateway_rssi', component: GatewayRSSI },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
