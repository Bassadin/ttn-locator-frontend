<template>
    <v-autocomplete
        clearable
        label="Gateway ID"
        :items="gatewaysInDatabase"
        :rules="gatewayRules"
        required
        @update:model-value="isGatewayIdValid"
    ></v-autocomplete>
</template>

<script setup lang="ts">
// Vue
import { onMounted, ref, Ref } from 'vue';

// Types
import TtnLocatorGatewayData from '@/types/Gateways/TtnLocatorGatewayData';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

// Axios instance
const axios = injectStrict(AxiosKey);

// Possible gateways in database to select from
const gatewaysInDatabase: Ref<string[]> = ref([]);

onMounted(() => {
    getGatewaysInDatabase();
});

// Get gateways in database
function getGatewaysInDatabase() {
    axios.get('/gateways').then((response: AxiosResponse<{ message: string; data: TtnLocatorGatewayData[] }>) => {
        const responseData = response.data;

        const gateways: TtnLocatorGatewayData[] = responseData.data;

        gatewaysInDatabase.value = gateways.map((eachGateway: TtnLocatorGatewayData) => {
            return eachGateway.gatewayId;
        });
    });
}

// Rules
const gatewayRules = [(v: string) => isGatewayIdValid(v) || 'Gateway must be in database'];

function isGatewayIdValid(gatewayID: string): boolean {
    return gatewaysInDatabase.value.includes(gatewayID);
}
</script>
