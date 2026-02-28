const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // ADD THIS LINE
const db = require('../db');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, budget, alert_threshold, email_alerts, profile_photo FROM users WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update budget settings
router.put('/budget-settings', auth, async (req, res) => {
  try {
    const { budget, alert_threshold, email_alerts } = req.body;

    await db.query(
      'UPDATE users SET budget = ?, alert_threshold = ?, email_alerts = ? WHERE id = ?',
      [budget, alert_threshold, email_alerts || false, req.userId]
    );

    res.json({ message: 'Budget settings updated successfully' });
  } catch (error) {
    console.error('Update budget settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;