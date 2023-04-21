<template>
    <div class="leaflet-map">
        <l-map :zoom="15" :center="[48.050857, 8.207022]">
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            />
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
            <l-layer-group ref="gps_points_layer">
                <l-circle-marker
                    v-for="(eachDeviceGPSPoint, index) in deviceGpsDatapointsLocations"
                    :key="index"
                    :lat-lng="eachDeviceGPSPoint.location"
                    :radius="2"
                >
                    <l-popup>
                        <b>Device ID:</b>{{ eachDeviceGPSPoint.deviceId }}<br />
                        <b>Location:</b> {{ eachDeviceGPSPoint.location }}
                    </l-popup>
                </l-circle-marker>
            </l-layer-group>
        </l-map>
    </div>
</template>

<script setup lang="ts">
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LCircleMarker, LLayerGroup, LPopup } from '@vue-leaflet/vue-leaflet';
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

type DeviceGPSDatapointAPIResponse = {
    data: {
        id: number;
        timestamp: string;
        deviceId: string;
        latitude: number;
        longitude: number;
        altitude: number;
        hdop: number;
    }[];
};

type DeviceGPSDatapoint = {
    deviceId: string;
    location: LatLng;
};

let deviceGpsDatapointsLocations: Ref<DeviceGPSDatapoint[]> = ref([]);
let gateways: Ref<GatewayData[]> = ref([]);

onMounted(() => {
    axios.get('/device_gps_datapoints').then((response: AxiosResponse<DeviceGPSDatapointAPIResponse>) => {
        deviceGpsDatapointsLocations.value = response.data.data.map((eachDeviceGPSDatapoint) => ({
            deviceId: eachDeviceGPSDatapoint.deviceId,
            location: new LatLng(eachDeviceGPSDatapoint.latitude, eachDeviceGPSDatapoint.longitude),
        }));
    });
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

        console.debug('gateways', gateways.value);
    });
});
</script>

<style>
.leaflet-map {
    width: 100%;
    height: 100%;
}
</style>
