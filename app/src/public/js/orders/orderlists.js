'use strict';
    function statusChange(ownerId) {
      $.ajax({
        type: "PUT",
        url: "/api/orders/status/" + ownerId,
        data: {},
        async: false,
        success: function (response) {
            window.location.replace = ('/orders/mypage2');
        },
        error: function (error) {
          customAlert(error.responseJSON.errorMessage);
        }
      });
    };



//   fetch('/api/orders/lists/' + ownerId, {
//     method: 'PUT',
//     // headers: {
//     //   'Content-Type': 'application/json',
//     // },
//     body: {
//       status_str: 1,
//     },
//   })
//     .then(async (res) => {
//       const code = res.status;

//       res = await res.json();
//       alert(res.message);

//       if (code === 201) {
//         location.href = '/orders/mypage2';
//       }
//     })
//     .catch((err) => {
//       console.log('err: ', err);
//     });
// }
