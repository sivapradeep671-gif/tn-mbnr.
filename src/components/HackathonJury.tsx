import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HackathonJury: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <div className="py-24 bg-slate-950">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="inline-flex p-3 rounded-full bg-yellow-500/10 mb-6 border border-yellow-500/20">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-widest">{t.hackathon.title}</h2>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] max-w-2xl mx-auto text-left shadow-2xl">
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        {t.hackathon.problem}
                    </p>
                    <p className="text-slate-100 text-sm leading-relaxed mb-10 font-black border-l-2 border-yellow-500 pl-6">
                        {t.hackathon.solution}
                    </p>

                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" /> {t.hackathon.impact_title}
                    </h3>
                    <ul className="text-slate-300 space-y-4 text-xs font-bold uppercase tracking-widest list-none">
                        {t.hackathon.impact_points.map((point, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                                {point}
                            </li>
                        ))}
                    </ul>
                    
                    <div className="mt-12 pt-8 border-t border-white/5">
                        <p className="text-[10px] text-slate-500 font-mono text-center uppercase tracking-[0.2em]">{t.hackathon.roadmap}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};