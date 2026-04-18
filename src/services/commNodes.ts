/**
 * Communication Node Infrastructure
 * Real implementation templates for Twilio and SendGrid.
 * These require VITE_TWILIO_ACCOUT_SID, VITE_TWILIO_AUTH_TOKEN, and VITE_SENDGRID_API_KEY.
 */

export const twilioService = {
    sendSms: async (to: string, body: string): Promise<boolean> => {
        const sid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
        const token = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
        const from = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

        if (!sid || !token || sid === 'MOCK_SID') {
            console.warn('[Twilio] Running in MOCK mode. SMS not sent to:', to);
            return true;
        }

        try {
            const response = await fetch('/api/notify-sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, body, from })
            });
            return response.ok;
        } catch (error) {
            console.error('[Twilio] SMS dispatch failed:', error);
            return false;
        }
    }
};

export const emailService = {
    sendEmail: async (to: string, subject: string, html: string): Promise<boolean> => {
        const apiKey = import.meta.env.VITE_SENDGRID_API_KEY;

        if (!apiKey || apiKey === 'MOCK_KEY') {
            console.warn('[SendGrid] Running in MOCK mode. Email not sent to:', to);
            return true;
        }

        try {
            const response = await fetch('/api/notify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, subject, html })
            });
            return response.ok;
        } catch (error) {
            console.error('[SendGrid] Email dispatch failed:', error);
            return false;
        }
    }
};
