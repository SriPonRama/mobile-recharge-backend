const Transaction = require('../models/Transaction');
const Plan = require('../models/Plan');

const createTransaction = async (req, res) => {
  try {
    const { planId, mobile, simType, paymentType, amount, planName } = req.body;
    const userId = req.user._id;

    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);

    const transaction = await Transaction.create({
      userId,
      planId: planId || null,
      userName: req.user.name,
      mobile,
      simType,
      planName,
      amount,
      paymentType,
      transactionId,
      status: 'Success'
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('planId')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getSpecificUserTransactions = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const transactions = await Transaction.find({ userId: req.params.userId })
      .populate('planId')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const transactions = await Transaction.find()
      .populate('userId', 'name email mobile simType')
      .populate('planId')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTransaction,
  getUserTransactions,
  getAllTransactions,
  getSpecificUserTransactions
};