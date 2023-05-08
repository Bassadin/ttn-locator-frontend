<template>
    <v-layout class="w-full h-full">
        <LoadingOverlay v-model="isCurrentlyLoading" />
        <BaseMap>
            <template #map-layers>
                <SingleGatewayMarker v-if="gatewayData.location" :gateway-data="gatewayData" />
                <SingleDeviceGPSDatapointMarker
                    v-for="(eachDeviceGPSDatapoint, index) in gpsDatapointsWithRSSIValues"
                    :key="index"
                    :device-gps-datapoint-data="eachDeviceGPSDatapoint"
                ></SingleDeviceGPSDatapointMarker>
            </template>
        </BaseMap>
        <v-dialog v-model="showFilteringDialog" min-width="40vw" width="auto">
            <template #activator="{ props }">
                <v-btn
                    v-bind="props"
                    color="primary"
                    icon="mdi-filter-cog"
                    size="x-large"
                    class="absolute bottom-6 right-6 z-900"
                >
                </v-btn>
            </template>
            <v-card>
                <v-card-title>RSSI Range Selector Settings</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveSelectedGatewayIDToUrlAndGetGatewayData">
                        <v-text-field v-model="gatewayID" label="Gateway ID"></v-text-field>
                        <v-range-slider
                            v-model="selectedRSSIRange"
                            class="mt-8"
                            strict
                            label="RSSI Range"
                            :min="-130"
                            :max="-30"
                            step="1"
                            thumb-label="always"
                        ></v-range-slider>
                        <v-row justify="center" class="mb-2">
                            <v-btn block type="submit" :loading="isCurrentlyLoading" color="primary">
                                Query TTN Mapper
                            </v-btn>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';

// Router
import { useRoute } from 'vue-router';
const route = useRoute();

// Components
import BaseMap from '@/components/BaseMap.vue';

const showFilteringDialog = ref(false);

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
import { DeviceGPSDatapoint, TTNMapperGatewayAPIDeviceGPSDatapoint } from '@/types/GPSDatapoints';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

// Axios instance
const axios = injectStrict(AxiosKey);

const gatewayID = ref(route.params.gatewayId.toString());
const gatewayData: Ref<GatewayData> = ref({} as GatewayData);
const selectedRSSIRange = ref([-110, -90]);

const gpsDatapointsWithRSSIValues: Ref<DeviceGPSDatapoint[]> = ref([]);

const isCurrentlyLoading = ref(false);

onMounted(() => {
    getGatewayData();
});

function saveSelectedGatewayIDToUrlAndGetGatewayData() {
    history.pushState({}, '', `/gateway_rssi/${gatewayID.value}`);
    getGatewayData();
}

function getGatewayData() {
    isCurrentlyLoading.value = true;

    const packetbrokerPromise = axios
        .get(`https://mapper.packetbroker.net/api/v2/gateways/netID=000013,tenantID=ttn,id=${gatewayID.value}`)
        .then((response: AxiosResponse) => {
            const responseData = response.data;

            const location = new LatLng(responseData.location.latitude, responseData.location.longitude);

            gatewayData.value = {
                id: responseData.id,
                location: location,
            };
        })
        .catch(() => {
            alert('Gateway not found');
        });

    const ttnMapperPromise = axios
        .get(
            `https://api.ttnmapper.org/gateway/data?gateway_id=${gatewayID.value}&start_time=2023-04-01T22%3A00%3A00.000Z`,
        )
        .then((response: AxiosResponse) => {
            const responseData: TTNMapperGatewayAPIDeviceGPSDatapoint[] = response.data;

            const filteredData: TTNMapperGatewayAPIDeviceGPSDatapoint[] = responseData.filter(
                (eachResponseDataObject: TTNMapperGatewayAPIDeviceGPSDatapoint) => {
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

    Promise.all([packetbrokerPromise, ttnMapperPromise]).finally(() => {
        isCurrentlyLoading.value = false;
        showFilteringDialog.value = false;
    });
}
</script>
