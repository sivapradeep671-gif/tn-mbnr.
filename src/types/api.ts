import type { Business } from './types';

export interface ApiResponse<T> {
    message: string;
    data?: T;
    error?: string;
    id?: number | string;
}

export interface BusinessListResponse extends ApiResponse<Business[]> {}

export interface BusinessSingleResponse extends ApiResponse<Business> {
    blockHash?: string;
}

export interface AuthResponse extends ApiResponse<void> {
    token: string;
    user: {
        id: string;
        phone: string;
        role: 'citizen' | 'business' | 'admin';
    };
}

export interface AIAnalysisResponse {
    verified: boolean;
    confidence: number;
    analysis: string;
}

export interface ReportResponse extends ApiResponse<void> {
    image?: string;
}
