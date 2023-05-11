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

                    <SingleDeviceGPSDatapointMarker
                        v-for="(eachDeviceGPSDatapoint, index) in eachRssiSimilarityParameter.deviceGpsDatapoints"
                        :key="index"
                        :device-gps-datapoint-data="eachDeviceGPSDatapoint"
                    ></SingleDeviceGPSDatapointMarker>
                </div>
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
                    <v-form @submit.prevent="loadSimilarityData">
                        <v-row>
                            <v-col>
                                <v-text-field
                                    v-model.number="rssiCheckingRange"
                                    label="RSSI checking range"
                                    hide-details
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="1"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mb-4">
                            <v-col align-self="end">
                                <v-btn prepend-icon="mdi-plus" @click.prevent="addNewParameter">
                                    Add new parameter set
                                </v-btn>
                            </v-col>
                        </v-row>
                        <GatewayAndRssiSelect
                            v-for="eachRssiSimilarityParameter in rssiSimilaritySelectionParameters"
                            :key="eachRssiSimilarityParameter.gatewayData.id"
                            v-model:gatewayId="eachRssiSimilarityParameter.gatewayData.id"
                            v-model:rssi="eachRssiSimilarityParameter.rssi"
                            @delete-parameter="deleteParameter"
                        />
                        <v-row justify="center" class="mb-2 mt-8">
                            <v-btn block type="submit" :loading="isCurrentlyLoading" color="primary">Submit</v-btn>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';

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
    stripRssiFromDeviceGPSDatapointWithRSSI,
    TtnLocatorDeviceGPSDatapointWithRSSI,
} from '@/types/GPSDatapoints';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import GatewayAndRssiSelect from '@/components/selection/GatewayAndRssiSelect.vue';
import GatewayUtils from '@/utils/GatewayUtils';

const showFilteringDialog = ref(false);
const isCurrentlyLoading = ref(false);

const rssiSimilaritySelectionParameters: Ref<GatewayRssiSelection[]> = ref([
    {
        gatewayData: {
            id: 'hfu-lr8-001',
            location: new LatLng(0, 0),
        },
        rssi: -105,
        deviceGpsDatapoints: [],
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
        deviceGpsDatapoints: [],
    },
    {
        gatewayData: {
            id: 'eui-a84041203275aeac',
            location: new LatLng(0, 0),
        },
        rssi: -81,
        deviceGpsDatapoints: [],
    },
]);

const rssiCheckingRange: Ref<number> = ref(1);

function addNewParameter() {
    rssiSimilaritySelectionParameters.value.push({
        gatewayData: {
            id: '',
            location: new LatLng(0, 0),
        },
        rssi: -50,
        deviceGpsDatapoints: [],
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

    const allPromises: Promise<TtnLocatorDeviceGPSDatapointWithRSSI[]>[] = [];

    rssiSimilaritySelectionParameters.value.forEach(async (eachRssiSimilarityParameter: GatewayRssiSelection) => {
        const gatewayID = eachRssiSimilarityParameter.gatewayData.id;
        const rssiRange = {
            min: eachRssiSimilarityParameter.rssi - rssiCheckingRange.value,
            max: eachRssiSimilarityParameter.rssi + rssiCheckingRange.value,
        };

        console.debug(`Loading gateway data for ${gatewayID} with RSSI range`, rssiRange);

        const gatewayLocation = await GatewayUtils.getGatewayLocationForGatewayId(gatewayID);

        if (gatewayLocation === null) {
            return;
        }

        eachRssiSimilarityParameter.gatewayData.location = gatewayLocation;

        const getGpsDatapointsPromise = GatewayUtils.getLastXDaysGpsDatapointsForGatewayId(
            gatewayID,
            rssiRange.min,
            rssiRange.max,
        );
        getGpsDatapointsPromise.then((responseData) => {
            const parsedData: DeviceGPSDatapoint[] = responseData.map(stripRssiFromDeviceGPSDatapointWithRSSI);

            eachRssiSimilarityParameter.deviceGpsDatapoints = parsedData;

            console.debug(
                `Loaded ${parsedData.length} GPS datapoints for gateway ${gatewayID} with RSSI range`,
                rssiRange,
            );
        });

        allPromises.push(getGpsDatapointsPromise);
    });

    Promise.allSettled(allPromises).then(() => {
        isCurrentlyLoading.value = false;
        showFilteringDialog.value = false;
        console.info('Finished loading gateway similarity data');
    });
}
</script>
