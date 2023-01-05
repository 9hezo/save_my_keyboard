'use strict';
    function statusChange(ownerId) { 
      $.ajax({
            type: "PUT",
            url: "/api/orders/mypage2/" + ownerId,
            data: {},
            async: false,
            success: function (response) {
                location.href ='/users/admin';
            },
            error: function (error) {
              customAlert(error.responseJSON.errorMessage);
            }
        });
    }

      // function statusChange(ownerId) {
    //   console.log({status_str:1});
    //   console.log(JSON.stringify({ status_str: 1 }));
    //   console.log(JSON.parse(JSON.stringify({ status_str: 1 })));
    //     fetch('/api/orders/status/' + ownerId, {
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ status: 1 }),
    //     })
    //       .then(async (res) => {
    //         const code = res.status;

    //         res = await res.json();
    //         alert(res.message);

    //         if (code === 201) {
    //           location.href = '/orders/mypage2';
    //         }
    //       })
    //       .catch((err) => {
    //         console.log('err: ', err);
    //       });
    // }