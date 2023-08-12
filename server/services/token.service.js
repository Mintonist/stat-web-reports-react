const jwt = require('jsonwebtoken');
const config = require('config');
const Token = require('../model/Token');

class TokenService {
  generate(payload) {
    const accessToken = jwt.sign(payload, config.get('accessSecret'), { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, config.get('refreshSecret'));
    return { accessToken, refreshToken, expiresIn: 3600 };
  }

  async validateRefreshToken(refreshToken) {
    try {
      const data = jwt.verify(refreshToken, config.get('refreshSecret'));
      const dbToken = await Token.findOne({ refreshToken });

      if (!data || !dbToken || data.id !== dbToken?.user?.toString()) {
        return null;
      }
      return dbToken;
    } catch (e) {
      return null;
    }
  }

  validateAccessToken(accessToken) {
    try {
      const data = jwt.verify(accessToken, config.get('accessSecret'));
      // const dbToken = await Token.findOne({ accessToken });

      // if (!data || !dbToken || data.id !== dbToken?.user?.toString()) {
      //   return null;
      // }
      return data;
    } catch (e) {
      return null;
    }
  }

  async save(userId, refreshToken) {
    const data = await Token.findOne({ user: userId });
    if (data) {
      data.refreshToken = refreshToken;
      return data.save();
    } else {
      const token = await Token.create({ user: userId, refreshToken });
      return token;
    }
  }

  // async findRefreshToken(refreshToken) {
  //   try {
  //     const data = await Token.findOne({ refreshToken });

  //     return data;
  //   } catch (e) {
  //     return null;
  //   }
  // }
}

module.exports = new TokenService();
