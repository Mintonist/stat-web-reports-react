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

router.patch('/:reportId', auth, user, async (req, res) => {
  try {
    const { reportId } = req.params;
    //console.log('PATCH reportId=' + reportId, req.body);

    // проверка роли или авторства
    if (req.userInfo.role != 'admin' && req.userInfo.role != 'editor') {
      res.status(401).json({ message: 'Не достаточно прав' });
      return;
    }

    const updatedReport = await Report.findByIdAndUpdate(reportId, req.body, { new: true });
    return res.status(200).send(updatedReport);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

router.delete('/:reportId', auth, user, async (req, res) => {
  try {
    const { reportId } = req.params;
    const reportToDelete = await Report.findById(reportId);

    // проверка роли или авторства
    if (
      reportToDelete &&
      (req.userInfo.role == 'admin' ||
        (req.userInfo.role == 'editor' && reportToDelete.create_user_id === req.userInfo._id.toString()))
    ) {
      await reportToDelete.deleteOne();
    } else {
      res.status(401).json({ message: 'Не достаточно прав' });
      return;
    }

    res.status(200).send(reportToDelete);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка работы с БД' });
  }
});

module.exports = router;
