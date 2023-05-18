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
import DeviceGPSDatapoint from '@/types/DeviceGpsDatapoints/DeviceGPSDatapoint';
import TtnLocatorDeviceGPSDatapoint from '@/types/DeviceGpsDatapoints/TtnLocatorDeviceGPSDatapoint';

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

                const responseData = response.data.data;

                deviceGpsDatapointsLocations.value = response.data.data.map((eachDeviceGPSDatapointJSON) =>
                    new DeviceGPSDatapoint(
                        eachDeviceGPSDatapointJSON.deviceId,
                         eachDeviceGPSDatapointJSON,
                         eachDeviceGPSDatapointJSON.hdop,
                         eachDeviceGPSDatapointJSON.id
                    ),
                    )

                eachDeviceGPSDatapoint.mapToDeviceGPSDatapoint(),
                );
                console.info(
                    `Mapped ${response.data.data.length} device GPS datapoints from TTN Locator's API to internal format.`,
                );
            },
        );
});
</script>
