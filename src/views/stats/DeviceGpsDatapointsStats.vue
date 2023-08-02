<template>
    <v-container>
        <v-card>
            <v-card-title>Stats for device GPS Datapoints</v-card-title>
            <v-card-text>
                <p>
                    This shows the amount of GPS Datapoints that exist for each count of TTN Mapper datapoints
                    relations.
                </p>
                <v-table fixed-header min-height="30vh">
                    <thead>
                        <tr>
                            <th>Count of TTN Mapper Datapoints</th>
                            <th># of GPS Datapoints</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="eachStatsDatapoint in statsData"
                            :key="eachStatsDatapoint.ttn_mapper_datapoints_count"
                        >
                            <td>{{ eachStatsDatapoint.ttn_mapper_datapoints_count }}</td>
                            <td>{{ eachStatsDatapoint.gps_datapoints_amount.toLocaleString('de-DE') }}</td>
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

const statsData: Ref<DatapointsCountQueryResult[]> = ref([]);

const chartDataReady = ref(false);

const chartOptions = ref({
    responsive: true,
    scales: {
        x: {
            title: {
                display: true,
                text: 'Amount of TTN Mapper Datapoints',
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

interface DatapointsCountQueryResult {
    ttn_mapper_datapoints_count: number;
    gps_datapoints_amount: number;
}

onMounted(async () => {
    const response: AxiosResponse<{ data: DatapointsCountQueryResult[] }> = await axios.get(
        '/device_gps_datapoints/count_by_ttnmapper_datapoints',
    );
    statsData.value = response.data.data;

    chartData.value.datasets = [
        {
            label: 'Data',
            data: statsData.value.map((eachStatsDatapoint) => eachStatsDatapoint.gps_datapoints_amount),
        },
    ];
    chartData.value.labels = statsData.value.map(
        (eachStatsDatapoint) => eachStatsDatapoint.ttn_mapper_datapoints_count,
    );

    console.debug('Stats data:', statsData.value);
    chartDataReady.value = true;
});
</script>
