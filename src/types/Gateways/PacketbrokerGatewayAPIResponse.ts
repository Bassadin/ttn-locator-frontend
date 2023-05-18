// Packetbroker GW API (https://mapper.packetbroker.net/api/v2/gateways/netID=000013,tenantID=ttn,id=hfu-lr8-001)
export default class PacketbrokerGatewayAPIResponse {
    constructor(
        public id: string,
        public location: {
            latitude: number;
            longitude: number;
            altitude: number;
        },
        public online: boolean,
    ) {}
}
