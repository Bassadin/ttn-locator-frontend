<template>
    <l-layer-group ref="gateway_layer">
        <l-circle-marker
            v-for="(eachGateway, index) in gateways"
            :key="index"
            :lat-lng="eachGateway.location"
            :radius="6"
            color="red"
        >
            <l-popup>
                <b>Gateway ID:</b>{{ eachGateway.id }}<br />
                <b>Location:</b> {{ eachGateway.location }}
            </l-popup>
        </l-circle-marker>
    </l-layer-group>
</template>

<script setup lang="ts">
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LCircleMarker, LLayerGroup, LPopup } from '@vue-leaflet/vue-leaflet';
import { Ref, onMounted, ref } from 'vue';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';
import { AxiosResponse } from 'axios';

const axios = injectStrict(AxiosKey);

type GatewayData = {
    id: string;
    location: LatLng;
};

type GatewayAPIResponse = {
    message: string;
    data: {
        gatewayId: string;
        latitude: number;
        longitude: number;
        altitude: number;
        createdAt: string;
        updatedAt: string;
    }[];
};

let gateways: Ref<GatewayData[]> = ref([]);

onMounted(() => {
    axios.get('/gateways').then((response: AxiosResponse<GatewayAPIResponse>) => {
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
