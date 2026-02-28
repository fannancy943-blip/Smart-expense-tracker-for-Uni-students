const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // ADD THIS LINE
const db = require('../db');

// Get all expenses for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const [expenses] = await db.query(
      'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC',
      [req.userId]
    );
    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new expense
router.post('/', auth, async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;

    const [result] = await db.query(
      'INSERT INTO expenses (user_id, category, amount, description, date) VALUES (?, ?, ?, ?, ?)',
      [req.userId, category, amount, description || null, date]
    );

    res.status(201).json({
      message: 'Expense created successfully',
      expense: {
        id: result.insertId,
        user_id: req.userId,
        category,
        amount,
        description,
        date
      }
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify expense belongs to user
    const [expenses] = await db.query(
      'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (expenses.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await db.query('DELETE FROM expenses WHERE id = ?', [id]);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;