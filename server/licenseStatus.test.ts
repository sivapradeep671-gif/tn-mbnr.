import { describe, it, expect } from 'vitest';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { calculateLicenseTimestamps, calculateLicenseStatus } = require('./licenseStatus.cjs');

describe('License Status Utilities', () => {
    describe('calculateLicenseTimestamps', () => {
        it('should calculate dates exactly 1 year from registration', () => {
            const regDate = '2024-01-01T00:00:00.000Z';
            const result = calculateLicenseTimestamps(regDate);

            expect(result.license_valid_till).toBe('2025-01-01T00:00:00.000Z');
            expect(result.grace_ends_at).toBe('2025-01-31T00:00:00.000Z'); // +30 days
            expect(result.pay_by_date).toBe('2025-01-01T00:00:00.000Z');
            expect(result.license_status).toBe('ACTIVE');
        });
    });

    describe('calculateLicenseStatus', () => {
        it('should return ACTIVE for current licenses', () => {
            const row = {
                license_status: 'ACTIVE',
                license_valid_till: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
                payment_done: 1
            };
            const result = calculateLicenseStatus(row);
            expect(result.status).toBe('ACTIVE');
        });

        it('should return GRACE_PERIOD if expired but within 30 days', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            const nextMonth = new Date();
            nextMonth.setDate(nextMonth.getDate() + 29);

            const row = {
                license_status: 'ACTIVE',
                license_valid_till: yesterday.toISOString(),
                grace_ends_at: nextMonth.toISOString(),
                payment_done: 1
            };
            const result = calculateLicenseStatus(row);
            expect(result.status).toBe('GRACE_PERIOD');
        });

        it('should return EXPIRED if past grace period', () => {
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const row = {
                license_status: 'ACTIVE',
                license_valid_till: lastYear.toISOString(),
                grace_ends_at: lastMonth.toISOString(),
                payment_done: 1
            };
            const result = calculateLicenseStatus(row);
            expect(result.status).toBe('EXPIRED');
        });
    });
});
