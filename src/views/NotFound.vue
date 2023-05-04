<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const notFoundPageName: Ref<string> = ref(route.params.pathMatch.toString());
</script>

<template>
    <!-- 404 page -->
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>404</v-card-title>
                    <v-card-text>
                        <p>Page '{{ notFoundPageName }}'' not found</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
