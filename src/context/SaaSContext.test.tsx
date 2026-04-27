import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SaaSProvider, useSaaS } from './SaaSContext';
import React from 'react';

describe('SaaSContext', () => {
    it('should provide default tenant', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SaaSProvider>{children}</SaaSProvider>
        );
        const { result } = renderHook(() => useSaaS(), { wrapper });

        expect(result.current.currentTenant.id).toBe('tn-chennai');
        expect(result.current.tenants.length).toBeGreaterThan(0);
    });

    it('should allow switching tenants', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SaaSProvider>{children}</SaaSProvider>
        );
        const { result } = renderHook(() => useSaaS(), { wrapper });

        act(() => {
            result.current.setTenant('tn-madurai');
        });

        expect(result.current.currentTenant.id).toBe('tn-madurai');
        expect(result.current.currentTenant.name).toContain('Madurai');
    });

    it('should ignore invalid tenant IDs', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SaaSProvider>{children}</SaaSProvider>
        );
        const { result } = renderHook(() => useSaaS(), { wrapper });

        act(() => {
            result.current.setTenant('invalid-id');
        });

        // Should remain on the previous tenant (default)
        expect(result.current.currentTenant.id).toBe('tn-chennai');
    });
});
