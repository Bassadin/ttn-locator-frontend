import { LatLng } from 'leaflet';
import { TtnMapperDatapoint } from '@/types/TtnMapperDatapoints';

export interface TtnLocatorDeviceGPSDatapoint {
    id: number;
    timestamp: string;
    deviceId: string;
    latitude: number;
    longitude: number;
    altitude: number;
    hdop: number;
}

export interface TtnLocatorDeviceGPSDatapointWithRSSI extends TtnLocatorDeviceGPSDatapoint {
    rssi: number;
}

export interface DeviceGPSDatapointWithTtnMapperDatapoints extends TtnLocatorDeviceGPSDatapoint {
    ttnMapperDatapoints: TtnMapperDatapoint[];
}

export interface DeviceGPSDatapoint {
    deviceId: string;
    location: LatLng;
    hdop: number;
    id: number;
}

export function convertTtnLocatorDeviceGPSDatapointToNormal(
    ttnLocatorDeviceGPSDatapoint: TtnLocatorDeviceGPSDatapoint,
) {
    return {
        deviceId: ttnLocatorDeviceGPSDatapoint.deviceId,
        location: new LatLng(ttnLocatorDeviceGPSDatapoint.latitude, ttnLocatorDeviceGPSDatapoint.longitude),
        hdop: ttnLocatorDeviceGPSDatapoint.hdop,
        id: ttnLocatorDeviceGPSDatapoint.id,
    };
}

export function mapTtnLocatorApiResponseToDeviceGPSDatapoint(
    ttnLocatorDeviceGPSDatapoint: TtnLocatorDeviceGPSDatapoint,
): DeviceGPSDatapoint {
    return {
        deviceId: ttnLocatorDeviceGPSDatapoint.deviceId,
        location: new LatLng(ttnLocatorDeviceGPSDatapoint.latitude, ttnLocatorDeviceGPSDatapoint.longitude),
        hdop: ttnLocatorDeviceGPSDatapoint.hdop,
        id: ttnLocatorDeviceGPSDatapoint.id,
    };
}

export function stripRssiFromDeviceGPSDatapointWithRSSI(
    deviceGPSDatapointWithRssi: TtnLocatorDeviceGPSDatapointWithRSSI,
): DeviceGPSDatapoint {
    return {
        deviceId: deviceGPSDatapointWithRssi.deviceId,
        location: new LatLng(deviceGPSDatapointWithRssi.latitude, deviceGPSDatapointWithRssi.longitude),
        hdop: deviceGPSDatapointWithRssi.hdop,
        id: deviceGPSDatapointWithRssi.id,
    };
}

export interface TTNMapperGatewayAPIDeviceGPSDatapoint {
    dev_id: string;
    latitude: number;
    longitude: number;
    rssi: number;
    hdop: number;
}

export interface RssiSimilarityFilter {
    gatewayId: string;
    minRssi: number;
    maxRssi: number;
}
