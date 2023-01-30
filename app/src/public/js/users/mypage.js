window.onload = () => {
  getOrdersDoing();
  getOrdersDone();
};

const getOrdersDoing = () => {
  document.querySelector('.loading').style.display = 'block';

  fetch('/api/orders/doing', {
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
          document.querySelector('#orders_status_doing').style.display = 'block';

          const order = res.data;
          if (order.imageUrl) {
            document.querySelector('#order_img').src = '/uploads/orders/' + order.imageUrl;
          } else {
            document.querySelector('#order_img').src = '/images/default.png';
          }
          document.querySelector('#order_kinds').innerHTML = order.kinds;
          document.querySelector('#order_details').innerHTML = order.details;

          const status_arr = ['대기 중', '수거 중', '수거 완료', '배송 중', '배송 완료', '취소 완료'];
          document.querySelector('#order_status').innerHTML = status_arr[order.status];

          if (order.status === 0) {
            const order_cancel = document.querySelector('#order_cancel');
            order_cancel.style.display = 'block';
            order_cancel.addEventListener('click', () => {
              cancelOrder(order.id);
            });
          } else if (userInfo.isAdmin & (order.status !== 0)) {
            const order_update = document.querySelector('#order_update');
            order_update.style.display = 'block';
            order_update.addEventListener('click', () => {
              updateOrder(order.id, order.status);
            });
          }
        } else {
          document.querySelector('#orders_status_doing').style.display = 'none';
        }
      } else if (code === 307) {
        document.cookie = `accessToken=${res.accessToken}; path=/;`;
        getOrdersDoing();
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    })
    .finally(() => {
      document.querySelector('.loading').style.display = 'none';
    });
};

const getOrdersDone = (page) => {
  document.querySelector('.loading').style.display = 'block';

  page = parseInt(page || 1);

  fetch('/api/orders/done?p=' + page, {
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
        if (orders.length == 0) {
          return;
        }
        setPagination(res.pagination); // 페이지네이션

        document.querySelector('#orders_status_done').innerHTML = '';
        const status_arr = ['대기 중', '수거 중', '수거 완료', '배송 중', '배송 완료', '취소 완료'];
        orders.forEach((order) => {
          const status = status_arr[order.status];
          let imageUrl = '';
          if (order.imageUrl) {
            imageUrl = '/uploads/orders/' + order.imageUrl;
          } else {
            imageUrl = '/images/default.png';
          }
          const temp = `
            <div class="card border-secondary border-2 mb-1">
              <div class="row">
                <div class="ps-4 pt-2 col-2">
                  <img class="img-fluid rounded-start" src="${imageUrl}" style="width: 100px;">
                </div>
                <div class="p-2 col-8">
                  <div class="card-body">
                    <h5 class="card-title">${order.kinds}</h5>
                    <p class="card-text">${order.details}</p>
                  </div>
                </div>
                <div class="p-1 col-2">
                  <button class="btn btn-outline-secondary mb-2" style="width: 100px;" disabled>${status}</button>
                  ${
                    !userInfo.isAdmin & (order.status === 4)
                      ? `<button onclick="writeReview(${order.id})" class="btn btn-outline-primary" style="width: 100px;">리뷰남기기</button>`
                      : ''
                  }
                </div>
              </div>
            </div>
          `;

          document.querySelector('#orders_status_done').insertAdjacentHTML('beforeend', temp);
        });
      } else if (code === 307) {
        document.cookie = `accessToken=${res.accessToken}; path=/;`;
        getOrdersDone(page);
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    })
    .finally(() => {
      document.querySelector('.loading').style.display = 'none';
    });
};

const writeReview = (orderId) => {
  alert(`준비중입니다.`);
  console.log(`준비중입니다. orderId=${orderId}`);
};

const setPagination = (obj) => {
  let page = parseInt(obj.page);
  let total_page = parseInt(obj.total_page);
  let start_page = parseInt(obj.start_page);
  let end_page = parseInt(obj.end_page);

  let temp = '';
  if (start_page != 1) {
    temp += `<li class="page-item" style="cursor: pointer;">
              <a class="page-link" onclick="getOrdersDone(${start_page - 1})"><span aria-hidden="true">&laquo;</span></a>
            </li>`;
  } else {
    temp += `<li class="page-item disabled">
              <a class="page-link"><span aria-hidden="true">&laquo;</span></a>
            </li>`;
  }
  for (let i = start_page; i <= end_page; i++) {
    if (i == page) {
      temp += `<li class="page-item active" style="cursor: pointer;"><a class="page-link" onclick="getOrdersDone(${i})">${i}</a></li>`;
    } else {
      temp += `<li class="page-item" style="cursor: pointer;"><a class="page-link" onclick="getOrdersDone(${i})">${i}</a></li>`;
    }
  }
  if (end_page != total_page) {
    temp += `<li class="page-item" style="cursor: pointer;">
              <a class="page-link" onclick="getOrdersDone(${end_page + 1})"><span aria-hidden="true">&raquo;</span></a>
            </li>`;
  } else {
    temp += `<li class="page-item disabled">
              <a class="page-link"><span aria-hidden="true">&raquo;</span></a>
            </li>`;
  }
  document.querySelector('.pagination').innerHTML = '';
  document.querySelector('.pagination').insertAdjacentHTML('beforeend', temp);
};

const updateOrder = (orderId, status_before) => {
  updateStatus(orderId, status_before, status_before + 1);
};

const cancelOrder = (orderId) => {
  const status = {
    waiting: 0,
    cancelled: 5,
  };
  updateStatus(orderId, status.waiting, status.cancelled);
};

const updateStatus = (orderId, status_before, status_after) => {
  const req = {
    status_before,
    status_after,
  };
  fetch('/api/orders/' + orderId, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  })
    .then(async (res) => {
      const code = res.status;

      res = await res.json();
      if (res.message) {
        alert(res.message);
      }

      if (code === 200) {
        location.href = '/mypage';
      } else if (code === 307) {
        document.cookie = `accessToken=${res.accessToken}; path=/;`;
        updateStatus(orderId, status_before, status_after);
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
};
