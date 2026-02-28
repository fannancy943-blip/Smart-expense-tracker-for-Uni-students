const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const SALT = 8;

// register
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('username too short'),
  body('email').isEmail().withMessage('invalid email'),
  body('password').isLength({ min: 4 }).withMessage('password too short')
], async (req, res) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    const { username, email, password } = req.body;

    // check existing user
    const [u] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (u.length) {
      return res.status(400).json({ msg: 'email already used' });
    }

    const hash = await bcrypt.hash(password, SALT);

    const [insertRes] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash]
    );

    const userId = insertRes.insertId;
    
    const goals = [
      ['Emergency Fund', 10000, 0, '🛡️'],
      ['New Laptop', 50000, 0, '💻'],
      ['Textbooks', 8000, 0, '📚']
    ];

    await Promise.all(
      goals.map(g =>
        db.query(
          'INSERT INTO savings_goals (user_id, name, target, current, icon) VALUES (?, ?, ?, ?, ?)',
          [userId, ...g]
        )
      )
    );

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      msg: 'registered',
      token,
      user: {
        id: userId,
        username,
        email
      }
    });

  } catch (e) {
    console.log('reg err:', e.message);
    res.status(500).json({ msg: 'server error' });
  }
});

// login
router.post('/login', [
  body('email').isEmail().withMessage('bad email'),
  body('password').exists().withMessage('no password??')
], async (req, res) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    const { email, password } = req.body;

    const [rows] = await db.query(
      'SELECT id, username, email, password, profile_photo, budget, alert_threshold, email_alerts FROM users WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(400).json({ msg: 'wrong email or password' });
    }

    const user = rows[0];
    const good = await bcrypt.compare(password, user.password);

    if (!good) {
      return res.status(400).json({ msg: 'wrong email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      msg: 'logged in',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePhoto: user.profile_photo,
        budget: user.budget,
        alertThreshold: user.alert_threshold,
        emailAlerts: user.email_alerts
      }
    });

  } catch (e) {
    console.log('login err:', e.message);
    res.status(500).json({ msg: 'server error' });
  }
});

module.exports = router;
