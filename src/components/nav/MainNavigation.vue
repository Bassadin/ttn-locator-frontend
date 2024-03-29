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
        <v-navigation-drawer v-model="showNavDrawer" :expand-on-hover="!mobile">
            <v-list-item density="compact" nav>
                <v-list-item prepend-icon="mdi-home" title="Home" :to="{ name: 'home' }" />

                <v-divider></v-divider>
                <v-list-subheader>Localization options</v-list-subheader>
                <v-list-item
                    prepend-icon="mdi-vector-circle-variant"
                    title="RSSI to Range Multilateration"
                    :to="{ name: 'rssi_to_range_multilateration' }"
                />
                <v-list-item
                    prepend-icon="mdi-gesture-tap-hold"
                    title="Fingerprinting"
                    :to="{ name: 'fingerprinting' }"
                />
                <!-- TODO: The hard gateway ID here is a hack, fix later -->
                <v-list-item
                    prepend-icon="mdi-chart-scatter-plot"
                    title="RSSI to Range Graph"
                    :to="{ name: 'rssi_range_graph', params: { gatewayId: 'hfu-lr8-001' } }"
                />
                <v-list-item
                    prepend-icon="mdi-chart-scatter-plot"
                    title="SNR to Range Graph"
                    :to="{ name: 'snr_range_graph', params: { gatewayId: 'hfu-lr8-001' } }"
                />

                <v-divider></v-divider>
                <v-list-subheader>Gateway data</v-list-subheader>
                <v-list-item
                    prepend-icon="mdi-router-wireless"
                    title="Gateway Range (RSSI)"
                    :to="{ name: 'gateway_rssi', params: { gatewayId: 'hfu-lr8-001' } }"
                />

                <v-divider></v-divider>
                <v-list-subheader>Management</v-list-subheader>
                <v-list-item prepend-icon="mdi-cellphone-marker" title="Devices" :to="{ name: 'manage_devices' }" />
                <v-list-item
                    prepend-icon="mdi-router-wireless-settings"
                    title="Gateways"
                    :to="{ name: 'manage_gateways' }"
                />

                <v-divider></v-divider>
                <v-list-subheader>Stats</v-list-subheader>
                <v-list-item
                    v-list
                    prepend-icon="mdi-chart-bar"
                    title="Device GPS Datapoints"
                    :to="{ name: 'device_gps_datapoints_stats' }"
                />
                <v-list-item
                    v-list
                    prepend-icon="mdi-arrow-left-right"
                    title="Spreading Factors Usage Stats"
                    :to="{ name: 'spreading_factors_usage_stats' }"
                />
            </v-list-item>
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
