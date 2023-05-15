import Constants from '@/other/Constants';
import { TtnLocatorDeviceGPSDatapointWithRSSI } from '@/types/GPSDatapoints';
import { LatLng } from 'leaflet';

// Axios
import axios from '@/plugins/axios';
import { AxiosResponse } from 'axios';
import { TtnLocatorGatewayData } from '@/types/Gateways';

export default class GatewayUtils {
    public static doesGatewayIdExist(gatewayId: string): Promise<boolean> {
        const doesGatewayIdExist: Promise<boolean> = axios
            .get(`/gateways/${gatewayId}`)
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
            .get(`/gateways/${gatewayId}`)
            .then((response: AxiosResponse<{ message: string; data: TtnLocatorGatewayData }>) => {
                const responseData: TtnLocatorGatewayData = response.data.data;

                if (responseData.latitude == 0 && responseData.longitude == 0) {
                    return null;
                }

                return new LatLng(responseData.latitude, responseData.longitude);
            })
            .catch(() => {
                return null;
            });
    }

    public static getLastXDaysGpsDatapointsForGatewayId(
        gatewayId: string,
        minRssi = -500,
        maxRssi = 0,
    ): Promise<TtnLocatorDeviceGPSDatapointWithRSSI[]> {
        return axios
            .get(`/gateways/${gatewayId}/gps_datapoints_with_rssi`, {
                params: {
                    hdop_filter: Constants.HDOP_CUTOFF_POINT,
                    min_rssi: minRssi,
                    max_rssi: maxRssi,
                },
            })
            .then((response: AxiosResponse) => {
                return response.data.data;
            });
    }
}
