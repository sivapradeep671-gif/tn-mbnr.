import React, { useState, useEffect } from 'react';
import { ChevronRight, LayoutDashboard, Database, Search, Activity, ShieldCheck, Zap, AlertTriangle, MapPin, Bot } from 'lucide-react';
import { aiService } from '../services/geminiService';
import type { Business, CitizenReport } from '../types/types';
import { api } from '../api/client';
import { AdminAnalytics } from './AdminAnalytics';

interface DashboardProps {
    businesses: Business[];
    reports: CitizenReport[];
    onUpdateStatus: (id: string, status: 'Verified' | 'Rejected') => void;
}

interface SuspiciousScan {
    id: number;
    business_id: string;
    token: string;
    scan_lat: number;
    scan_lng: number;
    result: string;
    distance?: number;
    scanned_at: string;
    tradeName?: string;
}

interface RiskyShop {
    shop_name: string;
    failed_scans: number;
    risk_score: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ businesses, reports, onUpdateStatus }) => {
    const [activeTab, setActiveTab] = useState<'businesses' | 'reports' | 'analytics' | 'prediction'>('businesses');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [predictionModel, setPredictionModel] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [realShops, setRealShops] = useState<Business[]>([]);
    const [suspiciousScans, setSuspiciousScans] = useState<SuspiciousScan[]>([]);
    const [riskyShops, setRiskyShops] = useState<RiskyShop[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const shopsRes = await api.get<{ shops: any[] }>('/admin/shops');
                setRealShops(shopsRes.shops);
                
                const suspiciousRes = await api.get<{ scans: any[], top_risky_shops: any[] }>('/admin/suspicious');
                setSuspiciousScans(suspiciousRes.scans);
                setRiskyShops(suspiciousRes.top_risky_shops);
            } catch (e) {
                console.error("Failed to fetch admin stats:", e);
                setRealShops(businesses);
            }
        };
        fetchStats();
    }, [businesses]);

    const displayShops = realShops.length > 0 ? realShops : businesses;

    const stats = {
        total: displayShops.length,
        verified: displayShops.filter((b: Business) => b.status === 'Verified').length,
        pending: displayShops.filter((b: Business) => b.status === 'Pending').length,
        rejected: displayShops.filter((b: Business) => b.status === 'Rejected').length
    };

    const filteredBusinesses = displayShops.filter((b: Business) => 
        b.tradeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.legalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 reveal-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-yellow-500 rounded-2xl shadow-2xl shadow-yellow-500/20 rotate-3">
                        <LayoutDashboard className="h-8 w-8 text-slate-950" />
                    </div>
                    <div>
                        <h1 className="h-display text-4xl mb-1 mt-0">Governance <span className="text-glow">Console</span></h1>
                        <p className="text-slate-500 text-sm font-bold tracking-[0.2em] uppercase">Enterprise Registry Management v2.4</p>
                    </div>
                </div>
                
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                    <button 
                        onClick={() => setActiveTab('businesses')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === 'businesses' ? 'bg-white text-slate-950 shadow-2xl' : 'text-slate-400 hover:text-white'}`}
                    >
                        Master Registry
                    </button>
                    <button 
                        onClick={() => setActiveTab('reports')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === 'reports' ? 'bg-white text-slate-950 shadow-2xl' : 'text-slate-400 hover:text-white'}`}
                    >
                        Civic Intelligence
                    </button>
                    <button 
                        onClick={() => setActiveTab('prediction')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === 'prediction' ? 'bg-yellow-500 text-slate-950 shadow-2xl' : 'text-slate-400 hover:text-white'}`}
                    >
                        AI Prediction
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Assets', value: stats.total, icon: Database, color: 'text-white', bg: 'bg-white/5' },
                    { label: 'Authenticated', value: stats.verified, icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Pending Audit', value: stats.pending, icon: Activity, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                    { label: 'Revoked', value: stats.rejected, icon: Zap, color: 'text-red-500', bg: 'bg-red-500/10' }
                ].map((stat, i) => (
                    <div key={i} className={`glass-card p-6 rounded-3xl border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500`}>
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-8 -mt-8 blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700`} />
                        <div className="relative z-10">
                            <stat.icon className={`h-5 w-5 ${stat.color} mb-4`} />
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                            <p className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {activeTab === 'businesses' && (
                <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden mb-12 shadow-2xl">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,1)]"></div>
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Registry Stream</h2>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Filter records..."
                            className="bg-slate-950/50 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10 transition-all w-full md:w-80 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.01] text-slate-500 text-[10px] uppercase font-black tracking-[0.4em]">
                            <tr>
                                <th className="px-8 py-5">Verified Identity</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Audit Status</th>
                                <th className="px-8 py-5">Integrity Rank</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredBusinesses.map((business: Business) => (
                                <tr key={business.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black text-md group-hover:text-yellow-500 transition-colors tracking-tight">{business.tradeName}</span>
                                            <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase mt-1 opacity-60">ID: {business.id.slice(0, 12)}...</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className="px-3 py-1 bg-white/5 text-slate-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-white/5">
                                            {business.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {business.status === 'Verified' ? (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-black rounded-xl border border-green-500/20">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                    AUTHENTICATED
                                                </div>
                                            ) : business.status === 'Pending' ? (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-500 text-[10px] font-black rounded-xl border border-yellow-500/20">
                                                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                                                    UNVERIFIED
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-black rounded-xl border border-red-500/20">
                                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                                    REVOKED
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ${
                                                        (business.riskScore || 0) < 3 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                                                        (business.riskScore || 0) < 6 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                                    }`}
                                                    style={{ width: `${((10 - (business.riskScore || 5)) / 10) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-500">{(10 - (business.riskScore || 5)).toFixed(1)}/10</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {business.status === 'Pending' ? (
                                                <>
                                                    <button 
                                                        onClick={() => onUpdateStatus(business.id, 'Verified')}
                                                        className="px-4 py-2 bg-white text-slate-950 text-[10px] font-black rounded-xl hover:bg-yellow-500 transition-all uppercase shadow-xl active:scale-95"
                                                    >
                                                        Authenticate
                                                    </button>
                                                    <button 
                                                        onClick={() => onUpdateStatus(business.id, 'Rejected')}
                                                        className="px-4 py-2 bg-red-500/10 text-red-500 text-[10px] font-black rounded-xl hover:bg-red-500 hover:text-white transition-all uppercase border border-red-500/20 active:scale-95"
                                                    >
                                                        Revoke
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="flex items-center gap-2 group/btn text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase py-2 px-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 active:scale-95">
                                                    View Traceability <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

            {activeTab === 'analytics' && (
                <AdminAnalytics stats={stats} />
            )}

            {activeTab === 'reports' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Activity className="h-4 w-4 text-yellow-500" />
                                    Live Security Feed
                                </h3>
                            </div>
                            <div className="p-8 space-y-6">
                                {suspiciousScans.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <ShieldCheck className="h-12 w-12 text-green-500/20 mx-auto mb-4" />
                                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">No Security Anomalies Detected</p>
                                    </div>
                                ) : (
                                    suspiciousScans.map((scan: SuspiciousScan, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-red-500/20 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${
                                                    scan.result === 'COUNTERFEIT' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                    <AlertTriangle className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm">{scan.tradeName || 'Unknown Shop'}</p>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                                                        {scan.result.replace('_', ' ')} • {new Date(scan.scanned_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest leading-none mb-1">Mismatch</p>
                                                <p className="text-white font-mono text-xs">{Math.round(scan.distance || 0)}m</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="glass-card rounded-[2.5rem] border-white/5 p-12 text-center animate-fade-in shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 mesh-gradient opacity-20 pointer-events-none" />
                            <div className="max-w-md mx-auto relative z-10">
                                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                                    <Activity className="h-8 w-8 text-yellow-500" />
                                </div>
                                <h2 className="h-display text-2xl mb-2 mt-0">Civic <span className="text-glow">Reports</span></h2>
                                <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">Integrated reports from citizens for municipal action.</p>
                                
                                <div className="grid grid-cols-1 gap-4 text-left">
                                    {reports.length === 0 ? (
                                        <div className="p-12 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01] text-center">
                                            <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.3em]">No Active Grievances</p>
                                        </div>
                                    ) : (
                                        reports.map(report => (
                                            <div key={report.id} className="glass-card p-6 rounded-2xl border-white/5 hover:border-yellow-500/30 transition-all duration-300">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-white font-black uppercase tracking-tight">{report.businessName}</span>
                                                    <span className={`text-[9px] px-2 py-1 rounded-lg font-black uppercase tracking-widest ${
                                                        report.status === 'Submitted' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                                    }`}>{report.status}</span>
                                                </div>
                                                <p className="text-slate-400 text-xs font-medium italic border-l-2 border-yellow-500/30 pl-4 mb-4">"{report.description}"</p>
                                                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {report.location}</span>
                                                    <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {report.category}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
                            <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-8">Asset Risk Profile</h3>
                            <div className="space-y-6">
                                {riskyShops.map((shop: RiskyShop, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-end mb-2">
                                            <p className="text-xs font-black text-white uppercase tracking-tight">{shop.shop_name}</p>
                                            <p className="text-[10px] font-mono text-red-500">{(shop.risk_score || 0).toFixed(1)}%</p>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000" style={{ width: `${shop.risk_score}%` }}></div>
                                        </div>
                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-2">{shop.failed_scans} Suspicious Events</p>
                                    </div>
                                ))}
                                {riskyShops.length === 0 && (
                                    <p className="text-[10px] text-slate-600 font-black uppercase text-center py-6">All Nodes Stable</p>
                                )}
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-yellow-500/10 to-transparent border-white/10 relative overflow-hidden group">
                            <div className="relative z-10">
                                <ShieldCheck className="h-8 w-8 text-yellow-500 mb-4" />
                                <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-2">Security Standard 4.0</h4>
                                <p className="text-slate-400 text-[10px] leading-relaxed mb-6">Your municipal identity grid is currently under 256-bit HMAC protection with active geofencing.</p>
                                <button className="w-full py-3 bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-yellow-500 transition-all active:scale-95">
                                    Refresh Grid
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'prediction' && (
                <div className="glass-card rounded-[2.5rem] border-white/5 p-12 text-center animate-fade-in shadow-2xl min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-yellow-500/5 backdrop-blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-yellow-500/20">
                            <Bot className="h-10 w-10 text-yellow-500" />
                        </div>
                        <h2 className="h-display text-4xl mb-4 italic">Predictive <span className="text-glow">Fraud Pulse</span></h2>
                        <p className="text-slate-400 text-sm mb-12 leading-relaxed">Let Gemini 2.0 analyze your current scan telemetry to identify hidden hotspots and future risk vectors.</p>
                        
                        {!predictionModel ? (
                            <button 
                                onClick={async () => {
                                    setIsAnalyzing(true);
                                    // Deep analysis simulation
                                    const logs = JSON.stringify(suspiciousScans.slice(0, 5));
                                    const prompt = `Analyze these scan logs and predict future fraud trends for Tamil Nadu. Keep it in 3 bullet points. Logs: ${logs}`;
                                    try {
                                        const res = await aiService.getChatResponse(prompt, []);
                                        setPredictionModel(res);
                                    } finally {
                                        setIsAnalyzing(false);
                                    }
                                }}
                                disabled={isAnalyzing}
                                className="px-12 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-yellow-500 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isAnalyzing ? 'Processing Telemetry...' : 'Initialize AI Audit'}
                            </button>
                        ) : (
                            <div className="text-left bg-slate-950/50 p-8 rounded-3xl border border-white/10 animate-in zoom-in-95 duration-500">
                                <div className="flex items-center gap-2 text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-6">
                                    <Zap className="h-3 w-3" /> Gemini Intelligence Output
                                </div>
                                <div className="text-slate-200 text-sm leading-relaxed space-y-4 font-medium whitespace-pre-wrap">
                                    {predictionModel}
                                </div>
                                <button 
                                    onClick={() => setPredictionModel('')}
                                    className="mt-8 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                                >
                                    Reset Neural Path
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};