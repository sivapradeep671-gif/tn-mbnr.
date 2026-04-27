import React from 'react';
import { useSaaS } from '../context/SaaSContext';
import { ChevronDown, MapPin, Globe, CheckCircle2 } from 'lucide-react';

export const TenantSelector: React.FC = () => {
    const { currentTenant, tenants, setTenant } = useSaaS();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all group"
            >
                <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-black text-[10px] ${currentTenant.color} border border-white/5 shadow-inner`}>
                    {currentTenant.logo}
                </div>
                <div className="text-left hidden sm:block">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Active Tenant</div>
                    <div className="text-xs font-bold text-white truncate max-w-[120px]">{currentTenant.name}</div>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full mt-2 right-0 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-slate-800">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Switch District Node</h4>
                        </div>
                        <div className="p-2 space-y-1">
                            {tenants.map((tenant) => (
                                <button
                                    key={tenant.id}
                                    onClick={() => {
                                        setTenant(tenant.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                        currentTenant.id === tenant.id 
                                        ? 'bg-yellow-500/10 border border-yellow-500/20' 
                                        : 'hover:bg-white/5 border border-transparent'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs ${tenant.color} border border-white/5`}>
                                        {tenant.logo}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-white">{tenant.name}</div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                            <MapPin className="h-2.5 w-2.5" />
                                            {tenant.region}
                                        </div>
                                    </div>
                                    {currentTenant.id === tenant.id && (
                                        <CheckCircle2 className="h-4 w-4 text-yellow-500 ml-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="p-3 bg-slate-950/50 border-t border-slate-800">
                            <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all flex items-center justify-center gap-2">
                                <Globe className="h-3 w-3" />
                                Request New Node
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
