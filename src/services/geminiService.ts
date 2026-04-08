import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import type { AnalysisResult, CitizenReport } from "../types/types";

/**
 * Senior AI Architect Service
 * Handles all interactions with Gemini Pro/Flash
 */
class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: GenerativeModel | null = null;
    private static instance: GeminiService;

    private constructor() {
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        if (API_KEY) {
            this.genAI = new GoogleGenerativeAI(API_KEY);
            this.model = this.genAI.getGenerativeModel({ 
                model: "gemini-2.0-flash",
                generationConfig: {
                    responseMimeType: "application/json"
                }
            });
        }
    }

    public static getInstance(): GeminiService {
        if (!GeminiService.instance) {
            GeminiService.instance = new GeminiService();
        }
        return GeminiService.instance;
    }

    /**
     * AI-powered logo and brand analysis
     */
    public async analyzeLogo(imageFile: File, businessName: string): Promise<AnalysisResult> {
        if (!this.model) {
            return this.getMockAnalysis(businessName);
        }

        try {
            const prompt = `
                Analyze logo for "${businessName}". Identify trademark risks, copyright issues, or visual mimics of famous brands.
                Return JSON schema: { "isSafe": boolean, "riskLevel": "Low"|"Medium"|"High", "similarBrands": string[], "message": string }
            `;

            const imageParts = await this.fileToGenerativePart(imageFile);
            const result = await this.model.generateContent([prompt, imageParts]);
            const response = await result.response;
            return JSON.parse(response.text());
        } catch (error) {
            console.error("AI Analysis Failed:", error);
            return {
                isSafe: false,
                riskLevel: "Medium",
                message: "Intelligence gathering interrupted. Proceed with caution.",
            };
        }
    }

    /**
     * AI-powered fraud report analysis for severity classification
     */
    public async analyzeFraudReport(report: Partial<CitizenReport>): Promise<{ severity: string; urgency: number; summary: string }> {
        if (!this.model) {
            return { severity: "Medium", urgency: 5, summary: "AI node offline. Standard classification applied." };
        }

        try {
            const prompt = `
                Analyze this fraud report: "${report.description}". 
                Rate severity based on financial impact, public safety, and evidence strength.
                Return JSON schema: { "severity": "Low"|"Medium"|"High"|"Critical", "urgency": number(1-10), "summary": string }
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return JSON.parse(response.text());
        } catch {
            return { severity: "High", urgency: 7, summary: "Automated risk flag raised due to processing error." };
        }
    }

    public async getChatResponse(message: string, history: { role: "user" | "model"; parts: { text: string }[] }[]): Promise<string> {
        if (!this.genAI) {
            return "AI node offline. Standard automated response applied.";
        }

        try {
            const chatModel = this.genAI.getGenerativeModel({ 
                model: "gemini-2.0-flash",
                systemInstruction: `
                    You are the TrustReg TN Assistant (MBNR Platform).
                    Your purpose is to help citizens and merchants in Tamil Nadu, India.
                    The platform uses HMAC-SHA256 signed QR codes and Haversine geofencing (200m threshold) to prevent business fraud.
                    
                    Rules:
                    1. Be official, polite, and helpful.
                    2. Support both English and Tamil (தமிழ்). If asked in Tamil, reply in Tamil.
                    3. If asked about registration: Explain that merchants need a unique logo (checked by AI), shop location, and contact details.
                    4. If asked about "Location Mismatch": Explain it's a security feature ensuring the shop is where it claims to be.
                    5. If asked about "Expired": Explain QR codes refresh every 30 seconds for security.
                    6. Never provide legal advice, but summarize platform rules.
                    7. Keep responses concise and formatted with markdown.
                `,
            });

            const chat = chatModel.startChat({
                history: history,
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Chat Failed:", error);
            return "Communication node disrupted. Please try again shortly.";
        }
    }

    private async fileToGenerativePart(file: File) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: {
                data: await base64EncodedDataPromise as string,
                mimeType: file.type,
            },
        };
    }

    private getMockAnalysis(name: string): AnalysisResult {
        const riskyNames = ['starbucks', 'a2b', 'dominos', 'kfc'];
        const isRisky = riskyNames.some(n => name.toLowerCase().includes(n));
        return {
            isSafe: !isRisky,
            riskLevel: isRisky ? 'High' : 'Low',
            similarBrands: isRisky ? ['Famous Brand Mimic'] : [],
            message: isRisky ? 'High similarity to protected trademark identified.' : 'Brand signature appears unique.',
        };
    }
}

export const aiService = GeminiService.getInstance();
