'use strict';

class UsersOutputController {
  register = (req, res) => {
    res.render('index', {
      components: 'register',
      userInfo: res.locals.userInfo ? res.locals.userInfo : null,
    });
  };

  login = (req, res) => {
    res.render('index', {
      components: 'login',
      userInfo: res.locals.userInfo ? res.locals.userInfo : null,
    });
  };

  mypage_user = (req, res) => {
    res.render('index', {
      components: 'mypage_user',
      userInfo: res.locals.userInfo ? res.locals.userInfo : null,
    });
  };

  admin = (req, res) => {
    res.render('index', {
      components: 'admin',
      userInfo: res.locals.userInfo ? res.locals.userInfo : null,
    });
  };
}

module.exports = UsersOutputController;
