import type { LicenseStatus } from './types';

export type ScanStatus = 'VALID' | 'EXPIRED' | 'LOCATION_MISMATCH' | 'COUNTERFEIT' | 'INVALID' | 'ERROR';

export interface QRVerificationLicense {
    status: LicenseStatus;
    message: string;
    color: 'green' | 'yellow' | 'orange' | 'red';
    daysOverdue?: number;
}

export interface ScanResult {
    status: ScanStatus;
    message: string;
    business?: {
        name: string;
        legalName?: string;
        gst?: string;
        id: string;
        lat: number;
        lng: number;
    };
    license?: QRVerificationLicense;
    verifiedAt?: string;
}

export interface QRTokenPayload {
    id: string;
    name: string;
    lat: number;
    lng: number;
    exp: number;
    nonce: string;
}

export interface QRTokenResponse {
    token: string;
}
