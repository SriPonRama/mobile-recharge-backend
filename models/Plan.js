const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  operator: { type: String, required: true, enum: ['Airtel', 'Jio', 'Vi', 'BSNL'] },
  planName: { type: String, required: true },
  price: { type: Number, required: true },
  validity: { type: Number, required: true },
  data: { type: String, required: true },
  benefits: [{ type: String }],
  category: { type: String, enum: ['Popular', 'Data', 'Unlimited', 'Talktime'], default: 'Popular' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);