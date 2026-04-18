# TrustReg TN: Operational Runbook (SOP-001)

This document provides step-by-step instructions for the administration and recovery of the regional TrustReg Node.

## 🟢 1. Daily Operations & Health
Verify node heartbeat and blockchain synchronization status.

-   **Check Pulse**: `GET /api/health` should return `{"status": "online"}`.
-   **Audit Sync**: Access the `Blockchain Explorer` and ensure the `Valid` badge is green.
-   **Log Monitoring**: Review server JSON logs specifically for `level: ERROR`.

## 🟠 2. Incident Response (Forensics)
If a Citizen scans a QR and receives a `📍 LOCATION MISMATCH` or `🔴 COUNTERFEIT` status:

1.  **Freeze Identity**: Locate the `business_id` in the Admin Dashboard.
2.  **Verify Geo-History**: Check the `Suspicious Activity` map for other failed scans at the same location.
3.  **Audit Trail Export**: Use the `Ledger` tool to extract the block hash associated with the record for legal submission.
4.  **Officer Scrutiny**: Flag the business for an emergency `INSPECTION` stage in the approval workflow.

## 🔴 3. Critical System Recovery
Procedures for system-layer failure.

### A. Database Corruption
In the event the SQLite database becomes unstable:
1.  **Stop Node**: Kill the Node.js process.
2.  **Backlink Verification**: The blockchain ledger serves as the source of truth. Data from `txn_mbnr.db` can be re-validated against the `ledger` table hashes.
3.  **Restore Point**: Restore from `tn_mbnr.db.backup` (backups performed every 24h by the infrastructure cron Job).

### B. Security Breach (Token Leak)
If a private secret (JWT/QR) is compromised:
1.  **Cycle Secrets**: Update the `AUTH_SECRET` and `QR_SECRET_KEY` in the environment (`.env`).
2.  **Node Restart**: Restart the service to force all active tokens to expire immediately.
3.  **Ledger Integrity**: Verify the blockchain chain hasn't been tampered with (`isChainValid()`).

## 🔵 5. Advanced Intelligence & Governance (Phase 3)
Strategic protocols for the High-Integrity municipal workflow.

### A. AI Forensic Scrutiny (Gemini)
When a business is in the `UNDER_REVIEW` stage:
1.  **Invoke Intelligence**: Click "Run Scrutiny" in the Inspector Dashboard.
2.  **Audit Brands**: The AI will perform cross-brand analysis for counterfeit naming risks.
3.  **Risk Score**: If the `Integrity Score > 75%`, mandatory manual field audit is required before approval.

### B. Blockchain Ledger Commitment
Final approval is an immutable legal act:
1.  **Cryptographic Signing**: Inspectors must perform a "Commit-to-Chain" signing.
2.  **TX_ID Verification**: Every approved node receives a unique `TX_ID` hash.
3.  **Sovereign Audit**: Once committed, the trust certificate is tamper-proof and cryptographically verifiable by citizens in real-time.

### C. Offline Field Operations
For officers in low-bandwidth zones (Wards-08, 12):
1.  **Transparent Queuing**: The PWA automatically detects offline state and switches to "Local Node Mode".
2.  **Sync-Queue Management**: All inspectors approvals and citizen reports are queued locally.
3.  **Automatic Reconciliation**: Connectivity restoration triggers an automatic background sync. Verify the "Network Stable" badge in the dashboard.

## 🏢 6. Strategic Executive Oversight
Strategic resource allocation for Nodal Officers.

1.  **Revenue Yield Map**: Use the "Strategic Command" hub to identify wards with high tax-pendency.
2.  **Compliance Heatmaps**: Target "High-Risk Nodes" for unplanned audits to maintain district-wide trust.
3.  **SLA Acceleration**: Monitor current processing velocity and re-assign inspectors to bottleneck sectors.

## 🛠️ 7. Administration
-   **Add Officer**: Update the Auth middleware and add the phone/role (inspector/executive) to the verified pool.
-   **Update SLAs**: Use direct SQL to update the `settings` table for new legislative processing days.
    *   `UPDATE settings SET value = '30' WHERE key = 'SLA_DAYS_NEW';`
