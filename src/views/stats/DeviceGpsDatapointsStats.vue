<template>
    <v-container>
        <v-card>
            <v-card-title>Stats for device GPS Datapoints</v-card-title>
            <v-card-text>
                <p>
                    This shows the amount of GPS Datapoints that exist for each count of TTN Mapper datapoints
                    relations.
                </p>
                <v-table fixed-header height="80vh">
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
                            <td>{{ eachStatsDatapoint.gps_datapoints_amount }}</td>
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

const statsData: Ref<DatapointsCountQueryResult[]> = ref([]);

interface DatapointsCountQueryResult {
    ttn_mapper_datapoints_count: number;
    gps_datapoints_amount: number;
}

onMounted(async () => {
    const response: AxiosResponse<{ data: DatapointsCountQueryResult[] }> = await axios.get(
        '/device_gps_datapoints/count_by_ttnmapper_datapoints',
    );
    statsData.value = response.data.data;

    console.debug('Stats data:', statsData.value);
});
</script>
