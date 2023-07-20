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

                <!-- TODO dirty hack: `geoJsonStyleFunction as any` should work without the any too -->
                <l-geo-json
                    v-for="eachGeoJson in geoJsonCirclesArray"
                    :key="eachGeoJson.id"
                    :geojson="eachGeoJson"
                    :options="{ style: { color: 'red', weight: 0, fill: true } }"
                    :options-style="geoJsonStyleFunction as any"
                ></l-geo-json>

                <ActualDeviceLocationMarker
                    v-if="actualDeviceLocation"
                    :device-gps-datapoint-data="actualDeviceLocation"
                />
            </template>
        </BaseMap>
        <!-- For eager, see RssiSimilarity.vue -->
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
                <v-card-title>RSSI to range multilateration</v-card-title>
                <v-card-text>
                    <GatewayRssiParametersSelect
                        v-model:rssi-similarity-selection-parameters="gatewayRssiSelectionParameters"
                        @actual-device-location-updated="actualDeviceLocation = $event"
                    />
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model.number="rangeDonutTolerance"
                                label="Range donut tolerance meters (+/-)"
                                type="number"
                                min="1"
                                max="300"
                                step="1"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-checkbox
                                v-model="shouldUseFixedRssiToRangeScale"
                                label="Use fixed RSSI to Range scale"
                            ></v-checkbox>
                        </v-col>
                    </v-row>
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
import Constants from '@/other/Constants';

// Components
import BaseMap from '@/components/BaseMap.vue';
import SingleGatewayMarker from '@/components/map/markers/SingleGatewayMarker.vue';
import ActualDeviceLocationMarker from '@/components/map/markers/ActualDeviceLocationMarker.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { LGeoJson } from '@vue-leaflet/vue-leaflet';
import GatewayRssiParametersSelect from '@/components/selection/GatewayRssiParametersSelect.vue';

// Types
import { GatewaySimilarityParameterSelection, TtnLocatorGatewayData } from '@/types/Gateways';
import { DeviceGPSDatapoint } from '@/types/GPSDatapoints';
import GatewayUtils from '@/utils/GatewayUtils';
import { GeoJSON, LatLng, PathOptions } from 'leaflet';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';

const axios = injectStrict(AxiosKey);

const showFilteringDialog = ref(false);
const isCurrentlyLoading = ref(false);
const gatewayRssiSelectionParameters: Ref<GatewaySimilarityParameterSelection[]> = ref([]);
const actualDeviceLocation: Ref<DeviceGPSDatapoint | null> = ref(null);
const geoJsonCirclesArray: Ref<GeoJSON.Feature[]> = ref([]);
const rangeDonutTolerance = ref(Constants.DEFAULT_RSSI_TO_RANGE_TOLERANCE_METERS);
const shouldUseFixedRssiToRangeScale = ref(false);

function geoJsonStyleFunction(_feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) {
    const pathOptions: PathOptions = {
        color: '#2E7D32',
        weight: 0,
        fill: true,
        opacity: 0.25,
    };

    return pathOptions;
}

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
        gatewayRssiSelectionParameters.value.map(
            async (eachRssiSimilarityParameter: GatewaySimilarityParameterSelection) => {
                const axiosResponse = await axios.get(`/gateways/${eachRssiSimilarityParameter.gatewayData.id}`);
                const responseData: TtnLocatorGatewayData = axiosResponse.data.data;

                if (responseData.latitude == 0 && responseData.longitude == 0) {
                    return;
                }

                eachRssiSimilarityParameter.gatewayData.location = new LatLng(
                    responseData.latitude,
                    responseData.longitude,
                );

                if (
                    !shouldUseFixedRssiToRangeScale.value &&
                    responseData.linearRegressionSlope &&
                    responseData.linearRegressionIntercept
                ) {
                    eachRssiSimilarityParameter.linearRegressionValues = {
                        slope: responseData.linearRegressionSlope,
                        intercept: responseData.linearRegressionIntercept,
                    };
                } else {
                    eachRssiSimilarityParameter.linearRegressionValues = undefined;
                }
            },
        ),
    );

    console.info('Finished loading gateway data', gatewayRssiSelectionParameters.value);
}

function recalculateGeoJsonCirclesArray() {
    const geoJsonArray: GeoJSON.Feature[] = [];

    gatewayRssiSelectionParameters.value.forEach((eachGatewayRssiParameter: GatewaySimilarityParameterSelection) => {
        const circleInner = GatewayUtils.getTurfCircleGeoJSONFromGatewayData(
            eachGatewayRssiParameter,
            -rangeDonutTolerance.value,
            eachGatewayRssiParameter.linearRegressionValues,
        );
        const circleOuter = GatewayUtils.getTurfCircleGeoJSONFromGatewayData(
            eachGatewayRssiParameter,
            rangeDonutTolerance.value,
            eachGatewayRssiParameter.linearRegressionValues,
        );

        const difference = turf.difference(circleOuter, circleInner);
        if (difference !== null) {
            geoJsonArray.push(difference);
        }
    });

    console.info(`GeoJSON array`, geoJsonArray);

    geoJsonCirclesArray.value = geoJsonArray;
}
</script>
