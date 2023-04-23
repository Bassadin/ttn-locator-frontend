import { LatLng } from 'leaflet';

export interface DeviceGPSDatapointAPIResponse {
    data: {
        id: number;
        timestamp: string;
        deviceId: string;
        latitude: number;
        longitude: number;
        altitude: number;
        hdop: number;
    }[];
}

export interface DeviceGPSDatapoint {
    deviceId: string;
    location: LatLng;
}
