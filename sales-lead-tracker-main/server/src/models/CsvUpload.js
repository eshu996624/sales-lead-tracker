const mongoose = require('mongoose');

const csvUploadSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  records: { type: Array, default: [] },
  recordCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CsvUpload', csvUploadSchema);
