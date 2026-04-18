import React from 'react';
import { Bell, ShieldAlert, CheckCircle, Info, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface Notification {
    id: string;
    type: 'ALERT' | 'SUCCESS' | 'INFO';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'ALERT',
        title: 'Geofence Breach Detected',
        message: 'A scan was attempted for your shop from a location 450m away. Token rejected.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false
    },
    {
        id: '2',
        type: 'SUCCESS',
        title: 'Monthly Audit Passed',
        message: 'Your business "Anna Nagar Grand Mall" maintains 100% integrity score for April.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: true
    },
    {
        id: '3',
        type: 'INFO',
        title: 'Renewals Update',
        message: 'Municipal SLA for license renewals has been updated to 10 business days.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        read: true
    }
];

export const NotificationCenter: React.FC = () => {
    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-yellow-500" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest">Notification Hub</h3>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                    {MOCK_NOTIFICATIONS.filter(n => !n.read).length} Unread
                </span>
            </div>
            
            <div className="divide-y divide-slate-800/50 max-h-[400px] overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((notif) => (
                    <div 
                        key={notif.id} 
                        className={clsx(
                            "p-4 transition-colors hover:bg-slate-800/30 group",
                            !notif.read && "bg-yellow-500/5"
                        )}
                    >
                        <div className="flex gap-3">
                            <div className="mt-1">
                                {notif.type === 'ALERT' && <ShieldAlert className="h-5 w-5 text-red-500" />}
                                {notif.type === 'SUCCESS' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                                {notif.type === 'INFO' && <Info className="h-5 w-5 text-blue-500" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={clsx(
                                        "text-sm font-bold",
                                        !notif.read ? "text-slate-100" : "text-slate-400"
                                    )}>
                                        {notif.title}
                                    </h4>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                                        <Clock className="h-3 w-3" />
                                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                                    {notif.message}
                                </p>
                                {!notif.read && (
                                    <button className="mt-2 text-[10px] text-yellow-500 font-bold uppercase tracking-tighter hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                                        Mark as Actioned
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <button className="w-full p-3 bg-slate-900/80 border-t border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-widest hover:text-slate-300 transition-colors">
                View Official Archive
            </button>
        </div>
    );
};
