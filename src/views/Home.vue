<script setup lang="ts">
// Components
import BaseMap from '@/components/BaseMap.vue';
import GatewayLayer from '@/components/map/GatewayLayer.vue';
import DeviceGPSDatapointsLayer from '@/components/map/DeviceGPSDatapointsLayer.vue';
</script>

<template>
    <BaseMap>
        <template #map-layers>
            <GatewayLayer />
            <DeviceGPSDatapointsLayer />
        </template>
    </BaseMap>
</template>
