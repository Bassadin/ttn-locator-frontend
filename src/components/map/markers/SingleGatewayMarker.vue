<template>
    <l-circle-marker :lat-lng="gatewayData.location" :radius="6" color="red">
        <l-popup>
            <b>Gateway ID:</b>{{ gatewayData.id }}<br />
            <b>Location:</b> {{ gatewayData.location }}
        </l-popup>
        <l-tooltip :options="{ offset: L.point({ x: 15, y: 0 }) }"> <b>Gateway:</b> {{ gatewayData.id }} </l-tooltip>
    </l-circle-marker>
</template>

<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GatewayData } from '@/types/Gateways';

import { LCircleMarker, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet';

import type { PropType } from 'vue';

defineProps({
    gatewayData: {
        type: Object as PropType<GatewayData>,
        required: true,
    },
});
</script>
