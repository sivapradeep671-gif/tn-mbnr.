import { showToast } from '../hooks/useToast';

interface NotificationPayload {
    to: string;
    type: 'SMS' | 'EMAIL';
    message: string;
    template?: string;
}

/**
 * Mock Notification Service for TrustReg TN
 * In a production environment, this would integrate with Twilio or SendGrid.
 * Currently simulates API latency and success/failure states.
 */
export const notificationService = {
    send: async (payload: NotificationPayload): Promise<boolean> => {
        console.log(`[Notification Service] Sending ${payload.type} to ${payload.to}: ${payload.message}`);
        
        // Simulating network latency
        await new Promise(resolve => setTimeout(resolve, 800));

        // In demo mode, we always succeed but show a toast for visual feedback
        const icon = payload.type === 'SMS' ? '📱' : '📧';
        showToast(`${icon} ${payload.type} sent to ${payload.to.slice(0, 3)}***`, 'success');
        
        return true;
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
        const message = `Hello from TrustReg TN. Monthly Integrity Report for ${shopName}: ${stats.verified} Verified Scans, ${stats.failed} Security Flags.`;
        return notificationService.send({
            to: email,
            type: 'EMAIL',
            message
        });
    }
};
