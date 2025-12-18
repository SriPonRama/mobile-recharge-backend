const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ role: 'User', blocked: { $ne: true } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Block/Unblock user (admin only)
router.patch('/:id/block', async (req, res) => {
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

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, mobile, simType } = req.body;
    const userId = req.user._id;

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if mobile is already taken by another user
    const existingMobile = await User.findOne({ mobile, _id: { $ne: userId } });
    if (existingMobile) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, mobile, simType },
      { new: true, select: '-password' }
    );

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;