import axios, { AxiosResponse } from 'axios';
import { LatLng } from 'leaflet';

export default class GatewayUtils {
    public static doesGatewayIdExist(gatewayId: string): Promise<boolean> {
        const doesGatewayIdExist: Promise<boolean> = axios
            .get(`https://mapper.packetbroker.net/api/v2/gateways/netID=000013,tenantID=ttn,id=${gatewayId}`)
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
            .get(`https://mapper.packetbroker.net/api/v2/gateways/netID=000013,tenantID=ttn,id=${gatewayId}`)
            .then((response: AxiosResponse) => {
                const responseData = response.data;

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
}
