'use strict';

function statusChange(id) {
    fetch('http://localhost:3000/orders/lists/'+ id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
        status_str = 1
    }
  })
    .then(async (res) => {
      const code = res.status;

      res = await res.json();
      alert(res.message);
      
      if (code === 201) {
        location.href = '/orders/mypage2';
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
}