const express = require('express');
const { createTransaction, getUserTransactions, getAllTransactions, getSpecificUserTransactions } = require('../controllers/transactionController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createTransaction);
router.get('/user', auth, getUserTransactions);
router.get('/user/:userId', async (req, res) => {
  try {
    const Transaction = require('../models/Transaction');
    const transactions = await Transaction.find({ userId: req.params.userId })
      .populate('planId')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/all', async (req, res) => {
  try {
    const Transaction = require('../models/Transaction');
    const transactions = await Transaction.find()
      .populate('userId', 'name email mobile simType')
      .populate('planId')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;