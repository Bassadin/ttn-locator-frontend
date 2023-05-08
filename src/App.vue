<template>
    <v-app>
        <v-layout full-height>
            <main-navigation />
            <v-main class="h-full">
                <router-view />
            </v-main>
        </v-layout>
    </v-app>
</template>

<script lang="ts" setup>
import MainNavigation from '@/components/nav/MainNavigation.vue';
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
