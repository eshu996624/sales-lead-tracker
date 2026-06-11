const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Lead = require('../models/Lead');
const ActivityLog = require('../models/ActivityLog');

const router = express.Router();

const logAction = async (user, action, details) => {
  await ActivityLog.create({ user: user._id, action, details });
};

router.post('/', authenticate, authorize('sales'), async (req, res, next) => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user._id });
    await logAction(req.user, 'Created lead', `School: ${lead.schoolName}`);
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, authorize('sales'), async (req, res, next) => {
  try {
    const { page = 1, limit = 15, search = '', status } = req.query;
    const query = { createdBy: req.user._id };
    if (search) {
      query.$or = [
        { schoolName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;
    const leads = await Lead.find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Lead.countDocuments(query);
    res.json({ leads, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', authenticate, authorize('sales'), async (req, res, next) => {
  try {
    const statuses = ['New Lead', 'Called', 'Hot Lead', 'Cold Lead', 'Proposal Sent', 'MOU Sent', 'Closed Won', 'Closed Lost'];
    const counts = await Promise.all(statuses.map(async (status) => ({ status, count: await Lead.countDocuments({ createdBy: req.user._id, status }) })));
    const totalLeads = counts.reduce((sum, item) => sum + item.count, 0);
    const closed = counts.filter((item) => item.status.startsWith('Closed')).reduce((sum, item) => sum + item.count, 0);
    const conversionRate = totalLeads ? Math.round((closed / totalLeads) * 100) : 0;
    const monthlyGrowth = await Lead.aggregate([
      { $match: { createdBy: req.user._id } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({ totalLeads, counts, conversionRate, monthlyGrowth });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize('sales'), async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, req.body, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    await logAction(req.user, 'Updated lead', `Lead: ${lead.schoolName}, status: ${lead.status}`);
    res.json(lead);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorize('sales'), async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    await logAction(req.user, 'Deleted lead', `Lead: ${lead.schoolName}`);
    res.json({ message: 'Lead deleted.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
