const express = require('express');
const { authenticate } = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');
const CsvUpload = require('../models/CsvUpload');
const { answerQuery } = require('../utils/chatAssistant');

const router = express.Router();

router.post('/assistant', authenticate, async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required.' });

    const uploads = await CsvUpload.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 }).limit(5);
    const queryData = {
      totalRecords: uploads.reduce((sum, upload) => sum + upload.recordCount, 0),
      schoolCount: uploads.length
    };

    const assistantResult = await answerQuery({ question, user: req.user, queryData });
    const chat = await ChatMessage.create({ user: req.user._id, query: question, response: assistantResult.response });
    res.json({ chat, response: assistantResult.response });
  } catch (error) {
    next(error);
  }
});

router.get('/history', authenticate, async (req, res, next) => {
  try {
    const history = await ChatMessage.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(25);
    res.json(history);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
