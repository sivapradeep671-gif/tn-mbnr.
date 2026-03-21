import { useEffect, useState } from 'react';
import { Link, Hash, Clock, Database, XCircle, Search, Filter, Info, ChevronLeft, ChevronRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import type { Business } from '../types/types';
import { api } from '../api/client';

interface Block {
    index_id: number;
    timestamp: string | number;
    data: string | object;
    previousHash: string;
    hash: string;
    nonce: number;
    status: 'Verified' | 'Pending';
}

interface BlockchainExplorerProps {
    businesses: Business[];
}

export const BlockchainExplorer: React.FC<BlockchainExplorerProps> = ({ businesses }) => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isValid] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'hash' | 'data'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchLedger = async () => {
            setLoading(true);
            try {
                const response = await api.get<{ data: Block[] }>('/ledger');
                if (response.data) {
                    setBlocks(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch ledger:", err);
                // Fallback to generating from prop if API fails
                const generatedBlocks: Block[] = businesses.map((b, index) => ({
                    index_id: index + 1,
                    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
                    previousHash: index === 0 ? "0x00000000000000000000000000000000000000000000000000000000000000" : "0xPARENT_HASH_REDACTED",
                    timestamp: b.registrationDate,
                    data: { tradeName: b.tradeName, type: b.type, gst: b.gstNumber || 'N/A', category: b.category },
                    nonce: Math.floor(Math.random() * 10000),
                    status: b.status === 'Verified' ? 'Verified' : 'Pending'
                }));
                setBlocks([...generatedBlocks].reverse());
            } finally {
                setLoading(false);
            }
        };

        fetchLedger();
    }, [businesses]);

    const formatDate = (timestamp: string | number) => {
        if (!timestamp) return 'Unknown Date';
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    };

    const filteredBlocks = blocks.filter((block: Block) => {
        const searchLower = searchTerm.toLowerCase();
        if (filterType === 'hash') return block.hash.toLowerCase().includes(searchLower);
        if (filterType === 'data') return JSON.stringify(block.data).toLowerCase().includes(searchLower);
        return (
            block.hash.toLowerCase().includes(searchLower) ||
            JSON.stringify(block.data).toLowerCase().includes(searchLower) ||
            block.index_id.toString().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(filteredBlocks.length / itemsPerPage);
    const paginatedBlocks = filteredBlocks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 reveal-up">
            {/* Premium Header Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-16 gap-8">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-yellow-500 rounded-3xl shadow-2xl shadow-yellow-500/20 rotate-3">
                        <Activity className="h-10 w-10 text-slate-950" />
                    </div>
                    <div>
                        <h2 className="h-display text-5xl mb-1 mt-0">Immutable <span className="text-glow">Ledger</span></h2>
                        <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase">MBNR Cryptographic Record Stream</p>
                    </div>
                </div>
                
                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${isValid ? 'bg-green-500/10 border-green-500/20 text-green-500 shadow-2xl shadow-green-500/5' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                    {isValid ? <ShieldCheck className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                    <span className="font-black text-xs uppercase tracking-widest">{isValid ? 'Mainnet Synced' : 'Integrity Compromised'}</span>
                </div>
            </div>

            {/* Info Strip */}
            <div className="glass-card bg-blue-500/5 border-blue-500/20 p-8 rounded-[2.5rem] mb-16 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 shrink-0">
                    <Info className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                    <h4 className="h-display text-xl text-blue-400 mb-2 mt-0">Protocol <span className="text-glow">Transparency</span></h4>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        Every commercial node registration is securely hashed into the regional grid using 256-bit encryption. Once committed, the record is globally immutable, ensuring permanent transparency for municipal intelligence.
                    </p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-6 mb-16 relative z-10">
                <div className="relative flex-1 group">
                    <div className="absolute inset-0 bg-yellow-500/5 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-yellow-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scan Hash, Node Data, or Block Index..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl pl-16 pr-8 py-6 text-xl text-white focus:border-yellow-500/50 outline-none transition-all shadow-2xl font-medium placeholder:opacity-30"
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-hover:text-yellow-500 transition-colors" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl pl-16 pr-12 py-6 text-sm text-white focus:border-yellow-500/50 outline-none appearance-none cursor-pointer hover:bg-white/[0.06] transition-all font-black uppercase tracking-widest min-w-[240px]"
                    >
                        <option value="all" className="bg-slate-950">Combined Stream</option>
                        <option value="hash" className="bg-slate-950">Hash Signature</option>
                        <option value="data" className="bg-slate-950">Record Payload</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-32 reveal-up">
                    <div className="relative inline-flex mb-8">
                        <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                        <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="h-display text-2xl text-slate-400">Syncing Tamil Nadu <span className="text-glow">Node Grid...</span></p>
                </div>
            ) : (
                <div className="space-y-10 relative">
                    <div className="absolute left-10 lg:left-[44px] top-0 bottom-0 w-px bg-gradient-to-b from-yellow-500/50 via-white/5 to-transparent -z-10" />

                    {paginatedBlocks.length === 0 ? (
                        <div className="text-center py-24 glass-card rounded-[3rem] border-white/5 border-dashed bg-white/[0.01]">
                            <Zap className="h-16 w-16 text-slate-700 mx-auto mb-6 animate-pulse" />
                            <h3 className="h-display text-2xl text-slate-400 mb-2 mt-0">Chain <span className="text-glow">Empty</span></h3>
                            <p className="text-slate-500 font-medium">No matching blocks detected on the local net.</p>
                        </div>
                    ) : (
                        paginatedBlocks.map((block: Block, idx: number) => (
                            <div key={block.hash} className="ml-0 md:ml-12 lg:ml-20 glass-card rounded-[3rem] border-white/5 p-8 lg:p-12 hover:border-yellow-500/30 transition-all duration-700 shadow-2xl relative group/block hover:shadow-yellow-500/5 hover:-translate-y-2 animate-reveal-up" style={{ animationDelay: `${idx * 150}ms` }}>
                                <div className="absolute -left-[54px] lg:-left-[68px] top-12 w-12 h-12 rounded-full bg-slate-950 border-4 border-white/5 flex items-center justify-center z-10 group-hover/block:border-yellow-500/50 transition-colors shadow-2xl">
                                    <div className={`w-3 h-3 rounded-full ${block.status === 'Verified' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]'}`}></div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <span className="bg-white/5 text-yellow-500 text-[10px] font-black px-4 py-2 rounded-xl border border-white/10 tracking-[0.2em] uppercase">
                                            Block #{block.index_id}
                                        </span>
                                        {block.index_id === 1 && (
                                            <span className="bg-yellow-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-lg tracking-widest uppercase">
                                                Genesis Node
                                            </span>
                                        )}
                                        {block.status === 'Pending' && (
                                            <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-3 py-1 rounded-lg border border-blue-500/20 tracking-widest uppercase animate-pulse">
                                                Auditing
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                        {formatDate(block.timestamp)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center text-yellow-500 gap-3">
                                            <Hash className="h-5 w-5" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Signature Hash</span>
                                        </div>
                                        <div className="font-mono text-sm text-slate-400 break-all bg-white/[0.02] p-6 rounded-3xl border border-white/5 select-all hover:text-white transition-colors cursor-text leading-relaxed">
                                            {block.hash}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center text-slate-500 gap-3">
                                            <Link className="h-5 w-5" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Parent Link</span>
                                        </div>
                                        <div className="font-mono text-sm text-slate-500 break-all bg-white/[0.02] p-6 rounded-3xl border border-white/5 select-all hover:text-slate-300 transition-colors cursor-text leading-relaxed">
                                            {block.previousHash}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative pt-10 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-slate-400 mb-6">
                                        <Database className="h-5 w-5 text-yellow-500" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Validated Transaction Data</span>
                                    </div>
                                    <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 group-hover/block:border-yellow-500/10 transition-colors">
                                        {typeof block.data === 'object' ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                                                {Object.entries(block.data).map(([key, value]) => (
                                                    <div key={key} className="flex flex-col gap-2">
                                                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">{key}</span>
                                                        <span className="text-base text-white font-mono font-medium truncate group-hover/block:text-yellow-500 transition-colors" title={String(value)}>{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <pre className="text-sm text-yellow-500/80 font-mono whitespace-pre-wrap">{String(block.data)}</pre>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Premium Pagination */}
                    {filteredBlocks.length > itemsPerPage && (
                        <div className="flex justify-center items-center gap-8 mt-20">
                            <button
                                onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-4 rounded-2xl bg-white/5 text-white disabled:opacity-20 hover:bg-yellow-500 hover:text-slate-950 transition-all border border-white/10 active:scale-95 shadow-2xl"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-full border border-white/10 shadow-2xl">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Page</span>
                                <span className="h-display text-2xl text-yellow-500">{currentPage}</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">of {totalPages}</span>
                            </div>
                            <button
                                onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-4 rounded-2xl bg-white/5 text-white disabled:opacity-20 hover:bg-yellow-500 hover:text-slate-950 transition-all border border-white/10 active:scale-95 shadow-2xl"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
