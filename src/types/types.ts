export type LicenseStatus = 'ACTIVE' | 'GRACE' | 'PENDING' | 'EXPIRED' | 'BLOCKED';

export type WorkflowStage = 'DRAFT' | 'SUBMITTED' | 'SCRUTINY' | 'INSPECTION' | 'FINAL';
export type WorkflowStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'UNDER_REVIEW';

export interface RegistryApproval {
    id: number;
    registry_id: string;
    stage: WorkflowStage;
    status: WorkflowStatus;
    acted_by_user_id: string;
    acted_by_role: string;
    acted_at: string;
    comments: string;
    order_ref_no?: string;
    valid_from?: string;
    valid_to?: string;
    attachment_url?: string;
}

export interface Business {
    id: string;
    legalName: string;
    tradeName: string;
    type: 'Sole Proprietorship' | 'Partnership' | 'Private Limited' | 'Public Limited' | 'LLP';
    address: string;
    branchName?: string;
    contactNumber: string;
    email: string;
    website?: string;
    gstNumber?: string;
    category: string;
    proofOfAddress?: string;
    logoUrl?: string;
    status: 'Pending' | 'Verified' | 'Rejected' | 'Draft' | 'Submitted' | 'Under Scrutiny' | 'Inspection Scheduled';
    riskScore?: number;
    registrationDate: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    latitude?: number;
    longitude?: number;
    // License Status Fields
    license_valid_till?: string;
    grace_ends_at?: string;
    pay_by_date?: string;
    payment_done?: number;
    license_status?: LicenseStatus;
    // Municipality Tax Fields
    assessment_number?: string;
    water_connection_no?: string;
    property_tax_status?: 'Paid' | 'Pending' | 'N/A';
    water_tax_status?: 'Paid' | 'Pending' | 'N/A';
    professional_tax_status?: 'Paid' | 'Pending' | 'N/A';
    // Workflow tracking
    current_stage?: WorkflowStage;
    last_status?: WorkflowStatus;
    // Municipal & Compliance Expansion
    municipal_ward?: string;
    nic_category?: string;
    employee_count?: number;
    application_type?: 'NEW' | 'AMENDMENT' | 'RENEWAL' | 'CANCELLATION';
    sla_deadline_at?: string;
    aadhaar_no?: string; // Masked
    documents_metadata?: string; // JSON string
    // Analytics
    total_scans?: number;
    verified_scans?: number;
    failed_scans?: number;
}

export interface AnalysisResult {
    isSafe: boolean;
    riskLevel: 'Low' | 'Medium' | 'High';
    similarBrands?: string[];
    message: string;
}

export interface CitizenReport {
    id: string;
    businessName: string;
    business_name?: string; // Matching backend naming
    location: string;
    description: string;
    category?: string;
    severity?: string;
    imageUrl?: string;
    status: 'Submitted' | 'Under Review' | 'Resolved';
    timestamp: string;
    latitude?: number;
    longitude?: number;
}
export interface GlobalHandlers {
    onReportBusiness?: (name: string) => void;
    onOpenCitizenReg?: () => void;
}
