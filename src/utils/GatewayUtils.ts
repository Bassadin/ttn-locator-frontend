import Constants from '@/other/Constants';

// Types
import { TtnLocatorDeviceGPSDatapointWithSignalData } from '@/types/GPSDatapoints';
import { LatLng } from 'leaflet';
import * as turf from '@turf/turf';

// Axios
import axios from '@/plugins/axios';
import { AxiosResponse } from 'axios';
import { GatewaySimilarityParameterSelection, TtnLocatorGatewayData } from '@/types/Gateways';

export interface LinearRegressionValues {
    slope: number;
    intercept: number;
}

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
    ): Promise<TtnLocatorDeviceGPSDatapointWithSignalData[]> {
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

    public static getKilometerRadiusForRssi(rssi: number, customLinearRegression?: LinearRegressionValues): number {
        return (
            (customLinearRegression
                ? customLinearRegression.slope * rssi + customLinearRegression.intercept
                : -12 * rssi - 605) / 1000
        );
    }

    public static linearRegressionPrintString(linearRegressionData: { b: number; m: number }) {
        const roundedM = linearRegressionData.m.toFixed(3);
        const roundedB = linearRegressionData.b.toFixed(3);

        return `y = ${roundedM} * x + ${roundedB}`;
    }

    public static getTurfCircleGeoJSONFromGatewayData(
        gatewayData: GatewaySimilarityParameterSelection,
        radiusOffsetMeters = 0,
        customLinearRegression?: LinearRegressionValues,
    ) {
        const turfCenterPoint = turf.point([
            gatewayData.gatewayData.location.lng,
            gatewayData.gatewayData.location.lat,
        ]);
        // TODO: Dirty fix, but the types are weird here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: any = { steps: 50, units: 'kilometers' };

        const kilometerRadius =
            this.getKilometerRadiusForRssi(gatewayData.rssi, customLinearRegression) + radiusOffsetMeters / 1000;

        console.info(
            `Radius for gateway ${gatewayData.gatewayData.id} RSSI ${gatewayData.rssi} is ${kilometerRadius} km, location is ${gatewayData.gatewayData.location}`,
        );
        return turf.circle(turfCenterPoint, kilometerRadius, options);
    }
}
