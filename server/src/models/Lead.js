const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  schoolName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['New Lead', 'Hot Lead', 'Cold Lead', 'Proposal Sent', 'MOU Sent', 'Closed'],
    default: 'New Lead'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
