import { createApp } from 'vue';
import '@/style.scss';
import App from '@/App.vue';

const vue = createApp(App);

// Vuetify
import vuetify from '@/plugins/vuetify';
vue.use(vuetify);

// Axios
import axios from '@/plugins/axios';
import { AxiosKey } from '@/symbols';
vue.provide(AxiosKey, axios);

vue.mount('#app');
