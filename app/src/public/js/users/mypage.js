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
          if (order.imageUrl) {
            document.querySelector('#order_img').src = '/uploads/orders/' + order.imageUrl;
          } else {
            document.querySelector('#order_img').src = '/images/default.png';
          }
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

getOrderStatusEnd = (page) => {
  page = parseInt(page || 1);

  fetch('/api/users/mypage?p=' + page, {
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
        setPagination(res.pagination); // 페이지네이션

        document.querySelector('#orders_status_end').innerHTML = '';
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
                  <img id="order_img" class="img-fluid rounded-start" src="${imageUrl}" style="width: 100px;">
                </div>
                <div class="p-2 col-8">
                  <div class="card-body">
                    <h5 id="order_kinds" class="card-title">${order.kinds}</h5>
                    <p id="order_details" class="card-text">${order.details}</p>
                  </div>
                </div>
                <div class="p-1 col-2">
                  <button id="order_status" class="btn btn-success mb-2" style="width: 100px;">${status}</button>
                  <button onclick="location.href='/reviews/write'" id="" class="btn btn-outline-primary" style="width: 100px;">리뷰남기기</button>
                </div>
              </div>
            </div>
          `;
          document.querySelector('#orders_status_end').insertAdjacentHTML('beforeend', temp);
        });
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
};

const setPagination = (obj) => {
  let page = parseInt(obj.page);
  let total_page = parseInt(obj.total_page);
  let start_page = parseInt(obj.start_page);
  let end_page = parseInt(obj.end_page);

  let temp = '';
  if (start_page != 1) {
    temp += `<li class="page-item" style="cursor: pointer;">
              <a class="page-link" onclick="getOrderStatusEnd(${start_page - 1})"><span aria-hidden="true">&laquo;</span></a>
            </li>`;
  } else {
    temp += `<li class="page-item disabled">
              <a class="page-link"><span aria-hidden="true">&laquo;</span></a>
            </li>`;
  }
  for (let i = start_page; i <= end_page; i++) {
    if (i == page) {
      temp += `<li class="page-item active" style="cursor: pointer;"><a class="page-link" onclick="getOrderStatusEnd(${i})">${i}</a></li>`;
    } else {
      temp += `<li class="page-item" style="cursor: pointer;"><a class="page-link" onclick="getOrderStatusEnd(${i})">${i}</a></li>`;
    }
  }
  if (end_page != total_page) {
    temp += `<li class="page-item" style="cursor: pointer;">
              <a class="page-link" onclick="getOrderStatusEnd(${end_page + 1})"><span aria-hidden="true">&raquo;</span></a>
            </li>`;
  } else {
    temp += `<li class="page-item disabled">
              <a class="page-link"><span aria-hidden="true">&raquo;</span></a>
            </li>`;
  }
  document.querySelector('.pagination').innerHTML = '';
  document.querySelector('.pagination').insertAdjacentHTML('beforeend', temp);
};
