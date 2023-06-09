<template>
    <div class="leaflet-map">
        <l-map :zoom="15" :center="mapCenter" :options="{ zoomControl: false, attributionControl: false }">
            <l-tile-layer
                v-for="tileProvider in tileProviders"
                :key="tileProvider.name"
                :name="tileProvider.name"
                :visible="tileProvider.visible"
                :url="tileProvider.url"
                :attribution="tileProvider.attribution"
                layer-type="base"
            />

            <slot name="map-layers"></slot>

            <l-control-attribution
                position="bottomright"
                prefix="Data courtesy of <a target='_blank' href='https://ttnmapper.org/'>TTN Mapper</a>"
            ></l-control-attribution>

            <slot name="map-controls">
                <l-control-zoom position="topright"></l-control-zoom>
                <l-control-layers position="topright"></l-control-layers>
            </slot>
        </l-map>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LControlAttribution, LControlZoom, LControlLayers } from '@vue-leaflet/vue-leaflet';
import { PointTuple } from 'leaflet';

const mapCenter: PointTuple = [48.050857, 8.207022];
const tileProviders = ref([
    {
        name: 'Stamen TonerLite',
        visible: true,
        url: 'https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
        attribution:
            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    },
    {
        name: 'Stamen Toner',
        visible: false,
        url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
        attribution:
            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    },
    {
        name: 'OpenStreetMap',
        visible: false,
        attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
    {
        name: 'OpenTopoMap',
        visible: false,
        url: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution:
            'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    },
    {
        name: 'Esri World Imagery (Satellite)',
        visible: false,
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
]);
</script>

<style>
.leaflet-map {
    width: 100%;
    height: 100%;
}

/* Kudos to @AljoshaVieth */
.leaflet-tile-loaded {
    transition: filter 0.5s ease-in-out;
}

.v-theme--dark .leaflet-tile-loaded {
    filter: invert(100%) grayscale(100%);
}
</style>
