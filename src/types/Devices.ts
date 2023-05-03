export interface TtnLocatorDeviceData {
    deviceId: string;
    subscription: boolean;
}

export interface TtnLocatorDeviceApiResponse {
    message: string;
    data: TtnLocatorDeviceData[];
}
