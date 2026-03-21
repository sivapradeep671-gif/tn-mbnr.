const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'tn_mbnr.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS businesses (
            id TEXT PRIMARY KEY,
            legalName TEXT,
            tradeName TEXT,
            type TEXT,
            category TEXT,
            address TEXT,
            proofOfAddress TEXT,
            branchName TEXT,
            contactNumber TEXT,
            email TEXT,
            gstNumber TEXT,
            status TEXT,
            registrationDate TEXT,
            riskScore INTEGER,
            latitude REAL,
            longitude REAL,
            license_valid_till TEXT,
            grace_ends_at TEXT,
            pay_by_date TEXT,
            payment_done INTEGER DEFAULT 0,
            license_status TEXT DEFAULT 'ACTIVE',
            website TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                // Attempt to add columns to existing table (will fail if they exist, which is fine)
                db.run("ALTER TABLE businesses ADD COLUMN latitude REAL", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN latitude REAL", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN longitude REAL", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN category TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN proofOfAddress TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN branchName TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN contactNumber TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN email TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN gstNumber TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN status TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN registrationDate TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN riskScore INTEGER", () => { });
                // Add new license fields
                db.run("ALTER TABLE businesses ADD COLUMN license_valid_till TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN grace_ends_at TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN pay_by_date TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN payment_done INTEGER DEFAULT 0", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN license_status TEXT DEFAULT 'ACTIVE'", () => { });
                // Add Municipality Tax fields
                db.run("ALTER TABLE businesses ADD COLUMN property_tax_status TEXT DEFAULT 'Pending'", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN water_tax_status TEXT DEFAULT 'Pending'", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN professional_tax_status TEXT DEFAULT 'Pending'", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN assessment_number TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN water_connection_no TEXT", () => { });
                // Add Website field
                db.run("ALTER TABLE businesses ADD COLUMN website TEXT", () => { });
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS ledger (
            index_id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            data TEXT,
            previousHash TEXT,
            hash TEXT,
            nonce INTEGER
        )`, (err) => {
            if (err) {
                console.error('Error creating ledger table', err.message);
            }
        });

        // Scans table for tracking all verification attempts
        db.run(`CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            business_id TEXT,
            token TEXT,
            scan_lat REAL,
            scan_lng REAL,
            result TEXT,
            distance REAL,
            scanned_at TEXT DEFAULT (datetime('now')),
            device_id TEXT,
            FOREIGN KEY (business_id) REFERENCES businesses(id)
        )`, (err) => {
            if (err) {
                console.error('Error creating scans table', err.message);
            } else {
                console.log('Scans table ready for fraud detection analytics.');
            }
        });

        // Reports table for citizen complaints (with image support)
        db.run(`CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            business_name TEXT,
            location TEXT,
            description TEXT,
            category TEXT,
            severity TEXT,
            status TEXT DEFAULT 'Submitted',
            image_path TEXT,
            timestamp TEXT DEFAULT (datetime('now'))
        )`, (err) => {
            if (err) {
                console.error('Error creating reports table', err.message);
            } else {
                console.log('Reports table ready for citizen complaints.');
            }
        });

        // Create indexes for performance
        db.run(`CREATE INDEX IF NOT EXISTS idx_scans_business ON scans(business_id)`, () => { });
        db.run(`CREATE INDEX IF NOT EXISTS idx_scans_result ON scans(result)`, () => { });
        db.run(`CREATE INDEX IF NOT EXISTS idx_scans_date ON scans(scanned_at)`, () => { });
    }
});

module.exports = db;
