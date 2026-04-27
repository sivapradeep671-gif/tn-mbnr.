import React from 'react';
import { Trophy, Star, ShieldCheck, Bot, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HackathonJury: React.FC = () => {
    const { t, language } = useLanguage();
    
    return (
        <div className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 mesh-gradient opacity-5 pointer-events-none" />
            
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20 animate-reveal-up">
                    <div className="inline-flex p-4 rounded-3xl bg-yellow-500/10 mb-8 border border-yellow-500/20 shadow-2xl shadow-yellow-500/5 rotate-3">
                        <Trophy className="h-10 w-10 text-yellow-500" />
                    </div>
                    <h2 className="h-display text-5xl mb-4 italic">Strategic <span className="text-glow text-yellow-500">Briefing</span></h2>
                    <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase">{language === 'ta' ? 'தொழில்நுட்ப மேலோட்டம்' : 'MBNR Technical Oversight v1.2'}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Problem / Solution Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-12 rounded-[3.5rem] border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                             <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                                    <Activity className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="h-display text-2xl m-0">{language === 'ta' ? 'அபாய மேலாண்மை' : 'Risk Management'}</h3>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium italic">
                                {t.hackathon.problem}
                            </p>
                            
                            <div className="border-l-4 border-yellow-500 pl-8 py-4 mb-10">
                                <p className="text-slate-100 text-xl leading-relaxed font-black mb-2">
                                    {language === 'ta' ? 'MBNR தீர்வு' : 'The MBNR Resolution'}
                                </p>
                                <p className="text-slate-400 text-base leading-relaxed">
                                    {t.hackathon.solution}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/5">
                                {[
                                    { label: 'Blockchain', val: 'HMAC-256' },
                                    { label: 'Intelligence', val: 'Gemini 2.0' },
                                    { label: 'Verification', val: 'Geofenced' },
                                    { label: 'Latency', val: '<300ms' }
                                ].map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-[9px] text-slate-500 font-black uppercase mb-1">{stat.label}</p>
                                        <p className="text-xs text-white font-black">{stat.val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-indigo-500/[0.02]">
                                <h3 className="h-display text-xl mb-6 flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-indigo-500" />
                                    {language === 'ta' ? 'நம்பகத்தன்மை' : 'Trust Protocol'}
                                </h3>
                                <p className="text-slate-500 text-xs leading-relaxed">
                                    Integrated time-locked HMAC tokens ensure 100% immunity to replay attacks and location spoofing across the regional grid.
                                </p>
                            </div>
                            <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-yellow-500/[0.02]">
                                <h3 className="h-display text-xl mb-6 flex items-center gap-3">
                                    <Bot className="h-5 w-5 text-yellow-500" />
                                    {language === 'ta' ? 'சுயாட்சி' : 'Cognitive Node'}
                                </h3>
                                <p className="text-slate-500 text-xs leading-relaxed">
                                    Gemini 2.0 Flash provides zero-latency commercial scrutiny, identifying label mimics and brand mimicry in ms.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Impact Side Column */}
                    <div className="space-y-8">
                         <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-slate-900 shadow-3xl">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                <Star className="h-4 w-4 text-yellow-500" /> {t.hackathon.impact_title}
                            </h3>
                            <div className="space-y-6">
                                {t.hackathon.impact_points.map((point, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 shrink-0 transition-all group-hover:scale-150 group-hover:shadow-[0_0_10px_rgba(234,179,8,1)]" />
                                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest leading-loose">
                                            {point}
                                        </p>
                                    </div>
                                ))}
                            </div>
                         </div>

                         <div className="glass-card p-10 rounded-[3rem] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px]" />
                             <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Scalability Node</h4>
                             <p className="text-slate-400 text-xs font-medium leading-relaxed">
                                Architecture designed for **1,000,000+ commercial nodes** using regional localized caching for 200m geofence precision.
                             </p>
                         </div>

                        <div className="pt-8 text-center">
                            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em] italic">
                                {t.hackathon.roadmap}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};