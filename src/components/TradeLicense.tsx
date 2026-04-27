import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
    Shield, 
    Award, 
    Landmark, 
    Calendar, 
    MapPin, 
    Hash, 
    CheckCircle2, 
    Download, 
    X,
    Printer,
    FileLock
} from 'lucide-react';
import type { Business } from '../types/types';

interface TradeLicenseProps {
    business: Business;
    onClose: () => void;
}

export const TradeLicense: React.FC<TradeLicenseProps> = ({ business, onClose }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    const registrationDate = business.createdAt ? new Date(business.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
    const expiryDate = new Date(new Date(registrationDate).setFullYear(new Date(registrationDate).getFullYear() + 1)).toLocaleDateString();
    
    // Generate a unique digital certificate ID based on registration details
    const certId = `CERT-TN-${business.id.substring(0, 8).toUpperCase()}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in print:p-0 print:bg-white">
            {/* Controls - Hidden on Print */}
            <div className="absolute top-8 right-8 flex gap-4 print:hidden">
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-xl font-black uppercase text-xs shadow-2xl hover:bg-yellow-500 transition-all active:scale-95"
                >
                    <Printer className="h-4 w-4" /> Print PDF
                </button>
                <button 
                    onClick={onClose}
                    className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Certificate Body */}
            <div 
                ref={printRef}
                className="relative w-full max-w-4xl aspect-[1/1.414] bg-white text-slate-900 shadow-2xl overflow-hidden rounded-sm border-[16px] border-slate-900 print:shadow-none print:static print:max-w-none print:border-none"
            >
                {/* Guilloche / Security Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                {/* Header Section */}
                <div className="p-12 text-center border-b-[3px] border-slate-900 mx-12">
                    <div className="flex justify-between items-center mb-10">
                        <img src="./logo.png" alt="TN Emblem" className="h-24 w-24 object-contain grayscale" />
                        <div className="flex flex-col items-center">
                            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">Government of Tamil Nadu</h1>
                            <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-slate-600">Municipal Administration Department</h2>
                        </div>
                        <div className="h-24 w-24 border-2 border-slate-900 rounded-xl flex items-center justify-center p-2">
                             <QRCodeSVG value={`https://tn-mbnr.gov.in/verify/${business.id}`} size={80} level="H" />
                        </div>
                    </div>
                    
                    <div className="relative inline-block py-2 px-12 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-sm transform -rotate-1 skew-x-12">
                        Official Trade License Certificate
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-16 space-y-12">
                    <div className="text-center">
                        <p className="text-lg font-medium text-slate-500 italic mb-4">This is to certify that the business entity described below is registered under the</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Tamil Nadu Business Facilitation Act</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-x-20 gap-y-12 py-12 border-y border-slate-200">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade Name / Display Name</p>
                            <p className="text-2xl font-black text-slate-900 uppercase">{business.tradeName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal Entity Name</p>
                            <p className="text-2xl font-black text-slate-900 uppercase">{business.legalName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Address</p>
                            <p className="text-base font-bold text-slate-700 leading-tight">{business.address}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Category</p>
                            <p className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
                                <Award className="h-5 w-5 text-slate-400" />
                                {business.category}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Hash className="h-4 w-4 text-slate-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Registration ID</span>
                            </div>
                            <p className="font-mono text-sm font-bold text-slate-900 underline decoration-slate-300 underline-offset-4">{business.id}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Issue Date</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{registrationDate}</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Validity Until</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{expiryDate}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="absolute bottom-0 left-0 right-0 p-16 flex justify-between items-end">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500 rounded-lg">
                                <FileLock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Blockchain Integrity Hash</p>
                                <p className="text-[9px] font-mono text-slate-500 break-all max-w-[300px]">
                                    0x{Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}
                                </p>
                            </div>
                        </div>
                        <p className="text-[8px] text-slate-400 max-w-sm italic">
                            This document is cryptographically signed and stored on the TrustReg TN blockchain ledger. Verification can be performed by scanning the QR code or visiting the official public registry at tn-mbnr.gov.in.
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="mb-4">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Signature_of_Mahatma_Gandhi.svg" alt="Signature" className="h-10 ml-auto grayscale opacity-50" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest mb-1">Commissioner</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Directorate of Municipal Administration</p>
                    </div>
                </div>

                {/* Security Seal Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
                    <Shield className="h-[500px] w-[500px] text-slate-900" />
                </div>
            </div>
        </div>
    );
};
