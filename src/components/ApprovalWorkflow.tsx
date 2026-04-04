import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, FileText, User, Shield, Send, RefreshCw } from 'lucide-react';
import { api } from '../api/client';
import type { Business, RegistryApproval, WorkflowStage, WorkflowStatus } from '../types/types';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../hooks/useToast';

interface ApprovalWorkflowProps {
    business: Business;
    onUpdate?: () => void;
    isAdmin?: boolean;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ business, onUpdate, isAdmin }) => {
    const { user } = useAuth();
    const [history, setHistory] = useState<RegistryApproval[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Form State
    const [stage, setStage] = useState<WorkflowStage>('SCRUTINY');
    const [status, setStatus] = useState<WorkflowStatus>('APPROVED');
    const [comments, setComments] = useState('');
    const [orderRef, setOrderRef] = useState('');

    const stages: WorkflowStage[] = ['SUBMITTED', 'SCRUTINY', 'INSPECTION', 'FINAL'];

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await api.get<{ data: RegistryApproval[] }>(`/approvals/${business.id}`);
            setHistory(res.data);
        } catch (e) {
            console.error("Failed to fetch approval history:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [business.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/approvals', {
                registry_id: business.id,
                stage,
                status,
                comments,
                order_ref_no: orderRef,
            });
            showToast(`Approval stage ${stage} updated to ${status}`, 'success');
            setComments('');
            setOrderRef('');
            fetchHistory();
            if (onUpdate) onUpdate();
        } catch (e) {
            showToast('Failed to update approval status', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: WorkflowStatus) => {
        switch (status) {
            case 'APPROVED': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'REJECTED': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'RETURNED': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'UNDER_REVIEW': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8 animate-reveal-up">
            {/* Stage Progress Bar */}
            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/50 to-transparent opacity-20" />
                <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-12 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-yellow-500" />
                    Registry Lifecycle Path
                </h3>
                
                <div className="flex items-center justify-between relative px-4">
                    <div className="absolute left-0 right-0 h-0.5 bg-white/5 top-1/2 -translate-y-1/2 -z-10" />
                    {stages.map((s, idx) => {
                        const isPast = history.some(h => h.stage === s && h.status === 'APPROVED');
                        const isCurrent = (history[0]?.stage === s) || (idx === 0 && history.length === 0);
                        
                        return (
                            <div key={s} className="flex flex-col items-center gap-4 relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                                    isPast ? 'bg-green-500 border-green-500/20 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.4)]' :
                                    isCurrent ? 'bg-yellow-500 border-yellow-500/20 text-slate-950 shadow-[0_0_20px_rgba(234,179,8,0.4)]' :
                                    'bg-slate-900 border-white/5 text-slate-600'
                                }`}>
                                    {isPast ? <CheckCircle className="h-5 w-5" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${isCurrent ? 'text-yellow-500' : isPast ? 'text-green-500' : 'text-slate-600'}`}>{s}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Decision History */}
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 min-h-[400px]">
                    <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-8">Approval Timeline</h3>
                    
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <Clock className="h-6 w-6 text-slate-600 animate-spin" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[2rem]">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">No history recorded</p>
                        </div>
                    ) : (
                        <div className="space-y-6 relative ml-4">
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 group-hover:bg-yellow-500/20 transition-colors" />
                            {history.filter(h => isAdmin || h.status === 'APPROVED' || h.status === 'REJECTED').map((record, i) => (
                                <div key={record.id} className="relative pl-10 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-white/20 group-hover:border-yellow-500/50 transition-colors" />
                                    <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest block mb-1">Stage: {record.stage}</span>
                                                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter border ${getStatusColor(record.status)}`}>
                                                    {record.status}
                                                </span>
                                            </div>
                                            <span className="text-[8px] text-slate-500 font-black uppercase">{new Date(record.acted_at).toLocaleDateString()}</span>
                                        </div>
                                        {/* Hide comments from citizens if not final/approved */}
                                        {(isAdmin || record.status === 'APPROVED' || record.status === 'REJECTED') && (
                                            <p className="text-xs text-slate-400 font-medium mb-4 italic">"{record.comments}"</p>
                                        )}
                                        <div className="flex items-center gap-4 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><User className="h-3 w-3" /> {record.acted_by_role}</span>
                                            {record.order_ref_no && <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {record.order_ref_no}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Admin Action Form */}
                {isAdmin && (
                    <div className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
                        <h3 className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.3em] mb-8">Officer Intervention</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Workflow Stage</label>
                                    <select 
                                        value={stage}
                                        onChange={(e) => setStage(e.target.value as WorkflowStage)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-yellow-500/50 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="SCRUTINY">Scrutiny</option>
                                        <option value="INSPECTION">Inspection</option>
                                        <option value="FINAL">Final Approval</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Decision</label>
                                    <select 
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as WorkflowStatus)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-yellow-500/50 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="APPROVED">Approve / Proceed</option>
                                        <option value="REJECTED">Reject / Terminate</option>
                                        <option value="RETURNED">Return to Applicant</option>
                                        <option value="UNDER_REVIEW">Place Under Review</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Internal Remarks / Comments</label>
                                <textarea 
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Enter detailed audit notes..."
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white focus:border-yellow-500/50 outline-none min-h-[120px] resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Order Reference No.</label>
                                <input 
                                    type="text"
                                    value={orderRef}
                                    onChange={(e) => setOrderRef(e.target.value)}
                                    placeholder="e.g., MBNR/2024/APP/0129"
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-yellow-500/50 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || !comments}
                                className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-yellow-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 disabled:grayscale"
                            >
                                {submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                Commit Decision to Ledger
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
