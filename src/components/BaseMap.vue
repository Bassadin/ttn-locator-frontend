<template>
    <div class="leaflet-map">
        <l-map :zoom="15" :center="[48.050857, 8.207022]" :options="{ zoomControl: false }">
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            />
            <v-slot name="map-layers"></v-slot>

            <l-control-attribution position="topright" prefix="Data courtesy of TTN Mapper"></l-control-attribution>

            <v-slot name="map-controls">
                <l-control-zoom position="topright"></l-control-zoom>
            </v-slot>
        </l-map>
    </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LControlAttribution, LControlZoom } from '@vue-leaflet/vue-leaflet';
</script>

<style>
.leaflet-map {
    width: 100%;
    height: 100%;
}
</style>
