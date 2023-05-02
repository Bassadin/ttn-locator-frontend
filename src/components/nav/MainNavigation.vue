<template>
    <v-app-bar :elevation="2" color="primary">
        <v-app-bar-nav-icon variant="text" @click="showNavDrawer = !showNavDrawer" />
        <v-app-bar-title>{{ title }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <color-switcher-button />
    </v-app-bar>
    <v-navigation-drawer v-model="showNavDrawer" :rail="!mobile" :expand-on-hover="!mobile">
        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>
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
        </v-list>
    </v-navigation-drawer>
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
