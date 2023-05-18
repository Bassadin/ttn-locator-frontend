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
                            :min="Constants.MIN_SELECTABLE_RSSI"
                            :max="Constants.MAX_SELECTABLE_RSSI"
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
import Constants from '@/other/Constants';
import { onMounted, ref, Ref } from 'vue';

// Router
import { useRoute } from 'vue-router';
const route = useRoute();

// Components
import BaseMap from '@/components/BaseMap.vue';

const showFilteringDialog = ref(false);

// Components
import SingleGatewayMarker from '@/components/map/markers/SingleGatewayMarker.vue';
import SingleDeviceGPSDatapointMarker from '@/components/map/markers/SingleDeviceGPSDatapointMarker.vue';

// Types
import { LatLng } from 'leaflet';
import GatewayData from '@/types/Gateways/GatewayData';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import GatewayUtils from '@/utils/GatewayUtils';
import DeviceGPSDatapoint from '@/types/DeviceGpsDatapoints/DeviceGPSDatapoint';

const gatewayID = ref(route.params.gatewayId.toString());
const gatewayData: Ref<GatewayData> = ref({} as GatewayData);
const selectedRSSIRange = ref([-100, -95]);

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

    const gatewayLocationPromise = GatewayUtils.getGatewayLocationForGatewayId(gatewayID.value)
        .then((location: LatLng | null) => {
            if (!location) {
                alert('Gateway not found');
                return;
            }

            gatewayData.value = {
                id: gatewayID.value,
                location: location,
            };
        })
        .catch(() => {
            alert('Gateway not found');
        });

    const ttnMapperPromise = GatewayUtils.getLastXDaysGpsDatapointsForGatewayId(
        gatewayID.value,
        selectedRSSIRange.value[0],
        selectedRSSIRange.value[1],
    ).then((responseData) => {
        const parsedData: DeviceGPSDatapoint[] = responseData.map((eachDeviceGPSDatapoint) =>
            eachDeviceGPSDatapoint.toNormalGpsDatapoint(),
        );

        gpsDatapointsWithRSSIValues.value = parsedData;
    });

    Promise.all([gatewayLocationPromise, ttnMapperPromise]).finally(() => {
        isCurrentlyLoading.value = false;
        showFilteringDialog.value = false;
    });
}
</script>
