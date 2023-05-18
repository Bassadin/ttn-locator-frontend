import TtnMapperDatapoint from '@/types/TtnMapperDatapoints';
import TtnLocatorDeviceGPSDatapoint from '@/types/DeviceGpsDatapoints/TtnLocatorDeviceGPSDatapoint';

export default class DeviceGPSDatapointWithTtnMapperDatapoints extends TtnLocatorDeviceGPSDatapoint {
    constructor(
        public id: number,
        public timestamp: string,
        public deviceId: string,
        public latitude: number,
        public longitude: number,
        public altitude: number,
        public hdop: number,
        public ttnMapperDatapoints: TtnMapperDatapoint[],
    ) {
        super(id, timestamp, deviceId, latitude, longitude, altitude, hdop);
    }
}
