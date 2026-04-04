/**
 * Centralized Configuration Management
 * Supports multiple environments (development, staging, production)
 */

interface AppConfig {
    env: 'development' | 'staging' | 'production';
    apiUrl: string;
    geminiApiKey: string;
    features: {
        enableBlockchain: boolean;
        enableVoiceInput: boolean;
        debugMode: boolean;
    };
    auth: {
        tokenKey: string;
    };
}

const ENV = (import.meta.env.MODE as 'development' | 'staging' | 'production') || 'development';

const configs: Record<string, AppConfig> = {
    development: {
        env: 'development',
        apiUrl: import.meta.env.VITE_API_URL || '/api',
        geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
        features: {
            enableBlockchain: true,
            enableVoiceInput: true,
            debugMode: true,
        },
        auth: {
            tokenKey: 'tn_mbnr_token_dev',
        }
    },
    staging: {
        env: 'staging',
        apiUrl: '/api', // Relative path for proxied staging
        geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
        features: {
            enableBlockchain: true,
            enableVoiceInput: true,
            debugMode: true,
        },
        auth: {
            tokenKey: 'tn_mbnr_token_staging',
        }
    },
    production: {
        env: 'production',
        apiUrl: import.meta.env.VITE_API_URL || '/api',
        geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
        features: {
            enableBlockchain: true,
            enableVoiceInput: true,
            debugMode: false,
        },
        auth: {
            tokenKey: 'tn_mbnr_token_prod',
        }
    }
};

export const config = configs[ENV] || configs.development;
