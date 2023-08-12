const express = require('express');
const router = express.Router({ mergeParams: true });

// /api/auth/signUp
router.post('/signUp', async (req, res) => {});
router.post('/signInWithPassword', async (req, res) => {});
router.post('/token', async (req, res) => {});

module.exports = router;
