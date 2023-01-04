window.onload = () => {
  getOrderStatusZeroToThree();
};
getOrderStatusZeroToThree = () => {
  fetch('/api/users/order', {
    method: 'GET',
  })
    .then(async (res) => {
      const code = res.status;

      res = await res.json();
      if (res.message) {
        alert(res.message);
      }

      if (code === 200) {
        const order = res.data;
        document.querySelector('#order_img').src = '/uploads/orders/' + order.imageUrl;
        document.querySelector('#order_kinds').innerHTML = order.kinds;
        document.querySelector('#order_details').innerHTML = order.details;

        const status_arr = ['대기 중', '수거 중', '수거 완료', '배송 중', '배송 완료', '신청 취소'];
        document.querySelector('#order_status').innerHTML = status_arr[order.status];
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
};
