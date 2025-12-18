const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  userName: { type: String, required: true },
  mobile: { type: String, required: true },
  simType: { type: String, required: true },
  planName: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentType: { type: String, required: true, enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking'] },
  status: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Success' },
  transactionId: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);