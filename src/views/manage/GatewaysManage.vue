<template>
    <v-container>
        <v-card>
            <v-card-title>Manage Gateways</v-card-title>
            <v-card-text>
                <v-table fixed-header height="80vh">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th># of TTN Mapper Datapoints</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="eachGateway in gatewaysData" :key="eachGateway.gatewayId">
                            <td>{{ eachGateway.gatewayId }}</td>
                            <td>{{ eachGateway.name }}</td>
                            <td>{{ eachGateway.description }}</td>
                            <td>{{ eachGateway._count.ttnmapperDatapoints }}</td>
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

// Types
import { TtnLocatorGatewayData } from '@/types/Gateways';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

// Axios instance
const axios = injectStrict(AxiosKey);

const gatewaysData: Ref<TtnLocatorGatewayData[]> = ref([]);

onMounted(async () => {
    const response: AxiosResponse<{ message: string; data: TtnLocatorGatewayData[] }> = await axios.get('/gateways');
    gatewaysData.value = response.data.data;
});
</script>
