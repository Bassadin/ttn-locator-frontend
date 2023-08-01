<template>
    <v-container>
        <v-card>
            <v-card-title>Stats for device GPS Datapoints</v-card-title>
            <v-card-text>
                <p>This shows the amount of Device GPS Datapoints that exist for each Spreading Factor (SF).</p>
                <v-table fixed-header height="80vh">
                    <thead>
                        <tr>
                            <th>Count of TTN Mapper Datapoints</th>
                            <th># of GPS Datapoints</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="eachStatsDatapoint in statsData" :key="eachStatsDatapoint.spreadingFactor">
                            <td>{{ eachStatsDatapoint.spreadingFactor }}</td>
                            <td>{{ eachStatsDatapoint.device_gps_datapoints_count }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, Ref } from 'vue';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

// Axios instance
const axios = injectStrict(AxiosKey);

const statsData: Ref<SpreadingFactorCountQueryResult[]> = ref([]);

interface SpreadingFactorCountQueryResult {
    spreadingFactor: number;
    device_gps_datapoints_count: number;
}

onMounted(async () => {
    const response: AxiosResponse<{ data: SpreadingFactorCountQueryResult[] }> = await axios.get(
        '/device_gps_datapoints/count_by_spreading_factor',
    );
    statsData.value = response.data.data;

    console.debug('Stats data:', statsData.value);
});
</script>
