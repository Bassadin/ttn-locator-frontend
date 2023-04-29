<template>
    <div class="leaflet-map">
        <l-map :zoom="15" :center="[48.050857, 8.207022]" :options="{ zoomControl: false }">
            <l-tile-layer :url="mapTileUrl" layer-type="base" name="OpenStreetMap" />
            <slot name="map-layers"></slot>

            <l-control-attribution
                position="topright"
                prefix="Data courtesy of <a target='_blank' href='https://ttnmapper.org/'>TTN Mapper</a>"
            ></l-control-attribution>

            <slot name="map-controls">
                <l-control-zoom position="topright"></l-control-zoom>
            </slot>
        </l-map>
    </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LControlAttribution, LControlZoom } from '@vue-leaflet/vue-leaflet';

const mapTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
</script>

<style>
.leaflet-map {
    width: 100%;
    height: 100%;
}
</style>
