import { useState, useEffect, useCallback, useRef } from 'react';
import type { Business, CitizenReport } from '../types/types';
import { api } from '../api/client';
import type { BusinessListResponse, BusinessSingleResponse } from '../types/api';
import { showToast } from './useToast';

export const useBusinesses = () => {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [reports, setReports] = useState<CitizenReport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const stateVersionRef = useRef(0);

    const fetchAll = useCallback(async () => {
        const currentVersion = ++stateVersionRef.current;
        setIsLoading(true);
        setError(null);
        try {
            const [bizRes, reportsRes] = await Promise.all([
                api.get<BusinessListResponse>('/businesses'),
                api.get<{ data: CitizenReport[] }>('/reports')
            ]);
            
            if (currentVersion !== stateVersionRef.current) return;

            if (bizRes.data) setBusinesses(bizRes.data);
            if (reportsRes.data) setReports(reportsRes.data);
        } catch (err) {
            if (currentVersion !== stateVersionRef.current) return;
            setError(err instanceof Error ? err.message : 'Sync failed');
            showToast('Sync failed', 'error');
        } finally {
            if (currentVersion === stateVersionRef.current) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const registerBusiness = async (business: Business) => {
        try {
            const response = await api.post<BusinessSingleResponse>('/businesses', business);
            const newBusiness = response.data || business;
            
            // Increment version to ignore any pending fetches that might be stale
            stateVersionRef.current++;
            setBusinesses(prev => [newBusiness, ...prev]);
            
            showToast('Business registered successfully', 'success');
            return newBusiness;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            showToast(message, 'error');
            throw err;
        }
    };

    const updateStatus = async (id: string, status: 'Verified' | 'Rejected') => {
        try {
            await api.put(`/admin/businesses/${id}/status`, { status });
            
            // Increment version to ignore any pending fetches
            stateVersionRef.current++;
            setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status } : b));
            
            showToast(`Status updated to ${status}`, 'success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Update failed';
            showToast(message, 'error');
            throw err;
        }
    };

    return {
        businesses,
        reports,
        isLoading,
        error,
        refresh: fetchAll,
        registerBusiness,
        updateStatus
    };
};
