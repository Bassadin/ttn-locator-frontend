export default class Constants {
    public static readonly MIN_SELECTABLE_RSSI: number = -150;
    public static readonly MAX_SELECTABLE_RSSI: number = 0;

    public static readonly MIN_SELECTABLE_SNR: number = -20;
    public static readonly MAX_SELECTABLE_SNR: number = 20;

    public static readonly DEFAULT_SF_VALUE: number = 7;
    public static readonly MIN_SELECTABLE_SF: number = 7;
    public static readonly MAX_SELECTABLE_SF: number = 12;

    public static readonly HDOP_CUTOFF_POINT: number = 1.5;

    public static readonly DEFAULT_RSSI_CHECKING_RANGE: number = 3;
    public static readonly DEFAULT_SNR_CHECKING_RANGE: number = 2;
    public static readonly DEFAULT_RSSI_TO_RANGE_TOLERANCE_METERS: number = 100;
}
