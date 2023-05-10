import Constants from '@/other/Constants';
import { TtnLocatorDeviceGPSDatapointWithRSSI } from '@/types/GPSDatapoints';
import { LatLng } from 'leaflet';

// Axios
import axios from '@/plugins/axios';
import { AxiosResponse } from 'axios';

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
    ): Promise<TtnLocatorDeviceGPSDatapointWithRSSI[]> {
        return axios
            .get(`/gateways/${gatewayId}/gps_datapoints_with_rssi?hdop_filter=${Constants.HDOP_CUTOFF_POINT}`)
            .then((response: AxiosResponse) => {
                return response.data.data;
            });
    }
}
