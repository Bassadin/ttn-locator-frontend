<script setup lang="ts">
// Components
import BaseMap from '@/components/BaseMap.vue';
import AllGatewaysFromTTNLocator from '@/components/map/layers/AllGatewaysFromTTNLocator.vue';
import AllDeviceGPSDatapointsLayerFromTTNLocator from '@/components/map/layers/AllDeviceGPSDatapointsLayerFromTTNLocator.vue';
</script>

<template>
    <BaseMap>
        <template #map-layers>
            <AllGatewaysFromTTNLocator />
            <AllDeviceGPSDatapointsLayerFromTTNLocator />
        </template>
    </BaseMap>
</template>
