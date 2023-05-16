<template>
    <v-layout class="w-full h-full">
        <LoadingOverlay v-model="isCurrentlyLoading" />
        <BaseMap>
            <template #map-layers>
                <!-- <SingleGatewayMarker
                    v-for="eachRssiSimilarityParameter in rssiSimilaritySelectionParameters"
                    :key="eachRssiSimilarityParameter.gatewayData.id"
                    :gateway-data="eachRssiSimilarityParameter.gatewayData"
                /> -->

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
                    <p>TODO</p>
                </v-card-text>
                <v-card-actions>
                    <!-- <v-btn block :loading="isCurrentlyLoading" color="primary" @click.prevent="loadSimilarityData">
                        Submit
                    </v-btn> -->
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

// Components
import BaseMap from '@/components/BaseMap.vue';
// import SingleGatewayMarker from '@/components/map/markers/SingleGatewayMarker.vue';
import ActualDeviceLocationMarker from '@/components/map/markers/ActualDeviceLocationMarker.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

// Types
// import { GatewayRssiSelection } from '@/types/Gateways';
import { DeviceGPSDatapoint } from '@/types/GPSDatapoints';
// import GatewayUtils from '@/utils/GatewayUtils';

// Axios
// import { injectStrict } from '@/utils/injectTyped';
// import { AxiosKey } from '@/symbols';
// import { AxiosResponse } from 'axios';

// const axios = injectStrict(AxiosKey);

const showFilteringDialog = ref(false);
const isCurrentlyLoading = ref(false);

const actualDeviceLocation: Ref<DeviceGPSDatapoint | null> = ref(null);

// function loadGatewayLocations() {
//     rssiSimilaritySelectionParameters.value.forEach(async (eachRssiSimilarityParameter: GatewayRssiSelection) => {
//         const gatewayLocation = await GatewayUtils.getGatewayLocationForGatewayId(
//             eachRssiSimilarityParameter.gatewayData.id,
//         );
//         if (gatewayLocation === null) {
//             return;
//         }
//         eachRssiSimilarityParameter.gatewayData.location = gatewayLocation;
//     });
// }
</script>
