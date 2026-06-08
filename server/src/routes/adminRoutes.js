const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { authenticate, authorize } = require('../middleware/auth');
const School = require('../models/School');
const CsvUpload = require('../models/CsvUpload');
const ActivityLog = require('../models/ActivityLog');
const { parseCsvFile } = require('../utils/csvParser');

const router = express.Router();
const tempUploadPath = path.join(__dirname, '../../tmp_uploads');
fs.mkdirSync(tempUploadPath, { recursive: true });
const upload = multer({ dest: tempUploadPath });

const logAction = async (user, action, details) => {
  await ActivityLog.create({ user: user._id, action, details });
};

router.post('/profile', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const profileData = { ...req.body, createdBy: req.user._id };
    const profile = await School.findOneAndUpdate({ createdBy: req.user._id }, profileData, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });
    await logAction(req.user, 'Updated school profile', `School: ${profile.schoolName}`);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

router.get('/profile', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const profile = await School.findOne({ createdBy: req.user._id });
    res.json(profile || {});
  } catch (error) {
    next(error);
  }
});

router.post('/upload-csv', authenticate, authorize('admin'), upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'CSV file is required.' });
    const filePath = req.file.path;
    const records = await parseCsvFile(filePath);
    const upload = await CsvUpload.create({ filename: req.file.originalname, uploadedBy: req.user._id, records, recordCount: records.length });
    await logAction(req.user, 'Uploaded CSV', `File: ${req.file.originalname}, records: ${records.length}`);
    fs.unlinkSync(filePath);
    res.status(201).json({ upload, message: 'CSV uploaded and parsed successfully.' });
  } catch (error) {
    next(error);
  }
});

router.get('/uploads', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 15, search = '' } = req.query;
    const query = { uploadedBy: req.user._id };
    if (search) {
      query.filename = { $regex: search, $options: 'i' };
    }
    const uploads = await CsvUpload.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await CsvUpload.countDocuments(query);
    res.json({ uploads, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
});

router.get('/uploads/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const upload = await CsvUpload.findOne({ _id: req.params.id, uploadedBy: req.user._id });
    if (!upload) return res.status(404).json({ message: 'Upload not found.' });
    res.json(upload);
  } catch (error) {
    next(error);
  }
});

router.get('/analytics', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const uploads = await CsvUpload.find({ uploadedBy: req.user._id });
    const totalUploads = uploads.length;
    const totalRecords = uploads.reduce((sum, item) => sum + item.recordCount, 0);
    const recentUploads = uploads.slice(0, 5).map((upload) => ({ id: upload._id, filename: upload.filename, recordCount: upload.recordCount, createdAt: upload.createdAt }));
    const schoolCount = await School.countDocuments({ createdBy: req.user._id });
    const summary = { totalUploads, totalRecords, schoolCount, recentUploads };
    res.json(summary);
  } catch (error) {
    next(error);
  }
});

router.get('/activity', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const activity = await ActivityLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activity);
  } catch (error) {
    next(error);
  }
});

router.get('/notifications', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const notifications = [
      { id: 'n1', message: 'CSV upload complete. View new data in your records.', type: 'success', date: new Date() },
      { id: 'n2', message: 'Schedule a review meeting with your sales representative.', type: 'info', date: new Date() }
    ];
    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
