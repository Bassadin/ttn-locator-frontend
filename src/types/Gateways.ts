import { LatLng } from 'leaflet';

export interface GatewayData {
    id: string;
    location: LatLng;
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
    latitude: number;
    longitude: number;
    altitude: number;
}

export interface PacketbrokerGatewayAPIResponse {
    id: string;
    location: {
        latitude: number;
        longitude: number;
        altitude: number;
    };
    online: boolean;
}
