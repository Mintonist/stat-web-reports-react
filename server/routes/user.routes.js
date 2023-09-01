const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth.middleware');
const user = require('../middleware/user.middleware');
const User = require('../model/User');

router.patch('/:userId', auth, user, async (req, res) => {
  try {
    const { userId } = req.params;
    // req.userId добавлся в нашем auth.middleware
    // req.userInfo добавлся в нашем user.middleware
    // if (!userId || (userId !== req.userId && req.userInfo.role != 'admin')) {
    //   return res.status(401).json({ message: 'Нельзя редактировать другого' });
    // }

    // проверка роли или авторства
    if (req.userInfo.role != 'admin') {
      res.status(401).json({ message: 'Не достаточно прав' });
      return;
    }

    console.log('PATCH userId=' + userId, req.body);

    if (req.body.password != null && req.body.password.length > 0) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    } else {
      // пустой пароль - в БД не меняем
      delete req.body.password;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    return res.status(200).send(updatedUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

router.get('/', [
  auth,
  async (req, res) => {
    try {
      const list = await User.find();
      return res.status(200).send(list);
    } catch (e) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  },
]);

router.delete('/:userId', auth, user, async (req, res) => {
  try {
    const { userId } = req.params;
    const userToDelete = await User.findById(userId);

    // проверка роли или авторства
    if (userToDelete && req.userInfo.role == 'admin') {
      await userToDelete.deleteOne();
    } else {
      res.status(401).json({ message: 'Не достаточно прав' });
      return;
    }

    res.status(200).send(userToDelete);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

module.exports = router;
