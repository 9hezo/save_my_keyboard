'use strict';

const UsersService = require('../services/users.service');

const TokenManager = require('../utils/TokenManager');
const redisClient = require('../utils/redis.util');

module.exports = async (req, res, next) => {
  console.log('path: ', req.path);

  try {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken || !refreshToken) {
      console.log('accessToken 또는 refreshToken이 없습니다.');
      return next();
    }

    const isAccessTokenValidate = await TokenManager.validateAccessToken(accessToken);
    const isRefreshTokenValidate = await TokenManager.validateRefreshToken(refreshToken);

    if (!isRefreshTokenValidate) {
      console.log('Refresh Token이 만료되었습니다.');
      return next();
    }

    let userId;
    if (!isAccessTokenValidate) {
      userId = await redisClient.get(refreshToken);
      if (!userId) {
        console.log('Refresh Token의 정보가 서버에 존재하지 않습니다');
        return next();
      }

      const newAccessToken = await TokenManager.createAccessToken(userId);

      return res.render('index', {
        redirect: req.path,
        accessToken: newAccessToken,
      });
    } else {
      const getAccessTokenPayloadReturnValue = await TokenManager.getAccessTokenPayload(accessToken);
      userId = getAccessTokenPayloadReturnValue.userId;
    }

    const usersService = new UsersService();
    const userInfo = await usersService.findOneById(userId);
    res.locals.userInfo = { id: userInfo.id, name: userInfo.name, point: userInfo.point, isAdmin: userInfo.isAdmin };
    return next();
  } catch (err) {
    console.log('output.middleware 에러: ' + err.message);
    return res.render('index', {
      message: 'output.middleware 에러',
    });
  }
};
