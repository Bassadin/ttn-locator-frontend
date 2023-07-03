import axios from 'axios';

const baseURL = import.meta.env.TTN_LOCATOR_API_URL;

const axiosInstance = axios.create({
    baseURL: baseURL,
});

// add api key header from .env
axiosInstance.defaults.headers.common['x-api-key'] = import.meta.env.TTN_LOCATOR_API_KEY;

console.info(`Mounting AxiosInstance with baseURL: ${baseURL}`);

export default axiosInstance;
