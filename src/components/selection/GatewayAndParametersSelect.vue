<template>
    <v-sheet border rounded elevation="4" class="p-4 mb-4">
        <v-row>
            <v-col cols="12" md="6">
                <GatewaysInDBSelection v-model="gatewayId" />
            </v-col>
            <v-col cols="10" md="4">
                <v-text-field
                    v-model.number="rssi"
                    type="number"
                    label="RSSI"
                    :min="Constants.MIN_SELECTABLE_RSSI"
                    :max="Constants.MAX_SELECTABLE_RSSI"
                ></v-text-field>
            </v-col>
            <v-col cols="2" md="2">
                <v-btn icon="mdi-minus" size="small" @click.prevent="$emit('deleteParameter', props.gatewayId)"></v-btn>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script setup lang="ts">
import Constants from '@/other/Constants';
import { computed } from 'vue';

// Components
import GatewaysInDBSelection from '@/components/selection/GatewaysInDBSelection.vue';

const props = defineProps({
    gatewayId: { type: String, required: true },
    rssi: { type: Number, required: true },
});

const emit = defineEmits(['update:gatewayId', 'update:rssi', 'deleteParameter']);

const gatewayId = computed({
    get() {
        return props.gatewayId;
    },
    set(value) {
        emit('update:gatewayId', value);
    },
});

const rssi = computed({
    get() {
        return props.rssi;
    },
    set(value) {
        emit('update:rssi', value);
    },
});
</script>
