import axios, { CreateAxiosDefaults } from 'axios';
import type { App } from 'vue';

const axiosOptions: CreateAxiosDefaults = {
    baseURL: import.meta.env.TTNMAPPER_LOCATOR_API_URL as string,
};

export default {
    install: (app: App) => {
        app.config.globalProperties.$axios = axios.create(axiosOptions);
    },
};
