import { useState, useEffect, useCallback } from 'react';
import type { Business } from '../types/types';
import { api } from '../api/client';
import type { BusinessListResponse, BusinessSingleResponse } from '../types/api';
import { showToast } from './useToast';

export const useBusinesses = () => {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [bizRes, reportsRes] = await Promise.all([
                api.get<BusinessListResponse>('/businesses'),
                api.get<{ reports: any[] }>('/reports')
            ]);
            
            if (bizRes.data) setBusinesses(bizRes.data);
            if (reportsRes.reports) setReports(reportsRes.reports);
        } catch (err: any) {
            setError(err.message);
            showToast('Sync failed', 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const registerBusiness = async (business: Business) => {
        try {
            const response = await api.post<BusinessSingleResponse>('/businesses', business);
            const newBusiness = response.data || business;
            setBusinesses(prev => [newBusiness, ...prev]);
            showToast('Business registered successfully', 'success');
            return newBusiness;
        } catch (err: any) {
            showToast(err.message || 'Registration failed', 'error');
            throw err;
        }
    };

    const updateStatus = async (id: string, status: 'Verified' | 'Rejected') => {
        try {
            await api.put(`/admin/businesses/${id}/status`, { status });
            setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status } : b));
            showToast(`Status updated to ${status}`, 'success');
        } catch (err: any) {
            showToast(err.message || 'Update failed', 'error');
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
