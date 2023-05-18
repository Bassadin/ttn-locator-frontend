export default class TtnLocatorDeviceData {
    constructor(
        public deviceId: string,
        public subscription: boolean,
        public _count: {
            deviceGPSDatapoints: number;
        },
    ) {}
}
