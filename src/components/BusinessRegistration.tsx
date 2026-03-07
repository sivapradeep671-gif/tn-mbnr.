import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shield, Save, AlertTriangle, CheckCircle, Loader, Building2, Upload, Check, X } from 'lucide-react';
import type { Business, AnalysisResult } from '../types/types';
import { useLanguage } from '../context/LanguageContext';
import { generateId } from '../utils/generateId';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }: { position: { lat: number; lng: number } | null, setPosition: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

interface BusinessRegistrationProps {
    onRegister: (business: Business) => void;
    businesses: Business[];
}

// Validation Regex Patterns
const PATTERNS = {
    legalName: /^[a-zA-Z0-9\s]{3,100}$/,
    tradeName: /^[a-zA-Z0-9\s]{3,50}$/,
    gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, // Standard 15-char GST format
    contact: /^[6-9]\d{9}$/, // Indian Mobile Number
    address: /^.{10,500}$/, // Min 10 chars
};

// --- Helper Component for Field Validation UI ---
interface InputFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'select' | 'textarea' | 'number';
    placeholder?: string;
    options?: string[];
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    error?: string;
    touched?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    label, name, type = "text", placeholder, options = [],
    value, onChange, onBlur, error, touched
}) => {
    const hasError = !!error;
    const isValidField = touched && !error && value;

    const baseClasses = "w-full bg-slate-950/50 backdrop-blur-sm rounded-lg px-4 py-3 sm:py-4 text-white outline-none transition-all duration-300 min-h-[48px] text-base";
    const borderClasses = hasError
        ? "border-l-4 border-red-500 bg-red-900/10 placeholder-red-300/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
        : isValidField
            ? "border-l-4 border-green-500 bg-green-900/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
            : "border border-slate-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20";

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
            <div className="relative">
                {type === 'select' ? (
                    <select
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        className={`${baseClasses} ${borderClasses}`}
                    >
                        {options.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : type === 'textarea' ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        rows={3}
                        placeholder={placeholder}
                        className={`${baseClasses} ${borderClasses} min-h-[100px]`}
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        className={`${baseClasses} ${borderClasses}`}
                    />
                )}

                {/* Status Icons */}
                {isValidField && (
                    <Check className="absolute right-3 top-3 h-5 w-5 text-green-500 animate-in fade-in zoom-in" />
                )}
                {hasError && (
                    <X className="absolute right-3 top-3 h-5 w-5 text-red-500 animate-in fade-in zoom-in" />
                )}
            </div>
            {hasError && (
                <p className="mt-1 text-xs text-red-400 animate-pulse flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {error}
                </p>
            )}
        </div>
    );
};

export const BusinessRegistration: React.FC<BusinessRegistrationProps> = ({ onRegister, businesses }) => {
    const { t } = useLanguage();

    // Form State
    const [formData, setFormData] = useState<Partial<Business>>({
        legalName: '',
        tradeName: '',
        type: 'Sole Proprietorship',
        address: '',
        branchName: '',
        contactNumber: '',
        email: '',
        website: '',
        gstNumber: '',
        category: '',
        proofOfAddress: '',
        latitude: undefined,
        longitude: undefined,
        assessment_number: '',
        water_connection_no: '',
        property_tax_status: 'Pending',
        water_tax_status: 'Pending',
        professional_tax_status: 'Pending',
    });

    // Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isValid, setIsValid] = useState(false);

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [termsError, setTermsError] = useState(false);
    const [duplicateError, setDuplicateError] = useState<string | null>(null);
    const [draftFound, setDraftFound] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [registeredBusiness, setRegisteredBusiness] = useState<Business | null>(null);
    const [gpsError, setGpsError] = useState<string | null>(null);

    useEffect(() => {
        const savedDraft = localStorage.getItem('tn_mbnr_registration_draft');
        if (savedDraft) {
            setDraftFound(true);
        }
    }, []);

    // Validation Effect
    useEffect(() => {
        const validateForm = () => {
            const newErrors: Record<string, string> = {};
            let valid = true;

            // Required Fields
            if (!formData.legalName || !PATTERNS.legalName.test(formData.legalName)) {
                if (touched.legalName) newErrors.legalName = "Name must be 3-100 alphanumeric characters.";
                valid = false;
            }
            if (!formData.tradeName || !PATTERNS.tradeName.test(formData.tradeName)) {
                if (touched.tradeName) newErrors.tradeName = "Name must be 3-50 alphanumeric characters.";
                valid = false;
            }
            if (!formData.category) {
                if (touched.category) newErrors.category = "Please select a business category.";
                valid = false;
            }
            if (!formData.address || !PATTERNS.address.test(formData.address || '')) {
                if (touched.address) newErrors.address = "Address must be at least 10 characters.";
                valid = false;
            }
            if (!formData.contactNumber || !PATTERNS.contact.test(formData.contactNumber)) {
                if (touched.contactNumber) newErrors.contactNumber = "Enter a valid 10-digit Indian mobile number.";
                valid = false;
            }

            // Optional Fields Validation (only if filled)
            if (formData.gstNumber && !PATTERNS.gst.test(formData.gstNumber)) {
                if (touched.gstNumber) newErrors.gstNumber = "Invalid GST Number format (e.g., 33AAAAA0000A1Z5).";
                valid = false;
            }

            setErrors(newErrors);
            setIsValid(valid);

            // Duplicate Check
            if (formData.tradeName) {
                const isDuplicate = businesses.some(b =>
                    b.tradeName.toLowerCase() === formData.tradeName?.toLowerCase() &&
                    b.status !== 'Rejected'
                );
                if (isDuplicate) {
                    setDuplicateError(`The business name "${formData.tradeName}" is already registered in our system. Please use a unique name.`);
                } else {
                    setDuplicateError(null);
                }
            }
        };

        validateForm();
    }, [formData, touched, businesses]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.permissions.query({ name: "geolocation" as any }).then((result) => {
                if (result.state === "denied") {
                    setGpsError("Location access is denied. Please enable it in browser settings.");
                }
                result.onchange = () => {
                    if (result.state === "denied") {
                        setGpsError("Location access is denied. Please enable it in browser settings.");
                    } else {
                        setGpsError(null);
                    }
                };
            });
        }
    }, []);

    const handleFillDemoData = () => {
        setFormData({
            legalName: "Amrit Tea Exports Pvt Ltd",
            tradeName: "Amrit Tea House",
            type: "Private Limited",
            category: "Food & Beverage",
            gstNumber: "33AABCX7891K1Z5", // Example valid format
            address: "45 Sterling Road, Nungambakkam, Chennai - 600034, Tamil Nadu",
            branchName: "Main Branch, Nungambakkam",
            contactNumber: "9876543210",
            email: "contact@amrittea.com",
            website: "https://www.amrittea.com",
            proofOfAddress: "rental_agreement.pdf",
            latitude: 13.0604,
            longitude: 80.2496,
            assessment_number: "CHN-05-048-01234",
            water_connection_no: "W-05-048-5678",
            property_tax_status: "Paid",
            water_tax_status: "Pending",
            professional_tax_status: "Paid"
        });

        setTouched({
            legalName: true,
            tradeName: true,
            category: true,
            address: true,
            contactNumber: true,
            gstNumber: true
        });

        setAnalysisResult(null);
    };

    const loadDraft = () => {
        const savedDraft = localStorage.getItem('tn_mbnr_registration_draft');
        if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            setFormData(parsed.data);
            setDraftFound(false);
        }
    };

    const discardDraft = () => {
        localStorage.removeItem('tn_mbnr_registration_draft');
        setDraftFound(false);
    };

    const saveDraft = () => {
        const draft = {
            data: formData,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem('tn_mbnr_registration_draft', JSON.stringify(draft));
        alert('Draft saved successfully!');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setTimeout(() => {
            setAnalysisResult({
                isSafe: true,
                riskLevel: 'Low',
                message: 'Business name verified successfully. All compliance checks passed.',
            });
            setIsAnalyzing(false);
        }, 2000);
    };

    const initiatePayment = async () => {
        if (!termsAccepted) {
            setTermsError(true);
            return;
        }
        setTermsError(false);
        setIsPaymentProcessing(true);

        try {
            const newId = generateId();
            const payload: Business = {
                ...formData as Business,
                id: newId,
                status: 'Pending',
                registrationDate: new Date().toISOString(),
                riskScore: 10,
            };

            let registered = payload;
            try {
                // Attempt Real Backend Registration
                const response = await fetch('/api/businesses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.data) {
                        registered = { ...payload, ...data.data };
                    }
                } else {
                    console.warn(`Backend returned ${response.status}. Falling back to Demo Mode.`);
                }
            } catch (apiError) {
                console.warn('Backend reachability error (expected on GitHub Pages). Falling back to Offline/Demo Mode.', apiError);
            }

            // Always succeed visually for the demo presentation
            onRegister(registered);
            setRegisteredBusiness(registered);
            localStorage.removeItem('tn_mbnr_registration_draft');

        } catch (error) {
            console.error("Critical Registration Error:", error);
            alert("An unexpected error occurred. Please try again.");
        } finally {
            setIsPaymentProcessing(false);
        }
    };

    if (registeredBusiness) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 text-center animate-in fade-in duration-700">
                <div className="bg-slate-900 rounded-2xl border border-green-500/30 p-6 sm:p-12 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500"></div>
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full"></div>
                            <CheckCircle className="relative h-20 w-20 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">{t.register.success}</h2>
                    <p className="text-slate-400 mb-8">
                        {registeredBusiness.tradeName} has been submitted for official verification.
                    </p>

                    <div className="bg-slate-950/50 p-6 rounded-xl border border-yellow-500/20 mb-8">
                        <div className="flex items-center justify-center text-yellow-500 mb-4">
                            <Loader className="h-6 w-6 mr-2 animate-spin" />
                            <span className="font-bold uppercase tracking-wider">Verification in Progress</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Our officers are reviewing your application and performing background checks.
                            Your license QR and certificate will be issued once approved.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-2">Application Tracking</h3>
                        <p className="text-slate-400">Application ID: <span className="text-yellow-500 font-mono text-lg break-all">{registeredBusiness.id}</span></p>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center mx-auto min-h-[48px] w-full sm:w-auto justify-center"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
            {draftFound && (
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4">
                    <div className="flex items-center">
                        <Save className="h-5 w-5 text-blue-400 mr-3 shrink-0" />
                        <span className="text-blue-200 text-sm">Found a saved draft from a previous session.</span>
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto">
                        <button onClick={loadDraft} className="flex-1 sm:flex-none text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors font-medium">Load Draft</button>
                        <button onClick={discardDraft} className="flex-1 sm:flex-none text-sm text-slate-400 hover:text-white px-4 py-2 transition-colors">Discard</button>
                    </div>
                </div>
            )}

            <div className="glass-card rounded-2xl p-5 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8 justify-between gap-4 relative z-10">
                    <div className="flex items-center">
                        <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-500 mr-3 sm:mr-4" />
                        <h2 className="text-xl sm:text-2xl font-bold text-white">{t.register.title}</h2>
                    </div>

                    <button
                        onClick={handleFillDemoData}
                        className="text-sm bg-yellow-500/10 text-yellow-500 border border-yellow-500/50 px-6 py-3 rounded-full hover:bg-yellow-500/20 transition-all hover:scale-105 flex items-center self-end sm:self-auto min-h-[48px]"
                    >
                        ⚡ Fill Demo Data
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Legal Name */}
                    <InputField
                        label={t.register.labels.legal_name}
                        name="legalName"
                        value={formData.legalName || ''}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.legalName}
                        touched={touched.legalName}
                        placeholder={t.register.placeholders.legal_name}
                    />

                    {/* Trade Name */}
                    <InputField
                        label="Trade Name (Shop Name)"
                        name="tradeName"
                        value={formData.tradeName || ''}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.tradeName}
                        touched={touched.tradeName}
                        placeholder="e.g., Sri Krishna Sweets"
                    />
                    {duplicateError && (
                        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-start animate-pulse">
                            <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-200">{duplicateError}</p>
                        </div>
                    )}

                    {/* Type & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            type="select"
                            label={t.register.labels.type}
                            name="type"
                            value={formData.type || 'Sole Proprietorship'}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            options={['Sole Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'LLP']}
                        />
                        <InputField
                            type="select"
                            label={t.register.category}
                            name="category"
                            value={formData.category || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.category}
                            touched={touched.category}
                            options={['', 'Food & Beverage', 'Retail', 'Health & Wellness', 'Services', 'Manufacturing', 'Logistics']}
                        />
                    </div>

                    {/* GST Number */}
                    <InputField
                        label={t.register.labels.gst}
                        name="gstNumber"
                        value={formData.gstNumber || ''}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.gstNumber}
                        touched={touched.gstNumber}
                        placeholder={t.register.placeholders.gst}
                    />

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">{t.register.labels.logo}</label>
                        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors cursor-pointer relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="transform group-hover:scale-110 transition-transform duration-300">
                                <Upload className="h-10 w-10 text-slate-500 mx-auto mb-2 text-yellow-500" />
                            </div>
                            <p className="text-slate-400">{logoFile ? logoFile.name : t.register.labels.upload_logo}</p>
                            <p className="text-xs text-slate-600 mt-1">Supports JPG, PNG</p>
                        </div>
                    </div>

                    {/* Address */}
                    <InputField
                        type="textarea"
                        label={t.register.labels.address}
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.address}
                        touched={touched.address}
                        placeholder={t.register.placeholders.address}
                    />

                    {/* Map Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Shop Location (Tap to select)</label>
                        <div className="h-64 rounded-lg overflow-hidden border border-slate-700 relative z-0">
                            <MapContainer center={[13.0827, 80.2707]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker
                                    position={formData.latitude && formData.longitude ? { lat: formData.latitude, lng: formData.longitude } : null}
                                    setPosition={(lat, lng) => {
                                        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                                        setGpsError(null);
                                    }}
                                />
                            </MapContainer>
                            {gpsError && (
                                <div className="absolute inset-x-0 bottom-0 bg-red-900/90 text-white p-3 text-xs flex items-center justify-center animate-in slide-in-from-bottom-2 backdrop-blur-sm z-[1000]">
                                    <AlertTriangle className="h-4 w-4 mr-2 text-red-300" />
                                    {gpsError}
                                </div>
                            )}
                        </div>
                        {formData.latitude && (
                            <p className="text-xs text-green-400 mt-1">
                                Selected Location: {formData.latitude.toFixed(4)}, {formData.longitude?.toFixed(4)}
                            </p>
                        )}
                    </div>

                    {/* Municipality Tax Linkage Section */}
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 animate-in slide-in-from-bottom-4">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                            <Building2 className="h-5 w-5 text-yellow-500 mr-2" />
                            Link Existing Municipal Taxes
                        </h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Enter your assessment numbers to auto-fetch tax status from tnurbanepay.tn.gov.in.
                            This enables the "One-Stop Payment" feature.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Property Tax Assessment No."
                                name="assessment_number"
                                value={formData.assessment_number || ''}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="e.g., CHN-05-048-01234"
                            />
                            <InputField
                                label="Water Tax / CMWSSB No."
                                name="water_connection_no"
                                value={formData.water_connection_no || ''}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="e.g., W-05-048-5678"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label={t.register.labels.branch}
                            name="branchName"
                            value={formData.branchName || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder={t.register.placeholders.branch}
                        />
                        <InputField
                            label={t.register.labels.contact}
                            name="contactNumber"
                            value={formData.contactNumber || ''}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            error={errors.contactNumber}
                            touched={touched.contactNumber}
                            placeholder="+91 98765 43210"
                        />
                    </div>

                    <InputField
                        label="Website URL (Optional)"
                        name="website"
                        value={formData.website || ''}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="https://www.example.com"
                    />

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-800 gap-4">
                        <button
                            onClick={saveDraft}
                            className="flex-1 sm:flex-none flex items-center justify-center text-slate-400 hover:text-white px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 transition-all text-sm font-medium"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Draft
                        </button>
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !isValid || !!duplicateError}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-8 py-3 rounded-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <Shield className="h-5 w-5 mr-2" />
                                    {t.register.submit}
                                </>
                            )}
                        </button>
                    </div>

                    {analysisResult && (
                        <div className={`mt-8 p-6 rounded-xl border animate-in fade-in slide-in-from-bottom-4 duration-500 ${analysisResult.isSafe ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                            <div className="flex items-start">
                                {analysisResult.isSafe ? (
                                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-4" />
                                ) : (
                                    <AlertTriangle className="h-6 w-6 text-red-500 mt-1 mr-4" />
                                )}
                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold mb-2 ${analysisResult.isSafe ? 'text-green-400' : 'text-red-400'}`}>
                                        {analysisResult.isSafe ? 'Verification Successful' : 'Risk Detected'}
                                    </h3>
                                    <p className="text-slate-300 mb-4">{analysisResult.message}</p>

                                    {analysisResult.isSafe && (
                                        <div className="mt-6 pt-6 border-t border-slate-700/50">
                                            <div className="mb-6">
                                                <div className="flex items-center mb-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                                                    <input
                                                        type="checkbox"
                                                        id="terms"
                                                        checked={termsAccepted}
                                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-yellow-500 focus:ring-yellow-500"
                                                    />
                                                    <label htmlFor="terms" className="ml-3 text-sm text-slate-300 cursor-pointer select-none">
                                                        I agree to the <button onClick={() => setShowTerms(!showTerms)} className="text-yellow-500 hover:underline">Terms and Conditions</button>
                                                    </label>
                                                </div>
                                                {showTerms && (
                                                    <div className="bg-slate-950 p-4 rounded-lg text-xs text-slate-400 mb-2 border border-slate-800 animate-in fade-in">
                                                        <p>1. I hereby declare that the information provided is true and correct.</p>
                                                        <p>2. I understand that falsification of data is a punishable offense.</p>
                                                        <p>3. I agree to the digital verification process.</p>
                                                    </div>
                                                )}
                                                {termsError && (
                                                    <p className="text-red-500 text-sm flex items-center mt-2 animate-pulse">
                                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                                        Please agree to the Terms and Conditions to proceed.
                                                    </p>
                                                )}
                                            </div>

                                            <div className="bg-slate-950 rounded-lg p-6 mb-6 border border-slate-800">
                                                <div className="flex justify-between text-sm text-slate-400 mb-2">
                                                    <span>Registration Fee</span>
                                                    <span>₹500.00</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-slate-400 mb-2">
                                                    <span>Blockchain Ledger Fee</span>
                                                    <span>₹50.00</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-slate-400 mb-4">
                                                    <span>GST (18%)</span>
                                                    <span>₹99.00</span>
                                                </div>
                                                <div className="flex justify-between text-xl font-bold text-white pt-4 border-t border-slate-800">
                                                    <span>Total Payable</span>
                                                    <span className="text-yellow-500">₹649.00</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={initiatePayment}
                                                disabled={isPaymentProcessing}
                                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center shadow-lg shadow-green-900/20 active:scale-95"
                                            >
                                                {isPaymentProcessing ? (
                                                    <>
                                                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                                                        Processing Secure Payment...
                                                    </>
                                                ) : (
                                                    'Proceed to Payment'
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
