<template>
    <v-form>
        <v-subheader>Load values from TTN Mapper Datapoint ID</v-subheader>
        <v-row>
            <v-col>
                <v-form @submit.prevent="loadParametersFromTtnMapperDatapointInDB">
                    <v-text-field
                        v-model.number="ttnMapperDatapointFromDatabaseID"
                        label="TTN Mapper Datapoint ID from DB"
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
                <v-btn prepend-icon="mdi-plus" @click.prevent="addNewParameter"> Add new parameter set </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

// Components
import GatewayAndRssiSelect from '@/components/selection/GatewayAndRssiSelect.vue';

// Types
import GatewayRssiSelection from '@/types/Gateways/GatewayRssiSelection';
import TtnMapperDatapoint from '@/types/TtnMapperDatapoints';
import { LatLng } from 'leaflet';

// Types
import {
    DeviceGPSDatapointWithTtnMapperDatapointsJSON,
    DeviceGPSDatapointWithTtnMapperDatapoints,
} from '@/types/DeviceGpsDatapoints/DeviceGPSDatapointWithTtnMapperDatapoints';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

const axios = injectStrict(AxiosKey);

// v-model
const props = defineProps({
    rssiSimilaritySelectionParameters: { type: Array<GatewayRssiSelection>, required: true },
});
const emit = defineEmits(['update:rssiSimilaritySelectionParameters', 'actualDeviceLocationUpdated']);

const rssiSimilaritySelectionParameters = computed({
    get() {
        return props.rssiSimilaritySelectionParameters;
    },
    set(value) {
        emit('update:rssiSimilaritySelectionParameters', value);
    },
});

// Data
const deviceGPSDatapointFromDatabaseID = ref(0);
const ttnMapperDatapointFromDatabaseID = ref(670326377);

// TODO: Temporary for quicker demos
onMounted(() => {
    loadParametersFromTtnMapperDatapointInDB();
});

// Functions
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

async function loadParametersFromDeviceGpsDatapointInDB() {
    emit('actualDeviceLocationUpdated', null);
    console.info(
        `Loading parameters from device GPS datapoint with id ${deviceGPSDatapointFromDatabaseID.value} in DB`,
    );

    await axios.get(`/device_gps_datapoints/${deviceGPSDatapointFromDatabaseID.value}`).then((response) => {
        const responseData = response.data.data;
        const parsedData: DeviceGPSDatapointWithTtnMapperDatapoints = new DeviceGPSDatapointWithTtnMapperDatapoints(
            responseData.id,
            responseData.timestamp,
            responseData.deviceId,
            responseData.latitude,
            responseData.longitude,
            responseData.altitude,
            responseData.hdop,
            responseData.ttnMapperDatapoints,
        );

        emit('actualDeviceLocationUpdated', parsedData.mapToDeviceGPSDatapoint());

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

async function loadParametersFromTtnMapperDatapointInDB() {
    console.info(
        `Loading parameters from TTN Mapper datapoint with id ${ttnMapperDatapointFromDatabaseID.value} in DB`,
    );

    await axios
        .get(`/ttnmapper_datapoints/${ttnMapperDatapointFromDatabaseID.value}`)
        .then(async (response: AxiosResponse<{ message: string; data: TtnMapperDatapoint }>) => {
            const parsedData: TtnMapperDatapoint = response.data.data;

            deviceGPSDatapointFromDatabaseID.value = parsedData.deviceGPSDatapointId;

            await loadParametersFromDeviceGpsDatapointInDB();
        });
}
</script>
