window.onload = () => {
  document.querySelector('#orders_status_waiting').innerHTML = '';

  infiniteScroll();
};

let page = 1;
let isGetOrdersWaitingLoading = false;

const infiniteScroll = () => {
  const scrollEnd = document.querySelector('#scroll-end');

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;  
      // entry가 interscting 중이 아니라면 함수를 실행하지 않음
      if (isGetOrdersWaitingLoading) return;
      // 현재 page가 불러오는 중임을 나타내는 flag를 통해 불러오는 중이면 함수를 실행하지 않음

      observer.observe(scrollEnd);
      getOrdersWaiting(page);
      page += 1;
    });
  });
  io.observe(scrollEnd);
};

const getOrdersWaiting = (p) => {
  isGetOrdersWaitingLoading = true;
  
  console.log('p: ' + p);
  fetch('/api/orders?p='+p, {
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
          alert('끝');
          document.querySelector('#scroll-end').style.display = 'none';
          return;
        }

        orders.forEach((order) => {
          const imageUrl = 
            order.imageUrl 
              ? '/uploads/orders/' + order.imageUrl 
              : '/images/default.png';

          const pickup = dateFormatter(order.pickup);

          const temp = `
            <div class="card border-secondary border-2 mb-1">
              <div class="row g-0">
                <div class="col-md-2 p-1">
                  <img src="${imageUrl}" class="img-fluid rounded-start">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${order.kinds}</h5>
                    <p class="card-text">${order.details}</p>
                    <p class="card-text"><small class="text-muted">픽업날짜: <span>${pickup}</span></small></p>
                  </div>
                </div>
                <div class="col-md-2 p-1">
                  <button onclick="takeOrder(${order.id})" class="btn btn-outline-primary mb-2" style="width: 100px;">접수</button>
                </div>
              </div>
            </div>
          `;

          document.querySelector('#orders_status_waiting').insertAdjacentHTML('beforeend', temp);
        });
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    })
    .finally(() => {
      isGetOrdersWaitingLoading = false;
    });
};

const dateFormatter = (str) => {
  return new Date(str).toLocaleString();
}

const takeOrder = (orderId) => {
  fetch('/api/orders/' + orderId, {
    method: 'PUT'
  })
    .then(async (res) => {
      const code = res.status;

      res = await res.json();
      alert(res.message);

      if (code === 200) {
        location.href = '/mypage';
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    });
}