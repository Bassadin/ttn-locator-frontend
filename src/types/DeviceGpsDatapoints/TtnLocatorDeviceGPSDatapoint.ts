import { LatLng } from 'leaflet';
import DeviceGPSDatapoint from './DeviceGPSDatapoint';

export default class TtnLocatorDeviceGPSDatapoint {
    constructor(
        public id: number,
        public timestamp: string,
        public deviceId: string,
        public latitude: number,
        public longitude: number,
        public altitude: number,
        public hdop: number,
    ) {}

    public mapToDeviceGPSDatapoint(): DeviceGPSDatapoint {
        return new DeviceGPSDatapoint(this.deviceId, new LatLng(this.latitude, this.longitude), this.hdop, this.id);
    }
}
