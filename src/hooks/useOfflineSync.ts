import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { showToast } from './useToast';

interface SyncAction {
    id: string;
    type: 'CERTIFY' | 'REPORT' | 'TAX_PAYMENT' | 'INSPECTION';
    payload: any;
    timestamp: number;
}

export const useOfflineSync = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncQueue, setSyncQueue] = useState<SyncAction[]>([]);

    // Initialize queue from localStorage
    useEffect(() => {
        const savedQueue = localStorage.getItem('tn_mbnr_sync_queue');
        if (savedQueue) {
            setSyncQueue(JSON.parse(savedQueue));
        }
    }, []);

    // Monitor Online Status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            showToast('Connectivity Restored. Synchronizing records...', 'success');
        };
        const handleOffline = () => {
            setIsOnline(false);
            showToast('Operating in Offline Mode. Actions will be queued.', 'warning');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const addToSyncQueue = useCallback((type: SyncAction['type'], payload: any) => {
        const newAction: SyncAction = {
            id: crypto.randomUUID(),
            type,
            payload,
            timestamp: Date.now()
        };

        setSyncQueue(prev => {
            const updated = [...prev, newAction];
            localStorage.setItem('tn_mbnr_sync_queue', JSON.stringify(updated));
            return updated;
        });
        
        if (!isOnline) {
            showToast(`Offline: ${type} queued for later sync.`, 'info');
        } else {
            // Trigger background sync attempt
            processQueue();
        }
    }, [isOnline]);

    const processQueue = useCallback(async () => {
        if (!isOnline || syncQueue.length === 0) return;

        // Process sequentially to maintain ledger integrity
        for (const action of [...syncQueue]) {
            try {
                // Map actions to real API calls
                switch (action.type) {
                    case 'INSPECTION':
                        await api.put(`/admin/businesses/${action.payload.businessId}/status`, { 
                            status: action.payload.status,
                            inspectorHash: action.payload.hash 
                        });
                        break;
                    case 'REPORT':
                        await api.post('/reports', action.payload);
                        break;
                    case 'CERTIFY':
                        await api.post('/businesses', action.payload);
                        break;
                    default:
                        console.log(`Processing simulated sync for ${action.type}`);
                }

                // Remove only the successfully processed item
                setSyncQueue(prev => {
                    const filtered = prev.filter(item => item.id !== action.id);
                    localStorage.setItem('tn_mbnr_sync_queue', JSON.stringify(filtered));
                    return filtered;
                });

            } catch (error) {
                console.error(`Sync failed for ${action.id}:`, error);
                // We stop processing the rest of the queue if we hit a network error
                // to maintain order, or we skip if it's a validation error.
                break; 
            }
        }

        const remaining = JSON.parse(localStorage.getItem('tn_mbnr_sync_queue') || '[]');
        if (syncQueue.length > 0 && remaining.length === 0) {
            showToast(`Ledger synchronization complete.`, 'success');
        }
    }, [isOnline, syncQueue]);

    // Attempt to process queue whenever coming online
    useEffect(() => {
        if (isOnline && syncQueue.length > 0) {
            const timer = setTimeout(() => {
                processQueue();
            }, 2000); // Wait 2s for stable connection
            return () => clearTimeout(timer);
        }
    }, [isOnline, syncQueue.length, processQueue]);

    return {
        isOnline,
        syncQueueLength: syncQueue.length,
        addToSyncQueue,
        processQueue
    };
};
