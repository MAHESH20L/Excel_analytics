const express = require('express');
const User = require('../models/user');
const Upload = require('../models/Upload'); // Add upload model
const router = express.Router();

// Signup endpoint
router.post('/signup', async (req, res) => {
  const { name, birthday, password } = req.body;
  try {
    const user = new User({ name, birthday, password });
    await user.save();
    res.json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ error: 'Name already exists or invalid data' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name, password });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ message: 'Login successful!', user: { name: user.name, birthday: user.birthday, _id: user._id } });
});

// POST /api/user/upload - Save a new upload for the user
router.post('/upload', async (req, res) => {
  const { filename, userId } = req.body;
  if (!filename || !userId) {
    return res.status(400).json({ error: 'filename and userId required' });
  }
  try {
    const upload = new Upload({ user: userId, filename });
    await upload.save();
    res.json({ message: 'Upload saved!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save upload' });
  }
});

// GET /api/user/uploads?userId=... - Fetch logged-in user's upload history
router.get('/uploads', async (req, res) => {
  const userId = req.query.userId || req.headers['userid'];
  if (!userId) return res.status(400).json({ error: "User ID required" });

  try {
    const uploads = await Upload.find({ user: userId }).sort({ uploadedAt: -1 });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upload history' });
  }
});

module.exports = router;
