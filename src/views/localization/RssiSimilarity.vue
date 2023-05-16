<template>
    <v-layout class="w-full h-full">
        <LoadingOverlay v-model="isCurrentlyLoading" />
        <BaseMap>
            <template #map-layers>
                <SingleGatewayMarker
                    v-for="eachRssiSimilarityParameter in rssiSimilaritySelectionParameters"
                    :key="eachRssiSimilarityParameter.gatewayData.id"
                    :gateway-data="eachRssiSimilarityParameter.gatewayData"
                />

                <SingleDeviceGPSDatapointMarker
                    v-for="(eachDeviceGPSDatapoint, index) in deviceGPSDatapoints"
                    :key="index"
                    :device-gps-datapoint-data="eachDeviceGPSDatapoint"
                />

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
                <v-card-title>RSSI similarity</v-card-title>
                <v-card-text>
                    <RssiSimilarityParametersSelect
                        v-model:rssi-similarity-selection-parameters="rssiSimilaritySelectionParameters"
                        v-model:rssi-checking-range="rssiCheckingRange"
                        @actual-device-location-updated="actualDeviceLocation = $event"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-btn block :loading="isCurrentlyLoading" color="primary" @click.prevent="loadSimilarityData">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import Constants from '@/other/Constants';

// Components
import BaseMap from '@/components/BaseMap.vue';
import SingleGatewayMarker from '@/components/map/markers/SingleGatewayMarker.vue';
import SingleDeviceGPSDatapointMarker from '@/components/map/markers/SingleDeviceGPSDatapointMarker.vue';
import ActualDeviceLocationMarker from '@/components/map/markers/ActualDeviceLocationMarker.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import RssiSimilarityParametersSelect from '@/components/selection/RssiSimilarityParametersSelect.vue';

// Types
import { LatLng } from 'leaflet';
import { GatewayRssiSelection } from '@/types/Gateways';
import {
    DeviceGPSDatapoint,
    mapTtnLocatorApiResponseToDeviceGPSDatapoint,
    TtnLocatorDeviceGPSDatapoint,
} from '@/types/GPSDatapoints';
import GatewayUtils from '@/utils/GatewayUtils';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

const axios = injectStrict(AxiosKey);

const showFilteringDialog = ref(false);
const isCurrentlyLoading = ref(false);

const rssiSimilaritySelectionParameters: Ref<GatewayRssiSelection[]> = ref([
    {
        gatewayData: {
            id: 'hfu-lr8-001',
            location: new LatLng(0, 0),
        },
        rssi: -105,
    },
    {
        gatewayData: {
            id: 'eui-a840411fcbc04150',
            location: new LatLng(0, 0),
        },
        rssi: -124,
        deviceGpsDatapoints: [],
    },
    {
        gatewayData: {
            id: '68068734-f17f-4ec2-ac0d-5ec7332d5e4e',
            location: new LatLng(0, 0),
        },
        rssi: -111,
    },
    {
        gatewayData: {
            id: 'eui-a84041203275aeac',
            location: new LatLng(0, 0),
        },
        rssi: -81,
    },
]);

const deviceGPSDatapoints: Ref<DeviceGPSDatapoint[]> = ref([]);

const rssiCheckingRange: Ref<number> = ref(Constants.DEFAULT_RSSI_CHECKING_RANGE);

const actualDeviceLocation: Ref<DeviceGPSDatapoint | null> = ref(null);

function loadGatewayLocations() {
    rssiSimilaritySelectionParameters.value.forEach(async (eachRssiSimilarityParameter: GatewayRssiSelection) => {
        const gatewayLocation = await GatewayUtils.getGatewayLocationForGatewayId(
            eachRssiSimilarityParameter.gatewayData.id,
        );
        if (gatewayLocation === null) {
            return;
        }
        eachRssiSimilarityParameter.gatewayData.location = gatewayLocation;
    });
}

async function loadSimilarityData() {
    console.info(`Loading gateway similarity data for ${rssiSimilaritySelectionParameters.value.length} gateways`);
    isCurrentlyLoading.value = true;

    await loadGatewayLocations();

    const similarityFilter = rssiSimilaritySelectionParameters.value.map((eachRssiSimilarityParameter) => {
        return {
            gatewayId: eachRssiSimilarityParameter.gatewayData.id,
            minRssi: eachRssiSimilarityParameter.rssi - rssiCheckingRange.value,
            maxRssi: eachRssiSimilarityParameter.rssi + rssiCheckingRange.value,
        };
    });

    console.debug('Sending request with similarity filter', similarityFilter);

    await axios
        .post('/device_gps_datapoints/rssi_similarity', {
            similarityFilter: similarityFilter,
        })
        .then((response: AxiosResponse<{ message: string; data: TtnLocatorDeviceGPSDatapoint[] }>) => {
            const parsedData: TtnLocatorDeviceGPSDatapoint[] = response.data.data;

            deviceGPSDatapoints.value = parsedData.map(mapTtnLocatorApiResponseToDeviceGPSDatapoint);

            console.debug(`Got ${parsedData.length} GPS datapoints for similarity filter`, similarityFilter);
        });

    isCurrentlyLoading.value = false;
    showFilteringDialog.value = false;
    console.info('Finished loading gateway similarity data');
}
</script>
