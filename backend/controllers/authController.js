const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, data: null, message: errors.array()[0].msg });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ status: false, data: null, message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ status: true, data: { token }, message: 'Sign up successful' });
  } catch (err) {
    res.status(500).json({ status: false, data: null, message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, data: null, message: errors.array()[0].msg });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: false, data: null, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: false, data: null, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ status: true, data: { token }, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ status: false, data: null, message: 'Server error' });
  }
}; 