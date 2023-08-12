const express = require('express');
const Report = require('../model/Report');
const router = express.Router({ mergeParams: true });

// /api/report/
router.get('/', async (req, res) => {
  try {
    const list = await Report.find();
    res.status(200).send(list);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

module.exports = router;
