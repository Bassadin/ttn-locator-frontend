import { LatLng } from 'leaflet';

export interface GatewayData {
    id: string;
    location: LatLng;
}

export interface GatewayAPIResponse {
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
