<template>
    <v-autocomplete label="Gateway ID" :items="gatewaysInDatabase"></v-autocomplete>
</template>

<script setup lang="ts">
// Vue
import { ref, Ref } from 'vue';

// Types
import { TtnLocatorGatewayApiResponse, TtnLocatorGatewayData } from '@/types/Gateways';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

// Axios instance
const axios = injectStrict(AxiosKey);

// Possible gateways in database to select from
const gatewaysInDatabase: Ref<string[]> = ref([]);

// Get gateways in database
axios.get('/gateways').then((response: AxiosResponse<TtnLocatorGatewayApiResponse>) => {
    const responseData = response.data;

    const gateways: TtnLocatorGatewayData[] = responseData.data;

    gatewaysInDatabase.value = gateways.map((eachGateway: TtnLocatorGatewayData) => {
        return eachGateway.gatewayId;
    });
});
</script>
