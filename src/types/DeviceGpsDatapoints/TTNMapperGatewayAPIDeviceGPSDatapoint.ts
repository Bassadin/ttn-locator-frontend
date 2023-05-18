export default class TTNMapperGatewayAPIDeviceGPSDatapoint {
    constructor(
        public dev_id: string,
        public latitude: number,
        public longitude: number,
        public rssi: number,
        public hdop: number,
    ) {}
}
