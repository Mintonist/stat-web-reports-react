const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth.middleware');
const User = require('../model/User');

router.patch('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    // req.user добавлся в нашем auth.middleware
    if (!userId || userId !== req.user.id) {
      return res.status(401).json({ error: { message: 'Unauthorized', code: 401 } });
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

module.exports = router;
