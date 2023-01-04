'use strict';

const kinds = document.querySelector('#kinds');
const details = document.querySelector('#details');
const pickup = document.querySelector('#pickup');
const imageUrl = document.querySelector('#imageUrl');

function orderlist() {
  if (!kinds.value | !pickup.value | !details.value) {
    return alert('빈 입력값이 있습니다.');
  }

  const req = {
    kinds: kinds.value,
    details: details.value,
    pickup: pickup.value,
    imageUrl: imageUrl.value,
  };

  fetch('http://localhost:3000/api/orders', {
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
        location.href = '/orders/mylists';
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
}
