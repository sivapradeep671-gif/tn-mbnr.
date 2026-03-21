import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToasts, showToast, dismissToast } from './useToast';

describe('useToasts Hook', () => {
    beforeEach(() => {
        // Reset the internal state for tests
        // This is a bit tricky since the state is global to the module.
        // We might need to export a reset function or rely on unique IDs.
        // For now, let's just make sure tests don't interfere with each other
        // if we use unique IDs.
        vi.useFakeTimers();
    });

    it('should start with an empty array of toasts', () => {
        const { result } = renderHook(() => useToasts());
        expect(result.current).toEqual([]);
    });

    it('should show a toast when showToast is called', () => {
        const { result } = renderHook(() => useToasts());
        
        act(() => {
            showToast('Test Message', 'success');
        });

        expect(result.current.length).toBe(1);
        expect(result.current[0].message).toBe('Test Message');
        expect(result.current[0].type).toBe('success');
    });

    it('should dismiss a toast after 5 seconds', () => {
        const { result } = renderHook(() => useToasts());
        
        act(() => {
            showToast('Wait Message', 'info');
        });

        expect(result.current.length).toBeGreaterThan(0);
        const toastId = result.current[0].id;

        act(() => {
            vi.advanceTimersByTime(5001);
        });

        const currentIds = result.current.map(t => t.id);
        expect(currentIds).not.toContain(toastId);
    });

    it('should manually dismiss a toast', () => {
        const { result } = renderHook(() => useToasts());
        
        act(() => {
            showToast('Manual Message', 'warning');
        });

        const toastId = result.current[result.current.length - 1].id;

        act(() => {
            dismissToast(toastId);
        });

        const currentIds = result.current.map(t => t.id);
        expect(currentIds).not.toContain(toastId);
    });
});
