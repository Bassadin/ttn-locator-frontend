<template>
    <div>
        <v-app-bar color="primary">
            <template #prepend>
                <v-app-bar-nav-icon variant="text" @click="showNavDrawer = !showNavDrawer" />
            </template>
            <v-app-bar-title>{{ title }}</v-app-bar-title>
            <template #append>
                <color-switcher-button />
            </template>
        </v-app-bar>
        <v-navigation-drawer v-model="showNavDrawer" :rail="!mobile" :expand-on-hover="!mobile">
            <v-list density="compact" nav>
                <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>

                <v-divider></v-divider>
                <v-list-subheader>Gateway-based</v-list-subheader>
                <v-list-item
                    prepend-icon="mdi-router-wireless"
                    title="Gateway Range (RSSI)"
                    to="/gateway_rssi"
                ></v-list-item>
                <v-list-item
                    prepend-icon="mdi-chart-scatter-plot"
                    title="RSSI Range Graph"
                    to="/rssi_range_graph"
                ></v-list-item>

                <v-divider></v-divider>
                <v-list-subheader>Management</v-list-subheader>
                <v-list-item prepend-icon="mdi-tooltip-account" title="Devices" to="/manage/devices"></v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useTitle } from '@vueuse/core';

// Components
import ColorSwitcherButton from '@/components/ColorSwitcherButton.vue';

// Vuetify
import { useDisplay } from 'vuetify';
const { mobile } = useDisplay();

const showNavDrawer = ref(true);

const title = useTitle();
title.value = 'TTN Locator';
</script>
