export interface TtnMapperDatapoint {
    id: number;
    timestamp: string;
    deviceGPSDatapointId: number;
    gatewayId: string;
    rssi: number;
    snr: number;
}
