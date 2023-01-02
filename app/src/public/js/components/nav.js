function logout() {
  fetch('/api/users/logout', {
    method: 'GET',
  })
    .then(async (res) => {
      const code = res.status;

      res = await res.json();
      // alert(res.message);

      if (code === 200) {
        location.href = '/';
      }
    })
    .catch((err) => {
      // console.error(new Error('회원가입 중 에러 발생'));
      console.log('err: ', err);
    });
}
