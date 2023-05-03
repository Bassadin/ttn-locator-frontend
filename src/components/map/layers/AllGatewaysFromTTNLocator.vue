<template>
    <l-layer-group ref="gateway_layer">
        <SingleGatewayMarker v-for="(eachGateway, index) in gateways" :key="index" :gateway-data="eachGateway">
        </SingleGatewayMarker>
    </l-layer-group>
</template>

<script setup lang="ts">
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LLayerGroup } from '@vue-leaflet/vue-leaflet';
import { Ref, onMounted, ref } from 'vue';

import SingleGatewayMarker from '@/components/map/markers/SingleGatewayMarker.vue';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';
import { TTNMapperGatewayAPIResponse, GatewayData } from '@/types/Gateways';

const axios = injectStrict(AxiosKey);

const gateways: Ref<GatewayData[]> = ref([]);

onMounted(() => {
    axios.get('/gateways').then((response: AxiosResponse<TTNMapperGatewayAPIResponse>) => {
        const filteredGatewayLocations = response.data.data.filter((eachGatewayData) => {
            // Filter out gateways with invalid coordinates (smaller than 1 is invalid)
            return (
                eachGatewayData.latitude &&
                eachGatewayData.longitude &&
                eachGatewayData.latitude > 1 &&
                eachGatewayData.longitude > 1
            );
        });
        gateways.value = filteredGatewayLocations.map((eachGatewayData) => ({
            id: eachGatewayData.gatewayId,
            location: new LatLng(eachGatewayData.latitude, eachGatewayData.longitude),
        }));
    });
});
</script>
