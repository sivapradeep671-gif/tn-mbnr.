import React from 'react';
import { useSaaS } from '../context/SaaSContext';
import { 
    Activity, 
    Server, 
    Users, 
    CreditCard, 
    AlertCircle, 
    CheckCircle2,
    BarChart3,
    Settings,
    MoreVertical
} from 'lucide-react';

export const SaaSAdmin: React.FC = () => {
    const { tenants } = useSaaS();

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">Platform <span className="text-glow">Control Center</span></h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Global Node Management & Multi-Tenant Analytics</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                        <Settings className="h-4 w-4" />
                        Platform Settings
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/20">
                        <Server className="h-4 w-4" />
                        Deploy New Node
                    </button>
                </div>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Nodes', value: '12', icon: Server, color: 'text-blue-500' },
                    { label: 'Active Citizens', value: '4.8M', icon: Users, color: 'text-green-500' },
                    { label: 'Monthly Revenue', value: '$84.2k', icon: CreditCard, color: 'text-yellow-500' },
                    { label: 'System Uptime', value: '99.99%', icon: Activity, color: 'text-purple-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <stat.icon className={`h-8 w-8 ${stat.color} mb-4`} />
                            <div className="text-2xl font-black mb-1">{stat.value}</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="h-24 w-24" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Tenant Management Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-yellow-500" />
                        Managed District Nodes
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Global Network Healthy</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-950/50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tenant / District</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Usage</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {tenants.map((tenant) => (
                                <tr key={tenant.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs ${tenant.color} border border-white/5 shadow-inner`}>
                                                {tenant.logo}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold">{tenant.name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{tenant.region}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-green-500">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Active
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest inline-block">
                                            {tenant.id === 'tn-chennai' ? 'Enterprise' : 'Smart City'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                                <span>Storage</span>
                                                <span>84%</span>
                                            </div>
                                            <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-[84%]" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                            <MoreVertical className="h-5 w-5 text-slate-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Alerts Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-black text-red-500 uppercase tracking-widest mb-1">Critical: SLA Breach Imminent</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Madurai Municipality Node reporting 12 applications exceeding the 7-day SLA window. Auto-escalation initiated.
                        </p>
                    </div>
                </div>
                <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl flex items-start gap-4">
                    <Server className="h-6 w-6 text-blue-500 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-1">System Update Scheduled</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Platform v1.3 deployment scheduled for all nodes on May 1st, 02:00 IST. Zero-downtime migration enabled.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
