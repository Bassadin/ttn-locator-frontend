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

                <l-geo-json
                    v-for="eachGeoJson in geoJsonCirclesArray"
                    :key="eachGeoJson.id"
                    :geojson="eachGeoJson"
                    :options="{ style: { color: '#1976D2', weight: 2, fill: false } }"
                ></l-geo-json>

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
                    <v-btn block :loading="isCurrentlyLoading" color="primary" @click.prevent="recalculate">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import * as turf from '@turf/turf';

// Components
import BaseMap from '@/components/BaseMap.vue';
import SingleGatewayMarker from '@/components/map/markers/SingleGatewayMarker.vue';
import ActualDeviceLocationMarker from '@/components/map/markers/ActualDeviceLocationMarker.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { LGeoJson } from '@vue-leaflet/vue-leaflet';
import GatewayRssiParametersSelect from '@/components/selection/GatewayRssiParametersSelect.vue';

// Types
import { GatewayRssiSelection } from '@/types/Gateways';
import { DeviceGPSDatapoint } from '@/types/GPSDatapoints';
import GatewayUtils from '@/utils/GatewayUtils';
import { GeoJSON } from 'leaflet';

const showFilteringDialog = ref(false);
const isCurrentlyLoading = ref(false);
const gatewayRssiSelectionParameters: Ref<GatewayRssiSelection[]> = ref([]);
const actualDeviceLocation: Ref<DeviceGPSDatapoint | null> = ref(null);
const geoJsonCirclesArray: Ref<GeoJSON.Feature[]> = ref([]);

async function recalculate() {
    isCurrentlyLoading.value = true;

    await loadGatewayLocationData();
    recalculateGeoJsonCirclesArray();

    showFilteringDialog.value = false;
    isCurrentlyLoading.value = false;
}

async function loadGatewayLocationData() {
    // https://stackoverflow.com/a/37576787/3526350
    await Promise.all(
        gatewayRssiSelectionParameters.value.map(async (eachRssiSimilarityParameter: GatewayRssiSelection) => {
            const gatewayLocation = await GatewayUtils.getGatewayLocationForGatewayId(
                eachRssiSimilarityParameter.gatewayData.id,
            );
            if (gatewayLocation === null) {
                return;
            }
            eachRssiSimilarityParameter.gatewayData.location = gatewayLocation;
        }),
    );

    console.info('Finished loading gateway data');
}

function recalculateGeoJsonCirclesArray() {
    const geoJsonArray: GeoJSON.Feature[] = [];

    gatewayRssiSelectionParameters.value.forEach((eachGatewayRssiParameter: GatewayRssiSelection) => {
        const circleInner = GatewayUtils.getTurfCircleGeoJSONFromGatewayData(eachGatewayRssiParameter, -0.05);
        const circleOuter = GatewayUtils.getTurfCircleGeoJSONFromGatewayData(eachGatewayRssiParameter, 0.05);

        const difference = turf.difference(circleOuter, circleInner);
        if (difference !== null) {
            geoJsonArray.push(difference);
        }
    });

    console.info(`GeoJSON array`, geoJsonArray);

    geoJsonCirclesArray.value = geoJsonArray;
}
</script>