const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const db = require('./database.cjs');
const { Blockchain, Block } = require('./blockchain.cjs');
const { calculateLicenseStatus, calculateLicenseTimestamps } = require('./licenseStatus.cjs');
const mult = require('multer');
const fs = require('fs');
require('dotenv').config({ path: '../.env' });

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for image uploads
const storage = mult.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'report-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = mult({ storage: storage });

const tnMbnrChain = new Blockchain();

// Initialize Blockchain from DB
db.all("SELECT * FROM ledger ORDER BY index_id ASC", [], (err, rows) => {
    if (err) {
        console.error("Error loading ledger:", err);
        return;
    }
    if (rows.length === 0) {
        // Create Genesis Block if empty
        const genesisBlock = tnMbnrChain.createGenesisBlock();
        const sql = `INSERT INTO ledger (timestamp, data, previousHash, hash, nonce) VALUES (?,?,?,?,?)`;
        const params = [genesisBlock.timestamp, JSON.stringify(genesisBlock.data), genesisBlock.previousHash, genesisBlock.hash, genesisBlock.nonce];
        db.run(sql, params, (err) => {
            if (err) console.error("Error saving genesis block:", err);
            else console.log("Genesis Block created and saved.");
        });
    } else {
        // Rebuild chain in memory (simplified)
        tnMbnrChain.chain = rows.map(row => {
            const b = new Block(row.timestamp, JSON.parse(row.data), row.previousHash);
            b.hash = row.hash;
            b.nonce = row.nonce;
            return b;
        });
        console.log(`Blockchain loaded with ${tnMbnrChain.chain.length} blocks.`);
    }
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/demo', require('./demoRoutes.cjs'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Report Suspicious Business (with Image)
app.post('/api/reports', upload.single('image'), (req, res) => {
    const { businessName, location, description, category, severity } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `INSERT INTO reports (business_name, location, description, category, severity, image_path) VALUES (?,?,?,?,?,?)`;
    const params = [businessName, location, description, category, severity, imagePath];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "id": this.lastID,
            "image": imagePath
        });
    });
});

// Get all businesses
app.get('/api/businesses', (req, res) => {
    const sql = "SELECT * FROM businesses";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Register a new business
app.post('/api/businesses', (req, res) => {
    const { id, legalName, tradeName, type, category, address, proofOfAddress, branchName, contactNumber, email, gstNumber, status, registrationDate, riskScore, latitude, longitude } = req.body;

    // Default to Chennai coordinates with random jitter if not provided (for demo)
    const lat = latitude || (13.0827 + (Math.random() - 0.5) * 0.1);
    const lng = longitude || (80.2707 + (Math.random() - 0.5) * 0.1);

    // Calculate license timestamps
    const regDate = registrationDate || new Date().toISOString();
    const licenseTimestamps = calculateLicenseTimestamps(regDate);

    // Default tax statuses if not provided
    const propStatus = req.body.property_tax_status || 'Pending';
    const waterStatus = req.body.water_tax_status || 'Pending';
    const profStatus = req.body.professional_tax_status || 'Pending';

    const sql = `INSERT INTO businesses (
        id, legalName, tradeName, type, category, address, proofOfAddress, branchName, 
        contactNumber, email, gstNumber, status, registrationDate, riskScore, latitude, longitude,
        license_valid_till, grace_ends_at, pay_by_date, payment_done, license_status,
        assessment_number, water_connection_no, property_tax_status, water_tax_status, professional_tax_status,
        website
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const params = [
        id, legalName, tradeName, type, category, address, proofOfAddress, branchName,
        contactNumber, email, gstNumber, status, regDate, riskScore, lat, lng,
        licenseTimestamps.license_valid_till,
        licenseTimestamps.grace_ends_at,
        licenseTimestamps.pay_by_date,
        licenseTimestamps.payment_done,
        licenseTimestamps.license_status,
        req.body.assessment_number,
        req.body.water_connection_no,
        propStatus,
        waterStatus,
        profStatus,
        req.body.website || ''
    ];

    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        // SIMULATED REAL DATA INTEGRATION (Mocking tnurbanepay.tn.gov.in)
        // In a real app, this would be an `axios.get` to the government API.
        const mockMunicipalData = {
            certificateId: `MUNI-TN-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`,
            propertyTaxStatus: propStatus === 'Paid' ? 'Paid' : (Math.random() > 0.5 ? 'Paid' : 'Pending'), // Simulate fetch
            waterTaxStatus: waterStatus === 'Paid' ? 'Paid' : (Math.random() > 0.5 ? 'Paid' : 'Pending'),
            professionalTaxStatus: profStatus === 'Paid' ? 'Paid' : (Math.random() > 0.5 ? 'Paid' : 'Pending'),
            zone: "Zone-II (Commercial)",
            lastInspectionDate: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0]
        };
        console.log("✔ Verified with tnurbanepay.tn.gov.in:", mockMunicipalData);

        // Add to Blockchain (Enhanced with Verified Data)
        const newBlock = new Block(new Date().toISOString(), {
            id,
            tradeName,
            status: 'Registered',
            verification: mockMunicipalData, // Storing the "Real Data" proof on-chain
            license: licenseTimestamps
        });
        tnMbnrChain.addBlock(newBlock);

        // Save Block to DB
        const ledgerSql = `INSERT INTO ledger (timestamp, data, previousHash, hash, nonce) VALUES (?,?,?,?,?)`;
        const ledgerParams = [newBlock.timestamp, JSON.stringify(newBlock.data), newBlock.previousHash, newBlock.hash, newBlock.nonce];

        db.run(ledgerSql, ledgerParams, (err) => {
            if (err) console.error("Error saving block to ledger:", err);
        });

        res.json({
            "message": "success",
            "data": { ...req.body, ...mockMunicipalData }, // Return the enhanced data
            "id": this.lastID,
            "blockHash": newBlock.hash
        });
    });
});

// AI Verification Endpoint
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");

app.post('/api/verify-business', async (req, res) => {
    try {
        const { businessName, type } = req.body;

        if (!process.env.VITE_GEMINI_API_KEY) {
            // Mock response if no key
            return res.json({
                verified: true,
                confidence: 0.85,
                analysis: "Mock Analysis: The business name appears valid and appropriate for the specified sector. (API Key missing)"
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analyze if the business name "${businessName}" is appropriate and valid for a "${type}" business in Tamil Nadu. Return a JSON response with fields: verified (boolean), confidence (0-1), and analysis (string).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // cleanup json string
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonStr);

        res.json(analysis);
    } catch (error) {
        console.error("AI Verification Error:", error);
        res.status(500).json({ error: "Failed to verify business" });
    }
});

// --- Dynamic QR & Verification Logic ---

const QR_SECRET_KEY = process.env.QR_SECRET_KEY || 'tn-mbnr-trust-key-2024';

// Helper to sign data
const signData = (data) => {
    return crypto.createHmac('sha256', QR_SECRET_KEY).update(JSON.stringify(data)).digest('hex');
};

// Calculate distance in km (Haversine formula)
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// 1. Generate Dynamic QR Token
app.get('/api/qr-token/:id', (req, res) => {
    const { id } = req.params;

    // Fetch business to get location
    db.get("SELECT * FROM businesses WHERE id = ?", [id], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: "Business not found" });
        }

        const payload = {
            id: row.id,
            name: row.tradeName,
            lat: row.latitude || 13.0827, // Fallback if null
            lng: row.longitude || 80.2707,
            exp: Date.now() + 30000, // Expires in 30 seconds
            nonce: Math.random().toString(36).substring(7)
        };

        const signature = signData(payload);
        res.json({ token: Buffer.from(JSON.stringify({ payload, signature })).toString('base64') });
    });
});

// 2. Verify Scan with Geofence
app.post('/api/verify-scan', (req, res) => {
    let { token, scannerLocation } = req.body; // scannerLocation: { lat, lng }
    token = token ? token.trim() : '';

    try {
        // --- 1. Attempt Dynamic Token Verification ---
        try {
            const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
            const { payload, signature } = decoded;

            const expectedSignature = signData(payload);
            if (signature !== expectedSignature) {
                // Log counterfeit attempt
                const scanSql = `INSERT INTO scans (business_id, token, scan_lat, scan_lng, result, distance) VALUES (?,?,?,?,?,?)`;
                db.run(scanSql, [payload.id || 'UNKNOWN', token, scannerLocation?.lat, scannerLocation?.lng, 'COUNTERFEIT', null]);

                return res.json({ status: 'COUNTERFEIT', message: 'Invalid QR Signature' });
            }

            if (Date.now() > payload.exp) {
                // Log expired token scan
                const scanSql = `INSERT INTO scans (business_id, token, scan_lat, scan_lng, result, distance) VALUES (?,?,?,?,?,?)`;
                db.run(scanSql, [payload.id, token, scannerLocation?.lat, scannerLocation?.lng, 'EXPIRED', null]);

                return res.json({ status: 'EXPIRED', message: 'QR Code Expired' });
            }

            if (scannerLocation && scannerLocation.lat) {
                const distance = getDistanceFromLatLonInKm(
                    payload.lat, payload.lng,
                    scannerLocation.lat, scannerLocation.lng
                );

                if (distance > 0.2) {
                    // Log suspicious scan
                    const scanSql = `INSERT INTO scans (business_id, token, scan_lat, scan_lng, result, distance) VALUES (?,?,?,?,?,?)`;
                    db.run(scanSql, [payload.id, token, scannerLocation.lat, scannerLocation.lng, 'LOCATION_MISMATCH', distance]);

                    return res.json({
                        status: 'LOCATION_MISMATCH',
                        message: `Scanner is ${distance.toFixed(2)}km away from registered location.`,
                        distance
                    });
                }
            }


            db.get("SELECT * FROM businesses WHERE id = ?", [payload.id], (err, row) => {
                if (err || !row) {
                    // Log failed scan
                    const scanSql = `INSERT INTO scans (business_id, token, scan_lat, scan_lng, result, distance) VALUES (?,?,?,?,?,?)`;
                    db.run(scanSql, [payload.id, token, scannerLocation?.lat, scannerLocation?.lng, 'INVALID', null]);

                    return res.json({ status: 'INVALID', message: 'Business Not Found in Registry' });
                }

                // Calculate distance for logging
                const distance = scannerLocation?.lat ? getDistanceFromLatLonInKm(
                    payload.lat, payload.lng,
                    scannerLocation.lat, scannerLocation.lng
                ) : null;

                // Calculate license status
                const licenseStatus = calculateLicenseStatus(row);

                // Log successful scan
                const scanSql = `INSERT INTO scans (business_id, token, scan_lat, scan_lng, result, distance) VALUES (?,?,?,?,?,?)`;
                db.run(scanSql, [row.id, token, scannerLocation?.lat, scannerLocation?.lng, 'VALID', distance]);

                return res.json({
                    status: 'VALID',
                    business: {
                        name: row.tradeName,
                        id: row.id,
                        legalName: row.legalName,
                        gst: row.gstNumber,
                        lat: row.latitude,
                        lng: row.longitude
                    },
                    license: licenseStatus,
                    message: 'Verified Successfully (Dynamic)'
                });
            });

            return; // Exit after starting dynamic DB lookup
        } catch (parseError) {
            // Not a dynamic token, try static ID lookup
            console.log("Not a dynamic token, trying static lookup for:", token);
        }

        // --- 2. Static ID Verification Fallback ---
        console.log("Searching DB for static ID:", token);
        db.get("SELECT * FROM businesses WHERE id = ?", [token], (err, row) => {
            if (err) {
                console.error("Database error during static lookup:", err);
                return res.json({ status: 'ERROR', message: 'Internal Database Error' });
            }

            if (!row) {
                console.log("No business found for ID:", token);
                return res.json({ status: 'INVALID', message: 'Business Not Found or Malformed Token' });
            }

            console.log("Business found:", row.tradeName);

            // Location check for static code (if location is available in DB)
            if (scannerLocation && scannerLocation.lat && row.latitude && row.longitude) {
                const distance = getDistanceFromLatLonInKm(
                    row.latitude, row.longitude,
                    scannerLocation.lat, scannerLocation.lng
                );

                if (distance > 0.2) {
                    // Log suspicious static scan
                    const scanSql = `INSERT INTO scans (business_id, token, scan_lat, scan_lng, result, distance) VALUES (?,?,?,?,?,?)`;
                    db.run(scanSql, [row.id, token, scannerLocation.lat, scannerLocation.lng, 'LOCATION_MISMATCH', distance]);

                    return res.json({
                        status: 'LOCATION_MISMATCH',
                        message: `Static QR scan from wrong location (${distance.toFixed(2)}km away).`,
                        business: { name: row.tradeName, id: row.id }
                    });
                }
            }

            // Log successful static scan
            const distance = scannerLocation?.lat && row.latitude ? getDistanceFromLatLonInKm(
                row.latitude, row.longitude,
                scannerLocation.lat, scannerLocation.lng
            ) : null;

            const scanSql = `INSERT INTO scans (business_id, token, scan_lat, scan_lng, result, distance) VALUES (?,?,?,?,?,?)`;
            db.run(scanSql, [row.id, token, scannerLocation?.lat, scannerLocation?.lng, 'VALID', distance]);

            res.json({
                status: 'VALID',
                business: {
                    name: row.tradeName,
                    id: row.id,
                    legalName: row.legalName,
                    gst: row.gstNumber,
                    lat: row.latitude,
                    lng: row.longitude
                },
                message: 'Verified Successfully (Static Certificate)'
            });
        });

    } catch (e) {
        console.error("Verification error:", e);
        res.json({ status: 'INVALID', message: 'Verification System Error' });
    }
});

// --- ADMIN FRAUD DETECTION APIs ---

// Get all shops with scan statistics
app.get('/api/admin/shops', (req, res) => {
    const sql = `
        SELECT 
            b.*,
            COUNT(s.id) as total_scans,
            SUM(CASE WHEN s.result = 'VALID' THEN 1 ELSE 0 END) as verified_scans,
            SUM(CASE WHEN s.result != 'VALID' THEN 1 ELSE 0 END) as failed_scans,
            MAX(s.scanned_at) as last_scan
        FROM businesses b
        LEFT JOIN scans s ON b.id = s.business_id
        GROUP BY b.id
        ORDER BY failed_scans DESC, b.tradeName ASC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: 'success',
            total: rows.length,
            shops: rows.map(row => ({
                id: row.id,
                name: row.tradeName,
                legalName: row.legalName,
                category: row.category,
                address: row.address,
                lat: row.latitude,
                lng: row.longitude,
                status: row.status,
                total_scans: row.total_scans || 0,
                verified_scans: row.verified_scans || 0,
                failed_scans: row.failed_scans || 0,
                last_scan: row.last_scan,
                gstNumber: row.gstNumber
            }))
        });
    });
});

// Get suspicious scans and top risky shops
// Endpoint to get all recent scans (valid and invalid)
app.get('/api/admin/scans', (req, res) => {
    db.all(`
    SELECT s.id, s.token, s.status, s.scanned_at, 
           b.tradeName as shop_name, 
           s.lat as scan_lat, s.lng as scan_lng,
           b.lat as shop_lat, b.lng as shop_lng
    FROM scans s
    LEFT JOIN businesses b ON s.business_id = b.id
    ORDER BY s.scanned_at DESC
    LIMIT 50
  `, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Calculate distance for each
        const scans = rows.map(row => {
            let distance = 0;
            if (row.shop_lat && row.shop_lng && row.scan_lat && row.scan_lng) {
                distance = calculateDistance(row.shop_lat, row.shop_lng, row.scan_lat, row.scan_lng);
            }
            return {
                id: row.id,
                result: row.status, // mapping status to result for frontend consistency
                shop_name: row.shop_name || 'Unknown',
                scanned_at: row.scanned_at,
                distance: distance,
                scan_location: { lat: row.scan_lat, lng: row.scan_lng },
                shop_location: { lat: row.shop_lat, lng: row.shop_lng }
            };
        });
        res.json({ scans });
    });
});

app.get('/api/admin/suspicious', (req, res) => {
    // Get suspicious scans (failed verifications)
    const suspiciousSql = `
        SELECT 
            s.*,
            b.tradeName as shop_name,
            b.latitude as shop_lat,
            b.longitude as shop_lng
        FROM scans s
        LEFT JOIN businesses b ON s.business_id = b.id
        WHERE s.result IN ('LOCATION_MISMATCH', 'COUNTERFEIT', 'EXPIRED')
        ORDER BY s.scanned_at DESC
        LIMIT 100
    `;

    // Get top risky shops (most failed scans)
    const riskySql = `
        SELECT 
            b.id,
            b.tradeName as shop_name,
            b.latitude,
            b.longitude,
            COUNT(s.id) as failed_scans,
            SUM(CASE WHEN s.result = 'LOCATION_MISMATCH' THEN 1 ELSE 0 END) as location_mismatches,
            SUM(CASE WHEN s.result = 'COUNTERFEIT' THEN 1 ELSE 0 END) as counterfeit_attempts,
            ROUND((COUNT(s.id) * 1.0 / NULLIF((SELECT COUNT(*) FROM scans WHERE business_id = b.id), 0)) * 100, 2) as risk_score
        FROM businesses b
        LEFT JOIN scans s ON b.id = s.business_id AND s.result != 'VALID'
        WHERE s.id IS NOT NULL
        GROUP BY b.id
        ORDER BY failed_scans DESC
        LIMIT 10
    `;

    db.all(suspiciousSql, [], (err, suspiciousScans) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.all(riskySql, [], (err, riskyShops) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: 'success',
                total_suspicious: suspiciousScans.length,
                scans: suspiciousScans.map(scan => ({
                    id: scan.id,
                    shop_name: scan.shop_name,
                    shop_id: scan.business_id,
                    shop_location: { lat: scan.shop_lat, lng: scan.shop_lng },
                    scan_location: { lat: scan.scan_lat, lng: scan.scan_lng },
                    distance: scan.distance,
                    result: scan.result,
                    scanned_at: scan.scanned_at
                })),
                top_risky_shops: riskyShops.map(shop => ({
                    shop_id: shop.id,
                    shop_name: shop.shop_name,
                    latitude: shop.latitude,
                    longitude: shop.longitude,
                    failed_scans: shop.failed_scans,
                    location_mismatches: shop.location_mismatches,
                    counterfeit_attempts: shop.counterfeit_attempts,
                    risk_score: shop.risk_score || 0
                }))
            });
        });
    });
});

// Get Blockchain Ledger
app.get('/api/ledger', (req, res) => {
    const sql = "SELECT * FROM ledger ORDER BY index_id DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows,
            "isValid": tnMbnrChain.isChainValid()
        });
    });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Network access enabled.`);
});
