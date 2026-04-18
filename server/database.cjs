const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.resolve(__dirname, 'tn_mbnr.db');

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
                // Add municipal fields
                db.run("ALTER TABLE businesses ADD COLUMN municipal_ward TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN nic_category TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN employee_count INTEGER DEFAULT 0", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN application_type TEXT DEFAULT 'NEW'", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN current_stage TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN sla_deadline_at TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN aadhaar_no TEXT", () => { });
                db.run("ALTER TABLE businesses ADD COLUMN documents_metadata TEXT", () => { });
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

        // Registry Approvals table for formal workflow
        db.run(`CREATE TABLE IF NOT EXISTS registry_approvals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            registry_id TEXT,
            stage TEXT,
            status TEXT,
            acted_by_user_id TEXT,
            acted_by_role TEXT,
            acted_at TEXT DEFAULT (datetime('now')),
            comments TEXT,
            order_ref_no TEXT,
            valid_from TEXT,
            valid_to TEXT,
            attachment_url TEXT,
            FOREIGN KEY (registry_id) REFERENCES businesses(id)
        )`, (err) => {
            if (err) {
                console.error('Error creating registry_approvals table', err.message);
            } else {
                console.log('Registry Approvals table ready.');
            }
        });
 
        // Settings Table for Dynamic Rules (SLAs, Fees, etc)
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT,
            description TEXT,
            updated_at TEXT DEFAULT (datetime('now'))
        )`, (err) => {
            if (!err) {
                // Initialize default SLAs
                db.run("INSERT OR IGNORE INTO settings (key, value, description) VALUES (?,?,?)", ['SLA_DAYS_NEW', '15', 'Days for new registration processing']);
                db.run("INSERT OR IGNORE INTO settings (key, value, description) VALUES (?,?,?)", ['SLA_DAYS_AMENDMENT', '7', 'Days for amendment processing']);
                db.run("INSERT OR IGNORE INTO settings (key, value, description) VALUES (?,?,?)", ['SLA_DAYS_RENEWAL', '10', 'Days for renewal processing']);
            }
        });

        // Create indexes for performance
        db.run(`CREATE INDEX IF NOT EXISTS idx_scans_business ON scans(business_id)`, () => { });
        db.run(`CREATE INDEX IF NOT EXISTS idx_scans_result ON scans(result)`, () => { });
        db.run(`CREATE INDEX IF NOT EXISTS idx_scans_date ON scans(scanned_at)`, () => { });
        db.run(`CREATE INDEX IF NOT EXISTS idx_biz_name ON businesses(tradeName)`, () => { });
        db.run(`CREATE INDEX IF NOT EXISTS idx_biz_status ON businesses(status)`, () => { });
        // Seed data for demo
        db.get("SELECT COUNT(*) as count FROM businesses", [], (err, row) => {
            if (row && row.count === 0) {
                console.log("Seeding initial demo businesses...");
                const businesses = [
                    ['KPN-001', 'KPN Travels India Pvt Ltd', 'KPN Travels', 'LTD', 'Transport', 'Madurai Main Road', 'madurai_proof.pdf', 'Madurai HO', '9876543210', 'contact@kpntravels.com', '33AAACK1234A1Z1', 'Verified', new Date().toISOString(), 2, 13.0694, 80.1914],
                    ['SVR-002', 'Saravana Bhavan Ltd', 'Hotel Saravana Bhavan', 'PVT', 'F&B', 'T.Nagar, Chennai', 'tn_proof.pdf', 'T.Nagar Branch', '9840123456', 'info@saravanabhavan.com', '33AAACS1234S1Z1', 'Verified', new Date().toISOString(), 1, 13.0406, 80.2337],
                    ['GRT-003', 'GRT Regency Madurai', 'GRT Regency', 'PVT', 'Hospitality', 'Palanganatham, Madurai', 'grt_proof.pdf', 'Madurai East', '04522371400', 'reservations@grtregency.com', '33AAACG1234G1Z1', 'Pending', new Date(Date.now() - 86400000 * 3).toISOString(), 3, 9.9077, 78.1027]
                ];

                const insertSql = `INSERT INTO businesses (id, legalName, tradeName, type, category, address, proofOfAddress, branchName, contactNumber, email, gstNumber, status, registrationDate, riskScore, latitude, longitude) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                businesses.forEach(b => db.run(insertSql, b));
            }
        });
    }
});

module.exports = db;
