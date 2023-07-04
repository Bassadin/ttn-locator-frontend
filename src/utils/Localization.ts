import { LatLng } from 'leaflet';
import * as turf from '@turf/turf';

export interface CircleWithRadius {
    center: LatLng;
    radius: number;
}

export function findCenterOfLatLongsWithHalfCoveringRadius(latLongs: LatLng[]): CircleWithRadius {
    if (latLongs.length === 0) {
        throw new Error('Cannot find center of empty array');
    }

    if (latLongs.length === 1) {
        console.debug('Only one point, returning point as center with radius 0');
        return {
            center: latLongs[0],
            radius: 0,
        };
    }

    console.debug(`Finding center of ${latLongs.length} points`);

    const turfPoints = latLongs.map((latLong) => turf.point([latLong.lng, latLong.lat]));
    const featureCollection = turf.featureCollection(turfPoints);

    const pointsCenter = turf.centroid(featureCollection);
    const centerCoordiantes = pointsCenter.geometry.coordinates;

    const distancesToCentroidPoint = turfPoints
        .map((point) => turf.distance(pointsCenter, point, { units: 'meters' }))
        .sort((a, b) => a - b); // sort ascending

    const halfwayPointIndex = Math.floor(distancesToCentroidPoint.length / 2);

    console.debug(
        `Found center at ${centerCoordiantes[1]}, ${centerCoordiantes[0]} with radius ${distancesToCentroidPoint[halfwayPointIndex]}`,
    );

    return {
        center: new LatLng(centerCoordiantes[1], centerCoordiantes[0]),
        radius: distancesToCentroidPoint[halfwayPointIndex],
    };
}
