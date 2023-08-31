const User = require('../model/User');
const tokenService = require('../services/token.service');

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') return next();

  console.log('user.middleware()', req.user);

  try {
    const userId = req.user.id;
    const user = User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: { message: 'UserInfo not founded', code: 401 } });
    }

    console.log('set req.userInfo:', user);
    req.userInfo = user;
    return next();
  } catch (e) {
    res.status(401).json({ error: { message: 'UserInfo not founded', code: 401 } });
  }
};
