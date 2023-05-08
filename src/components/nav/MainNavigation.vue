<template>
    <div>
        <v-app-bar color="primary">
            <template #prepend>
                <v-app-bar-nav-icon variant="text" @click="showNavDrawer = !showNavDrawer" />
                <v-icon class="ml-4" icon="mdi-wifi-marker"></v-icon>
            </template>
            <v-app-bar-title>{{ title }}</v-app-bar-title>
            <template #append>
                <color-switcher-button />
            </template>
        </v-app-bar>
        <v-navigation-drawer v-model="showNavDrawer" :rail="!mobile" :expand-on-hover="!mobile">
            <v-list density="compact" nav>
                <v-list-item prepend-icon="mdi-home" title="Home" :to="{ name: 'home' }"></v-list-item>

                <v-divider></v-divider>
                <v-list-subheader>Gateway-based</v-list-subheader>
                <v-list-item
                    prepend-icon="mdi-router-wireless"
                    title="Gateway Range (RSSI)"
                    :to="{ name: 'gateway_rssi', params: { gatewayId: 'hfu-lr8-001' } }"
                ></v-list-item>
                <!-- TODO: The hard gateway ID here is a hack, fix later -->
                <v-list-item
                    prepend-icon="mdi-chart-scatter-plot"
                    title="RSSI Range Graph"
                    :to="{ name: 'rssi_range_graph', params: { gatewayId: 'hfu-lr8-001' } }"
                ></v-list-item>

                <v-divider></v-divider>
                <v-list-subheader>Management</v-list-subheader>
                <v-list-item
                    prepend-icon="mdi-cellphone-marker"
                    title="Devices"
                    :to="{ name: 'manage_devices' }"
                ></v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useTitle } from '@vueuse/core';

// Components
import ColorSwitcherButton from '@/components/ColorSwitcherButton.vue';

// Vuetify
import { useDisplay } from 'vuetify';
import { useRoute } from 'vue-router';
const { mobile } = useDisplay();

const showNavDrawer = ref(true);

const title = useTitle('', { titleTemplate: '%s | TTN Locator' });
const route = useRoute();

// fetch the user information when params change
const DEFAULT_TITLE = 'Default Title';
watch(
    () => route.meta.title,
    async (newRouteTitle) => {
        console.debug(`Route changed, updating title to ${newRouteTitle ?? DEFAULT_TITLE}`);
        title.value = (newRouteTitle ?? DEFAULT_TITLE).toString();
    },
);
</script>
