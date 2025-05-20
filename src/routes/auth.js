const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const { generateOTP } = require('../utils/helpers');

const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = "9cd945ca506a9a4ce8c20091dda963a046df76be0c801f7f1d77dc317903f345"

const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = generateOTP();

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        verificationToken
      }
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: 'User registered successfully. Please check your email for verification.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { email, token } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verificationToken !== token) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verificationToken: null
      }
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SCRET_KEY || JWT_SECRET,
      { expiresIn: 86400 }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = generateOTP();
    await prisma.user.update({
      where: { email },
      data: { resetToken }
    });

    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing password reset request' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resetToken !== token) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetToken: null
      }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router; 