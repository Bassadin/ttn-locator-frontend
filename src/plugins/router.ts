import { createRouter, createWebHistory } from 'vue-router';

// Routes
import Home from '@/views/HomePage.vue';
import GatewayRSSI from '@/views/GatewayRSSI.vue';
import GatewayRSSIRangeGraph from '@/views/GatewayRSSIRangeGraph.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/gateway_rssi', component: GatewayRSSI },
    { path: '/rssi_range_graph', component: GatewayRSSIRangeGraph },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
