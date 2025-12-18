const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Plan = require('../models/Plan');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get admin stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'User' });
    const totalTransactions = await Transaction.countDocuments();
    const totalRevenue = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalPlans = await Plan.countDocuments();

    res.json({
      totalUsers,
      totalTransactions,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalPlans
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'User' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Block/Unblock user
router.patch('/users/:id/block', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role === 'Admin') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.blocked = !user.blocked;
    await user.save();
    
    res.json({ message: 'User status updated', user: { id: user._id, blocked: user.blocked } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all transactions
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;