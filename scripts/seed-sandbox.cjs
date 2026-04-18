const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.resolve(__dirname, '../server/tn_mbnr_sandbox.db');

// Delete existing sandbox DB if it exists
if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log('🗑️ Existing sandbox database wiped.');
}

const db = new sqlite3.Database(DB_PATH);

const schema = `
CREATE TABLE IF NOT EXISTS businesses (
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
    current_stage TEXT,
    registrationDate TEXT,
    riskScore INTEGER,
    latitude REAL,
    longitude REAL,
    license_valid_till TEXT,
    grace_ends_at TEXT,
    pay_by_date TEXT,
    payment_done INTEGER DEFAULT 0,
    assessment_number TEXT,
    water_connection_no TEXT,
    property_tax_status TEXT,
    water_tax_status TEXT,
    professional_tax_status TEXT,
    total_scans INTEGER DEFAULT 0,
    verified_scans INTEGER DEFAULT 0,
    failed_scans INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    business_name TEXT,
    location TEXT,
    description TEXT,
    category TEXT,
    severity TEXT,
    imageUrl TEXT,
    status TEXT,
    timestamp TEXT,
    latitude REAL,
    longitude REAL
);

CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id TEXT,
    token TEXT,
    scan_lat REAL,
    scan_lng REAL,
    result TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ledger (
    index_id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    data TEXT,
    previousHash TEXT,
    hash TEXT,
    nonce INTEGER
);

CREATE TABLE IF NOT EXISTS approvals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registry_id TEXT,
    stage TEXT,
    status TEXT,
    acted_by_user_id TEXT,
    acted_by_role TEXT,
    acted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    order_ref_no TEXT
);
`;

db.serialize(() => {
    console.log('🏗️ Initializing Sandbox Schema...');
    db.exec(schema);

    console.log('🌱 Seeding Sandbox Data...');

    // 1. Valid Business (Anna Nagar)
    db.run(`INSERT INTO businesses (id, tradeName, legalName, type, category, status, current_stage, latitude, longitude, registrationDate, license_valid_till, contactNumber) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, 
            ['BIZ-001', 'Anna Nagar Grand Mall', 'AGM Enterprises Pvt Ltd', 'Private Limited', 'General Trade', 'Verified', 'FINAL', 13.0850, 80.2101, '2024-01-15T10:00:00Z', '2025-01-15T00:00:00Z', '9876543210']);

    // 2. Expired Business (T-Nagar)
    db.run(`INSERT INTO businesses (id, tradeName, legalName, type, category, status, current_stage, latitude, longitude, registrationDate, license_valid_till, contactNumber) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, 
            ['BIZ-002', 'Old Silk House', 'Classic Weaves LLP', 'Partnership', 'Apparel', 'Verified', 'FINAL', 13.0400, 80.2333, '2023-01-10T10:00:00Z', '2024-01-10T00:00:00Z', '9876543211']);

    // 3. Pending Business (Velachery)
    db.run(`INSERT INTO businesses (id, tradeName, legalName, type, category, status, current_stage, latitude, longitude, registrationDate, license_valid_till, contactNumber) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, 
            ['BIZ-003', 'Sunrise Cafe', 'Naveen Foods', 'Sole Proprietorship', 'F&B', 'Pending', 'SCRUTINY', 12.9800, 80.2200, '2024-04-10T10:00:00Z', '2025-04-10T00:00:00Z', '9876543212']);

    // Sample Reports
    db.run(`INSERT INTO reports (id, business_name, location, description, severity, status, timestamp) 
            VALUES (?,?,?,?,?,?,?)`,
            ['REP-001', 'Unregistered Stall', 'Near Anna Statue', 'Operating without valid TrustReg QR code', 'High', 'Under Review', new Date().toISOString()]);

    console.log('✅ Sandbox successfully configured with 3 businesses and 1 report.');
});

db.close();
