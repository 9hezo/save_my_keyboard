'use strict';

window.onload = () => {
  getOrderStatusZeroToThree();
};

function getOrderStatusZeroToThree() {
  fetch('/api/users/order', {
    method: 'GET',
  })
    .then(async (res) => {
      const code = res.status;
      res = await res.json();

      if (code === 200) {
        if (res.data) {
          alert('이미 대기 중이거나 진행 중인 윤활 신청이 있습니다.');
          location.replace('/mypage_user');
        } else {
          console.log('신청 가능한 상태입니다.');
        }
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

function orderRequest() {
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
      alert(res.message);

      location.href = '/mypage_user';
    })
    .catch((err) => {
      console.log('err: ', err);
    });
}



// $(document).ready(function () {
//   orderList();
// });

// function orderList() {
//   $.ajax({
//       type: 'GET',
//       url: `/api/orders/aa`,
//       data: {},
//       success: function (response) {
//         let rows = response.orderlistdata
//         let statusArray = ['대기중','수거중','수거완료','배송중','배송완료']
//         for(let i in rows) {
//           let imageUrl = rows[i].imageUrl
//           let details = rows[i].details
//           let kinds = rows[i].kinds
//           let status = rows[i].status
//           if (imageUrl) {
//             imageUrl = '/uploads/orders/' + imageUrl;
//           } else {
//             imageUrl = '/images/default.png';
//           }

//           let temp_html = `<div class="card border-secondary border-2 mb-1">
//                               <div class="row">
//                                 <div class="ps-4 pt-2 col-2">
//                                   <img id="order_img" class="img-fluid rounded-start" src="${imageUrl}" style="width: 100px" />
//                                 </div>
//                                 <div class="p-2 col-8">
//                                   <div class="card-body">
//                                     <h5 id="order_kinds" class="card-title">${kinds}</h5>
//                                     <p id="order_details" class="card-text">${details}</p>
//                                   </div>
//                                 </div>
//                                 <div class="p-1 col-2">
//                                   <button id="order_status" class="btn btn-success mb-2" style="width: 100px">${statusArray[status]}</button>
//                                 </div>
//                               </div>
//                             </div>`
//             $('#orders_status_zeroToThree').append(temp_html);
//         }
//       },
//   });
// }
