import React from 'react';
import { 
    Users, 
    BarChart3, 
    ShieldAlert, 
    TrendingUp, 
    Landmark, 
    Map as MapIcon,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Download,
    Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ExecutiveDashboard: React.FC = () => {
    const { t } = useLanguage();

    const kpis = [
        { 
            label: t.executive.kpis.revenue, 
            value: '₹84.2M', 
            change: '+12.5%', 
            trend: 'up', 
            icon: Landmark, 
            color: 'text-green-500',
            sub: 'Property + Professional Tax'
        },
        { 
            label: t.executive.kpis.compliance, 
            value: '91.4%', 
            change: '+2.1%', 
            trend: 'up', 
            icon: TrendingUp, 
            color: 'text-indigo-400',
            sub: 'Across 15 Municipal Wards'
        },
        { 
            label: t.executive.kpis.risk, 
            value: '24', 
            change: '-8.0%', 
            trend: 'down', 
            icon: ShieldAlert, 
            color: 'text-red-500',
            sub: 'Pending Forensic Audit'
        },
        { 
            label: t.executive.kpis.verified, 
            value: '1,402', 
            change: '+45', 
            trend: 'up', 
            icon: Users, 
            color: 'text-yellow-500',
            sub: 'Active Trust-IDs issued'
        }
    ];

    const wardPerformance = [
        { ward: 'W01 - T-Nagar', compliance: 94, revenue: '₹12.1M' },
        { ward: 'W04 - Anna Nagar', compliance: 92, revenue: '₹9.4M' },
        { ward: 'W08 - Adyar', compliance: 88, revenue: '₹7.2M' },
        { ward: 'W12 - Velachery', compliance: 85, revenue: '₹6.8M' },
        { ward: 'W15 - Mylapore', compliance: 96, revenue: '₹14.2M' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-reveal-up relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-40 left-0 -z-10 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px]" />

            {/* Executive Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-500 rounded-lg shadow-2xl shadow-indigo-500/50">
                            <Landmark className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="h-display text-4xl italic">
                            {t.executive.title.split(' ')[0]} <span className="text-glow text-indigo-400">{t.executive.title.split(' ')[1] || 'Command'}</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-xs font-black tracking-[0.3em] uppercase">{t.executive.subtitle} v3.1</p>
                </div>
                
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all group">
                        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" /> Export Report
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] transition-all">
                        <Zap className="h-4 w-4" /> Global Audit
                    </button>
                </div>
            </div>

            {/* Strategic KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
                {kpis.map((kpi, i) => (
                    <div key={i} className="glass-card p-8 rounded-[2rem] border-white/5 bg-white/[0.02] relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-500">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/10 transition-colors" />
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-slate-900 border border-white/5 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500 ${kpi.color}`}>
                                <kpi.icon className="h-6 w-6" />
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-black/20 text-[10px] font-black ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {kpi.change}
                            </div>
                        </div>
                        <h3 className="text-4xl font-black text-white mb-1 tracking-tighter tabular-nums">{kpi.value}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 group-hover:text-slate-200 transition-colors">{kpi.label}</p>
                        <p className="text-[9px] text-slate-600 font-medium">{kpi.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Ward Rankings */}
                <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="h-display text-2xl">{t.executive.wards.title.split(' ')[0]} <span className="text-glow text-indigo-400">{t.executive.wards.title.split(' ')[1]}</span></h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{t.executive.wards.analytics}</p>
                        </div>
                        <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors border-b border-indigo-400/20 pb-1">View All 48 Wards</button>
                    </div>

                    <div className="space-y-8">
                        {wardPerformance.map((ward, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-black text-slate-800 tabular-nums grayscale group-hover:grayscale-0 transition-all">0{i+1}</span>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{ward.ward}</p>
                                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Sector Priority Alpha</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-4">
                                            <span className="text-base font-black text-white tabular-nums">{ward.revenue}</span>
                                            <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20 shadow-lg shadow-green-500/5">
                                                {ward.compliance}% INDEX
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-500 transition-all duration-1000 group-hover:brightness-125 relative overflow-hidden" 
                                        style={{ width: `${ward.compliance}%` }}
                                    >
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Real-time Risk Activity */}
                <div className="glass-card p-10 rounded-[2.5rem] border-white/5 bg-red-500/[0.01] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                    
                    <h3 className="h-display text-2xl mb-10 flex items-center gap-3">
                        {t.executive.alerts.title.split(' ')[0]} <span className="text-glow text-red-500">{t.executive.alerts.title.split(' ')[1]}</span>
                    </h3>
                    
                    <div className="space-y-10">
                        {[
                            { ward: 'W04', msg: 'High concentration of pending taxes in Commercial Sector B.', time: '12m ago', severity: 'High' },
                            { ward: 'W08', msg: 'AI Scrutiny flagged 3 naming conflicts in Adyar cluster.', time: '45m ago', severity: 'Med' },
                            { ward: 'W15', msg: 'Target revenue threshold achieved for Q2.', time: '2h ago', severity: 'Low' }
                        ].map((alert, i) => (
                            <div key={i} className="flex gap-5 group cursor-default">
                                <div className={`w-1.5 shrink-0 rounded-full transition-all duration-300 group-hover:scale-y-110 ${
                                    alert.severity === 'High' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 
                                    alert.severity === 'Med' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 
                                    'bg-green-500 shadow-lg shadow-green-500/50'
                                }`} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">{alert.ward} • {alert.time}</p>
                                        <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border ${
                                            alert.severity === 'High' ? 'border-red-500/40 text-red-400' : 
                                            alert.severity === 'Med' ? 'border-yellow-500/40 text-yellow-400' : 
                                            'border-green-500/40 text-green-400'
                                        }`}>
                                            {alert.severity} Priority
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{alert.msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-14 p-8 bg-slate-950/80 rounded-[2rem] border border-white/5 border-dashed relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-500">
                        <div className="absolute inset-0 bg-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <MapIcon className="h-4 w-4 text-indigo-400" />
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{t.executive.alerts.global_map}</span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition-all" />
                        </div>
                        
                        <div className="aspect-[16/10] rounded-2xl bg-slate-900 flex flex-col items-center justify-center border border-white/5 shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="h-8 w-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin-slow mb-3" />
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] animate-pulse">Geo-Matrix Pre-loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
