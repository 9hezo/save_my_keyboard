'use strict';

window.onload = () => {
  getOrdersDoing();
};

const getOrdersDoing = () => {
  fetch('/api/orders/doing', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
  })
    .then(async (res) => {
      const code = res.status;
      res = await res.json();

      if (code === 200) {
        if (res.data) {
          alert('이미 대기 중이거나 진행 중인 윤활 신청이 있습니다.');
          location.href = '/mypage';
        } else {
          console.log('신청 가능한 상태입니다.');
        }
      } else if (code === 307) {
        document.cookie = `accessToken=${res.accessToken}; path=/;`;
        getOrdersDoing();
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
}

const kinds = document.querySelector('#kinds');
const details = document.querySelector('#details');
const pickup_date = document.querySelector('#pickup_date');
const pickup_time = document.querySelector('#pickup_time');
const imageUrl = document.querySelector('#imageUrl');

const orderRequest = () => {
  if (!kinds.value | !details.value | !pickup_date.value | !pickup_time.value) {
    return alert('빈 입력값이 있습니다.');
  }

  const formData = new FormData();
  formData.append('kinds', kinds.value);
  formData.append('details', details.value);
  formData.append('pickup', pickup_date.value + ' ' + pickup_time.value);
  for (let i = 0; i < imageUrl.files.length; i++) {
    formData.append('files', imageUrl.files[i]);
  }
  fetch('/api/orders', {
    method: 'POST',
    body: formData,
  })
    .then(async (res) => {
      const code = res.status;

      res = await res.json();
      if (res.message) {
        alert(res.message);
      }

      if (code === 201) {
        location.href = '/mypage';
      } else if (code === 307) {
        document.cookie = `accessToken=${res.accessToken}; path=/;`;
        orderRequest();
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
}
