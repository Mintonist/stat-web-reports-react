const tokenService = require('../services/token.service');

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') return next();

  try {
    // вид строки: Bearer asjfvnsmzdfvbsjfnvjfsnvfv=
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: { message: 'Unauthorized', code: 401 } });
    }

    const data = tokenService.validateAccessToken(token);
    if (!data) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log('set req.user:', data);
    req.user = data;
    return next();
  } catch (e) {
    res.status(401).json({ error: { message: 'Unauthorized', code: 401 } });
  }
};
