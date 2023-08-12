const express = require('express');
const User = require('../model/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { generateUserData } = require('../utils/helpers');
const tokenService = require('../services/token.service');
const router = express.Router({ mergeParams: true });

const validatorCinfig = [
  check('login', 'Некорректный login').exists(),
  check('email', 'Некорректный email').optional().normalizeEmail().isEmail(),
  check('password', 'Длина пароля менее 4 символов').isLength({ min: 4 }),
];

// /api/auth/signUp
router.post('/signUp', [
  ...validatorCinfig,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'INVALID_DATA', code: 400, errors: errors.array() } });
    }

    try {
      const { login, password } = req.body;
      const data = await User.findOne({ login });
      if (data != null) {
        return res.status(400).json({ error: { message: 'LOGIN_EXISTS', code: 400 } });
      }

      const hashPass = await bcrypt.hash(password, 10);
      const newUser = await User.create({ ...generateUserData(), ...req.body, password: hashPass });

      const tokens = tokenService.generate({ id: newUser._id });
      await tokenService.save(newUser._id, tokens.refreshToken);

      return res.status(201).send({ ...tokens, userId: newUser._id });
    } catch (e) {
      console.log('/signUp error', e.message);
      return res.status(500).json({ message: 'Ошибка работы с БД' });
    }
  },
]);
router.post('/signInWithPassword', [
  ...validatorCinfig,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'INVALID_DATA', code: 400, errors: errors.array() } });
    }

    try {
      const { login, password } = req.body;
      const existingUser = await User.findOne({ login });
      if (existingUser == null) {
        return res.status(400).json({ error: { message: 'LOGIN_NOT_FOUND', code: 400 } });
      }

      const isPassCorrect = await bcrypt.compare(password, existingUser.password);
      if (!isPassCorrect) {
        return res.status(400).json({ error: { message: 'INVALID_PASSWORD', code: 400 } });
      }

      const tokens = tokenService.generate({ id: existingUser._id });
      await tokenService.save(existingUser._id, tokens.refreshToken);

      return res.status(200).send({ ...tokens, userId: existingUser._id });
    } catch (e) {
      console.log('/signInWithPassword error', e.message);
      return res.status(500).json({ message: 'Ошибка работы с БД' });
    }
  },
]);

router.post('/token', async (req, res) => {
  try {
    const { refresh_token: refreshToken } = req.body;
    const dbToken = await tokenService.validateRefreshToken(refreshToken);

    if (!dbToken) {
      return res.status(401).json({ error: { message: 'Unauthorized', code: 401 } });
    }

    const tokens = tokenService.generate({ id: dbToken.user });
    await tokenService.save(dbToken.user, tokens.refreshToken);

    return res.status(201).send({ ...tokens, userId: dbToken.user });
  } catch (e) {
    console.log('/token error', e.message);
    return res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

module.exports = router;
