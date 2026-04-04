# Implementation Plan: TN-MBNR TrustReg Enterprise Edition

This plan outlines the steps to evolve the prototype into a production-grade e-governance platform aligned with the **Tamil Nadu Business Facilitation Act** and municipal standards.

## 🏛️ Phase 1: Legal & Policy Compliance
**Goal:** Align data structures and workflows with TN Government requirements.

1.  **TN-Specific Data Schema**:
    *   Add fields for: `No. of Employees`, `Nature of Activity` (NIC Codes), `Shift Details`, `Safety Equipment`.
    *   Implement **SLA Tracking**: `sla_deadline_at`, `sla_cleared_at`, `sla_days_remaining`.
2.  **Multi-Lifecycle Support**:
    *   Introduce `application_type`: `NEW_REGISTRATION`, `AMENDMENT`, `RENEWAL`, `SURRENDER`.
    *   State machine for Business: `DRAFT` -> `SUBMITTED` -> `SCRUTINY` -> `INSPECTION` -> `APPROVED` -> `REJECTED`.

## 📂 Phase 2: Functional Core
**Goal:** Implement the "Hard" features of civic management.

1.  **Document Management**:
    *   `DocumentStore` system for mandatory uploads:
        *   Identity Proof (Aadhaar/PAN)
        *   Property Tax Receipt (TN-specific)
        *   NOC from Fire/Police (for high-risk categories)
    *   Auto-generation of **Order PDF** and **Trade License** using blockchain hashes as signatures.
2.  **Payment Gateway Integration (Reconciliation)**:
    *   Dynamic Fee Calculator based on category and ULB slabs.
    *   Receipt generation and history tracking.
3.  **Unified Notification System**:
    *   Automated SMS/Email triggers for:
        *   "Application Received - Track ID: TN-XXXX"
        *   "SLA Breach Warning" (For Officers)
        *   "Renewal Due in 30 Days"

## 👮 Phase 3: Governance & Security
**Goal:** Enterprise-grade reliability and departmental control.

1.  **Granular RBAC (Role Based Access Control)**:
    *   `citizen`: Apply, Track, Download.
    *   `csc_operator`: Apply on behalf of citizens.
    *   `scrutiny_officer`: Basic doc check.
    *   `inspector`: Field verification & Geo-tagging.
    *   `approver`: Final sign-off.
    *   `super_admin`: Config master data.
2.  **Security Hardening**:
    *   Sensitive PII data encryption at rest.
    *   Audit Logging: Append-only backend logs for every "View" or "Edit" action.
    *   MFA (Multi-Factor Authentication) for Government Officers.

## 📊 Phase 4: Monitoring & Operations
**Goal:** Accountability and data-driven decision making.

1.  **Officer Dashboard (SLA Focused)**:
    *   "Aging Report": Group applications by days pending (0-3, 3-7, 7+).
    *   Heatmaps of business clusters per ward.
2.  **Master Data Configuration**:
    *   ULB Settings: Ward lists, Holiday calendars, Fee slabs per trade category.
    *   Rule Engine: Configure "SLA Days" per application type without code changes.

---

## 🚀 Execution Roadmap (Student Project Scope)

| Step | Component | Feature | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `Backend` | Expand SQL Schema & migrations for TN fields | 🔥 High | ✅ DONE |
| 2 | `Backend` | Documents Metadata & Pseudo-Doc API | 🔥 High | ✅ DONE |
| 3 | `Frontend` | Advanced `BusinessRegistration` (Multi-stage) | 🔥 High | ✅ DONE |
| 4 | `Frontend` | Officer Dashboard (Pendency/SLA View) | ⚡ Medium | ✅ DONE |
| 5 | `Service` | Notification Simulation Middleware | ⚡ Medium | ✅ DONE |
| 6 | `Internal` | Audit Trail Persistence (Blockchain + DB) | 🛡️ Essential | ✅ DONE |
| 7 | `UI/UX` | Cyber-Industrial Aesthetic & Print System | 🎨 Visual | ✅ DONE |

> [!TIP]
> **COMPLETION NOTE**: All primary objectives for the academic prototype have been finalized. The platform now demonstrates a fully integrated e-governance lifecycle with high-fidelity simulations for legal compliance, audit logging, and document issuance.
