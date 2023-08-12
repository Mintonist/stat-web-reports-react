const express = require('express');
const Depart = require('../model/Depart');
const auth = require('../middleware/auth.middleware');
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

router.post('/', auth, async (req, res) => {
  try {
    const newDepart = await Depart.create({ ...req.body, create_user_id: req.user.id, change_user_id: req.user.id });
    res.status(201).send(newDepart);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

router.delete('/:departId', auth, async (req, res) => {
  try {
    const { departId } = req.params;
    const departToDelete = await Depart.findById(departId);

    // //todo проверка роли
    if (departToDelete && req.userInfo.role == 'admin') {
      await reportToDelete.remove();
    } else {
      res.status(401).json({ error: { message: 'NOT_ALOWED', code: 401 } });
    }

    await departToDelete.remove();

    res.status(200).send(departToDelete);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

module.exports = router;
