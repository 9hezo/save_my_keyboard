'use strict';

function statusChange(ownerId) {
  $.ajax({
    type: 'PUT',
    url: '/api/orders/lists/' + ownerId,
    data: {},
    async: false,
    success: function (response) {
      location.href = '/admin';
    },
    error: function (error) {
      customAlert(error.responseJSON.errorMessage);
    },
  });
}
