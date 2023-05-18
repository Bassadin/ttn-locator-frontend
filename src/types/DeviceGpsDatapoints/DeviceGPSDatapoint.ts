import { LatLng } from 'leaflet';

export default class DeviceGPSDatapoint {
    constructor(public deviceId: string, public location: LatLng, public hdop: number, public id: number) {}
}
