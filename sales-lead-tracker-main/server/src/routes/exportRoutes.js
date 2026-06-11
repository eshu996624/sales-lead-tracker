const express = require('express');
const { authenticate } = require('../middleware/auth');
const Lead = require('../models/Lead');
const CsvUpload = require('../models/CsvUpload');

const router = express.Router();

const serializeCsv = (records) => {
  if (!records.length) return '';
  const headers = Object.keys(records[0]);
  const rows = records.map((row) => headers.map((field) => JSON.stringify(row[field] || '')).join(','));
  return [headers.join(','), ...rows].join('\n');
};

router.get('/leads', authenticate, async (req, res, next) => {
  try {
    const leads = await Lead.find({ createdBy: req.user._id }).lean();
    const csvContent = serializeCsv(leads);
    res.header('Content-Type', 'text/csv');
    res.attachment('qwings_leads_export.csv');
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
});

router.get('/uploads', authenticate, async (req, res, next) => {
  try {
    const uploads = await CsvUpload.find({ uploadedBy: req.user._id }).lean();
    const flattened = uploads.flatMap((upload) => upload.records.map((record) => ({ uploadId: upload._id, filename: upload.filename, ...record })));
    const csvContent = serializeCsv(flattened);
    res.header('Content-Type', 'text/csv');
    res.attachment('qwings_upload_records.csv');
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
