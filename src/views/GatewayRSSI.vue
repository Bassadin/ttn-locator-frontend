<template>
    <BaseMap>
        <template #map-layers>
            <SingleGatewayMarker v-if="gatewayData" :gateway-data="gatewayData" />
            <SingleDeviceGPSDatapointMarker
                v-for="(eachDeviceGPSDatapoint, index) in gpsDatapointsWithRSSIValues"
                :key="index"
                :device-gps-datapoint-data="eachDeviceGPSDatapoint"
            ></SingleDeviceGPSDatapointMarker>
        </template>
    </BaseMap>
    <v-card class="absolute bottom-5 right-5 z-900" width="500">
        <v-card-text>
            <v-form @submit.prevent>
                <v-text-field v-model="gatewayID" label="Gateway ID"></v-text-field>
                <v-range-slider
                    v-model="selectedRSSIRange"
                    class="mt-8"
                    strict
                    label="RSSI Range"
                    :min="-130"
                    :max="0"
                    step="5"
                    thumb-label="always"
                ></v-range-slider>
                <v-btn @click="getGatewayData">Button</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, Ref } from 'vue';

// Components
import BaseMap from '@/components/BaseMap.vue';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';
import { LatLng } from 'leaflet';

// Components
import SingleGatewayMarker from '@/components/map/markers/SingleGatewayMarker.vue';
import SingleDeviceGPSDatapointMarker from '@/components/map/markers/SingleDeviceGPSDatapointMarker.vue';

// Types
import { GatewayData } from '@/types/Gateways';
import { DeviceGPSDatapoint, TTNMapperDeviceGPSDatapoint } from '@/types/GPSDatapoints';

// Axios instance
const axios = injectStrict(AxiosKey);

const gatewayID = ref('68068734-f17f-4ec2-ac0d-5ec7332d5e4e');
const gatewayData: Ref<GatewayData> = ref({} as GatewayData);
const selectedRSSIRange = ref([-110, -90]);

const gpsDatapointsWithRSSIValues: Ref<DeviceGPSDatapoint[]> = ref([]);

onBeforeMount(() => {
    getGatewayData();
});

function getGatewayData() {
    axios
        .get(`https://mapper.packetbroker.net/api/v2/gateways/netID=000013,tenantID=ttn,id=${gatewayID.value}`)
        .then((response: AxiosResponse) => {
            const responseData = response.data;

            const location = new LatLng(responseData.location.latitude, responseData.location.longitude);

            console.debug(location);

            gatewayData.value = {
                id: responseData.id,
                location: location,
            };
        });

    axios
        .get(
            `https://api.ttnmapper.org/gateway/data?gateway_id=${gatewayID.value}&start_time=2023-04-01T22%3A00%3A00.000Z`,
        )
        .then((response: AxiosResponse) => {
            const responseData: TTNMapperDeviceGPSDatapoint[] = response.data;

            const filteredData: TTNMapperDeviceGPSDatapoint[] = responseData.filter(
                (eachResponseDataObject: TTNMapperDeviceGPSDatapoint) => {
                    return (
                        eachResponseDataObject.rssi >= selectedRSSIRange.value[0] &&
                        eachResponseDataObject.rssi <= selectedRSSIRange.value[1]
                    );
                },
            );

            const parsedData: DeviceGPSDatapoint[] = filteredData.map((eachDeviceGPSDatapoint) => ({
                deviceId: eachDeviceGPSDatapoint.dev_id,
                location: new LatLng(eachDeviceGPSDatapoint.latitude, eachDeviceGPSDatapoint.longitude),
            }));

            gpsDatapointsWithRSSIValues.value = parsedData;
        });
}
</script>
