import { LatLng } from 'leaflet';

export default class GatewayData {
    constructor(public id: string, public location: LatLng) {}
}
