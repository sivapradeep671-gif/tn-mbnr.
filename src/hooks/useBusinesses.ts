import { useState, useEffect, useCallback, useRef } from 'react';
import type { Business, CitizenReport } from '../types/types';
import { api } from '../api/client';
import { useOfflineSync } from './useOfflineSync';
import type { BusinessListResponse, BusinessSingleResponse } from '../types/api';
import { showToast } from './useToast';

export const useBusinesses = () => {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [reports, setReports] = useState<CitizenReport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const stateVersionRef = useRef(0);
    const { isOnline, addToSyncQueue } = useOfflineSync();

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

            if (bizRes.data) {
                setBusinesses(bizRes.data);
                localStorage.setItem('tn_mbnr_cache_businesses', JSON.stringify(bizRes.data));
            }
            if (reportsRes.data) {
                setReports(reportsRes.data);
                localStorage.setItem('tn_mbnr_cache_reports', JSON.stringify(reportsRes.data));
            }
        } catch (err) {
            if (currentVersion !== stateVersionRef.current) return;
            
            // Fallback to cache
            const cachedBiz = localStorage.getItem('tn_mbnr_cache_businesses');
            const cachedReports = localStorage.getItem('tn_mbnr_cache_reports');
            
            if (cachedBiz) {
                setBusinesses(JSON.parse(cachedBiz));
                showToast('Operating on Local Cache: API Grid Unreachable', 'warning');
            } else {
                setError(err instanceof Error ? err.message : 'Sync failed');
                showToast('Grid Sync Failed: Running Sandbox Mode', 'error');
            }

            if (cachedReports) {
                setReports(JSON.parse(cachedReports));
            }
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
        if (!isOnline) {
            // Optimistic Update
            setBusinesses(prev => [business, ...prev]);
            addToSyncQueue('CERTIFY', business);
            showToast('Offline Mode: Registration queued locally', 'warning');
            return business;
        }

        try {
            const response = await api.post<BusinessSingleResponse>('/businesses', business);
            const newBusiness = response.data || business;
            
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

    const updateStatus = async (id: string, status: 'Verified' | 'Rejected', hash?: string) => {
        // Optimistic Update
        setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        
        if (!isOnline) {
            addToSyncQueue('INSPECTION', { businessId: id, status, hash });
            showToast('Action queued for background synchronization', 'info');
            return;
        }

        try {
            await api.put(`/admin/businesses/${id}/status`, { status, inspectorHash: hash });
            stateVersionRef.current++;
            showToast(`Status updated to ${status}`, 'success');
        } catch (err) {
            // Rollback on failure if online
            fetchAll(); 
            const message = err instanceof Error ? err.message : 'Update failed';
            showToast(message, 'error');
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
