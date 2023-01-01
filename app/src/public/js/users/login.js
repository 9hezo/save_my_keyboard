'use strict';

const email = document.querySelector('#email');
const password = document.querySelector('#password');

function login() {
  if (!email.value | !password.value) {
    return alert('빈 입력값이 있습니다.');
  }

  const req = {
    email: email.value,
    password: password.value,
  };

  fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  })
    .then(async (res) => {
      const code = res.status;

      res = await res.json();
      alert(res.message);

      if (code === 200) {
        location.href = '/';
      }
    })
    .catch((err) => {
      // console.error(new Error('회원가입 중 에러 발생'));
      console.log('err: ', err);
    });
}
