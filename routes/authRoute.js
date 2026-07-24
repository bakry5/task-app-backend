const express = require('express');
const { signupValidator, loginValidator } = require('../utils/validators/authValidator');
const { signup, login, logout } = require('../services/authService');

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.get('/logout', logout);

module.exports = router;
