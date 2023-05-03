<template>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">ID</th>
                <th class="text-left">ID</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="eachDevice in devices" :key="eachDevice.deviceId">
                <td>{{ eachDevice.deviceId }}</td>
                <td>{{ eachDevice.deviceId }}</td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted, Ref } from 'vue';

// Types
import { TtnLocatorDeviceData } from '@/types/Devices';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

// Axios instance
const axios = injectStrict(AxiosKey);

const devices: Ref<TtnLocatorDeviceData[]> = ref([]);

onMounted(async () => {
    const response: AxiosResponse<TtnLocatorDeviceData[]> = await axios.get('/devices');
    devices.value = response.data;
});
</script>
