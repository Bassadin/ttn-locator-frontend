<template>
    <v-autocomplete
        v-model="selectedGatewayId"
        label="Gateway ID"
        :items="gatewaysInDatabase"
        @input="$emit('update:modelValue', $event.target.value)"
    ></v-autocomplete>
</template>

<script setup lang="ts">
// Vue
import { computed, ref, Ref } from 'vue';

// Types
import { TtnLocatorGatewayApiResponse, TtnLocatorGatewayData } from '@/types/Gateways';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

// Axios instance
const axios = injectStrict(AxiosKey);

const props = defineProps({ modelValue: { type: String, required: true } });
const emits = defineEmits(['update:modelValue']);

const selectedGatewayId = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emits('update:modelValue', value);
    },
});

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
