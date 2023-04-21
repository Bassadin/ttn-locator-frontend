<template>
    <div class="leaflet-map">
        <l-map :zoom="15" :center="[48.050857, 8.207022]">
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            />
            <l-layer-group ref="gatewayLocations">
                <l-circle-marker
                    v-for="(eachLocation, index) in gatewayLocations"
                    :key="index"
                    :lat-lng="eachLocation"
                    :radius="6"
                    color="red"
                ></l-circle-marker>
            </l-layer-group>
            <l-layer-group ref="deviceGpsDatapointsLocations">
                <l-circle-marker
                    v-for="(eachLocation, index) in deviceGpsDatapointsLocations"
                    :key="index"
                    :lat-lng="eachLocation"
                    :radius="2"
                ></l-circle-marker>
            </l-layer-group>
        </l-map>
    </div>
</template>

<script setup lang="ts">
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LCircleMarker, LLayerGroup } from '@vue-leaflet/vue-leaflet';
import { Ref, onMounted, ref } from 'vue';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';

const axios = injectStrict(AxiosKey);

let deviceGpsDatapointsLocations: Ref<LatLng[]> = ref([]);
let gatewayLocations: Ref<LatLng[]> = ref([]);

onMounted(() => {
    axios.get('/device_gps_datapoints').then((response) => {
        deviceGpsDatapointsLocations.value = response.data.data.map((eachDeviceGPSDatapoint: any) => {
            return new LatLng(eachDeviceGPSDatapoint.latitude, eachDeviceGPSDatapoint.longitude);
        });
    });
    axios.get('/gateways').then((response) => {
        const filteredGatewayLocations = response.data.data.filter((eachGatewayData: any) => {
            // Filter out gateways with invalid coordinates (smaller than 1 is invalid)
            return eachGatewayData.latitude > 1 && eachGatewayData.longitude > 1;
        });
        gatewayLocations.value = response.data.data.map((eachGatewayData: any) => {
            return new LatLng(eachGatewayData.latitude, eachGatewayData.longitude);
        });
    });
});
</script>

<style>
.leaflet-map {
    width: 100%;
    height: 100%;
}
</style>
