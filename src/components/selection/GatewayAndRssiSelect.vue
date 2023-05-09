<template>
    <v-row>
        <v-col cols="12" md="6">
            <GatewaysInDBSelection :value="gatewayId" @input="$emit('update:gatewayId', $event.target.value)" />
        </v-col>
        <v-col cols="12" md="4">
            <v-text-field
                :value="rssi"
                hide-details
                single-line
                type="number"
                :min="Constants.MIN_SELECTABLE_RSSI"
                :max="Constants.MAX_SELECTABLE_RSSI"
                @input="$emit('update:rssi', $event.target.value)"
            ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
            <v-btn icon="mdi-minus" size="small" @click.prevent="$emit('deleteParameter', props.gatewayId)"></v-btn>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import Constants from '@/other/Constants';

// Components
import GatewaysInDBSelection from '@/components/selection/GatewaysInDBSelection.vue';

const props = defineProps({
    gatewayId: { type: String, required: true },
    rssi: { type: Number, required: true },
});

defineEmits(['update:gatewayId', 'update:rssi', 'deleteParameter']);
</script>
