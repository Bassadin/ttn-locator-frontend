<template>
    <l-layer-group ref="gps_points_layer">
        <l-circle-marker
            v-for="(eachDeviceGPSPoint, index) in deviceGpsDatapointsLocations"
            :key="index"
            :lat-lng="eachDeviceGPSPoint.location"
            :radius="3"
        >
            <l-popup>
                <b>Device ID:</b> {{ eachDeviceGPSPoint.deviceId }}<br />
                <b>Location:</b> {{ eachDeviceGPSPoint.location }}
            </l-popup>
            <l-tooltip :options="{ offset: L.point({ x: 15, y: 0 }) }">
                <b>Location:</b> {{ eachDeviceGPSPoint.location }}
            </l-tooltip>
        </l-circle-marker>
    </l-layer-group>
</template>

<script setup lang="ts">
import * as L from 'leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LCircleMarker, LLayerGroup, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet';
import { Ref, onMounted, ref } from 'vue';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

const axios = injectStrict(AxiosKey);

type DeviceGPSDatapointAPIResponse = {
    data: {
        id: number;
        timestamp: string;
        deviceId: string;
        latitude: number;
        longitude: number;
        altitude: number;
        hdop: number;
    }[];
};

type DeviceGPSDatapoint = {
    deviceId: string;
    location: LatLng;
};

let deviceGpsDatapointsLocations: Ref<DeviceGPSDatapoint[]> = ref([]);

onMounted(() => {
    axios.get('/device_gps_datapoints').then((response: AxiosResponse<DeviceGPSDatapointAPIResponse>) => {
        deviceGpsDatapointsLocations.value = response.data.data.map((eachDeviceGPSDatapoint) => ({
            deviceId: eachDeviceGPSDatapoint.deviceId,
            location: new LatLng(eachDeviceGPSDatapoint.latitude, eachDeviceGPSDatapoint.longitude),
        }));
    });
});
</script>
