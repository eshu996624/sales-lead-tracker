const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const tokenSigner = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '12h' });

const School = require('../models/School');

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role = 'admin', schoolName, contactNumber, address, city, state, country } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists.' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, role });
    if (role === 'admin' && schoolName && contactNumber && address && city && state && country) {
      await School.create({ schoolName, principalName: name, contactNumber, email, address, city, state, country, createdBy: user._id });
    }
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: tokenSigner(user._id) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: tokenSigner(user._id) });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.get('/seed', async (req, res, next) => {
  try {
    const adminEmail = 'principal@qwings.com';
    const salesEmail = 'sales@qwings.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    const existingSales = await User.findOne({ email: salesEmail });

    if (!existingAdmin) {
      const hashed = await bcrypt.hash('Admin@1234', 12);
      await User.create({ name: 'Qwings Principal', email: adminEmail, password: hashed, role: 'admin' });
    }
    if (!existingSales) {
      const hashed = await bcrypt.hash('Sales@1234', 12);
      await User.create({ name: 'Qwings Sales', email: salesEmail, password: hashed, role: 'sales' });
    }
    res.json({ message: 'Seed users created. Admin: principal@qwings.com / Admin@1234, Sales: sales@qwings.com / Sales@1234' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
