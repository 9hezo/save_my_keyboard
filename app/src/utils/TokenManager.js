'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

class TokenManager {
  static createAccessToken = async (userId) => {
    const expiresIn = process.env.JWT_ACCESS_EXPIRES;
    const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn });
    return accessToken;
  };

  static createRefreshToken = async () => {
    const expiresIn = process.env.JWT_REFRESH_EXPIRES;
    const refreshToken = jwt.sign({}, SECRET_KEY, { expiresIn });
    return refreshToken;
  };

  static validateAccessToken = async (accessToken) => {
    try {
      jwt.verify(accessToken, SECRET_KEY);
      return true;
    } catch (err) {
      return false;
    }
  }

  static validateRefreshToken = async (refreshToken) => {
    try {
      jwt.verify(refreshToken, SECRET_KEY);
      return true;
    } catch (err) {
      return false;
    }
  }

  static getAccessTokenPayload = async (accessToken) => {
    try {
      const payload = jwt.verify(accessToken, SECRET_KEY);
      return payload;
    } catch (err) {
      return null;
    }
  }
}

module.exports = TokenManager;
