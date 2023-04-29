<template>
    <v-app>
        <v-layout full-height>
            <v-app-bar :elevation="2" rounded>
                <v-app-bar-nav-icon variant="text" @click="showNavDrawer = !showNavDrawer" />
                <v-app-bar-title>TTN Locator</v-app-bar-title>
            </v-app-bar>
            <v-navigation-drawer v-model="showNavDrawer" :rail="!mobile" :expand-on-hover="!mobile">
                <v-list density="compact" nav>
                    <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-router-wireless"
                        title="Gateway Range (RSSI)"
                        to="/gateway_rssi"
                    ></v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-main class="h-full">
                <router-view></router-view>
            </v-main>
        </v-layout>
    </v-app>
</template>

<script lang="ts" setup>
import { useTitle } from '@vueuse/core';
import { ref } from 'vue';

// Vuetify
import { useDisplay } from 'vuetify';
const { mobile } = useDisplay();

const title = useTitle();
title.value = 'TTN Locator';

const showNavDrawer = ref(true);
</script>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
