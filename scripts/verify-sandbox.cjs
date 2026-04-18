const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../server/tn_mbnr_sandbox.db');
const db = new sqlite3.Database(DB_PATH);

console.log('--- Sandbox Integrity Report ---');
db.all("SELECT id, tradeName, status, current_stage FROM businesses", [], (err, rows) => {
    if (err) {
        console.error('❌ Failed to read businesses:', err.message);
    } else {
        console.log(`✅ Found ${rows.length} businesses in Sandbox.`);
        rows.forEach(r => console.log(`   [${r.id}] ${r.tradeName} - ${r.status} (${r.current_stage})`));
    }

    db.all("SELECT * FROM reports", [], (err, reports) => {
        if (err) {
            console.error('❌ Failed to read reports:', err.message);
        } else {
            console.log(`✅ Found ${reports.length} citizen reports.`);
        }
        db.close();
    });
});
