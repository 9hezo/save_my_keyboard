'use strict';

class UsersOutputController {
  register = (req, res) => {
    if (res.locals.userInfo) {
      const userInfo = res.locals.userInfo;
      res.render('index', {
        components: 'register',
        userInfo,
      });
    } else {
      res.render('index', {
        components: 'register',
      });
    }
  };

  login = (req, res) => {
    if (res.locals.userInfo) {
      const userInfo = res.locals.userInfo;
      res.render('index', {
        components: 'login',
        userInfo,
      });
    } else {
      res.render('index', {
        components: 'login',
      });
    }
  };

  mypage_user = (req, res) => {
    if (res.locals.userInfo) {
      const userInfo = res.locals.userInfo;
      res.render('index', {
        components: 'mypage_user',
        userInfo,
      });
    } else {
      res.render('index', {
        components: 'mypage_user',
      });
    }
  };

  admin = (req, res) => {
    if (res.locals.userInfo) {
      const userInfo = res.locals.userInfo;
      res.render('index', {
        components: 'admin',
        userInfo,
      });
    } else {
      res.render('index', {
        components: 'admin',
      });
    }
  };
}

module.exports = UsersOutputController;
