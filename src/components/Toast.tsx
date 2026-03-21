import React from 'react';
import type { ToastType } from '../hooks/useToast';
import { useToasts, dismissToast } from '../hooks/useToast';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastIcon = ({ type }: { type: ToastType }) => {
    switch (type) {
        case 'success': return <CheckCircle className="h-5 w-5 text-green-400" />;
        case 'error': return <AlertCircle className="h-5 w-5 text-red-100" />;
        case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
        default: return <Info className="h-5 w-5 text-blue-400" />;
    }
};

export const ToastContainer: React.FC = () => {
    const toasts = useToasts();

    return (
        <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        pointer-events-auto flex items-center p-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-full duration-300
                        ${toast.type === 'success' ? 'bg-green-950/60 border-green-500/40' :
                          toast.type === 'error' ? 'bg-red-900/60 border-red-500/40' :
                          toast.type === 'warning' ? 'bg-yellow-950/60 border-yellow-500/40' :
                          'bg-slate-900/60 border-blue-500/40'}
                    `}
                >
                    <div className="flex-shrink-0 mr-3">
                        <ToastIcon type={toast.type} />
                    </div>
                    <p className="text-sm font-semibold text-white flex-grow leading-tight">{toast.message}</p>
                    <button 
                        onClick={() => dismissToast(toast.id)}
                        className="ml-4 p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
