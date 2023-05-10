import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_TTNMAPPER_LOCATOR_API_URL,
});

console.info(`Mounting AxiosInstance with baseURL: ${import.meta.env.VITE_TTNMAPPER_LOCATOR_API_URL}`);

export default axiosInstance;
