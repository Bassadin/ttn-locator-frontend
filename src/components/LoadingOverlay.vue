<template>
    <v-overlay v-model="isCurrentlyLoading" class="align-center justify-center" persistent>
        <v-progress-circular indeterminate size="64"></v-progress-circular
    ></v-overlay>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({ modelValue: { type: Boolean, required: true } });
const emits = defineEmits(['update:modelValue']);

const isCurrentlyLoading = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emits('update:modelValue', value);
    },
});
</script>
