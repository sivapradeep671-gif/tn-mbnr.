import React, { useState } from 'react';
import { Shield, Zap, Search, AlertTriangle, CheckCircle2, Navigation, Database, Radio } from 'lucide-react';
import type { Business } from '../types/types';
import { api } from '../api/client';
import { showToast } from '../hooks/useToast';

interface FieldAuditSimulatorProps {
    businesses: Business[];
    onAuditComplete: () => void;
}

export const FieldAuditSimulator: React.FC<FieldAuditSimulatorProps> = ({ businesses, onAuditComplete }) => {
    const [selectedId, setSelectedId] = useState<string>('');
    const [distanceOffset, setDistanceOffset] = useState<number>(0);
    const [isPulsing, setIsPulsing] = useState(false);
    const [auditResult, setAuditResult] = useState<any>(null);
    const [simulatedPath, setSimulatedPath] = useState<string[]>([]);

    const verifiedBusinesses = businesses.filter(b => b.status === 'Verified');
    const targetBusiness = verifiedBusinesses.find(b => b.id === selectedId);

    const runAuditDrill = async () => {
        if (!targetBusiness) return;
        
        setIsPulsing(true);
        setAuditResult(null);
        setSimulatedPath(['Initializing Secure Node...', 'Fetching Registrar Key...', 'Calculating Geofence...']);

        // Artificial delay for "wow" effect
        await new Promise(r => setTimeout(r, 800));
        setSimulatedPath(prev => [...prev, 'Comparing HMAC Signatures...']);
        await new Promise(r => setTimeout(r, 600));

        try {
            // Calculate simulated location
            const lat = (targetBusiness.latitude || 10.79) + (distanceOffset / 111111); // simple conversion for demo
            const lng = (targetBusiness.longitude || 78.70);

            const res = await api.post<any>('/verify-scan', {
                token: targetBusiness.id,
                scannerLocation: { lat, lng },
                mode: 'AUDIT_DRILL'
            });

            setAuditResult({
                ...res,
                distance: distanceOffset
            });

            if (res.status === 'VALID') {
                showToast('Audit Passed: Identity Confirmed', 'success');
            } else {
                showToast(`Audit Alert: ${res.status}`, 'warning');
            }
            
            setSimulatedPath(prev => [...prev, 'Finalizing Blockchain Entry...']);
            onAuditComplete();
        } catch (err) {
            console.error(err);
            setAuditResult({ status: 'ERROR', message: 'Communication node failure during audit.' });
        } finally {
            setIsPulsing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-reveal-up">
            {/* Control Panel */}
            <div className="glass-card p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                            <Navigation className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                            <h3 className="h-display text-2xl mb-0 mt-0">Auditor <span className="text-glow">Control</span></h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Field Simulation v4.0</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4 block">Select Target Node</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <select 
                                    value={selectedId}
                                    onChange={(e) => setSelectedId(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-yellow-500/50 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">Choose a Verified Business...</option>
                                    {verifiedBusinesses.map(b => (
                                        <option key={b.id} value={b.id}>{b.tradeName} ({b.municipal_ward || 'Ward 04'})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Simulated Distance</label>
                                <span className={`text-xs font-mono ${distanceOffset > 200 ? 'text-red-500' : 'text-green-500'}`}>
                                    {distanceOffset}m {distanceOffset > 200 ? '(Mismatch)' : '(Internal)'}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="1000" 
                                step="10"
                                value={distanceOffset}
                                onChange={(e) => setDistanceOffset(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-yellow-500"
                            />
                            <div className="flex justify-between mt-2 text-[9px] text-slate-600 font-black uppercase">
                                <span>Stationary</span>
                                <span>200m (Limit)</span>
                                <span>1km (Remote)</span>
                            </div>
                        </div>

                        <button 
                            onClick={runAuditDrill}
                            disabled={!selectedId || isPulsing}
                            className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-yellow-500 transition-all active:scale-95 disabled:opacity-50 group overflow-hidden relative"
                        >
                            <div className={`absolute inset-0 bg-yellow-500/20 translate-x-[-100%] ${isPulsing ? 'animate-progress-infinite' : ''}`} />
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isPulsing ? 'Broadcasting Pulse...' : 'Initialize Field Audit'}
                                <Radio className={`h-4 w-4 ${isPulsing ? 'animate-pulse' : ''}`} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Live Telemetry */}
            <div className="glass-card p-10 rounded-[2.5rem] border-white/10 bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden text-center">
                {!auditResult && !isPulsing ? (
                    <div className="relative">
                        <div className="w-48 h-48 border-2 border-dashed border-white/5 rounded-full flex items-center justify-center animate-spin-slow">
                            <Shield className="h-12 w-12 text-slate-800" />
                        </div>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-8">Waiting for Authorization...</p>
                    </div>
                ) : isPulsing ? (
                    <div className="w-full space-y-6">
                        <div className="relative w-32 h-32 mx-auto">
                            <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping" />
                            <div className="absolute inset-0 bg-yellow-500/10 rounded-full animate-pulse blur-xl" />
                            <div className="relative w-full h-full bg-slate-900 border border-yellow-500/50 rounded-full flex items-center justify-center">
                                <Zap className="h-8 w-8 text-yellow-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            {simulatedPath.map((step, i) => (
                                <p key={i} className="text-[10px] font-mono text-yellow-500/50 uppercase tracking-widest animate-in fade-in slide-in-from-left-4">{step}</p>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full space-y-8 animate-in zoom-in-95 duration-500">
                        <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${
                            auditResult.status === 'VALID' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                            {auditResult.status === 'VALID' ? <CheckCircle2 className="h-10 w-10" /> : <AlertTriangle className="h-10 w-10" />}
                        </div>
                        
                        <div>
                            <h4 className={`text-3xl h-display mb-2 uppercase ${auditResult.status === 'VALID' ? 'text-green-500' : 'text-red-500'}`}>
                                {auditResult.status === 'VALID' ? 'Drill Passed' : 'Security Breach'}
                            </h4>
                            <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto leading-relaxed">
                                {auditResult.message}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-3xl">
                                <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Audit Score</p>
                                <p className="text-lg font-black text-white">{auditResult.status === 'VALID' ? '10/10' : '0/10'}</p>
                            </div>
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-3xl">
                                <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Distance Risk</p>
                                <p className="text-lg font-black text-white">{distanceOffset}m</p>
                            </div>
                        </div>

                         <div className="p-6 bg-slate-950 rounded-3xl border border-white/5 text-left overflow-hidden">
                            <div className="flex items-center gap-2 mb-3">
                                <Database className="h-3 w-3 text-yellow-500" />
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Signed Proof Payload</span>
                            </div>
                            <pre className="text-[9px] font-mono text-yellow-500/70 whitespace-pre-wrap break-all leading-relaxed">
                                {auditResult.proof || 'CRYPTO_HASH_GEN_V4_OFFLINE'}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
