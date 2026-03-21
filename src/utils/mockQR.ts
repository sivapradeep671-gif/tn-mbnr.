import type { ScanResult } from '../types/scan';

export const verifyMockToken = (token: string, _location: { lat: number, lng: number }): ScanResult => {
    const isKPN = token.includes('KPN') || token.toLowerCase().includes('kpn');
    
    if (isKPN) {
        return {
            status: 'VALID',
            message: 'Mock verification successful',
            business: {
                id: 'MOCK-1',
                name: 'KPN Travels',
                legalName: 'KPN Travels India Pvt Ltd',
                lat: 13.0694,
                lng: 80.1914,
                gst: '33AAACK1234A1Z1'
            },
            license: {
                status: 'ACTIVE',
                message: 'License Active & Paid',
                color: 'green'
            }
        };
    }

    return {
        status: 'INVALID',
        message: 'Mock Verification Failed: Token not recognized.',
    };
};
