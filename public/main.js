

function CurlHttp(url, method = 'GET', data = null) {
    $.ajax({
        url: url,
        data: data,
        type: method,
        dataType: "json",
        statusCode: {
            500: function () {
                noti(500, "500 status code! server error");
            },
        },
        success: (data) => {
            if (!data) {
                noti("error", "Không thể nhận dữ liệu về từ api này");
            } else {
                if (!data.href && data.href === undefined) {
                    noti(data.code, data.message);
                } else {
                    if (data.code == 200) {
                        setInterval(() => {
                            window.location.href = data.href;
                        }, 700);
                    }
                    noti(data.code, data.message);
                }
            }
        },
        error: function (request) {
            var obj = JSON.parse(request.responseText);
            if (!obj) {
                noti("error", "Không thể nhận dữ liệu về từ api này");
            } else {
                if (!obj.href && obj.href === undefined) {
                    noti(obj.code, obj.message);
                } else {
                    if (obj.code == 200) {
                        setInterval(() => {
                            window.location.href = obj.href;
                        }, 700);
                    }
                    noti(obj.code, obj.message);
                }
            }
        },
    });
}


$("form[data-ajax]").submit(function (e) {
    e.preventDefault();
    CurlHttp($(this).attr("action"), $(this).attr("method"), $(this).serialize());
});


function noti(status, message) {
    if (status == 200) {
        var icon = `success`;
    } else if (status == 400) {
        var icon = `warning`;
    } else {
        var icon = `error`;
    }

    Swal.fire({
        icon: icon,
        text: message,
    })

}
