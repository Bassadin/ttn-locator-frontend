import { LinearRegressionValues } from '@/utils/GatewayUtils';
import { LatLng } from 'leaflet';

export interface GatewayData {
    id: string;
    location: LatLng;
}

export interface GatewaySimilarityParameterSelection {
    gatewayData: GatewayData;
    rssi: number;
    snr?: number;
    linearRegressionValues?: LinearRegressionValues;
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
    linearRegressionSlope?: number;
    linearRegressionIntercept?: number;
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
