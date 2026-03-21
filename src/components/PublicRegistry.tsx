import React, { useState } from 'react';
import { Search, MapPin, Building2, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { Business } from '../types/types';

interface PublicRegistryProps {
    businesses: Business[];
}

export const PublicRegistry: React.FC<PublicRegistryProps> = ({ businesses }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBusinesses = businesses.filter(b =>
        (b.tradeName?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (b.legalName?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (b.id?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex p-3 rounded-full bg-blue-500/10 mb-4">
                    <ShieldCheck className="h-8 w-8 text-blue-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">MBNR Public Registry</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Verify the legitimacy of businesses operating in Tamil Nadu. Our transparent blockchain-backed registry allows citizens to search for any registered entity.</p>
            </div>

            <div className="relative max-w-2xl mx-auto mb-12">
                <Search className="absolute left-4 top-4 h-6 w-6 text-slate-500" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Business Name, Legal Name, or Registration ID..."
                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-lg text-white focus:border-blue-500 outline-none transition-all shadow-lg"
                />
            </div>

            <div className="space-y-6">
                {filteredBusinesses.map(business => (
                    <div key={business.id} className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="p-4 bg-slate-950 rounded-lg shrink-0">
                            <Building2 className="h-8 w-8 text-blue-400" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">{business.tradeName}</h3>
                                {business.status === 'Verified' && <CheckCircle className="h-5 w-5 text-green-500" />}
                                {business.status === 'Pending' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                            </div>
                            <p className="text-sm text-slate-400 mb-4">Legal Entity: {business.legalName} • ID: {business.id}</p>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm">
                                <div className="flex items-start text-slate-300">
                                    <MapPin className="h-4 w-4 text-slate-500 mr-2 shrink-0 mt-0.5" />
                                    <span>{business.address}</span>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 w-full sm:w-auto text-right">
                            <div className={`inline-block px-4 py-2 rounded-lg font-bold text-sm ${business.status === 'Verified' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                {business.status?.toUpperCase() ?? 'UNKNOWN'}
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                                Registered on: {new Date(business.registrationDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredBusinesses.length === 0 && (
                    <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                        <Search className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">No businesses found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};