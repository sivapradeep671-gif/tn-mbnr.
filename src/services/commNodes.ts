/**
 * Communication Node Infrastructure
 * Real implementation templates for Twilio and SendGrid.
 * These require VITE_TWILIO_ACCOUT_SID, VITE_TWILIO_AUTH_TOKEN, and VITE_SENDGRID_API_KEY.
 */

export const twilioService = {
    sendSms: async (to: string, body: string): Promise<boolean> => {
        const sid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
        
        console.log(`[TrustReg Communications] Initiating SMS protocol for: ${to}`);

        if (!sid || sid === 'MOCK_SID') {
            console.info('%c[MOCK MODE] SMS simulation successful.', 'color: #eab308; font-weight: bold;');
            return true;
        }

        try {
            const response = await fetch('/api/notify-sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, body })
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('[Communication Error] SMS relay failure:', error);
            return false;
        }
    }
};

export const emailService = {
    sendEmail: async (to: string, subject: string, html: string): Promise<boolean> => {
        const apiKey = import.meta.env.VITE_SENDGRID_API_KEY;

        console.log(`[TrustReg Communications] Initiating Email protocol for: ${to}`);

        if (!apiKey || apiKey === 'MOCK_KEY') {
            console.info('%c[MOCK MODE] Email simulation successful.', 'color: #eab308; font-weight: bold;');
            return true;
        }

        try {
            const response = await fetch('/api/notify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, subject, html })
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('[Communication Error] Email relay failure:', error);
            return false;
        }
    }
};
