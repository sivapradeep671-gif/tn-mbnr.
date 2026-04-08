import React from 'react';
import { BarChart3, TrendingUp, PieChart, Info } from 'lucide-react';

interface AnalyticsProps {
    stats: {
        total: number;
        verified: number;
        pending: number;
        rejected: number;
        sla_compliant: number;
        sla_breached: number;
        sla_urgent: number;
        aging_0_3: number;
        aging_3_7: number;
        aging_7_plus: number;
    };
}

export const AdminAnalytics: React.FC<AnalyticsProps> = ({ stats }) => {
    // Simulated Monthly Data
    const monthlyData = [
        { month: 'Jan', count: 45 },
        { month: 'Feb', count: 52 },
        { month: 'Mar', count: 68 },
        { month: 'Apr', count: 85 },
        { month: 'May', count: 92 },
        { month: 'Jun', count: stats.total }
    ];

    const maxCount = Math.max(...monthlyData.map((d: {count: number}) => d.count));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Trend Analysis */}
            <div className="glass-card p-10 rounded-[2.5rem] border-white/5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500 rounded-2xl shadow-2xl shadow-yellow-500/20">
                            <BarChart3 className="h-6 w-6 text-slate-950" />
                        </div>
                        <div>
                            <h3 className="h-display text-xl mb-0 mt-0">Registration <span className="text-glow">Growth</span></h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">H1 2024 Audit</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-between h-48 gap-4 mt-8">
                    {monthlyData.map((data: {month: string, count: number}, i: number) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                            <div 
                                className="w-full bg-white/5 rounded-t-xl group-hover:bg-yellow-500/50 transition-all duration-700 relative"
                                style={{ height: `${(data.count / maxCount) * 100}%` }}
                            >
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                                    {data.count}
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-4">{data.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Integrity Distribution */}
            <div className="glass-card p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-green-500 rounded-2xl shadow-2xl shadow-green-500/20">
                        <PieChart className="h-6 w-6 text-slate-950" />
                    </div>
                    <div>
                        <h3 className="h-display text-xl mb-0 mt-0">Registry <span className="text-glow">Integrity</span></h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Global Status Map</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {[
                        { label: 'Validated', count: stats.verified, color: 'bg-green-500', percent: (stats.verified / (stats.total || 1)) * 100 },
                        { label: 'Audit Required', count: stats.pending, color: 'bg-yellow-500', percent: (stats.pending / (stats.total || 1)) * 100 },
                        { label: 'Revoked', count: stats.rejected, color: 'bg-red-500', percent: (stats.rejected / (stats.total || 1)) * 100 }
                    ].map((item: {label: string, count: number, color: string, percent: number}, i: number) => (
                        <div key={i}>
                            <div className="flex justify-between items-end mb-3">
                                <p className="text-white font-black text-xs uppercase tracking-tight">{item.label}</p>
                                <p className="text-[10px] font-black text-slate-500">{item.count} NODES • {item.percent.toFixed(1)}%</p>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className={`h-full ${item.color} shadow-lg transition-all duration-1000`} 
                                    style={{ width: `${item.percent}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <Info className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        Live data synchronization with Municipality Servers (Simulated). Baseline integrity index: 94.2% based on pilot metrics.
                    </p>
                </div>
            </div>

            {/* SLA Performance Dashboard */}
            <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] border-white/5 shadow-2xl relative overflow-hidden bg-white/[0.01]">
                <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/10 blur-3xl -ml-16 -mt-16" />
                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl shadow-xl">
                        <TrendingUp className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                        <h3 className="h-display text-xl mb-0 mt-0">SLA <span className="text-glow">Velocity</span></h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Efficiency Metrics (TN Business Facilitation Act)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {[
                         { 
                            label: 'SLA Compliant', 
                            value: stats.sla_compliant, 
                            desc: 'Processing within legal timeframe', 
                            color: 'text-green-500', 
                            bg: 'bg-green-500/10',
                            percent: (stats.sla_compliant / (stats.total || 1)) * 100
                        },
                        { 
                            label: 'At Risk (Urgent)', 
                            value: stats.sla_urgent, 
                            desc: 'Breach expected < 72 hours', 
                            color: 'text-yellow-500', 
                            bg: 'bg-yellow-500/10',
                            percent: (stats.sla_urgent / (stats.total || 1)) * 100
                        },
                        { 
                            label: 'Breach / Lapsed', 
                            value: stats.sla_breached, 
                            desc: 'Escalated to Nodal Officer', 
                            color: 'text-red-500', 
                            bg: 'bg-red-500/10',
                            percent: (stats.sla_breached / (stats.total || 1)) * 100
                        }
                    ].map((card, idx) => (
                        <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative group hover:border-white/10 transition-all">
                             <div className="flex justify-between items-start mb-6">
                                <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${card.bg} ${card.color}`}>
                                    {card.label}
                                </div>
                                <span className="text-[10px] text-slate-500 font-black">{card.percent.toFixed(0)}%</span>
                            </div>
                            <div className="text-4xl font-black text-white mb-2 tracking-tighter">{card.value} <span className="text-xs text-slate-500 font-medium">APPS</span></div>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                            <div className="absolute bottom-0 left-0 h-1 bg-yellow-500 transition-all duration-700 w-0 group-hover:w-full opacity-30 shadow-[0_0_15px_rgba(234,179,8,1)]" />
                        </div>
                    ))}
                </div>

                {/* Aging Report */}
                <div className="mt-12 pt-12 border-t border-white/5">
                    <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-10">Pendency Aging Report</h4>
                    <div className="flex items-end justify-between h-32 gap-6 px-4">
                        {[
                            { label: '0-3 Days', count: stats.aging_0_3, color: 'bg-green-500/50', desc: 'Active' },
                            { label: '4-7 Days', count: stats.aging_3_7, color: 'bg-yellow-500/50', desc: 'Warning' },
                            { label: '7+ Days', count: stats.aging_7_plus, color: 'bg-red-500/50', desc: 'Breached' }
                        ].map((data, i) => {
                            const maxAge = Math.max(stats.aging_0_3, stats.aging_3_7, stats.aging_7_plus, 1);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center group">
                                    <div 
                                        className={`w-full ${data.color} rounded-t-xl group-hover:brightness-125 transition-all duration-700 relative`}
                                        style={{ height: `${(data.count / maxAge) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            {data.count}
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-[8px] text-white font-black uppercase tracking-widest">{data.label}</p>
                                        <p className="text-[6px] text-slate-500 font-black uppercase tracking-tighter mt-1">{data.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Geographic Heatmap Indicator */}
            <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] border-white/5 shadow-2xl bg-gradient-to-br from-yellow-500/5 to-transparent relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <TrendingUp className="h-6 w-6 text-yellow-500" />
                            <h3 className="h-display text-2xl mb-0 mt-0">Pilot <span className="text-glow">Acceleration</span></h3>
                        </div>
                        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                            TrustReg TN is successfully mitigating counterfeit risks in the Anna Nagar and T-Nagar pilot sectors. Scan volume has increased by 140% since Phase 1 rollout.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                            <p className="text-3xl font-black text-white tracking-tighter mb-1">+140%</p>
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Scan Vol</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                            <p className="text-3xl font-black text-green-500 tracking-tighter mb-1">-70%</p>
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Fraud hits</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
