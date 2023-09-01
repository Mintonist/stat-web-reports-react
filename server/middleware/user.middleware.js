const User = require('../model/User');
const tokenService = require('../services/token.service');

module.exports = async function (req, res, next) {
  if (req.method === 'OPTIONS') return next();

  // console.log('user.middleware()', req.user);

  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'UserInfo not founded[1]' });
    }

    console.log('user.middleware() set req.userInfo:', user);
    req.userInfo = user;
    return next();
  } catch (e) {
    res.status(401).json({ message: 'UserInfo not founded[2]' });
  }
};
