const express = require('express');
const Depart = require('../model/Depart');
const auth = require('../middleware/auth.middleware');
const user = require('../middleware/user.middleware');
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
    const newDepart = await Depart.create({ ...req.body, create_user_id: req.userId, change_user_id: req.userId });
    res.status(201).send(newDepart);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

router.patch('/:departId', auth, user, async (req, res) => {
  try {
    const { departId } = req.params;
    //console.log('PATCH departId=' + departId, req.body);

    // проверка роли или авторства
    if (req.userInfo.role != 'admin' && req.userInfo.role != 'editor') {
      res.status(401).json({ message: 'Не достаточно прав' });
      return;
    }

    const updatedDepart = await Depart.findByIdAndUpdate(departId, req.body, { new: true });
    return res.status(200).send(updatedDepart);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

router.delete('/:departId', auth, user, async (req, res) => {
  try {
    const { departId } = req.params;
    //console.log('/api/depart/delete: id=' + departId);
    const departToDelete = await Depart.findById(departId);

    //console.log(departToDelete);
    console.log(req.userInfo);
    //todo проверка роли
    if (departToDelete && req.userInfo.role == 'admin') {
      await departToDelete.deleteOne();
    } else {
      res.status(401).json({ message: 'Не достаточно прав' });
      return;
    }

    res.status(200).send(departToDelete);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

module.exports = router;
