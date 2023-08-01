<template>
    <v-form>
        <h3 class="mb-4">Load values from TTN Mapper Datapoint ID</h3>
        <v-row>
            <v-col cols="12" md="8">
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
        <h3 class="mb-4">Load values from Device GPS Datapoint ID</h3>
        <v-row>
            <v-col cols="12" md="8">
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

        <h3>Fingerprinting Parameters</h3>

        <v-col v-if="props.displaySfSelection" cols="12" md="8">
            <v-text-field
                v-model.number="sfValue"
                type="number"
                label="SNR"
                :min="Constants.MIN_SELECTABLE_SF"
                :max="Constants.MAX_SELECTABLE_SF"
            />
        </v-col>

        <div class="my-4">
            <GatewayAndParametersSelect
                v-for="(eachRssiSimilarityParameter, index) in rssiSimilaritySelectionParameters"
                :key="eachRssiSimilarityParameter.gatewayData.id"
                v-model:gatewaySimilarityParameters="rssiSimilaritySelectionParameters[index]"
                :display-snr-selection="props.displaySnrSelection"
                :display-sf-selection="props.displaySfSelection"
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
import Constants from '@/other/Constants';
import { computed, onMounted, ref } from 'vue';

// Components
import GatewayAndParametersSelect from '@/components/selection/GatewayAndParametersSelect.vue';

// Types
import { GatewaySimilarityParameterSelection } from '@/types/Gateways';
import { LatLng } from 'leaflet';

// Types
import {
    DeviceGPSDatapointWithTtnMapperDatapoints,
    convertTtnLocatorDeviceGPSDatapointToNormal,
} from '@/types/GPSDatapoints';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';
import { TtnMapperDatapoint } from '@/types/TtnMapperDatapoints';

const axios = injectStrict(AxiosKey);

// v-model
const props = defineProps({
    rssiSimilaritySelectionParameters: { type: Array<GatewaySimilarityParameterSelection>, required: true },
    sfValue: { type: Number, default: 7 },
    displaySnrSelection: { type: Boolean, default: false },
    displaySfSelection: { type: Boolean, default: false },
});
const emit = defineEmits(['update:rssiSimilaritySelectionParameters', 'actualDeviceLocationUpdated', 'update:sfValue']);

const rssiSimilaritySelectionParameters = computed({
    get() {
        return props.rssiSimilaritySelectionParameters;
    },
    set(value) {
        emit('update:rssiSimilaritySelectionParameters', value);
    },
});

const sfValue = computed({
    get() {
        return props.sfValue;
    },
    set(value) {
        emit('update:sfValue', value);
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
        (eachRssiSimilarityParameter: GatewaySimilarityParameterSelection) => {
            return eachRssiSimilarityParameter.gatewayData.id !== gatewayId;
        },
    );
}

async function loadParametersFromDeviceGpsDatapointInDB() {
    emit('actualDeviceLocationUpdated', null);
    console.info(
        `Loading parameters from device GPS datapoint with id ${deviceGPSDatapointFromDatabaseID.value} in DB`,
    );

    await axios
        .get(`/device_gps_datapoints/${deviceGPSDatapointFromDatabaseID.value}`)
        .then((response: AxiosResponse<{ message: string; data: DeviceGPSDatapointWithTtnMapperDatapoints }>) => {
            const parsedData: DeviceGPSDatapointWithTtnMapperDatapoints = response.data.data;

            emit('actualDeviceLocationUpdated', convertTtnLocatorDeviceGPSDatapointToNormal(parsedData));

            sfValue.value = parsedData.spreadingFactor;
            rssiSimilaritySelectionParameters.value = parsedData.ttnMapperDatapoints.map(
                (eachTtnMapperDatapoint: TtnMapperDatapoint) => {
                    return {
                        gatewayData: {
                            id: eachTtnMapperDatapoint.gatewayId,
                            location: new LatLng(0, 0),
                        },
                        rssi: eachTtnMapperDatapoint.rssi,
                        snr: props.displaySnrSelection ? eachTtnMapperDatapoint.snr : undefined,
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
