export default class TtnMapperDatapoint {
    constructor(
        public id: number,
        public timestamp: string,
        public deviceGPSDatapointId: number,
        public gatewayId: string,
        public rssi: number,
        public snr: number,
    ) {}
}
