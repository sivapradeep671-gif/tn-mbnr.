import type { Business } from '../types/types';

export const exportToCSV = (businesses: Business[], filename: string) => {
    // 1. Define the headers
    const headers = [
        'ID',
        'Trade Name',
        'Legal Name',
        'Category',
        'GST Number',
        'Udyam Aadhaar',
        'FSSAI Number',
        'Shop Act Number',
        'Address',
        'Pincode',
        'District',
        'State',
        'Status',
        'Registration Date'
    ];

    // 2. Map businesses to rows
    const rows = businesses.map(b => [
        b.id || '',
        `"${(b.tradeName || '').replace(/"/g, '""')}"`,
        `"${(b.legalName || '').replace(/"/g, '""')}"`,
        `"${(b.category || '').replace(/"/g, '""')}"`,
        b.gstNumber || '',
        b.udyam_aadhaar || '',
        b.fssai_number || '',
        b.shop_establishment_no || '',
        `"${(b.address || '').replace(/"/g, '""')}"`,
        b.pincode || '',
        b.district || '',
        b.state || '',
        b.status || '',
        b.registrationDate ? new Date(b.registrationDate).toLocaleDateString('en-IN') : ''
    ]);

    // 3. Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // 4. Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
