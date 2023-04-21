<template>
    <div class="leaflet-map">
        <l-map :zoom="15" :center="[48.050857, 8.207022]">
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            />
            <GatewayLayer />
            <DeviceGPSDatapointsLayer />

            <l-control-attribution position="topright" prefix="Data courtesy of TTN Mapper"></l-control-attribution>
        </l-map>
    </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LControlAttribution } from '@vue-leaflet/vue-leaflet';

// Components
import GatewayLayer from '@/components/map/GatewayLayer.vue';
import DeviceGPSDatapointsLayer from '@/components/map/DeviceGPSDatapointsLayer.vue';
</script>

<style>
.leaflet-map {
    width: 100%;
    height: 100%;
}
</style>
