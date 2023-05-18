export default class TtnMapperGatewayAPIResponse {
    constructor(
        public message: string,
        public data: {
            gatewayId: string;
            latitude: number;
            longitude: number;
            altitude: number;
            createdAt: string;
            updatedAt: string;
        }[],
    ) {}
}
