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
import {
    DeviceGPSDatapoint,
    TtnLocatorDeviceGPSDatapoint,
    mapTtnLocatorApiResponseToDeviceGPSDatapoint,
} from '@/types/GPSDatapoints';

// Axios instance
const axios = injectStrict(AxiosKey);

const deviceGpsDatapointsLocations: Ref<DeviceGPSDatapoint[]> = ref([]);

onMounted(() => {
    console.info("Fetching device GPS datapoints from TTN Locator's API...");
    axios
        .get('/device_gps_datapoints', {
            params: {
                min_ttnmapper_datapoints: 3,
            },
        })
        .then(
            (
                response: AxiosResponse<{
                    data: TtnLocatorDeviceGPSDatapoint[];
                }>,
            ) => {
                console.info(`Fetched ${response.data.data.length} device GPS datapoints from TTN Locator's API.`);
                deviceGpsDatapointsLocations.value = response.data.data.map(
                    mapTtnLocatorApiResponseToDeviceGPSDatapoint,
                );
                console.info(
                    `Mapped ${response.data.data.length} device GPS datapoints from TTN Locator's API to internal format.`,
                );
            },
        );
});
</script>
