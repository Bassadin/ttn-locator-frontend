export interface TtnLocatorDeviceData {
    deviceId: string;
    subscription: boolean;
    _count: {
        deviceGPSDatapoints: number;
    };
}

export interface TtnLocatorDeviceApiResponse {
    message: string;
    data: TtnLocatorDeviceData[];
}
