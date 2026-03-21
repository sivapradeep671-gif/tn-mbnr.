function calculateLicenseTimestamps(registrationDateStr) {
    const regDate = new Date(registrationDateStr);

    // Valid for 1 year from registration
    const validTill = new Date(regDate);
    validTill.setFullYear(validTill.getFullYear() + 1);

    // Grace period of 30 days after expiry
    const graceEnds = new Date(validTill);
    graceEnds.setDate(graceEnds.getDate() + 30);

    // Pay by date could be the expiry date
    const payBy = new Date(validTill);

    return {
        license_valid_till: validTill.toISOString(),
        grace_ends_at: graceEnds.toISOString(),
        pay_by_date: payBy.toISOString(),
        payment_done: 1, // Assume payment done initially
        license_status: 'ACTIVE'
    };
}

function calculateLicenseStatus(row) {
    const now = new Date();
    let status = row.license_status || 'ACTIVE';

    if (row.license_valid_till) {
        const validTill = new Date(row.license_valid_till);
        const graceEnds = row.grace_ends_at ? new Date(row.grace_ends_at) : null;

        if (now > validTill) {
            if (graceEnds && now <= graceEnds) {
                status = 'GRACE_PERIOD';
            } else {
                status = 'EXPIRED';
            }
        }
    }

    return {
        status: status,
        valid_till: row.license_valid_till,
        payment_done: row.payment_done
    };
}

module.exports = {
    calculateLicenseTimestamps,
    calculateLicenseStatus
};
