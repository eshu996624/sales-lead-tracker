const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');
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

router.get('/schools', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = { createdBy: req.user._id };
    if (search) {
      query.$or = [
        { schoolName: { $regex: search, $options: 'i' } },
        { principalName: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }
    const schools = await School.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await School.countDocuments(query);
    res.json({ schools, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
});

router.post('/schools', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const school = await School.create({ ...req.body, createdBy: req.user._id });
    await logAction(req.user, 'Created school', `School: ${school.schoolName}`);
    res.status(201).json(school);
  } catch (error) {
    next(error);
  }
});

router.put('/schools/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const school = await School.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, req.body, { new: true });
    if (!school) return res.status(404).json({ message: 'School not found.' });
    await logAction(req.user, 'Updated school', `School: ${school.schoolName}`);
    res.json(school);
  } catch (error) {
    next(error);
  }
});

router.delete('/schools/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const school = await School.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!school) return res.status(404).json({ message: 'School not found.' });
    await logAction(req.user, 'Deleted school', `School: ${school.schoolName}`);
    res.json({ message: 'School deleted.' });
  } catch (error) {
    next(error);
  }
});

router.get('/users', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ users, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
});

router.post('/users', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists.' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, role });
    await logAction(req.user, 'Created user', `User: ${user.email}, role: ${user.role}`);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    } else {
      delete updateData.password;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    await logAction(req.user, 'Updated user', `User: ${user.email}, role: ${user.role}`);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    await logAction(req.user, 'Deleted user', `User: ${user.email}`);
    res.json({ message: 'User deleted.' });
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
