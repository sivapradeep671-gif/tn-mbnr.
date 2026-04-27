import React from 'react';
import { 
    ShieldCheck, 
    Users, 
    CreditCard, 
    MapPin, 
    Database, 
    Cpu,
    CheckCircle2,
    ArrowRight,
    Zap
} from 'lucide-react';

const MODULES = [
    {
        id: 'registry',
        name: 'Smart Registry',
        description: 'Digitize business licenses and registrations with blockchain verification.',
        icon: Database,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        status: 'Enabled',
        features: ['Automated Approvals', 'Blockchain Ledger', 'NIC Code Mapping']
    },
    {
        id: 'citizen',
        name: 'Citizen Portal',
        description: 'Omni-channel platform for citizen reports, applications, and feedback.',
        icon: Users,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        status: 'Enabled',
        features: ['Aadhaar Integration', 'Report Heatmaps', 'Mobile App Support']
    },
    {
        id: 'payments',
        name: 'GovPay Gateway',
        description: 'Integrated fee collection and reconciliation for municipal taxes.',
        icon: CreditCard,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        status: 'Upgrade',
        features: ['UPI/Card Support', 'Dynamic Fee Slabs', 'Instant Receipts']
    },
    {
        id: 'audit',
        name: 'Field Audit Pro',
        description: 'Mobile-first tool for inspectors with geo-tagging and offline support.',
        icon: MapPin,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        status: 'Enabled',
        features: ['Geo-fencing', 'Photo Evidence', 'Offline Sync']
    },
    {
        id: 'ai',
        name: 'AI Gov Assistant',
        description: 'LLM-powered assistant for policy lookup and automated citizen help.',
        icon: Cpu,
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
        status: 'Beta',
        features: ['Multilingual Support', 'Policy Vector Search', 'Auto-drafting']
    },
    {
        id: 'security',
        name: 'TrustGuard MFA',
        description: 'Enterprise-grade security with multi-factor auth and audit trails.',
        icon: ShieldCheck,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        status: 'Security Patch',
        features: ['Biometric Auth', 'Immutable Logs', 'PII Encryption']
    }
];

export const SaaSMarketplace: React.FC = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-black uppercase tracking-widest mb-6">
                    <Zap className="h-3 w-3" />
                    SaaS Governance Hub
                </div>
                <h1 className="text-4xl sm:text-6xl font-black mb-6">
                    Enable <span className="text-glow">Digital Services</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Scale your municipality with pre-built governance modules. One-click deployment to your local district node.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MODULES.map((module) => (
                    <div 
                        key={module.id}
                        className="group relative bg-slate-900/40 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                    >
                        {/* Status Badge */}
                        <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            module.status === 'Enabled' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                            module.status === 'Upgrade' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                            'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}>
                            {module.status}
                        </div>

                        {/* Icon */}
                        <div className={`w-14 h-14 ${module.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <module.icon className={`h-7 w-7 ${module.color}`} />
                        </div>

                        <h3 className="text-2xl font-black mb-3">{module.name}</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            {module.description}
                        </p>

                        <div className="space-y-3 mb-8">
                            {module.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <button className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                            module.status === 'Enabled' 
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                            : 'bg-yellow-500 text-slate-950 hover:bg-yellow-400 shadow-lg shadow-yellow-500/10'
                        }`}>
                            {module.status === 'Enabled' ? 'Manage Module' : 'Enable Service'}
                            <ArrowRight className="h-4 w-4" />
                        </button>

                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                ))}
            </div>

            {/* Platform Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Tenants', value: '42' },
                    { label: 'Citizens Served', value: '1.2M' },
                    { label: 'Tx Success Rate', value: '99.9%' },
                    { label: 'Avg SLA Speed', value: '2.4 Days' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl text-center">
                        <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
