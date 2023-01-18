'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

class TokenManager {
  static createAccessToken(userId) {
    return new Promise((resolve, reject) => {
      const expiresIn = process.env.JWT_ACCESS_EXPIRES;
      const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn });
      resolve(accessToken);
    });
  }

  // static createAccessToken = async (userId) => {
  //   const expiresIn = process.env.JWT_ACCESS_EXPIRES;
  //   const accessToken = await jwt.sign({ userId }, SECRET_KEY, { expiresIn });
  //   return accessToken;
  // }

  static createRefreshToken() {
    return new Promise((resolve, reject) => {
      const expiresIn = process.env.JWT_REFRESH_EXPIRES;
      const refreshToken = jwt.sign({}, SECRET_KEY, { expiresIn });
      resolve(refreshToken);
    });
  }

  // static createRefreshToken = () => {
  //   const expiresIn = process.env.JWT_REFRESH_EXPIRES;
  //     const refreshToken = jwt.sign({}, SECRET_KEY, { expiresIn });
  //     return refreshToken;
  // }

  static validateAccessToken(accessToken) {
    try {
      jwt.verify(accessToken, SECRET_KEY);
      return true;
    } catch (err) {
      return false;
    }
  }

  static validateRefreshToken(refreshToken) {
    try {
      jwt.verify(refreshToken, SECRET_KEY);
      return true;
    } catch (err) {
      return false;
    }
  }

  static getAccessTokenPayload(accessToken) {
    try {
      const payload = jwt.verify(accessToken, SECRET_KEY);
      return payload;
    } catch (err) {
      return null;
    }
  }
}

module.exports = TokenManager;
