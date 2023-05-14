<template>
    <v-layout class="w-full h-full">
        <LoadingOverlay v-model="isCurrentlyLoading" />
        <BaseMap>
            <template #map-layers>
                <div
                    v-for="eachRssiSimilarityParameter in rssiSimilaritySelectionParameters"
                    :key="eachRssiSimilarityParameter.gatewayData.id"
                >
                    <SingleGatewayMarker :gateway-data="eachRssiSimilarityParameter.gatewayData" />
                </div>
                <SingleDeviceGPSDatapointMarker
                    v-for="(eachDeviceGPSDatapoint, index) in deviceGPSDatapoints"
                    :key="index"
                    :device-gps-datapoint-data="eachDeviceGPSDatapoint"
                ></SingleDeviceGPSDatapointMarker>
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
                <v-card-title>RSSI similarity parameters</v-card-title>
                <v-card-text>
                    <v-subheader>Load values from Device GPS Datapoint ID</v-subheader>
                    <v-row>
                        <v-col>
                            <v-form @submit.prevent="loadParametersFromDeviceGpsDatapointInDB">
                                <v-text-field
                                    v-model.number="deviceGPSDatapointFromDatabaseID"
                                    label="Device GPS Datapoint ID from DB"
                                    type="number"
                                    clearable
                                >
                                    <template #append>
                                        <v-btn icon="mdi-database-arrow-down" type="submit"></v-btn>
                                    </template>
                                </v-text-field>
                            </v-form>
                        </v-col>
                    </v-row>
                    <v-subheader>RSSI Similarity Parameters</v-subheader>
                    <v-form>
                        <v-row>
                            <v-col>
                                <v-text-field
                                    v-model.number="rssiCheckingRange"
                                    label="RSSI checking range"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <div class="my-4">
                            <GatewayAndRssiSelect
                                v-for="eachRssiSimilarityParameter in rssiSimilaritySelectionParameters"
                                :key="eachRssiSimilarityParameter.gatewayData.id"
                                v-model:gatewayId="eachRssiSimilarityParameter.gatewayData.id"
                                v-model:rssi="eachRssiSimilarityParameter.rssi"
                                @delete-parameter="deleteParameter"
                            />
                        </div>
                        <v-row class="mb-4">
                            <v-col align-self="end">
                                <v-btn prepend-icon="mdi-plus" @click.prevent="addNewParameter">
                                    Add new parameter set
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
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

// Components
import SingleGatewayMarker from '@/components/map/markers/SingleGatewayMarker.vue';
import SingleDeviceGPSDatapointMarker from '@/components/map/markers/SingleDeviceGPSDatapointMarker.vue';

// Types
import { LatLng } from 'leaflet';
import { GatewayRssiSelection } from '@/types/Gateways';
import {
    DeviceGPSDatapoint,
    mapTtnLocatorApiResponseToDeviceGPSDatapoint,
    TtnLocatorDeviceGPSDatapoint,
    DeviceGPSDatapointWithTtnMapperDatapoints,
} from '@/types/GPSDatapoints';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import GatewayAndRssiSelect from '@/components/selection/GatewayAndRssiSelect.vue';
import GatewayUtils from '@/utils/GatewayUtils';
import { TtnMapperDatapoint } from '@/types/TtnMapperDatapoints';

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

const deviceGPSDatapointFromDatabaseID: Ref<number> = ref(0);

function addNewParameter() {
    rssiSimilaritySelectionParameters.value.push({
        gatewayData: {
            id: '',
            location: new LatLng(0, 0),
        },
        rssi: -50,
    });
}

function deleteParameter(gatewayId: string) {
    rssiSimilaritySelectionParameters.value = rssiSimilaritySelectionParameters.value.filter(
        (eachRssiSimilarityParameter: GatewayRssiSelection) => {
            return eachRssiSimilarityParameter.gatewayData.id !== gatewayId;
        },
    );
}

async function loadSimilarityData() {
    console.info(`Loading gateway similarity data for ${rssiSimilaritySelectionParameters.value.length} gateways`);
    isCurrentlyLoading.value = true;

    rssiSimilaritySelectionParameters.value.forEach(async (eachRssiSimilarityParameter: GatewayRssiSelection) => {
        const gatewayLocation = await GatewayUtils.getGatewayLocationForGatewayId(
            eachRssiSimilarityParameter.gatewayData.id,
        );
        if (gatewayLocation === null) {
            return;
        }
        eachRssiSimilarityParameter.gatewayData.location = gatewayLocation;
    });

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

async function loadParametersFromDeviceGpsDatapointInDB() {
    console.info(
        `Loading parameters from device GPS datapoint with id ${deviceGPSDatapointFromDatabaseID.value} in DB`,
    );

    await axios
        .get(`/device_gps_datapoints/${deviceGPSDatapointFromDatabaseID.value}`)
        .then((response: AxiosResponse<{ message: string; data: DeviceGPSDatapointWithTtnMapperDatapoints }>) => {
            const parsedData: DeviceGPSDatapointWithTtnMapperDatapoints = response.data.data;

            rssiSimilaritySelectionParameters.value = parsedData.ttnMapperDatapoints.map(
                (eachTtnMapperDatapoint: TtnMapperDatapoint) => {
                    return {
                        gatewayData: {
                            id: eachTtnMapperDatapoint.gatewayId,
                            location: new LatLng(0, 0),
                        },
                        rssi: eachTtnMapperDatapoint.rssi,
                    };
                },
            );
        });
}
</script>
