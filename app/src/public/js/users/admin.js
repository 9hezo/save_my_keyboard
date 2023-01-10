$(document).ready(function () {
  orderList();
});

function orderList() {
  $.ajax({
    type: 'GET',
    url: `/api/orders/aa`,
    data: {},
    success: function (response) {
      let rows = response.orderlistdata;
      let statusArray = ['대기중', '수거중', '수거완료', '배송중', '배송완료'];
      for (let i in rows) {
        let imageUrl = rows[i].imageUrl;
        let details = rows[i].details;
        let kinds = rows[i].kinds;
        let status = rows[i].status;
        if (order.imageUrl) {
          imageUrl = '/uploads/orders/' + order.imageUrl;
        } else {
          imageUrl = '/images/default.png';
        }

        let temp_html = `<div class="card border-secondary border-2 mb-1">
                              <div class="row">
                                <div class="ps-4 pt-2 col-2">
                                  <img id="order_img" class="img-fluid rounded-start" src="${imageUrl}" style="width: 100px" />
                                </div>
                                <div class="p-2 col-8">
                                  <div class="card-body">
                                    <h5 id="order_kinds" class="card-title">${kinds}</h5>
                                    <p id="order_details" class="card-text">${details}</p>
                                  </div>
                                </div>
                                <div class="p-1 col-2">
                                  <button id="order_status" class="btn btn-success mb-2" style="width: 100px">${statusArray[status]}</button>
                                </div>
                              </div>
                            </div>`;
        $('#orders_status_zeroToThree').append(temp_html);
      }
    },
  });
}
