const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // ADD THIS LINE
const db = require('../db');

// Get all savings goals
router.get('/', auth, async (req, res) => {
  try {
    const [goals] = await db.query(
      'SELECT * FROM savings_goals WHERE user_id = ?',
      [req.userId]
    );
    res.json(goals);
  } catch (error) {
    console.error('Get savings goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update savings goal
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { current } = req.body;

    await db.query(
      'UPDATE savings_goals SET current = ? WHERE id = ? AND user_id = ?',
      [current, id, req.userId]
    );

    res.json({ message: 'Savings goal updated successfully' });
  } catch (error) {
    console.error('Update savings goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;