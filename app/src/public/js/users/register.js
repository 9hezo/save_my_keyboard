'use strict';

const email = document.querySelector('#email');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirmPassword');
const name = document.querySelector('#name');
const phone = document.querySelector('#phone');
const address = document.querySelector('#address');

function checkPassword() {
  password.classList.remove('is-invalid');
  confirmPassword.classList.remove('is-invalid');
  if (password.value !== confirmPassword.value) {
    password.classList.add('is-invalid');
    confirmPassword.classList.add('is-invalid');
    return false;
  }
  return true;
}

function register(admin) {
  if (!email.value | !password.value | !confirmPassword.value | !name.value | !phone.value | !address.value) {
    return alert('빈 입력값이 있습니다.');
  }
  if (!checkPassword()) {
    return alert('비밀번호를 확인해주세요.');
  }
  // if (!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email.value)) {
  //   return alert('이메일을 정확히 입력해주세요.');
  // }
  if (isNaN(phone.value)) {
    return alert('핸드폰 번호를 정확히 입력해주세요.');
  }

  const req = {
    email: email.value,
    password: password.value,
    name: name.value,
    phone: phone.value,
    address: address.value,
    admin,
  };

  fetch('/api/users/register', {
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

      if (code === 201) {
        document.cookie = `accessToken=${res.accessToken}`;
        document.cookie = `refreshToken=${res.refreshToken}`;

        location.href = '/';
      }
    })
    .catch((err) => {
      // console.error(new Error('회원가입 중 에러 발생'));
      console.log('err: ', err);
    });
}
