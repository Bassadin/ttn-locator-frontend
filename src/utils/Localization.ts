import { LatLng } from 'leaflet';
import * as turf from '@turf/turf';

export function findCenterOfLatLongs(latLongs: LatLng[]): LatLng {
    const turfPoints = latLongs.map((latLong) => {
        return turf.point([latLong.lng, latLong.lat]);
    });

    const center = turf.centroid(turf.featureCollection(turfPoints));
    const coordiantes = center.geometry.coordinates;

    return new LatLng(coordiantes[1], coordiantes[0]);
}
