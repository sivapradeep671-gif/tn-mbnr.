import React, { useState, useEffect } from 'react';
import { Type, Monitor, Moon, Sun } from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
    const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
    const [highContrast, setHighContrast] = useState(false);

    useEffect(() => {
        // Handle Font Sizing
        const html = document.documentElement;
        html.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
        html.classList.add(`text-size-${fontSize}`);

        // Handle High Contrast
        if (highContrast) {
            html.classList.add('high-contrast');
        } else {
            html.classList.remove('high-contrast');
        }
    }, [fontSize, highContrast]);

    const changeFontSize = (size: 'normal' | 'large' | 'xlarge') => setFontSize(size);
    const toggleContrast = () => setHighContrast(!highContrast);

    return (
        <div className="bg-slate-900 border-b border-white/10 text-xs text-slate-300 py-1.5 px-4 flex items-center justify-between z-[60] relative">
            <div className="flex items-center space-x-4">
                <span className="font-bold text-yellow-500 hidden sm:inline">GOVERNMENT OF TAMIL NADU</span>
                <span className="hidden sm:inline">|</span>
                <span>Municipal Administration & Water Supply Department</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Text Size Controls */}
                <div className="flex items-center bg-black/30 rounded-md overflow-hidden border border-white/5">
                    <button 
                        onClick={() => changeFontSize('normal')}
                        className={`px-2 py-1 hover:bg-white/10 transition-colors ${fontSize === 'normal' ? 'bg-yellow-500/20 text-yellow-500' : ''}`}
                        title="Normal Text Size"
                        aria-label="Normal Text Size"
                    >
                        A-
                    </button>
                    <button 
                        onClick={() => changeFontSize('large')}
                        className={`px-2 py-1 hover:bg-white/10 transition-colors ${fontSize === 'large' ? 'bg-yellow-500/20 text-yellow-500' : ''}`}
                        title="Large Text Size"
                        aria-label="Large Text Size"
                    >
                        A
                    </button>
                    <button 
                        onClick={() => changeFontSize('xlarge')}
                        className={`px-2 py-1 hover:bg-white/10 transition-colors ${fontSize === 'xlarge' ? 'bg-yellow-500/20 text-yellow-500' : ''}`}
                        title="Extra Large Text Size"
                        aria-label="Extra Large Text Size"
                    >
                        A+
                    </button>
                </div>

                {/* Contrast Toggle */}
                <button 
                    onClick={toggleContrast}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-md border transition-colors ${
                        highContrast 
                        ? 'bg-yellow-500 text-black border-yellow-500' 
                        : 'bg-black/30 border-white/5 hover:bg-white/10'
                    }`}
                    title="Toggle High Contrast"
                    aria-label="Toggle High Contrast"
                >
                    <Monitor className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline font-bold">High Contrast</span>
                </button>
            </div>
        </div>
    );
};
