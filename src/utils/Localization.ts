import { LatLng } from 'leaflet';
import * as turf from '@turf/turf';

export interface CircleWithRadius {
    center: LatLng;
    radius: number;
}

export function findCenterOfLatLongsWithHalfCoveringRadius(latLongs: LatLng[]): CircleWithRadius {
    const turfPoints = latLongs.map((latLong) => turf.point([latLong.lng, latLong.lat]));
    const featureCollection = turf.featureCollection(turfPoints);

    const pointsCentroid = turf.centerOfMass(featureCollection);
    const centerCoordiantes = pointsCentroid.geometry.coordinates;

    const distancesToCentroidPoint = turfPoints
        .map((point) => turf.distance(turf.point(centerCoordiantes), point, { units: 'meters' }))
        .sort((a, b) => a - b);

    console.debug('distancesToCentroidPoint', distancesToCentroidPoint);

    const halfwayPointIndex = Math.floor(distancesToCentroidPoint.length / 2);

    return {
        center: new LatLng(centerCoordiantes[1], centerCoordiantes[0]),
        radius: distancesToCentroidPoint[halfwayPointIndex],
    };
}
