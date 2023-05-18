<template>
    <l-marker :lat-lng="gatewayData.location">
        <l-icon :icon-anchor="[16, 16]" class-name="gateway-leaflet-icon">
            <div class="p-1 rounded-full w-8 h-8 flex justify-center items-center" style="background-color: #1976d2">
                <v-icon icon="mdi-antenna" size="large" color="white"></v-icon>
            </div>
        </l-icon>

        <l-popup :options="{ offset: L.point({ x: 0, y: -10 }) }">
            <h3>Gateway</h3>
            <h2 class="mb-2"><v-icon icon="mdi-antenna" size="small"></v-icon> {{ gatewayData.id }}</h2>
            <b>Location:</b><br />
            <v-icon icon="mdi-latitude" /> {{ gatewayData.location.lat }}<br />
            <v-icon icon="mdi-longitude" /> {{ gatewayData.location.lng }}<br />
            <v-btn
                class="mt-2"
                color="primary"
                size="small"
                :to="`/rssi_range_graph/${gatewayData.id}`"
                target="_blank"
                block
            >
                Gateway range graph
            </v-btn>
            <v-btn
                class="mt-2"
                color="primary"
                size="small"
                :to="`/gateway_rssi/${gatewayData.id}`"
                target="_blank"
                block
            >
                Gateway RSSI range
            </v-btn>
        </l-popup>
        <l-tooltip :options="{ offset: L.point({ x: 20, y: 0 }) }"> <b>Gateway:</b> {{ gatewayData.id }} </l-tooltip>
    </l-marker>
</template>

<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import GatewayData from '@/types/Gateways/GatewayData';

import { LMarker, LPopup, LTooltip, LIcon } from '@vue-leaflet/vue-leaflet';

import type { PropType } from 'vue';

defineProps({
    gatewayData: {
        type: Object as PropType<GatewayData>,
        required: true,
    },
});
</script>

<style scoped>
.gateway-leaflet-icon {
    border: none !important;
    background: none !important;
}
</style>
