import GatewayData from '@/types/Gateways/GatewayData';

export default class GatewayRssiSelection {
    constructor(public gatewayData: GatewayData, public rssi: number) {}
}
