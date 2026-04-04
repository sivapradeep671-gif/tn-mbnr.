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

## 🛠️ 4. Administration
-   **Add Officer**: Update the Auth middleware and add the phone/role to the verified pool.
-   **Update SLAs**: Use direct SQL to update the `settings` table for new legislative processing days.
    *   `UPDATE settings SET value = '30' WHERE key = 'SLA_DAYS_NEW';`
