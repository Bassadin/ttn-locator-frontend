import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import tsconfigPaths from 'vite-tsconfig-paths';
import importMetaEnv from '@import-meta-env/unplugin';
import path from 'path';

// UnoCSS
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths(),
        vue(),
        vuetify(),
        UnoCSS({
            mode: 'vue-scoped',
        }),
        importMetaEnv.vite({ example: '.env.sample' }),
    ],
    resolve: {
        alias: {
            // Hard override since vite-tsconfig-paths doesn't seem to work for this right now
            '@': path.resolve(__dirname, './src'),
        },
    },
});
