import React from 'react';
import { Database, Shield, Link, ChevronRight, Hash, Clock, User, CheckCircle2 } from 'lucide-react';

interface LedgerBlock {
    index_id: number;
    timestamp: string;
    data: string;
    previousHash: string;
    hash: string;
    nonce: number;
}

interface BlockchainLedgerProps {
    blocks: LedgerBlock[];
    onClose: () => void;
    targetId?: string; // Optional filter for a specific business
}

export const BlockchainLedger: React.FC<BlockchainLedgerProps> = ({ blocks, onClose, targetId }) => {
    const filteredBlocks = targetId 
        ? blocks.filter(b => {
            try {
                const data = JSON.parse(b.data);
                return data.id === targetId || data.registry_id === targetId;
            } catch { return false; }
        })
        : blocks;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl transition-all" onClick={onClose} />
            
            <div className="relative w-full max-w-4xl glass-card rounded-[2.5rem] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-reveal-up max-h-[90vh] flex flex-col">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500 rounded-2xl">
                            <Database className="h-6 w-6 text-slate-950" />
                        </div>
                        <div>
                            <h2 className="text-2xl h-display text-white mb-0 mt-0">Regional <span className="text-glow">Audit Ledger</span></h2>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Cryptographic Node Chain {targetId ? `• Filtered by Asset ${targetId}` : ''}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
                        <ChevronRight className="h-6 w-6 rotate-180" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-12">
                    {filteredBlocks.length === 0 ? (
                        <div className="py-20 text-center">
                            <Shield className="h-16 w-16 text-slate-800 mx-auto mb-6" />
                            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">No Cryptographic History Found for this Node</p>
                        </div>
                    ) : (
                        filteredBlocks.map((block) => {
                            let parsedData;
                            try { parsedData = JSON.parse(block.data); } catch { parsedData = block.data; }
                            
                            return (
                                <div key={block.index_id} className="relative pl-12 group">
                                    {/* Timeline Link */}
                                    <div className="absolute left-[1.125rem] top-8 bottom-[-3rem] w-0.5 bg-gradient-to-b from-yellow-500/50 via-yellow-500/10 to-transparent group-last:hidden" />
                                    
                                    {/* Node Icon */}
                                    <div className="absolute left-0 top-0 w-9 h-9 bg-slate-950 border border-yellow-500/30 rounded-full flex items-center justify-center shadow-2xl group-hover:border-yellow-500 transition-colors">
                                        <Link className="h-4 w-4 text-yellow-500" />
                                    </div>

                                    <div className="glass-card p-8 rounded-3xl border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase tracking-widest rounded">Block #{block.index_id}</span>
                                                    <h3 className="text-white font-black text-lg tracking-tight uppercase">
                                                        {parsedData.action || 'Registration Entry'}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {new Date(block.timestamp).toLocaleString()}</span>
                                                    <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> Registrar Root</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right hidden md:block">
                                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Network Proof</p>
                                                    <p className="text-green-500 text-[10px] font-black italic">VERIFIED</p>
                                                </div>
                                                <div className="p-2 bg-green-500/10 rounded-xl">
                                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Cryptographic Proofs */}
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <Hash className="h-3 w-3 text-yellow-500" /> Block Header
                                                    </p>
                                                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 font-mono text-[9px] break-all text-yellow-500/70 leading-relaxed">
                                                        {block.hash}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 opacity-50">
                                                        <Link className="h-3 w-3" /> Parent Hash
                                                    </p>
                                                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 font-mono text-[9px] break-all text-slate-600 leading-relaxed italic">
                                                        {block.previousHash}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* State Payload */}
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Registry State Changes</p>
                                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                                    <pre className="text-[10px] text-slate-400 font-medium whitespace-pre-wrap leading-relaxed">
                                                        {JSON.stringify(parsedData, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="p-8 bg-slate-900 border-t border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">
                        Immutable Node Registry • Securing Tamil Nadu Commercial Identity
                    </p>
                </div>
            </div>
        </div>
    );
};
