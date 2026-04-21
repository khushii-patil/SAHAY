import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// In-memory OTP store: email -> { otp, expiresAt, purpose }
const otpStore = new Map();

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp, name, purpose) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = purpose === 'login'
    ? 'SAHAY — Your Login OTP'
    : 'SAHAY — Your Password Reset OTP';

  const heading = purpose === 'login'
    ? 'Your one-time login password is:'
    : 'Your password reset OTP is:';

  await transporter.sendMail({
    from: `"SAHAY Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#7C3AED;font-size:28px;margin:0;">SAHAY</h1>
          <p style="color:#6b7280;margin:4px 0 0;">Women Safety & Legal Support</p>
        </div>
        <p style="color:#111827;">Hello <strong>${name || 'User'}</strong>,</p>
        <p style="color:#374151;">${heading}</p>
        <div style="background:#F3F0FF;border:2px dashed #7C3AED;border-radius:8px;padding:20px;text-align:center;margin:24px 0;">
          <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#7C3AED;">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:14px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p style="color:#6b7280;font-size:14px;">If you did not request this, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="color:#9ca3af;font-size:12px;text-align:center;">SAHAY — Your safety is our priority</p>
      </div>
    `,
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'User with this email already exists' });

    const user = await User.create({ name, email, phone, password });
    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login (password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/send-otp — works for both login and password reset
router.post('/send-otp', async (req, res) => {
  try {
    const { email, purpose = 'login' } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'No account found with this email address' });

    const otp = generateOTP();
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000, purpose });

    await sendOTPEmail(email, otp, user.name, purpose);
    res.json({ message: `OTP sent to ${email}` });
  } catch (error) {
    console.error('Email error:', error.message);
    res.status(500).json({ message: 'Failed to send OTP. Check your email settings.' });
  }
});

// POST /api/auth/verify-otp-login — OTP login (no password needed)
router.post('/verify-otp-login', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: 'Email and OTP are required' });

    const stored = otpStore.get(email);
    if (!stored) return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    if (Date.now() > stored.expiresAt) return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    if (stored.otp !== otp) return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });

    otpStore.delete(email);
    const user = await User.findOne({ email });

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/verify-otp — verify OTP and reset password
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const stored = otpStore.get(email);
    if (!stored) return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    if (Date.now() > stored.expiresAt) return res.status(400).json({ message: 'OTP has expired.' });
    if (stored.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });

    otpStore.delete(email);
    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password reset successful',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/refresh
router.post('/refresh', protect, async (req, res) => {
  try {
    res.json({ token: generateToken(req.user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
