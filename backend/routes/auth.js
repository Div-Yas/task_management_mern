const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], authController.signup);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').exists().withMessage('Password is required'),
], authController.login);

module.exports = router; 