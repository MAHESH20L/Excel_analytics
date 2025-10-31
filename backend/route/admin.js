const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /api/admin/users - Get all user names and birthdays (for admin only)
router.get('/users', async (req, res) => {
  try {
    // Fetch name and birthday for all users
    const users = await User.find({}, 'name birthday');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id - Update user by admin
router.put('/users/:id', async (req, res) => {
  try {
    const { name, birthday } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, birthday },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
