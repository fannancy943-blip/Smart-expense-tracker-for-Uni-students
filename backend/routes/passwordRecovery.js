const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { sendEmail } = require('../utils/emailService');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Store OTP in database with 15-minute expiry
const storeOTP = async (email, otp) => {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  await db.query(
    'INSERT INTO password_resets (email, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?',
    [email, otp, expiresAt, otp, expiresAt]
  );
};

// Request password reset (sends OTP via email)
router.post('/request-reset', [
  body('email').isEmail().withMessage('Invalid email')
], async (req, res) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    const { email } = req.body;

    // Check if user exists
    const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (!users.length) {
      return res.status(404).json({ msg: 'Email not found' });
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, otp);

    // Send email
    await sendEmail(email, 'Password Reset Code', `Your OTP: ${otp}\nValid for 15 minutes`);

    res.json({ msg: 'OTP sent to email', email });
  } catch (err) {
    console.error('Reset request error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', [
  body('email').isEmail().withMessage('Invalid email'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('Invalid OTP')
], async (req, res) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    const { email, otp } = req.body;

    // Check OTP validity
    const [resets] = await db.query(
      'SELECT otp, expires_at FROM password_resets WHERE email = ?',
      [email]
    );

    if (!resets.length) {
      return res.status(400).json({ msg: 'No reset request found' });
    }

    const reset = resets[0];
    if (reset.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    if (new Date() > reset.expires_at) {
      return res.status(400).json({ msg: 'OTP expired' });
    }

    // Generate temporary token valid for 1 hour
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    await db.query(
      'UPDATE password_resets SET reset_token = ?, token_expires = ? WHERE email = ?',
      [tokenHash, tokenExpires, email]
    );

    res.json({ msg: 'OTP verified', resetToken });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Reset password with token
router.post('/reset-password', [
  body('resetToken').notEmpty().withMessage('Reset token required'),
  body('newPassword').isLength({ min: 4 }).withMessage('Password too short')
], async (req, res) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    const { resetToken, newPassword } = req.body;
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Verify token
    const [resets] = await db.query(
      'SELECT email, token_expires FROM password_resets WHERE reset_token = ?',
      [tokenHash]
    );

    if (!resets.length) {
      return res.status(400).json({ msg: 'Invalid reset token' });
    }

    const reset = resets[0];
    if (new Date() > reset.token_expires) {
      return res.status(400).json({ msg: 'Reset token expired' });
    }

    // Hash new password
    const hash = await bcrypt.hash(newPassword, 8);

    // Update password and clear reset tokens
    await db.query('UPDATE users SET password = ? WHERE email = ?', [hash, reset.email]);
    await db.query('DELETE FROM password_resets WHERE email = ?', [reset.email]);

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
