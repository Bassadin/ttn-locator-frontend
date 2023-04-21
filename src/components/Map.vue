<template>
    <div class="leaflet-map">
        <l-map :zoom="15" :center="[48.050857, 8.207022]">
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            />
            <template v-for="(marker, index) in markers" :key="index">
                <l-marker :lat-lng="marker"></l-marker>
            </template>
        </l-map>
    </div>
</template>

<script setup lang="ts">
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import { Ref, inject, onMounted, ref } from 'vue';

// Axios
import { injectStrict } from '@/utils/injectTyped';
import { AxiosKey } from '@/symbols';

const axios = injectStrict(AxiosKey);

let markers: Ref<LatLng[]> = ref([]);

onMounted(() => {
    axios.get('/device_gps_datapoints').then((response) => {
        markers.value = response.data.data.map((location: any) => {
            return new LatLng(location.latitude, location.longitude);
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
