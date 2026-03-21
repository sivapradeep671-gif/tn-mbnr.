import { describe, it, expect } from 'vitest';
import { verifyMockToken } from './mockQR';

describe('verifyMockToken', () => {
    it('should return VALID result if token contains "KPN"', () => {
        const result = verifyMockToken('KPN-TOKEN', { lat: 13, lng: 80 });
        expect(result.status).toBe('VALID');
        expect(result.business?.name).toBe('KPN Travels');
    });

    it('should return INVALID result if token does not contain "KPN"', () => {
        const result = verifyMockToken('RANDOM-TOKEN', { lat: 13, lng: 80 });
        expect(result.status).toBe('INVALID');
        expect(result.message).toContain('Token not recognized');
    });

    it('should be case-insensitive for "KPN"', () => {
        const result = verifyMockToken('kpn-test', { lat: 13, lng: 80 });
        expect(result.status).toBe('VALID');
    });
});
