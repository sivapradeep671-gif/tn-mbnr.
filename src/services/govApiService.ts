import { showToast } from '../hooks/useToast';

interface GstData {
    legalName: string;
    tradeName: string;
    address: string;
    nic_category: string;
    status: 'ACTIVE' | 'INACTIVE';
}

interface UdyamData {
    tradeName: string;
    nic_category: string;
    type: string;
}

interface FssaiData {
    legalName: string;
    address: string;
    status: 'ACTIVE' | 'EXPIRED';
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
     * Fetches business data from the National UDYAM portal
     */
    fetchUdyamDetails: async (udyamNo: string): Promise<UdyamData | null> => {
        console.log(`[Gov API Bridge] Fetching UDYAM data for: ${udyamNo}`);
        await new Promise(resolve => setTimeout(resolve, 1200));

        if (udyamNo.toUpperCase().startsWith('UDYAM')) {
            return {
                tradeName: "TN Ventures",
                nic_category: "Manufacturing",
                type: "Private Limited"
            };
        }
        showToast('UDYAM Registration not found', 'error');
        return null;
    },

    /**
     * Fetches business data from the FSSAI Food Safety portal
     */
    fetchFssaiDetails: async (fssaiNo: string): Promise<FssaiData | null> => {
        console.log(`[Gov API Bridge] Fetching FSSAI data for: ${fssaiNo}`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (fssaiNo.length === 14) {
            return {
                legalName: "AUTHENTIC TAMIL NADU VENTURES PVT LTD",
                address: "Plot 12, SIDCO Industrial Estate, Guindy, Chennai - 600032",
                status: 'ACTIVE'
            };
        }
        showToast('Invalid FSSAI License Number', 'error');
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
