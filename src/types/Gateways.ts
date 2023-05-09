import { LatLng } from 'leaflet';
import { DeviceGPSDatapoint } from '@/types/GPSDatapoints';

export interface GatewayData {
    id: string;
    location: LatLng;
}

export interface GatewayRssiSelection {
    gatewayData: GatewayData;
    rssi: number;
    deviceGpsDatapoints: DeviceGPSDatapoint[];
}

export interface TTNMapperGatewayAPIResponse {
    message: string;
    data: {
        gatewayId: string;
        latitude: number;
        longitude: number;
        altitude: number;
        createdAt: string;
        updatedAt: string;
    }[];
}

export interface TtnLocatorGatewayApiResponse {
    message: string;
    data: TtnLocatorGatewayData[];
}

export interface TtnLocatorGatewayData {
    gatewayId: string;
    name?: string;
    description?: string;
    latitude: number;
    longitude: number;
    altitude: number;
    _count: {
        ttnmapperDatapoints: number;
    };
}

// Packetbroker GW API (https://mapper.packetbroker.net/api/v2/gateways/netID=000013,tenantID=ttn,id=hfu-lr8-001)
export interface PacketbrokerGatewayAPIResponse {
    id: string;
    location: {
        latitude: number;
        longitude: number;
        altitude: number;
    };
    online: boolean;
}
