<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card justify="center">
                    <v-card-title>Gateway selection</v-card-title>
                    <v-card-text>
                        <v-form>
                            <GatewaysInDBSelection
                                v-model="selectedGatewayID"
                                @update:model-value="updateGatewaySelection"
                            />
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
                        <p v-else>No data available</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { LatLng } from 'leaflet';

// Router
import { useRoute } from 'vue-router';
const route = useRoute();

// Components
import { Scatter } from 'vue-chartjs';
import GatewaysInDBSelection from '@/components/selection/GatewaysInDBSelection.vue';

// Charts stuff
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LinearScale,
    PointElement,
    ChartData,
    LineElement,
    LineController,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LinearScale, PointElement, LineElement, LineController);

// Regressions
import * as simpleStatistics from 'simple-statistics';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

// Types
import { GatewayData, PacketbrokerGatewayAPIResponse } from '@/types/Gateways';
import { TtnLocatorDeviceGPSDatapointWithRSSI } from '@/types/GPSDatapoints';

// Turf options
import * as turf from '@turf/turf';
import Constants from '@/other/Constants';

// Axios instance
const axios = injectStrict(AxiosKey);

const selectedGatewayID = ref(route.params.gatewayId.toString());
const gatewayData: Ref<GatewayData> = ref({} as GatewayData);

const isCurrentlyLoading = ref(false);

// Chart stuff
const chartOptions = ref({
    responsive: true,
    scales: {
        x: {
            type: 'linear',
            position: 'left',
            title: {
                display: true,
                text: 'RSSI (dBm)',
            },
        },
        y: {
            type: 'linear',
            position: 'bottom',
            title: {
                display: true,
                text: 'Distance (m)',
            },
        },
    },
});
const chartDataReady = ref(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chartData: Ref<ChartData<any | 'line', { x: number; y: number }[]>> = ref({
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

async function getGatewayData() {
    isCurrentlyLoading.value = true;
    chartDataReady.value = false;

    const packetbrokerApiResponse: AxiosResponse<PacketbrokerGatewayAPIResponse> = (await axios
        .get(`https://mapper.packetbroker.net/api/v2/gateways/netID=000013,tenantID=ttn,id=${selectedGatewayID.value}`)
        .catch(() => {
            isCurrentlyLoading.value = false;
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
        .get(`/gateways/${selectedGatewayID.value}/gps_datapoints_with_rssi?hdop_filter=${Constants.HDOP_CUTOFF_POINT}`)
        .then(
            (
                response: AxiosResponse<{
                    message: string;
                    data: TtnLocatorDeviceGPSDatapointWithRSSI[];
                }>,
            ) => {
                const responseData: TtnLocatorDeviceGPSDatapointWithRSSI[] = response.data.data;

                const gatewayTurfPoint = turf.point([gatewayLocation.lng, gatewayLocation.lat]);

                console.info(`Found ${responseData.length} GPS datapoints`);

                const rssiDistanceData = responseData.map((eachDeviceGPSDatapoint) => {
                    const rssiValue = eachDeviceGPSDatapoint.rssi;

                    const distanceToGateway = turf.distance(
                        gatewayTurfPoint,
                        turf.point([eachDeviceGPSDatapoint.longitude, eachDeviceGPSDatapoint.latitude]),
                        { units: 'meters' },
                    );

                    return { x: rssiValue, y: distanceToGateway };
                });

                if (rssiDistanceData.length === 0) {
                    console.info('No data available');
                    return;
                }

                // Regression
                const rssiValues = rssiDistanceData.map((eachDataPoint) => eachDataPoint.x);
                const minRssi = Math.min(...rssiValues);
                const maxRssi = Math.max(...rssiValues);
                const regressionData = simpleStatistics.linearRegression(
                    rssiDistanceData.map((eachDataPoint) => [eachDataPoint.x, eachDataPoint.y]),
                );

                const regressionPrediction = simpleStatistics.linearRegressionLine(regressionData);
                console.debug('Regression data', regressionData);

                // Calculate some regression datapoints between 0 and maxDistance
                const regressionDatapoints = [];
                for (let i = minRssi; i <= maxRssi; i += 5) {
                    regressionDatapoints.push({ x: i, y: regressionPrediction(i) });
                }

                chartData.value = {
                    datasets: [
                        {
                            type: 'scatter',
                            label: 'GPS Datapoints',
                            data: rssiDistanceData,
                        },
                        {
                            type: 'line',
                            label: `Trend line (${GatewayUtils.linearRegressionPrintString(regressionData)})`,
                            data: regressionDatapoints,
                            fill: false,
                            borderColor: 'red',
                            backgroundColor: 'red',
                            pointRadius: 0,
                            borderWidth: 3,
                            showLine: true,
                            tension: 0.5,
                        },
                    ],
                };

                chartDataReady.value = true;
            },
        );

    isCurrentlyLoading.value = false;
}

// Update URL when selected gateway changes
function updateGatewaySelection(newSelectedGatewayID: string) {
    console.debug('New gateway selected', newSelectedGatewayID);
    history.pushState({}, '', `/rssi_range_graph/${newSelectedGatewayID}`);
    getGatewayData();
}
</script>
