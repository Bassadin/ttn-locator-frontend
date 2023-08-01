<template>
    <v-sheet border rounded elevation="4" class="p-4 mb-4">
        <v-row>
            <v-col cols="12" md="6">
                <GatewaysInDBSelection v-model="gatewaySimilarityParameters.gatewayData.id" />
            </v-col>
            <v-col cols="6" :md="props.displaySnrSelection ? 2 : 4">
                <v-text-field
                    v-model.number="gatewaySimilarityParameters.rssi"
                    type="number"
                    label="RSSI"
                    :min="Constants.MIN_SELECTABLE_RSSI"
                    :max="Constants.MAX_SELECTABLE_RSSI"
                ></v-text-field>
            </v-col>
            <v-col v-if="props.displaySnrSelection" cols="6" md="2">
                <v-text-field
                    v-model.number="gatewaySimilarityParameters.snr"
                    type="number"
                    label="SNR"
                    :min="Constants.MIN_SELECTABLE_SNR"
                    :max="Constants.MAX_SELECTABLE_SNR"
                ></v-text-field>
            </v-col>
            <v-col cols="2" md="2">
                <v-btn
                    icon="mdi-minus"
                    size="small"
                    @click.prevent="$emit('deleteParameter', props.gatewaySimilarityParameters.gatewayData.id)"
                ></v-btn>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script setup lang="ts">
import Constants from '@/other/Constants';
import { computed } from 'vue';

// Components
import GatewaysInDBSelection from '@/components/selection/GatewaysInDBSelection.vue';
import { GatewaySimilarityParameterSelection } from '@/types/Gateways';

interface Props {
    gatewaySimilarityParameters: GatewaySimilarityParameterSelection;
    displaySnrSelection?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    displaySnrSelection: false,
});

const emit = defineEmits(['update:gatewayId', 'update:gatewaySimilarityParameters', 'deleteParameter']);

const gatewaySimilarityParameters = computed({
    get() {
        return props.gatewaySimilarityParameters;
    },
    set(value) {
        emit('update:gatewayId', value);
    },
});
</script>
