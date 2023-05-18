import { LatLng } from 'leaflet';
import DeviceGPSDatapoint from './DeviceGPSDatapoint';
import TtnLocatorDeviceGPSDatapoint from './TtnLocatorDeviceGPSDatapoint';

export default class TtnLocatorDeviceGPSDatapointWithRSSI extends TtnLocatorDeviceGPSDatapoint {
    constructor(
        public id: number,
        public timestamp: string,
        public deviceId: string,
        public latitude: number,
        public longitude: number,
        public altitude: number,
        public hdop: number,
        public rssi: number,
    ) {
        super(id, timestamp, deviceId, latitude, longitude, altitude, hdop);
    }

    public toNormalGpsDatapoint(): DeviceGPSDatapoint {
        return new DeviceGPSDatapoint(this.deviceId, new LatLng(this.latitude, this.longitude), this.hdop, this.id);
    }
}
