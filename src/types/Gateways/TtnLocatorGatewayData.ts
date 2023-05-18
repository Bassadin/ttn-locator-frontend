export default class TtnLocatorGatewayData {
    constructor(
        public gatewayId: string,
        public latitude: number,
        public longitude: number,
        public altitude: number,
        public _count: {
            ttnmapperDatapoints: number;
        },
        public name?: string,
        public description?: string,
    ) {}
}
