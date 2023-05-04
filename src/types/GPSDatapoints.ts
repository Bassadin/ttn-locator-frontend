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
