import React from 'react';
import { Shield, Sparkles, Building2, QrCode } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
    onRegister: () => void;
    onScan: () => void;
    onCitizenRegister: () => void;
    onExploreMap: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegister, onScan, onCitizenRegister, onExploreMap }) => {
    const { t } = useLanguage();

    return (
        <div className="relative overflow-hidden pt-24 pb-16 sm:pt-40 sm:pb-32 mesh-gradient min-h-[90vh] flex items-center">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none animate-float" />
            <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" style={{ animationDelay: '-3s' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                <div className="reveal-up inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full mb-8 shadow-2xl">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">TN-MBNR Platform v1.2</span>
                </div>

                <h1 className="h-display text-5xl sm:text-8xl mb-8 leading-[0.9] reveal-up" style={{ animationDelay: '0.1s' }}>
                    {t.hero.title_prefix} <br />
                    <span className="text-glow">{t.hero.title_suffix}</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg sm:text-2xl text-slate-400/90 mb-12 leading-relaxed reveal-up font-medium" style={{ animationDelay: '0.2s' }}>
                    {t.hero?.subtitle || "The world's first multi-tenant SaaS e-governance platform. Deploy secure, blockchain-verified digital infrastructure for your district in minutes."}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-3xl mx-auto reveal-up" style={{ animationDelay: '0.3s' }}>
                    <button
                        onClick={onRegister}
                        className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-10 py-5 rounded-2xl font-black transition-all shadow-[0_20px_40px_rgba(234,179,8,0.2)] hover:shadow-[0_25px_50px_rgba(234,179,8,0.4)] hover:-translate-y-1 active:scale-95 group overflow-hidden relative"
                    >
                        <Building2 className="h-6 w-6 relative z-10" />
                        <span className="relative z-10 uppercase tracking-wider">{t.nav?.register || "Register Business"}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>

                    <button
                        onClick={onScan}
                        className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 px-8 py-5 rounded-2xl font-black transition-all hover:-translate-y-1 active:scale-95 backdrop-blur-xl shadow-2xl group"
                    >
                        <QrCode className="h-6 w-6 text-yellow-500 group-hover:rotate-12 transition-transform" />
                        <span className="uppercase tracking-wider">{t.nav?.scan_qr || "Verify Shop"}</span>
                    </button>

                    <button
                        onClick={onExploreMap}
                        className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 px-8 py-5 rounded-2xl font-black transition-all hover:-translate-y-1 active:scale-95 backdrop-blur-xl shadow-2xl group"
                    >
                        <Sparkles className="h-6 w-6 text-blue-400 group-hover:animate-pulse" />
                        <span className="uppercase tracking-wider">{t.nav?.map || "Explore Map"}</span>
                    </button>
                </div>

                <div className="mt-24 pt-10 border-t border-white/5 max-w-4xl mx-auto reveal-up" style={{ animationDelay: '0.4s' }}>
                    <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-[0.4em] font-black">Secure Citizen Access</p>
                    <button
                        onClick={onCitizenRegister}
                        className="inline-flex items-center space-x-3 bg-slate-900/50 hover:bg-slate-800/80 px-6 py-3 rounded-full border border-slate-800 hover:border-yellow-500/30 transition-all text-slate-400 hover:text-white group"
                    >
                        <Shield className="h-4 w-4 text-green-500 group-hover:animate-pulse" />
                        <span className="font-bold text-sm">{t.hero.badge}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};