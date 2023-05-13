import { LatLng } from 'leaflet';

export interface DeviceGPSDatapointTTNLocatorAPIResponse {
    data: TtnLocatorDeviceGPSDatapoint[];
}

export interface TtnLocatorDeviceGPSDatapoint {
    id: number;
    timestamp: string;
    deviceId: string;
    latitude: number;
    longitude: number;
    altitude: number;
    hdop: number;
}

export interface DeviceGPSDatapoint {
    deviceId: string;
    location: LatLng;
    hdop: number;
}

export function mapTtnLocatorApiResponseToDeviceGPSDatapoint(
    ttnLocatorDeviceGPSDatapoint: TtnLocatorDeviceGPSDatapoint,
): DeviceGPSDatapoint {
    return {
        deviceId: ttnLocatorDeviceGPSDatapoint.deviceId,
        location: new LatLng(ttnLocatorDeviceGPSDatapoint.latitude, ttnLocatorDeviceGPSDatapoint.longitude),
        hdop: ttnLocatorDeviceGPSDatapoint.hdop,
    };
}

export function stripRssiFromDeviceGPSDatapointWithRSSI(
    deviceGPSDatapointWithRssi: TtnLocatorDeviceGPSDatapointWithRSSI,
): DeviceGPSDatapoint {
    return {
        deviceId: deviceGPSDatapointWithRssi.deviceId,
        location: new LatLng(deviceGPSDatapointWithRssi.latitude, deviceGPSDatapointWithRssi.longitude),
        hdop: deviceGPSDatapointWithRssi.hdop,
    };
}

export interface TTNMapperGatewayAPIDeviceGPSDatapoint {
    dev_id: string;
    latitude: number;
    longitude: number;
    rssi: number;
    hdop: number;
}

export interface TtnLocatorDeviceGPSDatapointWithRSSI {
    deviceId: string;
    latitude: number;
    longitude: number;
    hdop: number;
    altitude: number;
    rssi: number;
}

// gps_datapoints_with_rssi
export interface TtnLocatorDeviceGPSDatapointWithRSSIApiResponse {
    message: string;
    data: TtnLocatorDeviceGPSDatapointWithRSSI[];
}

export interface RssiSimilarityFilter {
    gatewayId: string;
    minRssi: number;
    maxRssi: number;
}
