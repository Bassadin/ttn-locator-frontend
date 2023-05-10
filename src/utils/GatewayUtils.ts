import { TTNMapperGatewayAPIDeviceGPSDatapoint } from '@/types/GPSDatapoints';
import axios, { AxiosResponse } from 'axios';
import { LatLng } from 'leaflet';

export default class GatewayUtils {
    public static doesGatewayIdExist(gatewayId: string): Promise<boolean> {
        const doesGatewayIdExist: Promise<boolean> = axios
            .get(`https://www.thethingsnetwork.org/gateway-data/gateway/${gatewayId}`)
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(() => {
                return false;
            });

        return doesGatewayIdExist;
    }

    public static getGatewayLocationForGatewayId(gatewayId: string): Promise<LatLng | null> {
        return axios
            .get(`https://www.thethingsnetwork.org/gateway-data/gateway/${gatewayId}`)
            .then((response: AxiosResponse) => {
                const responseData = response.data[gatewayId];

                if (responseData.location === undefined) {
                    return null;
                }

                if (responseData.location.latitude == 0 && responseData.location.longitude == 0) {
                    return null;
                }

                const location = new LatLng(responseData.location.latitude, responseData.location.longitude);

                return location;
            })
            .catch(() => {
                return null;
            });
    }

    public static getLastXDaysGpsDatapointsForGatewayId(
        gatewayId: string,
        amountOfDays = 30,
    ): Promise<TTNMapperGatewayAPIDeviceGPSDatapoint[]> {
        const last30DaysDateString = new Date(Date.now() - amountOfDays * 24 * 60 * 60 * 1000).toISOString();

        return axios
            .get(`https://api.ttnmapper.org/gateway/data?gateway_id=${gatewayId}&start_time=${last30DaysDateString}`)
            .then((response: AxiosResponse) => {
                return response.data;
            });
    }
}
