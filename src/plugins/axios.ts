import axios from 'axios';

const baseURL = import.meta.env.VITE_TTN_LOCATOR_API_URL;

const axiosInstance = axios.create({
    baseURL: baseURL,
});

console.info(`Mounting AxiosInstance with baseURL: ${baseURL}`);

export default axiosInstance;
