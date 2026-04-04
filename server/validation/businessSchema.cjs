const { z } = require('zod');

const businessSchema = z.object({
  id: z.string().min(3),
  legalName: z.string().min(3).max(100),
  tradeName: z.string().min(3).max(50),
  type: z.enum(['Sole Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'LLP']),
  category: z.string().min(1),
  address: z.string().min(10).max(500),
  contactNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  email: z.string().email(),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST format').optional().or(z.literal('')),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  employee_count: z.number().min(0).default(0),
  application_type: z.enum(['NEW', 'AMENDMENT', 'RENEWAL', 'SURRENDER']).default('NEW'),
  aadhaar_no: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits').optional().or(z.literal('')),
  municipal_ward: z.string().optional(),
  nic_category: z.string().optional(),
});

module.exports = { businessSchema };
