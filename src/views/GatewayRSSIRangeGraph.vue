<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card justify="center">
                    <v-card-title>Gateway selection</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="getGatewayData">
                            <v-text-field v-model="gatewayID" label="Gateway ID"></v-text-field>
                            <v-btn block type="submit" :loading="isCurrentlyLoading" color="primary">Submit</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>Graph</v-card-title>
                    <v-card-text>
                        <Scatter v-if="chartDataReady" :data="chartData" :options="chartOptions"></Scatter>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';

// Components
import { Scatter } from 'vue-chartjs';

// Charts stuff
import { Chart as ChartJS, Title, Tooltip, Legend, LinearScale, PointElement, ChartData } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LinearScale, PointElement);

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';
import { LatLng } from 'leaflet';

// Types
import { GatewayData, PacketbrokerGatewayAPIResponse } from '@/types/Gateways';
import { TTNMapperGatewayAPIDeviceGPSDatapoint } from '@/types/GPSDatapoints';

// Turf options
import * as turf from '@turf/turf';

// Axios instance
const axios = injectStrict(AxiosKey);

const gatewayID = ref('hfu-lr8-001');
const gatewayData: Ref<GatewayData> = ref({} as GatewayData);

const isCurrentlyLoading = ref(false);

// Chart stuff
const chartOptions = ref({
    responsive: true,
    scales: {
        x: {
            type: 'linear',
            position: 'bottom',
            title: {
                display: true,
                text: 'Distance (m)',
            },
        },
        y: {
            type: 'linear',
            position: 'left',
            title: {
                display: true,
                text: 'RSSI (dBm)',
            },
        },
    },
});
const chartDataReady = ref(false);

const chartData: Ref<ChartData<'scatter', { x: number; y: number }[]>> = ref({
    datasets: [
        {
            label: 'GPS Datapoints',
            data: [],
        },
    ],
});

onMounted(() => {
    getGatewayData();
});

const hdopCutoffPoint = 1.6;

async function getGatewayData() {
    isCurrentlyLoading.value = true;
    chartDataReady.value = false;

    const packetbrokerApiResponse: AxiosResponse<PacketbrokerGatewayAPIResponse> = (await axios
        .get(`https://mapper.packetbroker.net/api/v2/gateways/netID=000013,tenantID=ttn,id=${gatewayID.value}`)
        .catch(() => {
            alert('Gateway not found');
        })) as AxiosResponse<PacketbrokerGatewayAPIResponse>;

    const gatewayLocation = new LatLng(
        packetbrokerApiResponse.data.location.latitude,
        packetbrokerApiResponse.data.location.longitude,
    );

    gatewayData.value = {
        id: packetbrokerApiResponse.data.id,
        location: gatewayLocation,
    };

    axios
        .get(
            `https://api.ttnmapper.org/gateway/data?gateway_id=${gatewayID.value}&start_time=2023-04-01T22%3A00%3A00.000Z`,
        )
        .then((response: AxiosResponse) => {
            const responseData: TTNMapperGatewayAPIDeviceGPSDatapoint[] = response.data;

            const gatewayTurfPoint = turf.point([gatewayLocation.lng, gatewayLocation.lat]);

            const filteredData = responseData.filter(
                (eachDeviceGPSDatapoint) => eachDeviceGPSDatapoint.hdop <= hdopCutoffPoint,
            );

            const rssiDistanceData = filteredData.map((eachDeviceGPSDatapoint) => {
                const rssiValue = eachDeviceGPSDatapoint.rssi;

                const distanceToGateway = turf.distance(
                    gatewayTurfPoint,
                    turf.point([eachDeviceGPSDatapoint.longitude, eachDeviceGPSDatapoint.latitude]),
                    { units: 'meters' },
                );

                return { x: distanceToGateway, y: rssiValue };
            });

            chartData.value = {
                datasets: [
                    {
                        label: 'GPS Datapoints',
                        data: rssiDistanceData,
                    },
                ],
            };
        });

    isCurrentlyLoading.value = false;
    chartDataReady.value = true;
}
</script>
