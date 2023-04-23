<template>
    <l-layer-group ref="gps_points_layer">
        <SingleDeviceGPSDatapointMarker
            v-for="(eachDeviceGPSDatapoint, index) in deviceGpsDatapointsLocations"
            :key="index"
            :device-gps-datapoint-data="eachDeviceGPSDatapoint"
        ></SingleDeviceGPSDatapointMarker>
    </l-layer-group>
</template>

<script setup lang="ts">
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LLayerGroup } from '@vue-leaflet/vue-leaflet';
import { Ref, onMounted, ref } from 'vue';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

// Components
import SingleDeviceGPSDatapointMarker from '@/components/map/markers/SingleDeviceGPSDatapointMarker.vue';

// Types
import { DeviceGPSDatapoint, DeviceGPSDatapointTTNLocatorAPIResponse } from '@/types/GPSDatapoints';

// Axios instance
const axios = injectStrict(AxiosKey);

let deviceGpsDatapointsLocations: Ref<DeviceGPSDatapoint[]> = ref([]);

onMounted(() => {
    axios.get('/device_gps_datapoints').then((response: AxiosResponse<DeviceGPSDatapointTTNLocatorAPIResponse>) => {
        deviceGpsDatapointsLocations.value = response.data.data.map((eachDeviceGPSDatapoint) => ({
            deviceId: eachDeviceGPSDatapoint.deviceId,
            location: new LatLng(eachDeviceGPSDatapoint.latitude, eachDeviceGPSDatapoint.longitude),
        }));
    });
});
</script>
