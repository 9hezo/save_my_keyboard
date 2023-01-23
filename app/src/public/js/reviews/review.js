'use strict';

const content = document.querySelector('#content');
const score = document.querySelector('input[name="score"]:checked');

const imageUrl = document.querySelector('#imageUrl');

function reviewRequest() {
  if (!content.value | !score.value) {
    return alert('빈 입력값이 있습니다.');
  }

  const formData = new FormData();
  formData.append('content', content.value);
  formData.append('score', score.value);
  for (let i = 0; i < imageUrl.files.length; i++) {
    formData.append('imageUrl', imageUrl.files[i]);
  }

  fetch('/api/reviews', {
    method: 'POST',
    body: formData,
  })
    .then(async (res) => {
      const code = res.status;

      res = await res.json();
      alert(res.message);

      location.href = '/users/mypage';
    })
    .catch((err) => {
      console.log('err: ', err);
    });
}
