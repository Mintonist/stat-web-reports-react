const express = require('express');
const Depart = require('../model/Depart');
const router = express.Router({ mergeParams: true });

// /api/depart/
router.get('/', async (req, res) => {
  try {
    const list = await Depart.find();
    res.status(200).send(list);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

module.exports = router;
