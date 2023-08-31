const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth.middleware');
const user = require('../middleware/user.middleware');
const User = require('../model/User');

router.patch('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    // req.user добавлся в нашем auth.middleware
    if (!userId || userId !== req.user.id) {
      return res.status(401).json({ error: { message: 'Unauthorized', code: 401 } });
    }

    if (req.body.password != null && req.body.password.length > 0) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    } else {
      delete req.body.password;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    return res.status(200).send(updatedUser);
  } catch (e) {
    res.status(401).json({ error: { message: 'Unauthorized', code: 401 } });
  }
});

router.get('/', [
  auth,
  async (req, res) => {
    try {
      const list = await User.find();
      return res.status(200).send(list);
    } catch (e) {
      res.status(401).json({ error: { message: 'Unauthorized', code: 401 } });
    }
  },
]);

router.delete('/:userId', auth, user, async (req, res) => {
  try {
    const { userId } = req.params;
    const userToDelete = await User.findById(userId);

    //todo проверка роли или авторства
    if (userToDelete && req.userInfo.role == 'admin') {
      await userToDelete.remove();
    } else {
      res.status(401).json({ error: { message: 'NOT_ALOWED', code: 401 } });
      return;
    }

    res.status(200).send(userToDelete);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

module.exports = router;
