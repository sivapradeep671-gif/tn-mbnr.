import { showToast } from '../hooks/useToast';

interface GstData {
    legalName: string;
    tradeName: string;
    address: string;
    nic_category: string;
    status: 'ACTIVE' | 'INACTIVE';
}

/**
 * TrustReg TN Government API Bridge
 * Simulates integration with GSTN and UDYAM portals.
 * In production, this would use authenticated API endpoints.
 */
export const govApiService = {
    /**
     * Fetches business data from the National GST Grid
     */
    fetchGstDetails: async (gstNumber: string): Promise<GstData | null> => {
        console.log(`[Gov API Bridge] Fetching GST data for: ${gstNumber}`);
        
        // Simulating API Latency
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock response data based on common GST patterns
        if (gstNumber.startsWith('33')) { // 33 is the state code for Tamil Nadu
            return {
                legalName: "AUTHENTIC TAMIL NADU VENTURES PVT LTD",
                tradeName: "TN Ventures",
                address: "Plot 12, SIDCO Industrial Estate, Guindy, Chennai - 600032",
                nic_category: "Manufacturing",
                status: 'ACTIVE'
            };
        }

        showToast('GST Number not found in TN Regional Grid', 'error');
        return null;
    },

    /**
     * Verifies Aadhaar linked metadata for business owners
     */
    verifyAadhaarLink: async (aadhaarNo: string): Promise<boolean> => {
        // Aadhaar verification simulation
        await new Promise(resolve => setTimeout(resolve, 1000));
        return aadhaarNo.length === 12;
    }
};
