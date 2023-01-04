window.onload = () => {
  getOrderStatusZeroToThree();
  getOrderStatusEnd();
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
        if (res.data) {
          const order = res.data;
          document.querySelector('#order_img').src = '/uploads/orders/' + order.imageUrl;
          document.querySelector('#order_kinds').innerHTML = order.kinds;
          document.querySelector('#order_details').innerHTML = order.details;

          const status_arr = ['대기 중', '수거 중', '수거 완료', '배송 중', '배송 완료', '취소 완료'];
          document.querySelector('#order_status').innerHTML = status_arr[order.status];
        } else {
          document.querySelector('#orders_status_zeroToThree').remove();
        }
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
};

getOrderStatusEnd = () => {
  fetch('/api/users/mypage', {
    method: 'GET',
  })
    .then(async (res) => {
      const code = res.status;

      res = await res.json();
      if (res.message) {
        alert(res.message);
      }

      if (code === 200) {
        const orders = res.data;

        document.querySelector('#orders_status_end').innerHTML = '';
        const status_arr = ['대기 중', '수거 중', '수거 완료', '배송 중', '배송 완료', '취소 완료'];
        orders.forEach((order) => {
          const status = status_arr[order.status];
          const temp = `
            <div class="card border-secondary border-2 mb-1">
              <div class="row">
                <div class="ps-4 pt-2 col-2">
                  <img id="order_img" class="img-fluid rounded-start" src="/uploads/orders/${order.imageUrl}" style="width: 100px;">
                </div>
                <div class="p-2 col-8">
                  <div class="card-body">
                    <h5 id="order_kinds" class="card-title">${order.kinds}</h5>
                    <p id="order_details" class="card-text">${order.details}</p>
                  </div>
                </div>
                <div class="p-1 col-2">
                  <button id="order_status" class="btn btn-success mb-2" style="width: 100px;">${status}</button>
                  <button id="" class="btn btn-outline-primary" style="width: 100px;">리뷰남기기</button>
                </div>
              </div>
            </div>
          `;
          document.querySelector('#orders_status_end').insertAdjacentHTML('beforebegin', temp);
        });
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
};
