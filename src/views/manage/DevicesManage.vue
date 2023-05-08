<template>
    <v-container>
        <v-card>
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">ID</th>
                        <th class="text-left">Subscribed?</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="eachDevice in devices" :key="eachDevice.deviceId">
                        <td>{{ eachDevice.deviceId }}</td>
                        <td>
                            <v-icon v-if="eachDevice.subscription" icon="mdi-check"></v-icon>
                            <v-icon v-else icon="mdi-close"></v-icon>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, Ref } from 'vue';

// Types
import { TtnLocatorDeviceApiResponse, TtnLocatorDeviceData } from '@/types/Devices';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

// Axios instance
const axios = injectStrict(AxiosKey);

const devices: Ref<TtnLocatorDeviceData[]> = ref([]);

onMounted(async () => {
    const response: AxiosResponse<TtnLocatorDeviceApiResponse> = await axios.get('/devices');
    devices.value = response.data.data;
});
</script>
