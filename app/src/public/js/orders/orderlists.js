'use strict';

function statusChange(ownerId) {
  $.ajax({
    type: 'PUT',
    url: '/api/orders/mypage2/' + ownerId,
    data: {},
    async: false,
    success: function (response) {
      location.href = '/users/mypage';
    },
    error: function (error) {
      customAlert(error.responseJSON.errorMessage);
    },
  });
}
