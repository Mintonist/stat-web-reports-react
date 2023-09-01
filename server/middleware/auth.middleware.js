const tokenService = require('../services/token.service');

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') return next();

  try {
    // вид строки: Bearer asjfvnsmzdfvbsjfnvjfsnvfv=
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized[1]' });
    }

    const data = tokenService.validateAccessToken(token);
    if (!data) {
      return res.status(401).json({ message: 'Unauthorized[2]' });
    }
    console.log('auth.middleware() set req.userId:', data.id);
    req.userId = data.id;
    return next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized[3]' });
  }
};
