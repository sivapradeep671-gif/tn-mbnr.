# 🚀 TrustReg TN: Phase 2 Implementation Plan

This document outlines the strategic roadmap for the TrustReg TN platform, moving from a hackathon prototype to a municipal-grade pilot.

## 📈 Status Audit: Phase 1 ✅
*   [x] **Blockchain Ledger**: Immutable audit trail for registrations.
*   [x] **Dynamic QR Signing**: HMAC-SHA256 for tampering prevention.
*   [x] **AI Logo Verification**: Gemini 2.0 Flash for brand duplication checks.
*   [x] **Internationalization**: Full **Tamil (தமிழ் மொழி)** and English support.
*   [x] **CI/CD Pipeline**: GitHub Actions for automated verification.
*   [x] **Admin Analytics**: High-fidelity dashboard with fraud heatmaps.

---

## 📅 Roadmap: Phase 2 (Current Focus)

### 🔴 Priority 1: Communication & Transparency
1.  **SMS/Email Alert Integration** (Done - Mocked)
    - Replace `notificationService.ts` mocks with actual Twilio/SendGrid implementations.
    - Notify business owners immediately on geofence mismatch scans.
2.  **Live Audit Logs**
    - Transition from the internal `blockchain.cjs` simulation to a permissioned blockchain (e.g., Hyperledger Fabric) or a stable L2 (Polygon/Base).

### 🟡 Priority 2: Robust Mobility
1.  **Mobile Progressive Web App (PWA)** (In Progress)
    - Service worker implementation for offline verification capabilities.
    - "Add to Home Screen" support for shopkeepers to access their dashboard like a native app.
2.  **Advanced QR Scanning**
    - Offline QR support for areas with low connectivity using local hash pre-computation.
    - Secure "Tap-to-Verify" (NFC) as an alternative for modern Android devices.

### 🟢 Priority 3: Governance & AI Scaling
1.  **AI Severity Triage**
    - Improve Gemini prompts for citizen report classification based on Tamil Nadu state laws.
    - Automated severity assignments for municipal official follow-ups.
2.  **Government API Bridge**
    - Integrate with GST and UDYAM APIs for automated legal data validation during registration.

---

## 🏗️ Technical Enhancements
*   **Database**: Migrating from SQLite to PostgreSQL for better concurrency handling during the 50k shop pilot.
*   **Caching**: Implement Redis for storing dynamic QR tokens in memory, reducing database load during peak scan times.
*   **Monitoring**: Integrated Sentry/LogRocket for tracking frontend errors and scan performance in the field.

---

## 👥 Pilot Target: 50,000 Shops (Chennai Metro)
*   **Goal**: Zero counterfeit businesses allowed in the Anna Nagar and T-Nagar pilot sectors.
*   **Metrics**: 1M+ scans verified annually; ₹20 Cr+ in protected trade revenue.
