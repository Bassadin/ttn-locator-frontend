<template>
    <v-layout class="w-full h-full">
        <LoadingOverlay v-model="isCurrentlyLoading" />
        <BaseMap>
            <template #map-layers>
                <SingleGatewayMarker
                    v-for="eachRssiSimilarityParameter in gatewayRssiSelectionParameters"
                    :key="eachRssiSimilarityParameter.gatewayData.id"
                    :gateway-data="eachRssiSimilarityParameter.gatewayData"
                />

                <l-circle
                    v-for="eachGatewayRssiParameter in gatewayRssiSelectionParameters"
                    :key="eachGatewayRssiParameter.gatewayData.id"
                    :lat-lng="eachGatewayRssiParameter.gatewayData.location"
                    :radius="getRadiusRangeForRssi(eachGatewayRssiParameter.rssi) + 100"
                    color="#1976D2"
                    :fill="false"
                    :weight="2"
                ></l-circle>
                <l-circle
                    v-for="eachGatewayRssiParameter in gatewayRssiSelectionParameters"
                    :key="eachGatewayRssiParameter.gatewayData.id"
                    :lat-lng="eachGatewayRssiParameter.gatewayData.location"
                    :radius="getRadiusRangeForRssi(eachGatewayRssiParameter.rssi) - 100"
                    color="#1976D2"
                    :fill="false"
                    :weight="2"
                ></l-circle>

                <ActualDeviceLocationMarker
                    v-if="actualDeviceLocation"
                    :device-gps-datapoint-data="actualDeviceLocation"
                />
            </template>
        </BaseMap>
        <v-dialog v-model="showFilteringDialog" min-width="50vw" width="auto">
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
                <v-card-title>RSSI to range multilateration</v-card-title>
                <v-card-text>
                    <GatewayRssiParametersSelect
                        v-model:rssi-similarity-selection-parameters="gatewayRssiSelectionParameters"
                        @actual-device-location-updated="actualDeviceLocation = $event"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-btn block :loading="isCurrentlyLoading" color="primary" @click.prevent="loadGatewayLocationData">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

// Components
import BaseMap from '@/components/BaseMap.vue';
import SingleGatewayMarker from '@/components/map/markers/SingleGatewayMarker.vue';
import ActualDeviceLocationMarker from '@/components/map/markers/ActualDeviceLocationMarker.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { LCircle } from '@vue-leaflet/vue-leaflet';
import GatewayRssiParametersSelect from '@/components/selection/GatewayRssiParametersSelect.vue';

// Types
import { GatewayRssiSelection } from '@/types/Gateways';
import { DeviceGPSDatapoint } from '@/types/GPSDatapoints';
import GatewayUtils from '@/utils/GatewayUtils';

// Axios
// import { injectStrict } from '@/utils/injectTyped';
// import { AxiosKey } from '@/symbols';
// import { AxiosResponse } from 'axios';

// const axios = injectStrict(AxiosKey);

const showFilteringDialog = ref(false);
const isCurrentlyLoading = ref(false);

const gatewayRssiSelectionParameters: Ref<GatewayRssiSelection[]> = ref([]);

const actualDeviceLocation: Ref<DeviceGPSDatapoint | null> = ref(null);

function loadGatewayLocationData() {
    isCurrentlyLoading.value = true;

    gatewayRssiSelectionParameters.value.forEach(async (eachRssiSimilarityParameter: GatewayRssiSelection) => {
        const gatewayLocation = await GatewayUtils.getGatewayLocationForGatewayId(
            eachRssiSimilarityParameter.gatewayData.id,
        );
        if (gatewayLocation === null) {
            return;
        }
        eachRssiSimilarityParameter.gatewayData.location = gatewayLocation;
    });

    isCurrentlyLoading.value = false;
    showFilteringDialog.value = false;
    console.info('Finished loading gateway data');
}

function getRadiusRangeForRssi(rssi: number): number {
    const radius = 20 * rssi + 3500;
    return radius;
}
</script>
