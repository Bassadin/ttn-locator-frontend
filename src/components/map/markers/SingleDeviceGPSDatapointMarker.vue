<template>
    <l-circle-marker :lat-lng="deviceGpsDatapointData.location" :radius="3">
        <l-popup>
            <b>Device ID:</b> {{ deviceGpsDatapointData.deviceId }}<br />
            <b>Location:</b> {{ deviceGpsDatapointData.location }}
        </l-popup>
        <l-tooltip :options="{ offset: L.point({ x: 15, y: 0 }) }">
            <b>Location:</b> {{ deviceGpsDatapointData.location }}
        </l-tooltip>
    </l-circle-marker>
</template>

<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { LCircleMarker, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet';

import type { PropType } from 'vue';
import { DeviceGPSDatapoint } from '@/types/GPSDatapoints';

defineProps({
    deviceGpsDatapointData: {
        type: Object as PropType<DeviceGPSDatapoint>,
        required: true,
    },
});
</script>
