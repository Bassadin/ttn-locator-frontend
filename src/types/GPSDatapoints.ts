import { LatLng } from 'leaflet';

export interface DeviceGPSDatapointTTNLocatorAPIResponse {
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

export interface TTNMapperGatewayAPIDeviceGPSDatapoint {
    dev_id: string;
    latitude: number;
    longitude: number;
    rssi: number;
    hdop: number;
}
