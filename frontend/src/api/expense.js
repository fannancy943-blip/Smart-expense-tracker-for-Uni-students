const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const db = require('../db');

// Get all expenses for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [expenses] = await db.query(
      'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC',
      [req.userId]
    );

    res.json({ expenses });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new expense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    const [result] = await db.query(
      'INSERT INTO expenses (user_id, description, amount, category, date) VALUES (?, ?, ?, ?, ?)',
      [req.userId, description, amount, category, date]
    );

    res.status(201).json({
      message: 'Expense added successfully',
      expense: {
        id: result.insertId,
        description,
        amount,
        category,
        date
      }
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expenseId = req.params.id;

    // Check if expense belongs to user
    const [expenses] = await db.query(
      'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
      [expenseId, req.userId]
    );

    if (expenses.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await db.query('DELETE FROM expenses WHERE id = ?', [expenseId]);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get expense statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [stats] = await db.query(
      'SELECT category, SUM(amount) as total FROM expenses WHERE user_id = ? GROUP BY category',
      [req.userId]
    );

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;