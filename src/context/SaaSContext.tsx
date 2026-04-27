import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Tenant {
    id: string;
    name: string;
    region: string;
    logo: string;
    color: string;
    modules: string[];
}

const TENANTS: Tenant[] = [
    {
        id: 'tn-chennai',
        name: 'Greater Chennai Corporation',
        region: 'North Tamil Nadu',
        logo: 'GCC',
        color: 'text-blue-500',
        modules: ['registry', 'citizen', 'payments', 'audit']
    },
    {
        id: 'tn-madurai',
        name: 'Madurai Municipality',
        region: 'South Tamil Nadu',
        logo: 'MMC',
        color: 'text-yellow-500',
        modules: ['registry', 'citizen']
    },
    {
        id: 'tn-coimbatore',
        name: 'Coimbatore Smart City',
        region: 'West Tamil Nadu',
        logo: 'CSC',
        color: 'text-green-500',
        modules: ['registry', 'citizen', 'payments', 'ai']
    }
];

interface SaaSContextType {
    currentTenant: Tenant;
    setTenant: (id: string) => void;
    tenants: Tenant[];
}

const SaaSContext = createContext<SaaSContextType | undefined>(undefined);

export const SaaSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTenant, setCurrentTenant] = useState<Tenant>(TENANTS[0]);

    const setTenant = (id: string) => {
        const tenant = TENANTS.find(t => t.id === id);
        if (tenant) setCurrentTenant(tenant);
    };

    return (
        <SaaSContext.Provider value={{ currentTenant, setTenant, tenants: TENANTS }}>
            {children}
        </SaaSContext.Provider>
    );
};

export const useSaaS = () => {
    const context = useContext(SaaSContext);
    if (!context) throw new Error('useSaaS must be used within a SaaSProvider');
    return context;
};
