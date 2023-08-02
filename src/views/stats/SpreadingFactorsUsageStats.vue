<template>
    <v-container>
        <v-card>
            <v-card-title>Stats for device GPS Datapoints</v-card-title>
            <v-card-text>
                <p>This shows the amount of Device GPS Datapoints that exist for each Spreading Factor (SF).</p>
                <v-table fixed-header min-height="30vh">
                    <thead>
                        <tr>
                            <th>Count of TTN Mapper Datapoints</th>
                            <th># of GPS Datapoints</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="eachStatsDatapoint in statsData" :key="eachStatsDatapoint.spreadingFactor">
                            <td>{{ eachStatsDatapoint.spreadingFactor }}</td>
                            <td>{{ eachStatsDatapoint.device_gps_datapoints_count.toLocaleString('de-DE') }}</td>
                        </tr>
                    </tbody>
                </v-table>
                <Bar v-if="chartDataReady" class="mt-6 max-h-40vh" :data="chartData" :options="chartOptions"></Bar>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, Ref } from 'vue';

// Chartjs
import { Bar } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    Chart,
} from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, BarController);

Chart.defaults.font.size = 16;

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

// Axios instance
const axios = injectStrict(AxiosKey);

const statsData: Ref<SpreadingFactorCountQueryResult[]> = ref([]);

const chartDataReady = ref(false);

const chartOptions = ref({
    responsive: true,
    scales: {
        x: {
            title: {
                display: true,
                text: 'Spreading Factor (SF)',
            },
        },
        y: {
            title: {
                display: true,
                text: 'Amount of DeviceGPSDatapoints',
            },
        },
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chartData: Ref<any> = ref({});

interface SpreadingFactorCountQueryResult {
    spreadingFactor: number;
    device_gps_datapoints_count: number;
}

onMounted(async () => {
    const response: AxiosResponse<{ data: SpreadingFactorCountQueryResult[] }> = await axios.get(
        '/device_gps_datapoints/count_by_spreading_factor',
    );
    statsData.value = response.data.data;

    chartData.value.datasets = [
        {
            label: 'Data',
            data: statsData.value.map((eachStatsDatapoint) => eachStatsDatapoint.device_gps_datapoints_count),
        },
    ];
    chartData.value.labels = statsData.value.map((eachStatsDatapoint) => eachStatsDatapoint.spreadingFactor);

    console.debug('Chart data:', chartData.value);

    console.debug('Stats data:', statsData.value);
    chartDataReady.value = true;
});
</script>
