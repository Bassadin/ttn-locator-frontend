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

                <l-circle
                    v-if="estimatedPosition"
                    :lat-lng="estimatedPosition"
                    :radius="estimatedPositionRadius"
                    color="orange"
                >
                    <l-tooltip :options="{ offset: L.point({ x: estimatedPositionRadius / 3 + 10, y: 0 }) }">
                        <b>Error radius:</b> {{ estimatedPositionRadius }} m
                    </l-tooltip>
                </l-circle>
            </template>
        </BaseMap>
        <!-- Need the eager here since otherwise the refs reset every time the dialog gets opened -->
        <v-dialog v-model="showFilteringDialog" min-width="50vw" width="auto" eager>
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
                <v-card-title>Fingerprinting</v-card-title>
                <v-card-text>
                    <GatewaySimilarityParametersSelect
                        v-model:rssi-similarity-selection-parameters="rssiSimilaritySelectionParameters"
                        @actual-device-location-updated="actualDeviceLocation = $event"
                    />
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model.number="rssiCheckingRange"
                                label="RSSI checking range (+/-)"
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                            ></v-text-field>
                        </v-col>
                    </v-row>
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
import GatewaySimilarityParametersSelect from '@/components/selection/GatewaySimilarityParametersSelect.vue';
import * as L from 'leaflet';
import { LCircle, LTooltip } from '@vue-leaflet/vue-leaflet';

// Types
import { GatewaySimilarityParameterSelection } from '@/types/Gateways';
import {
    DeviceGPSDatapoint,
    mapTtnLocatorApiResponseToDeviceGPSDatapoint,
    TtnLocatorDeviceGPSDatapoint,
} from '@/types/GPSDatapoints';
import GatewayUtils from '@/utils/GatewayUtils';
import { LatLng } from 'leaflet';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';
import { findCenterOfLatLongsWithHalfCoveringRadius } from '@/utils/Localization';

const axios = injectStrict(AxiosKey);

const showFilteringDialog = ref(false);
const isCurrentlyLoading = ref(false);
const rssiSimilaritySelectionParameters: Ref<GatewaySimilarityParameterSelection[]> = ref([]);
const estimatedPosition: Ref<LatLng | null> = ref(null);
const estimatedPositionRadius: Ref<number> = ref(50);
const deviceGPSDatapoints: Ref<DeviceGPSDatapoint[]> = ref([]);
const rssiCheckingRange: Ref<number> = ref(Constants.DEFAULT_RSSI_CHECKING_RANGE);
const actualDeviceLocation: Ref<DeviceGPSDatapoint | null> = ref(null);

function loadGatewayLocations() {
    rssiSimilaritySelectionParameters.value.forEach(
        async (eachRssiSimilarityParameter: GatewaySimilarityParameterSelection) => {
            const gatewayLocation = await GatewayUtils.getGatewayLocationForGatewayId(
                eachRssiSimilarityParameter.gatewayData.id,
            );
            if (gatewayLocation === null) {
                return;
            }
            eachRssiSimilarityParameter.gatewayData.location = gatewayLocation;
        },
    );
}

async function loadSimilarityData() {
    console.info(`Loading gateway similarity data for ${rssiSimilaritySelectionParameters.value.length} gateways`);
    isCurrentlyLoading.value = true;
    estimatedPosition.value = null;

    await loadGatewayLocations();

    const similarityFilter = rssiSimilaritySelectionParameters.value.map((eachRssiSimilarityParameter) => {
        return {
            gatewayId: eachRssiSimilarityParameter.gatewayData.id,
            minRssi: eachRssiSimilarityParameter.rssi - rssiCheckingRange.value,
            maxRssi: eachRssiSimilarityParameter.rssi + rssiCheckingRange.value,
        };
    });

    console.debug('Sending request with similarity filter', similarityFilter);

    const deviceGpsDatapointsResponse: AxiosResponse<{ message: string; data: TtnLocatorDeviceGPSDatapoint[] }> =
        await axios.post('/device_gps_datapoints/rssi_similarity', {
            similarityFilter: similarityFilter,
        });

    const parsedData: TtnLocatorDeviceGPSDatapoint[] = deviceGpsDatapointsResponse.data.data;
    deviceGPSDatapoints.value = parsedData.map(mapTtnLocatorApiResponseToDeviceGPSDatapoint);

    const cirleData = findCenterOfLatLongsWithHalfCoveringRadius(
        parsedData.map((eachParsedData) => {
            return new LatLng(eachParsedData.latitude, eachParsedData.longitude);
        }),
    );

    estimatedPosition.value = cirleData.center;
    estimatedPositionRadius.value = cirleData.radius;

    console.info(`Estimated position as: ${estimatedPosition.value}`);

    console.debug(`Got ${parsedData.length} GPS datapoints for similarity filter`, similarityFilter);

    isCurrentlyLoading.value = false;
    showFilteringDialog.value = false;
    console.info('Finished loading gateway similarity data');
}
</script>
