import axios, { CreateAxiosDefaults } from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_TTNMAPPER_LOCATOR_API_URL,
});

export default axiosInstance;
