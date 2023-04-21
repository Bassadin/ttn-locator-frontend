import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths(), vue(), vuetify()],
    resolve: {
        alias: {
            // Hard override since vite-tsconfig-paths doesn't seem to work for this right now
            '@': path.resolve(__dirname, './src'),
        },
    },
});
