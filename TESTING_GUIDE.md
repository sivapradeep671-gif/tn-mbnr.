# 🧪 TrustReg TN: Testing Guide

This guide outlines the procedures for verifying the functionality, security, and integrity of the TrustReg TN platform.

## 🛠️ Environment Setup

Ensure your `.env` file is configured:
```env
VITE_GEMINI_API_KEY=your_key
QR_SECRET_KEY=demo_secret
PORT=3001
```

## 🧩 Unit Testing (Vitest)

We use Vitest for core logic verification.

### Running Tests
```bash
npm run test:run
```

### Key Test Suites:
1.  **Blockchain (`server/blockchain.test.ts`)**: Verifies block integrity and chain validation.
2.  **ID Generation (`src/utils/generateId.test.ts`)**: Ensures UUID consistency.
3.  **Translations (`src/utils/translations.test.ts`)**: Validates key-value consistency between English and Tamil.
4.  **Mock Verification (`src/utils/mockQR.test.ts`)**: Tests the geofence and signature logic in isolation.

## 📱 Manual Demo Flow (90 Seconds)

| Step | Action | Expected Outcome |
|------|--------|------------------|
| 1 | Register a Business | Receives a unique Shop ID (e.g., SHOP-123) |
| 2 | Merchant Login | Access the dashboard & generate a dynamic QR code |
| 3 | Citizen Scan (Valid) | Scan QR; result should show ✅ VERIFIED |
| 4 | Geofence Test | Move 200m+ away; result should show 📍 LOCATION MISMATCH |
| 5 | Security Check | Wait 30s for QR refresh; old photo shows ⏳ EXPIRED |
| 6 | Admin Console | View the fraud map; suspicious scans appear as red pins |

## 🛡️ Security Verification

### Geofencing
The system uses the Haversine formula to calculate the distance between the scanner and the registered business coordinates. 
*   **Threshold**: 200 meters.
*   **Verification**: Logs are saved to the `scans` table with the calculated distance.

### HMCA Signature
The QR code is an HMAC-SHA256 signed Base64 token.
*   **Integrity**: Altering a single character in the token results in a 🔴 COUNTERFEIT status.

## 🤖 AI Logic (Gemini)
The system uses Gemini 2.0 Flash to analyze uploaded logos during registration.
*   **Test**: Upload a generic non-business image (e.g., a cat) to see the AI flag it for review.

## 🏗️ CI/CD Integration
Every Push/PR triggers the GitHub Actions pipeline:
1.  **Lint**: Checks code style.
2.  **TypeScript**: Verifies type safety.
3.  **Tests**: Runs the full Vitest suite.
4.  **Build**: Verifies production bundling.
