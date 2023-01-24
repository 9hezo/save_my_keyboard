'use strict';

class UsersOutputController {
  register = (req, res) => {
    res.render('index', {
      components: 'register',
      userInfo: res.locals.userInfo ?? null,
    });
  };

  login = (req, res) => {
    res.render('index', {
      components: 'login',
      userInfo: res.locals.userInfo ?? null,
    });
  };

  mypage = (req, res) => {
    res.render('index', {
      components: 'mypage',
      userInfo: res.locals.userInfo ?? null,
    });
  };
}

module.exports = UsersOutputController;
