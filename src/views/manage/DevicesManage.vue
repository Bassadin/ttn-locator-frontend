<template>
    <v-container>
        <v-card>
            <v-card-title>Manage Devices</v-card-title>
            <v-card-text>
                <v-table fixed-header height="80vh">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th># of GPS Datapoints</th>
                            <th>Subscribed?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="eachDevice in devices" :key="eachDevice.deviceId">
                            <td>{{ eachDevice.deviceId }}</td>
                            <td>{{ eachDevice._count.deviceGPSDatapoints }}</td>
                            <td>
                                <!-- <v-icon v-if="eachDevice.subscription" icon="mdi-check"></v-icon>
                                <v-icon v-else icon="mdi-close"></v-icon> -->
                                <v-checkbox-btn
                                    :model-value="eachDevice.subscription"
                                    @change="handleSubscriptionChange(eachDevice.deviceId, $event.target.checked)"
                                ></v-checkbox-btn>
                            </td>
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
import TtnLocatorDeviceData from '@/types/TtnLocatorDeviceData';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

// Axios instance
const axios = injectStrict(AxiosKey);

const devices: Ref<TtnLocatorDeviceData[]> = ref([]);

onMounted(async () => {
    const response: AxiosResponse<{ message: string; data: TtnLocatorDeviceData[] }> = await axios.get('/devices');
    devices.value = response.data.data;
});

function handleSubscriptionChange(deviceId: string, newSubscriptionBoolean: boolean) {
    axios.put(`/devices/${deviceId}`, {
        subscription: newSubscriptionBoolean,
    });
}
</script>
