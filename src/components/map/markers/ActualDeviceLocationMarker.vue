<template>
    <l-marker :lat-lng="deviceGpsDatapointData.location">
        <l-popup>
            <h3>Actual Device Location</h3>
            <h2 class="mb-2">
                <v-icon icon="mdi-cellphone-marker" size="small"></v-icon> {{ deviceGpsDatapointData.deviceId }}
            </h2>
            <b>GPS Datapoint DB ID:</b> {{ deviceGpsDatapointData.id }}<br />
            <b>Location:</b><br />
            <v-icon icon="mdi-latitude" /> {{ deviceGpsDatapointData.location.lat }}<br />
            <v-icon icon="mdi-longitude" /> {{ deviceGpsDatapointData.location.lng }}<br />
        </l-popup>
        <l-tooltip :options="{ offset: L.point({ x: 15, y: 0 }) }">
            <h2>{{ deviceGpsDatapointData.deviceId }}</h2>
            <b>Location:</b> {{ deviceGpsDatapointData.location }}
        </l-tooltip>
    </l-marker>
</template>

<script setup lang="ts">
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { LMarker, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet';

import type { PropType } from 'vue';
import DeviceGPSDatapoint from '@/types/DeviceGpsDatapoints/DeviceGPSDatapoint';

defineProps({
    deviceGpsDatapointData: {
        type: Object as PropType<DeviceGPSDatapoint>,
        required: true,
    },
});
</script>
