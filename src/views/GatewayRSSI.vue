<script setup lang="ts">
import { ref } from 'vue';

// Components
import BaseMap from '@/components/BaseMap.vue';

const gatewayID = ref('68068734-f17f-4ec2-ac0d-5ec7332d5e4e');
</script>

<template>
    <BaseMap>
        <template #map-layers> </template>
    </BaseMap>
</template>
