import React, { useState } from 'react';
import { Shield, User, Building2, KeyRound, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
    onLoginSuccess: (role: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const { login } = useAuth();
    const [role, setRole] = useState<'citizen' | 'business' | 'admin'>('citizen');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(phone, role);
            onLoginSuccess(role);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Authentication failed';
            setError(errorMsg || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600"></div>

                <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-full bg-yellow-500/10 mb-4">
                        <Shield className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Secure Login</h2>
                    <p className="text-slate-400 text-sm">Access your TrustReg TN Dashboard</p>
                </div>

                <div className="flex gap-2 mb-8 bg-slate-950 p-1 rounded-lg">
                    {(['citizen', 'business', 'admin'] as const).map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => {
                                setRole(r);
                                setError(null);
                            }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all capitalize flex items-center justify-center gap-2 ${role === r
                                ? 'bg-slate-800 text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                                }`}
                        >
                            {r === 'citizen' ? <User className="h-4 w-4" /> : r === 'business' ? <Building2 className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
                            <span className="hidden sm:inline">{r}</span>
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-200">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            {role === 'business' ? 'Registered Mobile / GST' : role === 'admin' ? 'Admin ID' : 'Mobile Number'}
                        </label>
                        <input
                            type="text"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={role === 'citizen' ? 'Enter 10-digit number' : 'Enter ID'}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !phone}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center"
                    >
                        {isLoading ? (
                            <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                            'Send OTP & Authenticate'
                        )}
                    </button>
                </form>

                <p className="text-xs text-center text-slate-500 mt-8">
                    By logging in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};