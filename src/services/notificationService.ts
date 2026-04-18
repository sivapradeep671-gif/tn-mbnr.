import { showToast } from '../hooks/useToast';
import { twilioService, emailService } from './commNodes';

interface NotificationPayload {
    to: string;
    type: 'SMS' | 'EMAIL';
    message: string;
    subject?: string;
    template?: string;
}

/**
 * TrustReg TN Notification Authority
 * Integrates with Twilio (SMS) and SendGrid (Email) nodes.
 */
export const notificationService = {
    send: async (payload: NotificationPayload): Promise<boolean> => {
        console.log(`[Notification Authority] Dispatching ${payload.type} to recipient...`);
        
        let success = false;
        if (payload.type === 'SMS') {
            success = await twilioService.sendSms(payload.to, payload.message);
        } else {
            success = await emailService.sendEmail(payload.to, payload.subject || 'TrustReg TN Security Update', payload.message);
        }

        if (success) {
            const icon = payload.type === 'SMS' ? '📱' : '📧';
            showToast(`${icon} ${payload.type} dispatched to ${(payload.to || '').slice(0, 3)}***`, 'success');
        } else {
            showToast(`Failed to dispatch ${payload.type} alert`, 'error');
        }
        
        return success;
    },

    /**
     * Alerts the shop owner about a suspicious scan
     */
    alertOwner: async (shopName: string, ownerPhone: string, reason: string) => {
        const message = `TRUSTREG ALERT: Suspicious activity detected for your business "${shopName}". Reason: ${reason}. Please verify your QR signage.`;
        return notificationService.send({
            to: ownerPhone,
            type: 'SMS',
            message
        });
    },

    /**
     * Sends a monthly integrity report to the merchant
     */
    sendMonthlyReport: async (email: string, shopName: string, stats: { verified: number, failed: number }) => {
        const message = `
            <h2>TrustReg TN: Monthly Integrity Report</h2>
            <p><strong>Business:</strong> ${shopName}</p>
            <p><strong>Verified Scans:</strong> ${stats.verified}</p>
            <p><strong>Security Flags:</strong> ${stats.failed}</p>
            <p>Your business maintains an official integrity status of "EXCELLENT".</p>
        `;
        return notificationService.send({
            to: email,
            type: 'EMAIL',
            subject: `Monthly Report: ${shopName}`,
            message
        });
    }
};
