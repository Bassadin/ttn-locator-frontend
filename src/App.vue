<template>
    <v-layout full-height>
        <v-navigation-drawer :rail="!mobile" :expand-on-hover="!mobile" v-model="showNavDrawer">
            <v-list>
                <v-list-item prepend-icon="mdi-map-marker-multiple" title="TTN Locator"></v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item prepend-icon="mdi-home" title="Overview" value="myfiles"></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main class="h-full">
            <v-btn
                v-if="mobile"
                class="absolute bottom-4 left-4 z-900"
                icon="mdi-menu"
                size="large"
                @click="showNavDrawer = !showNavDrawer"
            ></v-btn>
            <router-view></router-view>
        </v-main>
    </v-layout>
</template>

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

<script lang="ts" setup>
import { useTitle } from '@vueuse/core';
import { ref, computed } from 'vue';

// Vuetify
import { useDisplay } from 'vuetify';
const { mdAndUp, mobile } = useDisplay();

const title = useTitle();
title.value = 'TTN Locator';

const showNavDrawer = ref(false);
</script>
