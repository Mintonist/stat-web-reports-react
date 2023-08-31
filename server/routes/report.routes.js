const express = require('express');
const Report = require('../model/Report');
const auth = require('../middleware/auth.middleware');
const user = require('../middleware/user.middleware');
const router = express.Router({ mergeParams: true });

// /api/report/
router.get('/', auth, async (req, res) => {
  try {
    const list = await Report.find();
    res.status(200).send(list);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newReport = await Report.create({ ...req.body });
    res.status(201).send(newReport);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

router.delete('/:reportId', auth, user, async (req, res) => {
  try {
    const { reportId } = req.params;
    const reportToDelete = await Report.findById(reportId);

    //todo проверка роли или авторства
    if (
      reportToDelete &&
      (req.userInfo.role == 'admin' ||
        (req.userInfo.role == 'editor' && reportToDelete.create_user_id === req.userInfo._id.toString()))
    ) {
      await reportToDelete.remove();
    } else {
      res.status(401).json({ error: { message: 'NOT_ALOWED', code: 401 } });
      return;
    }

    res.status(200).send(reportToDelete);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

module.exports = router;
